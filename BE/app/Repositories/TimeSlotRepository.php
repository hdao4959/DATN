<?php
namespace App\Repositories;

use App\Models\TimeSlot;
use App\Repositories\Contracts\TimeSlotRepositoryInterface;

class TimeSlotRepository implements TimeSlotRepositoryInterface{
    public function getAll(){
       return TimeSlot::all();
    }

    public function create(array $data){
        return TimeSlot::create($data);
    }

    public function update(array $data , int $id){
        return TimeSlot::findOrFail($id)->update($data);
    }

    public function delete($id){
        return TimeSlot::findOrFail($id)->delete();
    }
}
