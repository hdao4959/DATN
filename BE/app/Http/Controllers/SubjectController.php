<?php

namespace App\Http\Controllers;

use App\Models\Subject;
use App\Http\Requests\StoreSubjectRequest;
use App\Http\Requests\UpdateSubjectRequest;
use App\Repositories\Contracts\SubjectRepositoryInterface;
use App\Repositories\SubjectRepository;

class SubjectController extends Controller
{
    protected $subjectRepository;

    public function __construct(SubjectRepositoryInterface $subjectRepository)
    {
        $this->subjectRepository = $subjectRepository;
    }


    public function handleErrorNotDefine($th)
    {
        return response()->json([
            'message' => "Đã xảy ra lỗi không xác định",
            'error' => env('APP_DEBUG') ? $th->getMessage() : "Lỗi không xác định"
        ], 500);
    }


    public function index()
    {
        $subjects = $this->subjectRepository->getAll();
        return response()->json($subjects, 200);
    }

    public function store(StoreSubjectRequest $request)
{
    try {
        $newestSubjectCode = Subject::withTrashed()
            ->where('major_code', 'LIKE', $request['major_code'])
            ->selectRaw("MAX(CAST(SUBSTRING(subject_code, 4) AS UNSIGNED)) as max_number")
            ->value('max_number');
        $nextNumber = $newestSubjectCode ? $newestSubjectCode + 1 : 1;

        // Tạo mã subject_code mới với phần tiền tố (ở đây là mã chuyên ngành từ request)
        $newSubjectCode = $request['major_code'] . str_pad($nextNumber, 2, '0', STR_PAD_LEFT);

        // Gán giá trị subject_code mới vào request
        $request['subject_code'] = $newSubjectCode;

        // Tạo bản ghi mới
        $subject = $this->subjectRepository->create($request);

        return response()->json(['message' => 'Thêm mới thành công'], 201);
    } catch (\Throwable $th) {
        return response()->json(['message' => $th->getMessage()], 400);
    }
}


    public function show(string $subject_code)
    {
        try {
            $subject =  Subject::select('subject_code', 'subject_name', 'tuition', 're_study_fee', 'credit_number', 'total_sessions', 'description', 'major_code', 'is_active', 'semester_code')->with([
                'semester' => function($query){
                    $query->select('cate_code', 'cate_name');
                }
                , 'major' => function($query){
                    $query->select('cate_code', 'cate_name');
                }
            ])->firstWhere('subject_code', $subject_code);

            if(!$subject){
                return response()->json([
                    'status' => false,
                    'message' => 'Môn học này không tồn tại!'
                ],404);
            }


            $semester_info = optional($subject->semester);
            $major_info = optional($subject->major);
            return response()->json(

                [
                    'status' => false,
                    'subject' => [
                        'subject_code' => $subject->subject_code,
                        'subject_name' => $subject->subject_name,
                        'tuition' => $subject->tuition,
                        're_study_fee' => $subject->re_study_fee,
                        'credit_number' => $subject->credit_number,
                        'total_sessions' => $subject->total_sessions,
                        'description' => $subject->description,
                        'is_active' => $subject->is_active,
                        'semester_code' => $semester_info->cate_code,
                        'semester_name' => $semester_info->cate_name,
                        'major_code' => $major_info->cate_code,
                        'major_name' => $major_info->cate_name
                    ]
                ],
                200
            );
        } catch (\Throwable $th) {
            return $this->handleErrorNotDefine($th);
        }
    }

    public function update(UpdateSubjectRequest $request, string $subject_code)
    {
        try {
            // $subject = Subject::where
            // $this->subjectRepository->update($request, $id);
            return response()->json(['message' => 'cập nhật thành công']);
        } catch (\Throwable $th) {
            return response()->json(['message' => $th->getMessage()], 400);
        }
    }

    public function destroy(string $id)
    {
        try {
            $subject = Subject::findOrFail($id);
            $subject->delete();
            return response()->json(['message' => 'xóa thành công'], 200);
        } catch (\Throwable $th) {
            return response()->json(['message' => 'Đã có lỗi xảy ra: ' . $th->getMessage()], 400);
        }
    }

    public function renderSubjectForClassroom() {}
}
