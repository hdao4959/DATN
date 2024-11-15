<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Response;
use Illuminate\Validation\ValidationException;
use Laravel\Sanctum\PersonalAccessToken;
use Validator;

class AuthController extends Controller
{
    public function login(LoginRequest $request)
    {
        try {
            $data = $request->validated();   
            $user = User::firstWhere('email',$data['email']);

            if(!$user || !Hash::check($data['password'], $user['password'])){
                return response()->json([
                    'message' => 'Tài khoản hoặc mật khẩu không chính xác'
                ], 401);
            }

                // Tạo token khi tài khoản đúng
                $token = $user->createToken($user->id)->plainTextToken;
                
                return response()->json([
                    'user' => $user,
                    'token' => [
                        'access_token' => $token,
                        'type_token' => 'Bearer'
                    ]
                ], 200);


        } catch (\Throwable $th) {

                return response([
                    'message' => "Lỗi không xác định"
                ], 500);
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
