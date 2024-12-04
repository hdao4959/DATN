<?php
namespace App\Repositories;

use App\Models\Category;
use App\Models\TimeSlot;
use App\Repositories\Contracts\SessionRepositoryInterface;

class SessionRepository implements SessionRepositoryInterface{
    public function getAll(){
       return Category::query()->where('type','session')
                                ->where('deleted_at',null)->get();
    }

    public function create(array $data){

        return  Category::create($data);
    }

    public function update(array $data , string $code){
        $model = Category::where('cate_code',$code);
        return $model->update($data);
    }

    public function delete($code){
        return Category::where('cate_code',$code)->delete();
    }
}
