<?php

namespace App\Http\Controllers;

use App\Models\Subject;
use App\Http\Requests\StoreSubjectRequest;
use App\Http\Requests\UpdateSubjectRequest;

class SubjectController extends Controller
{
    public function index()
    {
        try {
            $subject = Subject::paginate(10);
            if($subject->isEmpty()){
            return response()->json('Không tìm thấy môn học', 404);
        }
        return response()->json($subject);
        } catch (\Throwable $th) {
            return response()->json(['message'=>$th->getMessage()], 404);
        }

    }



    public function store(StoreSubjectRequest $request)
    {
        try {
            Subject::create($request->validated());
            return response()->json(['message'=> 'thêm mới thành công'], 201);
        } catch (\Throwable $th) {
            return response()->json(['message' => $th->getMessage(),500]);
        }
    }


    public function show(string $id)
    {
        try {

            $getSubject = Subject::findOrFail($id);
            return response()->json(['message' => 'Tìm thấy', 'data' => $getSubject], 200);

        } catch (\Throwable $th) {

            return response()->json(['message' => 'Đã xảy ra lỗi', 'error' => $th->getMessage()], 500);
        }
    }


    public function update(UpdateSubjectRequest $request, string $id)
    {
        try {
            $subject = Subject::findOrFail($id);

        if(!$subject){
            return response()->json(['message'=>'không tìm thấy môn học'], 404);
        }

        $subject->update($request->toArray());
        return response()->json(['message' => 'cập nhật thành công' ]);
        } catch (\Throwable $th) {
            return response()->json(['message'=> $th->getMessage()]);
        }

    }


    public function destroy(string $id)
    {
        try {
            $subject = Subject::findOrFail($id);
            $subject->delete();
            return response()->json(['message'=>'xóa thành công'],200);

        } catch (\Throwable $th) {
            return response()->json(['message' => 'Đã có lỗi xảy ra: ' . $th->getMessage()], 500);
        }
    }
}
