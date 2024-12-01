<?php

namespace App\Http\Controllers\Student;

use Throwable;
use App\Models\User;
use App\Models\Category;
use App\Models\Classroom;
use Illuminate\Http\Request;
use App\Models\ClassroomUser;
use App\Models\ScoreComponent;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;

class ScoreController extends Controller
{
    // Hiển thị điểm theo kỳ
    public function bangDiemTheoKy(Request $request)
    {
        try {
            $userCode = $request->user()->user_code;
            $semesterCodeUser = User::where('user_code', $userCode)
                                    ->select('semester_code')
                                    ->first();

            $semesterCode = $request->input('search') ?: $semesterCodeUser->semester_code;
        
            $listSemester = Category::where('type', 'semester')
                ->where('is_active', '1')
                ->where('cate_code', '<=', $semesterCodeUser->semester_code) 
                ->orderBy('cate_code', 'asc')
                ->select('cate_code', 'cate_name')
                ->get();
                $classrooms = Classroom::whereHas('subject', function ($query) use ($semesterCode) {
                                $query->where('semester_code', $semesterCode);
                            })
                            ->whereHas('users', function ($query) use ($userCode) {
                                $query->where('classroom_user.user_code', $userCode);
                            })
                            ->with([
                                'subject' => function ($query) {
                                    $query->with('subjectAssessment', function ($query) {
                                        $query->select('assessment_items.assessment_code', 'assessment_items.name', 'assessment_items.weight');
                                    })->select('subject_code', 'subject_name', 'semester_code');
                                },
                                'teacher' => function ($query) {
                                    $query->select('user_code', 'full_name');
                                },
                                'scorecomponents' => function ($query) use ($userCode) {
                                    $query->where('student_code', $userCode)
                                        ->with('assessmentItem', function ($query) {
                                                $query->select('assessment_code', 'name', 'weight');
                                        })
                                        ->select('student_code', 'class_code', 'score', 'assessment_code');
                                }

                            ])
                            ->get(['class_code', 'class_name', 'subject_code', 'user_code']);
                $result = $classrooms->map(function ($classroom) {
                    $subjectAssessments = $classroom->subject->subjectAssessment ?? collect([]);
                    $scoreComponents = $classroom->scorecomponents ?? collect([]);
                    
                    // Duyệt qua các subjectAssessment để xử lý dữ liệu
                    $scores = $subjectAssessments->map(function ($assessment) use ($scoreComponents) {
                        $matchedScore = $scoreComponents->firstWhere('assessment_code', $assessment->assessment_code);
                
                        return [
                            'assessment_name' => $matchedScore->assessmentItem->name ?? $assessment->name,
                            'weight' => $matchedScore->assessmentItem->weight ?? $assessment->weight,
                            'score' => $matchedScore->score ?? 0 // Nếu không có điểm, trả về 0
                        ];
                    });
                    $diem = 0;
                    $heSo = 0;
                    foreach ($scores as $scoreEntry) {
                        $diem += $scoreEntry['score'] * $scoreEntry['weight'];
                        $heSo += $scoreEntry['weight'];
                    }
                    $averageScore = $heSo > 0 ? ($diem / $heSo) : 0;
                    $formattedScore = number_format($averageScore, 1, ',', '');
                
                    return [
                        'class_code' => $classroom->class_code,
                        'class_name' => $classroom->class_name,
                        'average_score' => $formattedScore,
                        'scores' => $scores
                    ];
                });
            if($classrooms->isEmpty()){
                return response()->json(
                    ['message' => "Không có lớp học nào!"], 204
                );
            }
            return response()->json($result, 200);
        } catch (Throwable $th) {
            Log::error(__CLASS__ . '@' . __FUNCTION__, [$th]);

            return response()->json([
                'message' => 'Lỗi không xác định!'
            ], 500);
        }
    }

    //////// END

    // Hiển thị điểm tất cả các môn học của sinh viên
    public function bangDiem(Request $request)
    {
        try {
            $userCode = $request->user()->user_code;
            $classRooms = ClassroomUser::where('user_code', $userCode)
                            ->with(['classroom' => function ($query) {
                                $query->select('class_code', 'class_name', 'score', 'subject_code')
                                    ->with(['subject' => function ($query) {
                                        $query->select('subject_code', 'subject_name', 'credit_number', 'semester_code')
                                                ->with('semester:cate_code,cate_name');
                                        }
                                    ]);
                                }
                            ])
                            ->select('user_code', 'class_code')
                            ->get();
            $listClassRoom = $classRooms->map(function ($classRoom) use ($userCode) {
                // Nếu `classroom` là một mảng, cần lặp qua từng phần tử của nó.
                return collect($classRoom->classroom)->map(function ($classroom) use ($userCode) {
                    $subject = $classroom->subject ?? null;
                    $semester = $subject ? $subject->semester : null;

                    $scores = json_decode($classroom['score'], true); // Giả sử 'score' là chuỗi JSON.
                    $diem = 0;
                    $heSo = 0;
            
                    if (is_array($scores)) {
                        // Lọc các phần tử có 'student_code' trùng với $userCode
                        $filteredScores = array_filter($scores, function ($scoreSet) use ($userCode) {
                            return $scoreSet['student_code'] === $userCode;
                        });

                        foreach ($filteredScores as $scoreSet) {
                            foreach ($scoreSet['scores'] as $score) {
                                $diem += $score['score'] + $score['value']; // tổng của điểm và hệ số với nha: ( (đ1+hs1)+(đ2+hs2)+... )
                                $heSo += $score['value']; // Tổng của hệ số
                            }
                        }
                    }
            
                    $averageScore = $heSo > 0 ? ($diem / $heSo) * 100 : 0;
                    $formattedScore = number_format($averageScore, 1, ',', '');
            
                    return [
                        'cate_name' => $semester ? $semester->cate_name : null,
                        'subject_name' => $subject ? $subject->subject_name : null,
                        'subject_code' => $subject ? $subject->subject_code : null,
                        'credit_number' => $subject ? $subject->credit_number : null,
                        'score' => $formattedScore
                    ];
                });
            })->flatten(1); // Dùng `flatten` để gộp tất cả các kết quả lại thành một mảng đơn lẻ.

            return response()->json($listClassRoom, 200);
        } catch (Throwable $th) {
            Log::error(__CLASS__ . '@' . __FUNCTION__, [$th]);

            return response()->json([
                'message' => 'Lỗi không xác định!'
            ], 500);
        }
    }

    //////// END
    
}
