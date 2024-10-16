<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Models\User;
use Dotenv\Exception\ValidationException;
use Throwable;


class UserController extends Controller
{

    public function index()
    {

        try {
            $list_user = User::where('is_active', true)->paginate(20);

            if ($list_user->isEmpty()) {
                return response()->json(
                    ['message' => 'Không có tài khoản nào!'],
                    404
                );
            }
            return response()->json($list_user, 200);
        } catch (Throwable $th) {
            return response()->json(
                [
                    'message' => 'Đã xảy ra lỗi không xác định',
                    'error' => env('APP_DEBUG') ? $th->getMessage() : "Đã xảy ra lỗi!"
                ],
                500
            );
        }
    }


    public function store(StoreUserRequest $request)
    {

        try {
            $data = $request->all();
            User::create($data);
            return response()->json([
                'message' => 'Thêm mới tài khoản thành công'
            ], 201);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => "Đã xảy ra lỗi không xác định",
                'error' => env('APP_DEBUG') ? $th->getMessage() : 'Lỗi không xác định'
            ], 500);
        }
    }

    public function show(string $user_code)
    {
        try {
            $user = User::where([
                'user_code' => $user_code,
                'is_active' => true
            ])->first();

            if (!$user) {
                return response()->json([
                    'message' => "Tài khoản không tồn tại!"
                ], 404);
            }
            return response()->json($user, 200);
        } catch (Throwable $th) {
            return response()->json([
                'message' => "Đã xảy ra lỗi không xác định",
                'error' => env('APP_DEBUG') ? $th->getMessage() : "Lỗi không xác định"
            ], 500);
        }
    }


    public function update(UpdateUserRequest $request, string $user_code)
    {
        try {
            $user = User::where('user_code', $user_code)->first();
            if (!$user) {
                return response()->json([
                    'message' => "Tài khoản không tồn tại!"
                ], 404);
            }
            $data = $request->all();
            $user->update($data);

            return response()->json([
                'message' => 'Cập nhật thông tin tài khoản thành công!'
            ], 200);
        } catch (ValidationException $e) {
            // Trả về lỗi đầu tiên từ validation
            return response()->json([
                'message' => $e->getMessage()
            ], 422);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => "Lỗi không xác định",
                'error' => env('APP_DEBUG') ? $th->getMessage() : "Lỗi không xác định"
            ], 500);
        }
    }


    public function destroy(string $user_code)
    {
        try {

            $user = User::where('user_code', $user_code)->first();
            if (!$user) {
                return response()->json(
                    ['message' => 'Tài khoản không tồn tại'],
                    404
                );
            }
            $user->delete();
            return response()->json(
                ['message' => 'Xoá tài khoản thành công'],
                200
            );
        } catch (\Throwable $th) {
            return response()->json(
                [
                    'message' => 'Đã xảy ra lỗi không xác định',
                    'error' => env('APP_DEBUG') ? $th->getMessage() : 'Lỗi không xác định'
                ],500
            );
        }
    }
}
