<?php

namespace App\Http\Controllers;

use App\Models\Fee;
use App\Models\Subject;
use App\Models\User;
use App\Models\Wallet;
use App\Repositories\Contracts\FeeRepositoryInterface;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Throwable;

class FeeController extends Controller
{

    protected $feeRepository;

    public function __construct(FeeRepositoryInterface $feeRepository)
    {
        $this->feeRepository = $feeRepository;
    }


    public function index(Request $request)
    {
        try {
            $status = $request['status'];
            $email  = $request['email'];
            $data = $this->feeRepository->getAll($email, $status);
            return response()->json($data);
        } catch (Throwable $th) {
            return response()->json(['message' => $th], 404);
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create() {}

    /**
     * Store a newly created resource in storage.
     */
    public function store()
    {
        // return response()->json(['data' => $request]);
        try {
            $data = $this->feeRepository->createAll();
            return response()->json(['message' => $data]);
            // return response()->json($data);
        } catch (Throwable $th) {
            return response()->json(['message' => $th->getMessage()], 404);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            // $data = Fee::where('id', $id)->first();
            $data = Fee::find($id);
            if (!$data) {
                return response()->json([
                    'message' => 'Fee not found.',
                    'success' => false
                ], 404);    
            } else {
                return response()->json([
                    $data
                ], 200);
            }
        } catch (\Throwable $th) {

            return $this->handleErrorNotDefine($th);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request, $id)
    {
        
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Fee $fee)
    {
        $validatedData = $request->validate([
            'amount' => 'required|numeric|min:0',
        ]);
    
        // Cập nhật giá trị mới
        $fee->amount = $validatedData['amount'];
        if($validatedData['amount'] >= $fee->total_amount){
            $fee->status = 'paid';
        }
        $fee->save();
    
        return response()->json([
            'message' => 'Fee updated successfully.',
            'data' => $fee,
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Fee $fee)
    {
        //
    }

    public function getListDebt(Request $request)
    {
        try {
            $userCode = $request->user()->user_code;
            if (!$userCode) {
                return response()->json('Không có user_code', 400);
            }

            $data = Fee::where('user_code', $userCode)->where('status', 'unpaid')->get();

            return response()->json($data);
        } catch (Throwable $th) {
            return response()->json(['message' => $th], 404);
        }
    }
}
