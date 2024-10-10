<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    // môn học
    use HasFactory;

    protected $fillable = [
        'subject_code',
        'subject_name',
        'tuition',
        're_study_fee',
        'credit_number',
        'number_study',
        'exam_day',
        'description',
        'image',
        'is_active',
        'is_delete',
        'semester_code',
        'major_code',
        'narrow_major_code',
    ];
}
