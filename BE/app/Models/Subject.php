<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Subject extends Model
{
    // môn học
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'subject_code',
        'subject_name',
        'tuition',
        're_study_fee',
        'credit_number',
        'total_sessions',
        'exam_day',
        'description',
        'image',
        'is_active',
        'semester_code',
        'major_code',
        'narrow_major_code',
    ];

    public function major(){
        return $this->belongsTo(Category::class, 'major_code', 'cate_code');
    }

    public function semester(){
        return $this->belongsTo(Category::class, 'semester_code', 'cate_code');
    }

    // public function course(){
    //     return $this->belongsTo(Category::class, '')
    // }

}
