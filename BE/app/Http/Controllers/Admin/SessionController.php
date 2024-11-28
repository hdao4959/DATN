<?php

namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;

use App\Http\Requests\StoreSessionRequest;
use App\Http\Requests\UpdateSessionRequest;
use App\Repositories\Contracts\SessionRepositoryInterface;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Throwable;

class SessionController extends Controller
{
    public $sessionRepository;

    public function __construct(SessionRepositoryInterface $sessionRepository){
        $this->sessionRepository = $sessionRepository;
    }

    public function index(){
        try{
            $model = $this->sessionRepository->getAll();
            return response()->json($model , 200);
        }catch(NotFoundHttpException $e){
            return response()->json(['message'=>$e->getMessage()],404);
        }
        catch(\Throwable $th){
            return response()->json(["message"=>$th],500);
        }
    }

    public function store(StoreSessionRequest $request){
        try{
            $cate_code = "TS".$request->session;
            $cate_name = "Ca ".$request->session;
            $value = [
                'start' => $request->time_start,
                'end'   => $request->time_end
            ];

            $value_json = json_encode($value);
            $data = [
                'cate_code'=>   $cate_code,
                'cate_name'=>   $cate_name,
                'value'    =>   $value_json,
                'type'     =>   'session'
            ];

            $model = $this->sessionRepository->create($data);
            return response()->json(["message"=> "thêm thành công"], 200);
        }catch(\Throwable $th){
            return response()->json($th->getMessage(), 400);
        }
    }

    // public function update(UpdateSessionRequest $request ,int $id){
    //     try{
    //         $model = $this->sessionRepository->update($request->toArray() , $id);
    //         return response()->json(["message"=> "sửa thành công"], 200);
    //     }catch(\Throwable $th){
    //         return response()->json($th->getMessage(), 400);
    //     }
    // }

    public function destroy(string $code){
        try{
            $model = $this->sessionRepository->delete($code);
            return response()->json(["message"=> "xóa thành công"], 200);
        }catch(\Throwable $th){
            return response()->json($th->getMessage(), 400);
        }
    }
}
