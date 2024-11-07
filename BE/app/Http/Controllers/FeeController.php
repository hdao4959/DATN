<?php

namespace App\Http\Controllers;

use App\Models\Fee;
use App\Models\Subject;
use App\Models\User;
use App\Models\Wallet;
use Illuminate\Http\Request;

class FeeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $fee =  Fee::query()->take(50)->get();
        return response()->json($fee);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Fee::query()->delete();
        $students = User::with(['semester' => function ($query) {
            $query->select('cate_code', 'value'); // chỉ lấy cate_code và name từ bảng categories
        }])
        ->select('id', 'full_name','user_code', 'semester_code')
        ->get();


        foreach ($students as $stu) {

            $number = $stu->semester->value + 1 ;

            $subjects = Subject::whereHas('semester', function ($query) use ($number) {
                $query->where('value', $number);
            })
            ->with(['semester' => function ($query) {
                $query->select('cate_code', 'value', 'id');
            }])
            ->get();

            $totalTuition = 0;

            foreach ($subjects as $sub) {
                $totalTuition+= $sub->tuition;
            }

            $data = [
                'user_id' => $stu->id,
                'user_code' => $stu->user_code,
                'semester' => $number,
                'amount'  => $totalTuition,
                'start_date' => '2024-10-01',
                'due_date' => '2024-10-31',
                'status'  => 'pending'
            ];

            $fee = Fee::create($data);

            $fees = Fee::where('user_id',$fee->user_id)->select('amount')->get();

            $total = 0;
            foreach ($fees as $fe) {
                $total += $fe->amount;
            }

            // return response()->json($total);

             Wallet::query()
            ->where('user_id',$fee->user_id)
            ->update(['total'=>$total]);
        }

        return response()->json(['message'=>'tao fee thanh cong']);
    }

    /**
     * Display the specified resource.
     */
    public function show(Fee $fee)
    {
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Fee $fee)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Fee $fee)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Fee $fee)
    {
        //
    }
}
