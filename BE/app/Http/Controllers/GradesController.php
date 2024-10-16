<?php

namespace App\Http\Controllers;

use App\Models\Grades;
use App\Http\Requests\UpdateGradesRequest;
use App\Repositories\Contracts\GradeRepositoryInterface;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Throwable;

class GradesController extends Controller
{
    protected $gradeRepository;
    public function __construct(GradeRepositoryInterface $gradeRepository){
        $this->gradeRepository = $gradeRepository;
    }
    public function index()
    {
        $grade = Grades::all();
        return response($grade);
    }


    public function create()
    {
        //
    }



    public function show(Grades $grades)
    {

    }

    public function getByParam(Request $request){
        try{
            $grade = $this->gradeRepository->getByParam($request);

            return response()->json($grade);
        }catch(ModelNotFoundException $e){
            return response()->json(['message'=>'không tìm thấy bản ghi'],404);
        }
        catch(\Throwable $th){
            return response()->json(['error'=>$th->getMessage()],500);
        }
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Grades  $grades
     * @return \Illuminate\Http\Response
     */

    public function update(Request $request, $id)
    {
        try{
            $this->gradeRepository->update($request,$id);

            return response()->json(['message'=>'cập nhật điểm thành công'],200);
        }catch(\Throwable $th){
            return response()->json(['error'=>$th->getMessage()],500);
        }
    }


}
