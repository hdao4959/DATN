<?php
namespace App\Repositories;

use App\Models\Fee;
use App\Models\Subject;
use App\Models\Transaction;
use App\Models\User;
use App\Models\Wallet;
use App\Repositories\Contracts\FeeRepositoryInterface;
use App\Jobs\SendEmailJob;

class FeeRepository implements FeeRepositoryInterface {
    public function getAll($email = null ,$status = null){
        $data =  Fee::query()->with(['user' => function($query){
            $query->select('id', 'user_code', 'full_name', 'email', 'phone_number');
        }]);

        if($status){
            $data->where('status',$status);
        }

        if($email){
            $data->whereHas('user', function($query) use ($email) {
                $query->where('email', 'like', '%' . $email.'%' );
            });

        }

        return $data->paginate(20);
    }

    public function createAll(){

        Transaction::query()->delete();
        Fee::query()->delete();
        $students = User::with(['semester' => function ($query) {
            $query->select('cate_code', 'value'); // chỉ lấy cate_code và name từ bảng categories
        }])
        ->select('id', 'full_name','user_code', 'semester_code')
        ->get();

        foreach ($students as $stu) {

            $nextSemester = $stu->semester->value + 1;

            $subjects = Subject::whereHas('semester', function ($query) use ($nextSemester) {
                $query->where('value', $nextSemester);
            })
            ->with(['semester' => function ($query) {
                $query->select('cate_code', 'value', 'id');
            }])

            ->get();

            $totalTuition = $subjects->sum('tuition');

            $feeData  = [
                'user_id' => $stu->id,
                'user_code' => $stu->user_code,
                'semester' => $nextSemester,
                'amount'  => $totalTuition,
                'start_date' => '2024-10-01',
                'due_date' => '2024-10-31',
                'status'  => 'pending'
            ];

            $fee = Fee::create($feeData);

            $totalFees = Fee::where('user_id', $fee->user_id)->sum('amount');


             Wallet::query()
            ->where('user_id',$fee->user_id)
            ->update(['total'=>$totalFees]);
        }
    }

    public function sendEmailToUsers (array $user = []){

        if (empty($user)) {
            dd('No users provided for email sending');
        }

        foreach ($user as $email) {
            $data = ['email' => $email];

            // Dispatch job để gửi email
            dispatch(new SendEmailJob($data));
        }

        dd('Email Send Successfully');
    }
}
