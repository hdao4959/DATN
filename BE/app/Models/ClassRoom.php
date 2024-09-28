<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ClassRoom extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'class_code',
        'class_name',
        'exam_score',
        'school_schedule',
        'exam_schedule',
        'description',
        'date_from',
        'date_to',
        'students',
        'is_active',
        'study_room_code',
        'subject_code',
        'user_code'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'exam_score' => 'json',
        'school_schedule' => 'json',
        'exam_schedule' => 'json',
        'students' => 'json'
    ];

    // public function responseData(){
    //     return $this->only(['id', 'class_code', 'class_name', 'exam_score', 
    //     'school_schedule' ,'exam_schedule', 'description', 'date_from', 
    //     'date_to', 'students', 'is_active', 'study_room_code', 'subject_code', 'user_code', 'created_at', 'updated_at']);
    // }
}
