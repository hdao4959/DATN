<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    use HasFactory;

    protected $fillable = [
        'subjectCode',
        'subjectName',
        'tuition',
        'reStudyFee',
        'creditNumber',
        'numberStudy',
        'examDay',
        'description',
        'image',
        'isActive',
        'isDelete',
        'semesterCode',
        'majorCode',
        'narrowMajorCode',
    ];
}
