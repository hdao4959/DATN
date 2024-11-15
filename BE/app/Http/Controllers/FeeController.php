<?php

namespace App\Http\Controllers;

use App\Models\Fee;
use App\Models\Subject;
use App\Models\User;
use App\Models\Wallet;
use App\Repositories\Contracts\FeeRepositoryInterface;
use Illuminate\Http\Request;
use Throwable;

class FeeController extends Controller
{

    protected $feeRepository;

    public function __construct(FeeRepositoryInterface $feeRepository) {
        $this->feeRepository = $feeRepository;
    }


    public function index(Request $request)
    {
        try{
            $status = $request['status'];
            $email  = $request['email'];
            $data = $this->feeRepository->getAll( $email, $status);
            return response()->json($data);
        }catch(Throwable $th){
            return response()->json(['message' => $th],404);
        }

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

        try{
            $this->feeRepository->createAll();
            return response()->json(['message'=>'tao fee thanh cong']);
        }catch(Throwable $th){
            return response()->json(['message' => $th],404);
        }

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
