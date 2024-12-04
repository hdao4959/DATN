<?php

namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;

use App\Http\Requests\StoreSessionRequest;
use App\Http\Requests\UpdateSessionRequest;
use App\Repositories\Contracts\SessionRepositoryInterface;
use Carbon\Carbon;
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
            $timeStart = Carbon::parse($request->time_start);
            $timeEnd = Carbon::parse($request->time_end);

            $differenceInHours = $timeStart->diffInHours($timeEnd);
            if ($differenceInHours !== 2) {
                return response()->json(["message" => "Thời gian bắt đầu và kết thúc phải cách nhau 2 tiếng."], 400);
            }

            $existingSessions = $this->sessionRepository->getAll();

            foreach ($existingSessions as $session) {
                // Tách chuỗi value thành start và end
                [$existingStart, $existingEnd] = explode('-', $session->value);

                // Chuyển đổi start và end thành Carbon
                $existingStart = Carbon::parse($existingStart);
                $existingEnd = Carbon::parse($existingEnd);

                // Kiểm tra chồng chéo thời gian
                if ($timeStart < $existingEnd && $timeEnd > $existingStart) {
                    return response()->json(["message" => "Thời gian bị trùng với ca học khác."], 400);
                }
            }

            $cate_code = "TS".$request->session;
            $cate_name = "Ca ".$request->session;
            $value = "$request->time_start-$request->time_end";
            $data = [
                'cate_code'=>   $cate_code,
                'cate_name'=>   $cate_name,
                'value'    =>   $value,
                'type'     =>   'session'
            ];

            $model = $this->sessionRepository->create($data);
            return response()->json(["message"=> "thêm thành công"], 200);
        }catch(\Throwable $th){
            return response()->json($th->getMessage(), 400);
        }
    }

    public function update(Request $request, $code) {
        try {
            // Chuyển đổi thời gian bắt đầu và kết thúc
            $timeStart = Carbon::parse($request->time_start);
            $timeEnd = Carbon::parse($request->time_end);

            // Kiểm tra thời gian phải cách nhau đúng 2 tiếng
            $differenceInHours = $timeStart->diffInHours($timeEnd);
            if ($differenceInHours !== 2) {
                return response()->json(["message" => "Thời gian bắt đầu và kết thúc phải cách nhau 2 tiếng."], 400);
            }

            // Lấy tất cả các ca học trừ bản ghi hiện tại
            $existingSessions = $this->sessionRepository->getModel()
                ->where('cate_code', '!=', $code) // Loại bỏ bản ghi đang được cập nhật
                ->where('type', 'session')
                ->get();

            // Duyệt qua các ca học để kiểm tra trùng lặp
            foreach ($existingSessions as $session) {
                // Tách chuỗi value thành start và end
                [$existingStart, $existingEnd] = explode('-', $session->value);

                // Chuyển đổi start và end thành Carbon
                $existingStart = Carbon::parse($existingStart);
                $existingEnd = Carbon::parse($existingEnd);

                // Kiểm tra chồng chéo thời gian
                if ($timeStart < $existingEnd && $timeEnd > $existingStart) {
                    return response()->json(["message" => "Thời gian bị trùng với ca học khác."], 400);
                }
            }

            // Tạo dữ liệu cập nhật
            $cate_code = "TS" . $request->session;
            $cate_name = "Ca " . $request->session;

            $value = "$request->time_start-$request->time_end";

            $data = [
                'cate_code' => $cate_code,
                'cate_name' => $cate_name,
                'value'     => $value,
                'type'      => 'session',
            ];

            // Cập nhật bản ghi
            $this->sessionRepository->update($data, $code);

            return response()->json(["message" => "Cập nhật thành công"], 200);
        } catch (\Throwable $th) {
            return response()->json($th->getMessage(), 400);
        }
    }

    public function destroy(string $code){
        try{
            $model = $this->sessionRepository->delete($code);
            return response()->json(["message"=> "xóa thành công"], 200);
        }catch(\Throwable $th){
            return response()->json($th->getMessage(), 400);
        }
    }
}
