<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Response;
use Illuminate\Validation\ValidationException;
use Laravel\Sanctum\PersonalAccessToken;
use Validator;

class AuthController extends Controller
{
    public function login(Request $request)
    {

        try {

            $request->validate(
                [
                    'email' => "required|email",
                    'password' => 'required|min:6'
                ],
                [
                    'email.required' => 'Bạn chưa nhập email',
                    'password.required' => "Bạn chưa nhập password",
                    'email.email' => 'Email không hợp lệ',
                    'password.min' => "Mật khẩu phải tối thiểu 6 kí tự"
                ]
            );
            
            $data = [
                'email' => $request->email,
                'password' => $request->password
            ];
            // Kiểm tra sự tồn tại của tài khoản
            if (Auth::attempt($data)) {
                $user = Auth::user();
                // Tạo token khi tài khoản đúng
                $token = $user->createToken($user->id)->plainTextToken;
                return response()->json([
                    'user' => $user,
                    'token' => [
                        'access_token' => $token,
                        'type_token' => 'Bearer'
                    ]
                ], 200);
            }
            // Trường hợp dữ liệu nhập và là hợp lệ nhưng không khớp với db
            return response()->json([
                'message' => 'Tài khoản hoặc mật khẩu không chính xác'
            ], 401);

        } catch (\Throwable $th) {
            // Trường hợp dữ liệu nhập vào không hợp lệ
            if ($th instanceof ValidationException) {
                return response([
                    'message' => $th->validator->errors()->first()
                ], 422);
            } else {
                // Trường hợp lỗi không xác định
                return response([
                    'message' => "Lỗi không xác định"
                ], 500);
            }
        }
    }

    public function logout(Request $request)
    {
        // Lấy token từ frontend
        $token  = $request->bearerToken();
        if (!$token) {
            return response()->json([
                'message' => "Bạn không có quyền truy cập!"
            ], 401);
        }
        // Tìm bản ghi token trong db
        $accessToken = PersonalAccessToken::findToken($token);
        
        // Trường hợp tìm thấy bản ghi trong db có token vừa nhận được
        if ($accessToken) {
            $accessToken->delete();
            return response()->json([
                'message' => "Đăng xuất thành công!!"
            ], 200);
        }else{
            // Trường hợp không tìm thấy bản ghi trùng khớp
            return response()->json([
                'message' => "Bạn không có quyền truy cập!"
            ], 401);
        }

       
    }
}
