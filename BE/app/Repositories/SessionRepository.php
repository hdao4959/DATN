<?php
namespace App\Repositories;

use App\Models\Category;
use App\Models\TimeSlot;
use App\Repositories\Contracts\SessionRepositoryInterface;

class SessionRepository implements SessionRepositoryInterface{
    public function getAll(){
       return Category::query()->where('type','like','%session%')->get();
    }

    public function create(array $data){
        return  Category::create($data);
    }

    public function update(array $data , int $id){
        $model = Category::findOrFail($id);
        return $model->update($data);
    }

    public function delete($id){
        return Category::findOrFail($id)->delete();
    }
}
