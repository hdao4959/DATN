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
            $data = Fee::where('id', $id)->first();
            if (!$data) {
                return $this->handleInvalidId();
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
        $data = $request->all(); // Lấy tất cả dữ liệu từ FormData
        // Bạn có thể truy cập các giá trị này ví dụ: $data['user_code'], $data['semester_code'], ...
        return response()->json([
            'data' => $data,
        ], 200);
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
