<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Support\Str;
use App\Models\Category;
use App\Models\Score;
use App\Models\Service;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;


class ServiceController extends Controller
{

    public function getAllServices(Request $request)
    {
        try {

            $query = Service::query()
            ->select([
                'id',
                'user_code',
                'service_name',
                'slug',
                'content',
                'status',
                'amount',
                'created_at',
                'updated_at'
            ])
            ->with([
                'student:id,user_code,full_name,email,phone_number' // Chỉ lấy cột cần thiết từ bảng User
            ]);

            // Lọc theo trạng thái nếu có
            if ($request->has('status') && !empty($request->status)) {
                $query->where('status', $request->status);
            }

            if ($request->has('student_id') && !empty($request->student_id)) {
                $query->where('student_id', $request->student_id);
            }

            // Sắp xếp theo cột nếu có tham số 'sort_by' và 'order'
            if ($request->has('sort_by') && $request->has('order')) {
                $query->orderBy($request->sort_by, $request->order === 'desc' ? 'desc' : 'asc');
            } else {
                $query->orderBy('created_at', 'desc'); // Mặc định sắp xếp theo thời gian tạo
            }

            $data = $query->paginate($request->get('per_page', 25)); // Mặc định 25 bản ghi mỗi trang

            return response()->json([
                'success' => true,
                'message' => 'Lấy danh sách dịch vụ thành công.',
                'data' => $data,
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => 'Đã xảy ra lỗi: ' . $th->getMessage(),
            ], 500);
        }
    }

  public function getAllServiesByStudent(Request $request)
  {
    try {
      $user_code = request()->user()->user_code;
      $data = Service::query()->where('user_code',$user_code);

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

  public function provideScoreboard(Request $request)
  {
    try {
        // input số lượng bảng điểm- number_board
        // số điện thoại - number_phone
        // hình thức nhận [Chuyển phát nhanh, Nhận trực tiếp]
        // địa chỉ - receive_address
        // Ghi chú - note
    $validatedData = $request->validate([
        'number_board'     => 'required|integer|min:1', // Số lượng bảng điểm, phải là số nguyên >= 1
        'number_phone'     => 'required|string|max:15', // Số điện thoại, giới hạn 15 ký tự
        'receive_method'   => 'required|string', // Hình thức nhận
        'receive_address'  => 'nullable|string|max:255',
        'note'             => 'nullable|string|max:500',
    ]);

      $user_code = request()->user()->user_code;
    //   $user_code = $request->user_code;

      if(!$user_code){
        return response()->json(['message' => 'không tìm thấy user_code']);
      }

      $content = "Số lượng bảng điểm: {$validatedData['number_board']} \n";
      $content .= "Số điện thoại: {$validatedData['number_phone']} \n";
      $content .= "Hình thức nhận: {$validatedData['receive_method']} \n";

      if (!empty($validatedData['receive_address'])) {
        $content .= "Địa chỉ nhận: {$validatedData['receive_address']} \n";
      }

      if (!empty($validatedData['note'])) {
            $content .= "Ghi chú: {$validatedData['note']} \n";
      }

      $service_name = "Đăng ký cấp bảng điểm";
      $slug =  Str::slug($service_name);

      $amount = $validatedData['number_board'] * 100000;
      $data = [
        'user_code'     => $user_code,
        'service_name'  => $service_name,
        'slug'          => $slug,
        'content'       => $content,
        'amount'        => $amount
      ];

      $service = Service::create($data);
      return response()->json(['message' => 'gửi dịch vụ thành công', 'service' => $service]);
    } catch (\Throwable $th) {
        return response()->json([
            'message' => 'Đã xảy ra lỗi',
            'error'   => $th->getMessage(),
        ], 500);
    }
  }


  public function changeInfo( Request $request)
  {
    try {

        $validatedData = $request->validate([
            'full_name'     => 'nullable|string|max:255',
            'sex'           => 'nullable|string|in:Nam,Nữ',  // Giới tính, chỉ có 2 giá trị
            'date_of_birth' => 'nullable|date', // Kiểm tra định dạng ngày tháng
            'address'       => 'nullable|string|max:255', // Địa chỉ
            'id_number'     => 'nullable|string|max:20', // Kiểm tra CMT/CCCD
            'note'          => 'nullable|string|max:500',
        ]);

      $user_code = $request->user()->user_code;
      if(!$user_code){
        return response()->json(['message' => 'không tìm thấy user_code']);
      }

      $service_name = "Đăng kí thay đổi thông tin";
      $slug =  Str::slug($service_name);

      $content = "";

      if (!empty($validatedData['full_name'])) {
          $content .= "Họ và tên mới: {$validatedData['full_name']} \n";
      }

      if (!empty($validatedData['sex'])) {
          $content .= "Giới tính mới: {$validatedData['sex']} \n";
      }

      if (!empty($validatedData['date_of_birth'])) {
          $content .= "Ngày sinh mới: {$validatedData['date_of_birth']} \n";
      }

      if (!empty($validatedData['address'])) {
          $content .= "Địa chỉ mới: {$validatedData['address']} \n";
      }

      if (!empty($validatedData['id_number'])) {
          $content .= "Số CMND/CCCD mới: {$validatedData['id_number']} \n";
      }

      if (!empty($validatedData['note'])) {
          $content .= "Ghi chú: {$validatedData['note']} \n";
      }
      $data = [
        'user_code'     => $user_code,
        'service_name'  => $service_name,
        'slug'          => $slug,
        'content'       => $content,
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
