<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSemesterRequest;
use App\Http\Requests\UpdateSemesterRequest;
use App\Models\Semester;
use Illuminate\Http\Request;

class SemesterController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try{
           $model = Semester::all();
           return response()->json($model , 200);
        }catch(\Throwable $th){
            return response()->json(['message'=>$th->getMessage()]);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSemesterRequest $request)
    {
        try{
            Semester::create($request->toArray());
            return response()->json(['message' => 'Thêm thành công'], 200);
        }catch(\Throwable $th){
            return response()->json(['message'=>$th->getMessage()]);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSemesterRequest $request, int $id)
    {
        try{
            $model = Semester::findOrFail($id);
            $model->update($request->toArray());
            return response()->json(['message'=>'cập nhật thành công'],200);
        }catch(\Throwable $th){
            return response()->json(['message'=>$th->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        try{
            $model = Semester::findOrFail($id);
            $model->delete();
            return response()->json(['message' => 'xóa thành công']);
        }catch(\Throwable $th){
            return response()->json(['message'=>$th->getMessage()],200);
        }
    }
}
