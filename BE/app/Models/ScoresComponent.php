<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ScoresComponent extends Model
{
    use HasFactory;
    protected $fillable = [
        'student_code', 
        'class_code',
        'score',
        'point_head_code',
    ];
}
