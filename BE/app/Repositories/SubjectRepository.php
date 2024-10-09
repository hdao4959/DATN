<?php
namespace App\Repositories;

use App\Models\Subject;
use App\Repositories\Contracts\SubjectRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Foundation\Http\FormRequest;

class SubjectRepository implements SubjectRepositoryInterface {

    protected $model;

    public function __construct(Subject $subject){
        $this->model = $subject;
    }
    public function getAll(){
        return $this->model->all();
    }

    public function getById($id){
        return $this->model->findOrFail($id);
    }

    public function create(array $data){
        return $this->model->create($data);
    }

    public function update($data, $id) {
        return $this->model->findOrFail($id)->update($data);
    }

    public function delete($id){
        return $this->model->findOrFail($id)->delete();
    }

}
