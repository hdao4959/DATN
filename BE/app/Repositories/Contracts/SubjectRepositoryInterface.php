<?php
namespace App\Repositories\Contracts;

use Illuminate\Foundation\Http\FormRequest;

interface SubjectRepositoryInterface{
    public function getAll();

    public function getById(int $id);

    public function create(array $data);

    public function update(array $data , int $id);

    public function delete($id);
}
