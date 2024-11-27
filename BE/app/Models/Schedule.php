<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'date', 
        'room_code',
        'classroom_code',
        'class_code',
        'session_code'
    ];

    public function classroom(){
        return $this->belongsTo(Classroom::class, 'class_code', 'class_code');
    }

    public function room(){
        return $this->belongsTo(Category::class, 'room_code', 'cate_code');
    }

    public function session(){
        return $this->belongsTo(Category::class, 'session_code', 'cate_code');
    }

    public function toArray()
    {
        return [
            'class_code' => $this->class_code,
            'date' => $this->date,
            'classroom' => [
                'class_name' => $this->classroom->class_name ?? null,
            ],
            'room' => [
                'cate_name' => $this->room->cate_name ?? null,
                'value' => $this->room->value ?? null,
            ],
            'session' => [
                'cate_code' => $this->session->cate_code ?? null,
                'cate_name' => $this->session->cate_name ?? null,
                'value' => $this->session->value ?? null,
            ]
        ];
    }
}
