<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTimeSlotRequest;
use App\Http\Requests\UpdateTimeSlotRequest;
use App\Repositories\Contracts\TimeSlotRepositoryInterface;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Throwable;

class TimeSlotController extends Controller
{
    public $timeslotRepository;

    public function __construct(TimeSlotRepositoryInterface $timeslotRepository){
        $this->timeslotRepository = $timeslotRepository;
    }

    public function index(){
        try{
            $timeSlot = $this->timeslotRepository->getAll();
            return response()->json($timeSlot , 200);
        }catch(NotFoundHttpException $e){
            return response()->json(['message'=>$e->getMessage()],404);
        }
        catch(\Throwable $th){
            return response()->json(["message"=>$th],500);
        }
    }

    public function store(StoreTimeSlotRequest $request){
        try{
            $timeSlot = $this->timeslotRepository->create($request->toArray());
            return response()->json(["message"=> "thêm thành công"], 200);
        }catch(\Throwable $th){
            return response()->json($th->getMessage(), 400);
        }
    }

    public function update(UpdateTimeSlotRequest $request ,int $id){

        try{
            $timeSlot = $this->timeslotRepository->update($request->toArray() , $id);
            return response()->json(["message"=> "sửa thành công"], 200);
        }catch(\Throwable $th){
            return response()->json($th->getMessage(), 400);
        }
    }

    public function destroy(int $id){
        try{
            $timeSlot = $this->timeslotRepository->delete($id);
        }catch(\Throwable $th){
            return response()->json($th->getMessage(), 400);
        }
    }
}
