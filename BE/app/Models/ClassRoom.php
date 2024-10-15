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
        'section',
        'exam_score',
        'study_schedule',
        'exam_schedule',
        'description',
        'date_from',
        'date_to',
        'students',
        'is_active',
        'room_code',
        'subject_code',
        'user_code'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'exam_score' => 'json',
        'study_schedule' => 'json',
        'exam_schedule' => 'json',
        'students' => 'json'
    ];

   
}
