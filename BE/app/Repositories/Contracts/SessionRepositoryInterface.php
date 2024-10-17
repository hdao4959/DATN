<?php
namespace App\Repositories\Contracts;

interface SessionRepositoryInterface {
    public function getAll();

    public function create(array $data);

    public function update(array $data , int $id);

    public function delete($id);
}
