<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Service;
use App\Models\User;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    
    public function getAllServies(Request $request){
        try{
            $data = Service::query();

            if($request['status']){
                $data->where('status', $request['status']);
            }

            $data->paginate(25);
            return response()->json($data);
        }catch(\Throwable $th){
            return response()->json(['message'=>$th->getMessage()]);
        }
    }

    public function changeStatus(string $user_code, Request $request){
          try{
              $message = "";
              $status = $request->status;
              $reason  = $request->reason;
              $user = User::where('user_code',$user_code);
            // "pending","approved","rejected"
              if($status == "approved"){
                  $message = "Đã duyệt";
              }

              if($status == "rejected"){
                  $message = "Đã từ chối";
              }

              $user->update([
                'status'=> $request->status,
                'reason'=> $reason
              ]);

              return response()->json(['message' => $message,'reason' => $reason ]);
          }catch(\Throwable $th){
              return response()->json(['message' => $th->getMessage()]);
          }
    }
    public function changeMajor(string $user_code, Request $request){

      try{
        $old_major = Category::where('cate_code',$request->old_major)->first();
        $new_major = Category::where('cate_code',$request->new_major)->first();

        $content = "Mong mong muốn được chuyển Chuyên ngành: Từ " . $old_major->cate_name . " sang " . $new_major->cate_name . ".
        Lý do: {$request->reason}";


        $data = [
            'user_code'=>$user_code,
            'name'=> "Đăng kí dịch vụ chuyển Chuyên Ngành Học ",
            'content'=>$content,
        ];

        $service = Service::create($data);
        return response()->json(['message'=>'gửi dịch vụ thành công','service'=>$service]);
      }catch(\Throwable $th){
        return response()->json(['message'=>$th->getMessage()]);
      }
    }

    public function provideScoreboard(string $user_code, Request $request){
        try{
            $content = "Mong muốn nhà trường cung cấp bảng điểm";
            $data = [
                'user_code'=>$user_code,
                'name'=> "Đăng kí dịch vụ Cung cấp bảng điểm ",
                'content'=>$content,
            ];

            $service = Service::create($data);
            return response()->json(['message'=>'gửi dịch vụ thành công','service'=>$service]);
          }catch(\Throwable $th){
            return response()->json(['message'=>$th->getMessage()]);
          }
    }

    public function changeInfo(string $user_code, Request $request){
        try{
            $content = "Mong muốn thay đổi thông tin học sinh";
            $data = [
                'user_code'=>$user_code,
                'name'=> "Đăng kí dịch vụ Thay đổi thông tin",
                'content'=>$content,
            ];

            $service = Service::create($data);
            return response()->json(['message'=>'gửi dịch vụ thành công','service'=>$service]);
          }catch(\Throwable $th){
            return response()->json(['message'=>$th->getMessage()]);
          }
    }
    public function provideStudentCard(string $user_code, Request $request){
        try{
            $content = "Mong muốn được cung cấp thẻ sinh viên";
            $data = [
                'user_code'=>$user_code,
                'name'=> "Đăng kí dịch vụ Cung cấp thẻ sinh viên ",
                'content'=>$content,
            ];

            $service = Service::create($data);
            return response()->json(['message'=>'gửi dịch vụ thành công','service'=>$service]);
          }catch(\Throwable $th){
            return response()->json(['message'=>$th->getMessage()]);
          }
    }

    public function dropOutOfSchool(string $user_code, Request $request){
        try{
            $content = "Mong muốn đăng ký dịch vụ thôi học. Lý do: {$request->reason}";
            $data = [
                'user_code'=>$user_code,
                'name'=> "Đăng kí dịch vụ Thôi học",
                'content'=>$content,
            ];

            $service = Service::create($data);
            return response()->json(['message'=>'gửi dịch vụ thành công','service'=>$service]);
          }catch(\Throwable $th){
            return response()->json(['message'=>$th->getMessage()]);
          }
    }

}
