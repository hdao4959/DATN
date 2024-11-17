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
}
