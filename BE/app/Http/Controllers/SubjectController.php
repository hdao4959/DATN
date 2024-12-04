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


    public function show(string $id)
    {
        try {
            $subject =  $this->subjectRepository->getById($id);
            return response()->json(
                [
                    'message' => 'Đã tìm thấy',
                    'data' => [
                        'subject_name' => $subject->subject_name,
                        'subject_code' => $subject->subject_code,
                        'description' => $subject->description,
                        'image' => $subject->image,
                        'credit_number' => $subject->credit_number,
                        'assessment_items' => $subject->assessmentItems
                    ]
                ],
                200
            );
        } catch (\Throwable $th) {

            return response()->json(['message' => 'Không tìm thấy',  $th->getMessage()], 500);
        }
    }

    public function update(UpdateSubjectRequest $request, string $id)
    {
        try {
            $this->subjectRepository->update($request, $id);
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
