<?php

namespace App\Http\Controllers\Student;

use Throwable;
use App\Models\Classroom;
use App\Models\Newsletter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;

class NewsletterController extends Controller
{
    public function showNewsletter(Request $request) 
    {
        try {
            // Lấy user_code từ FE
            $userCode = $request->query('user_code');       
            if (!$userCode) {

                return response()->json('Không có user', 200);
            } else {
                // Lấy ra student từ những lớp có mã lớp giống bên newsletters
                $listClass = Classroom::whereJsonContains('students', [['student_code' => $userCode]])->pluck('class_code');

                // Lấy ra các newsletters thuộc lớp học của user_code
                $newsletters = Newsletter::whereJsonContains('notification_object', [['class_code' => $listClass]])->get();            
            }

            return response()->json($newsletters, 200);
        } catch (Throwable $th) {
            Log::error(__CLASS__ . '@' . __FUNCTION__, [$th]);

            return response()->json([
                'message' => 'Lỗi không xác định!'
            ], 500);
        }
    }
}
