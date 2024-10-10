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

    public function __construct(SubjectRepositoryInterface $subjectRepository){
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

            $subject = $this->subjectRepository->create($request->toArray());
            return response()->json(['message'=> 'thêm mới thành công'], 201);
        } catch (\Throwable $th) {
            return response()->json(['message' => $th->getMessage(),400]);
        }
    }

    public function show(string $id)
    {
        try {
            $subject =  $this->subjectRepository->getById($id);
            return response()->json(['message' => 'Tìm thấy', 'data' => $subject], 200);
        } catch (\Throwable $th) {

            return response()->json(['message' => 'Không tìm thấy',  $th->getMessage()], 500);
        }
    }

    public function update(UpdateSubjectRequest $request, string $id)
    {
        try {
            $this->subjectRepository->update($request->toArray() , $id);
            return response()->json(['message' => 'cập nhật thành công' ]);
        } catch (\Throwable $th) {
            return response()->json(['message'=>'không tìm thấy môn học'], 400);
        }

    }

    public function destroy(string $id)
    {
        try {
            $subject = Subject::findOrFail($id);
            $subject->delete();
            return response()->json(['message'=>'xóa thành công'],200);

        } catch (\Throwable $th) {
            return response()->json(['message' => 'Đã có lỗi xảy ra: ' . $th->getMessage()], 400);
        }
    }
}
