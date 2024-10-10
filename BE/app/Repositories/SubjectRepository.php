<?php
namespace App\Repositories;

use App\Models\Subject;
use App\Repositories\Contracts\SubjectRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Foundation\Http\FormRequest;

class SubjectRepository implements SubjectRepositoryInterface {


    public function getAll(){
        return Subject::all();
    }

    public function getById($id){
        return Subject::findOrFail($id);
    }

    public function create(array $data){
        return Subject::create($data);
    }

    public function update($data, $id) {
        return Subject::findOrFail($id)->update($data);
    }

    public function delete($id){
        return Subject::findOrFail($id)->delete();
    }

}
