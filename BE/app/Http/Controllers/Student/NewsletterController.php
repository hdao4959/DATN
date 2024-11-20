<?php

namespace App\Http\Controllers\Student;

use Throwable;
use App\Models\Category;
use App\Models\Newsletter;
use Illuminate\Http\Request;
use App\Models\ClassroomUser;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;

class NewsletterController extends Controller
{
    public function index(Request $request) 
    {
        try {
            // Lấy user_code từ FE
            $userCode = $request->user()->user_code;     
            
            if (!$userCode) {

                return response()->json('Không có user', 200);
            }
            // Lấy ra student từ những lớp có mã lớp giống bên newsletters
            $listClass = ClassroomUser::where('user_code', $userCode)->pluck('class_code');
            if (!$listClass) {

                return response()->json('Không có user', 200);
            }
            // dd($listClass);
            $listCategory = Category::where('type', 'category')
                            ->with(['newsletter' => function ($query) use ($listClass) {
                                $query->where(function ($query) use ($listClass) {
                                    foreach ($listClass as $classCode) {
                                        $query->orWhereJsonContains('notification_object', ['class_code' => $classCode]);
                                    }
                                    $query->orWhereNull('notification_object');
                                });
                            }])
                            ->get();       
            
            return response()->json($listCategory, 200);
        } catch (Throwable $th) {
            Log::error(__CLASS__ . '@' . __FUNCTION__, [$th]);

            return response()->json([
                'message' => 'Lỗi không xác định!'
            ], 500);
        }
    }
    public function show(Request $request, string $code) 
    {
        try {
            // Lấy user_code từ FE
            $userCode = $request->user()->user_code;      
            if (!$userCode) {

                return response()->json('Không có user', 200);
            } else {
                // Lấy ra student từ những lớp có mã lớp giống bên newsletters
                $listClass = ClassroomUser::where('user_code', $userCode)->pluck('class_code');

                // Lấy ra các newsletters thuộc lớp học của user_code
                $newsletters = Newsletter::whereJsonContains('notification_object', [['class_code' => $listClass]])->where('code', $code)->get();            
            }

            return response()->json($newsletters, 200);
        } catch (Throwable $th) {
            Log::error(__CLASS__ . '@' . __FUNCTION__, [$th]);

            return response()->json([
                'message' => 'Lỗi không xác định!'
            ], 500);
        }
    }
    public function showCategory(Request $request, string $cateCode) 
    {
        try {
            // Lấy user_code từ FE
            $userCode = $request->user()->user_code;     
            
            if (!$userCode) {

                return response()->json('Không có user', 200);
            }
            // Lấy ra student từ những lớp có mã lớp giống bên newsletters
            $listClass = ClassroomUser::where('user_code', $userCode)->pluck('class_code');
            if (!$listClass) {

                return response()->json('Không có user', 200);
            }
            // dd($listClass);
            $listCategory = Category::where('cate_code', $cateCode)->where('type', 'category')
                            ->with(['newsletter' => function ($query) use ($listClass) {
                                $query->where(function ($query) use ($listClass) {
                                    foreach ($listClass as $classCode) {
                                        $query->orWhereJsonContains('notification_object', ['class_code' => $classCode]);
                                    }
                                    $query->orWhereNull('notification_object');
                                });
                            }])
                            ->get();       
            
            return response()->json($listCategory, 200);
        } catch (Throwable $th) {
            Log::error(__CLASS__ . '@' . __FUNCTION__, [$th]);

            return response()->json([
                'message' => 'Lỗi không xác định!'
            ], 500);
        }
    }
}
