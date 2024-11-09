<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSemesterRequest;
use App\Http\Requests\UpdateSemesterRequest;
use App\Models\Category;
use App\Models\Semester;
use App\Repositories\Contracts\SemesterRepositoryInterface;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class SemesterController extends Controller
{
    protected $semesterRepository;
    public function __construct(SemesterRepositoryInterface $semesterRepository){
        $this->semesterRepository = $semesterRepository;
    }
    public function index()
    {
        try{
          $model = $this->semesterRepository->getAll();
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
            $model = $this->semesterRepository->create($request->toArray());
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
            $model = $this->semesterRepository->update($request->toArray(), $id);
            return response()->json(['message'=>'cập nhật thành công'],200);
        }
        catch(NotFoundHttpException $e){
            return response()->json(['message'=>$e->getMessage()]);
        }
        catch(\Throwable $th){
            return response()->json(['message'=>$th->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        try{
            $model = $this->semesterRepository->delete($id);
            return response()->json(['message' => 'xóa thành công']);
        }
        catch(NotFoundHttpException $e){
            return response()->json(['message'=>$e->getMessage()]);
        }
        catch(\Throwable $th){
            return response()->json(['message'=>$th->getMessage()],200);
        }
    }

    
}
