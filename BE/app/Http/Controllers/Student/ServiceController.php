<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Score;
use App\Models\Service;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ServiceController extends Controller
{

  public function getAllServies(Request $request)
  {
    try {
      $data = Service::query();

      if ($request['status']) {
        $data->where('status', $request['status']);
      }

      $data->paginate(25);
      return response()->json($data);
    } catch (\Throwable $th) {
      return response()->json(['message' => $th->getMessage()]);
    }
  }

  public function getListLearnAgain(Request $request)
  {
    $user_code = request()->user()->user_code;
    $subject = Score::Where('is_pass', false)->where('status', false)->where('student_code',$user_code)->with('Subject')->get();
    return response()->json(['data' => $subject],200);

  }
  public function LearnAgain(Request $request)
  {
    try {
      $user_code = request()->user()->user_code;
      $subject_code = $request->subject_code;

      $subject = Subject::where('subject_code', $subject_code)->firstOrFail();
      $content = $subject->subject_code;
      $amount  = $subject->re_study_fee;
      $data = [
        'user_code'      =>    $user_code,
        'service_name'   =>    "Đăng kí học lại môn " . $subject->subject_name,
        'content'        =>    $content,
        'amount'         =>    $amount
      ];

      $service = Service::create($data);
      // if ($service) {
        // Xây dựng URL cho API gửi email
        // $redirectUrl = url("/send-email/learn-again/{$service->id}");
        
        // // Gọi API gửi email
        // $response = Http::post($redirectUrl, [
        //     'subject_code' => $subject_code,  // Gửi danh sách user_code
        // ]);

        // if ($response->successful()) {
        //     return response()->json(['message' => 'Gửi dịch vụ thành công và email đã được gửi', 'service' => $service]);
        // } else {
        //     return response()->json(['message' => 'Gửi dịch vụ thành công nhưng không thể gửi email', 'service' => $service]);
        // }
    // }
      return response()->json(['message' => 'gửi dịch vụ thành công', 'service' => $service]);
    } catch (\Throwable $th) {
      return response()->json(['message' => $th->getMessage()]);
    }
  }
  public function changeStatus(string $user_code, Request $request)
  {
    try {
      $message = "";
      $status = $request->status;
      $reason  = $request->reason;
      $user = User::where('user_code', $user_code);
      // "pending","approved","rejected"
      if ($status == "approved") {
        $message = "Đã duyệt";
      }

      if ($status == "rejected") {
        $message = "Đã từ chối";
      }

      $user->update([
        'status' => $request->status,
        'reason' => $reason
      ]);

      return response()->json(['message' => $message, 'reason' => $reason]);
    } catch (\Throwable $th) {
      return response()->json(['message' => $th->getMessage()]);
    }
  }
  public function changeMajor(string $user_code, Request $request)
  {

    try {
      $old_major = Category::where('cate_code', $request->old_major)->first();
      $new_major = Category::where('cate_code', $request->new_major)->first();

      $content = "Mong mong muốn được chuyển Chuyên ngành: Từ " . $old_major->cate_name . " sang " . $new_major->cate_name . ".
        Lý do: {$request->reason}";


      $data = [
        'user_code' => $user_code,
        'name' => "Đăng kí dịch vụ chuyển Chuyên Ngành Học ",
        'content' => $content,
      ];

      $service = Service::create($data);
      return response()->json(['message' => 'gửi dịch vụ thành công', 'service' => $service]);
    } catch (\Throwable $th) {
      return response()->json(['message' => $th->getMessage()]);
    }
  }

  public function provideScoreboard(string $user_code, Request $request)
  {
    try {
      $content = "Mong muốn nhà trường cung cấp bảng điểm";
      $data = [
        'user_code' => $user_code,
        'name' => "Đăng kí dịch vụ Cung cấp bảng điểm ",
        'content' => $content,
      ];

      $service = Service::create($data);
      return response()->json(['message' => 'gửi dịch vụ thành công', 'service' => $service]);
    } catch (\Throwable $th) {
      return response()->json(['message' => $th->getMessage()]);
    }
  }

  public function changeInfo(string $user_code, Request $request)
  {
    try {
      $content = "Mong muốn thay đổi thông tin học sinh";
      $data = [
        'user_code' => $user_code,
        'name' => "Đăng kí dịch vụ Thay đổi thông tin",
        'content' => $content,
      ];

      $service = Service::create($data);
      return response()->json(['message' => 'gửi dịch vụ thành công', 'service' => $service]);
    } catch (\Throwable $th) {
      return response()->json(['message' => $th->getMessage()]);
    }
  }
  public function provideStudentCard(string $user_code, Request $request)
  {
    try {
      $content = "Mong muốn được cung cấp thẻ sinh viên";
      $data = [
        'user_code' => $user_code,
        'name' => "Đăng kí dịch vụ Cung cấp thẻ sinh viên ",
        'content' => $content,
      ];

      $service = Service::create($data);
      return response()->json(['message' => 'gửi dịch vụ thành công', 'service' => $service]);
    } catch (\Throwable $th) {
      return response()->json(['message' => $th->getMessage()]);
    }
  }

  public function dropOutOfSchool(string $user_code, Request $request)
  {
    try {
      $content = "Mong muốn đăng ký dịch vụ thôi học. Lý do: {$request->reason}";
      $data = [
        'user_code' => $user_code,
        'name' => "Đăng kí dịch vụ Thôi học",
        'content' => $content,
      ];

      $service = Service::create($data);
      return response()->json(['message' => 'gửi dịch vụ thành công', 'service' => $service]);
    } catch (\Throwable $th) {
      return response()->json(['message' => $th->getMessage()]);
    }
  }
}
