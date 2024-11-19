<?php

namespace App\Http\Controllers;
use App\Jobs\SendEmailJob;
use App\Models\Fee;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class SendEmailController extends Controller
{
    public function sendMailFee(){

        $fees = Fee::with(['user' => function($query){
            $query->select('id', 'full_name', 'user_code','email');
        }])->where('status','pending')->get();

        foreach ($fees as $fee) {
                try{
                    // return response()->json( ['message' => 'Emails dispatched', 'data' => $fee['user']['email']]);


                    dispatch(new SendEmailJob([
                        'email' => $fee->user->email,
                        'full_name' => $fee->user->full_name,
                        'user_code' => $fee->user->user_code,
                        'semester' => $fee->semester,
                        'amount'  => $fee->amount,
                        'due_date' => $fee->due_date,
                    ]));
                }catch(\Exception $e){
                    Log::error('Error dispatching email job for Fee ID: ' . $fee->id . '. Error: ' . $e->getMessage());
                }
        }

        // $data['email'] = 'loctqph42545@fpt.edu.vn';
        // dispatch(new SendEmailJob($data));


        return response()->json( ['message' => 'Emails dispatched', 'data' => $fees]);
    }

    public function sendMailFeeUser(Request $request)
{
    $userCodes = $request->input('UserCode'); // Lấy danh sách user_code từ request

    if (empty($userCodes) || !is_array($userCodes)) {
        return response()->json(['message' => 'Invalid user_codes input. It should be a non-empty array.'], 400);
    }

    // Lấy danh sách phí dựa vào user_code
    $fees = Fee::with(['user' => function($query) {
            $query->select('id', 'full_name', 'user_code', 'email');
        }])
        ->whereHas('user', function($query) use ($userCodes) {
            $query->whereIn('user_code', $userCodes);
        })
        // ->where('status', 'pending')
        ->get();

    if ($fees->isEmpty()) {
        return response()->json(['message' => 'No pending fees found for the provided user_codes.'], 404);
    }

    foreach ($fees as $fee) {
        try {
            dispatch(new SendEmailJob([
                'email' => $fee->user->email,
                'full_name' => $fee->user->full_name,
                'user_code' => $fee->user->user_code,
                'semester' => $fee->semester,
                'amount' => $fee->amount,
                'due_date' => $fee->due_date,
            ]));
        } catch (\Exception $e) {
            Log::error('Error dispatching email job for Fee ID: ' . $fee->id . '. Error: ' . $e->getMessage());
        }
    }

    return response()->json(['message' => 'Emails dispatched', 'data' => $fees]);
}

}
