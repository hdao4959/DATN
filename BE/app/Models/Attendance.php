<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Attendance extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'student_code',
        'class_code',
        'date',
        'status',
        'noted'
    ];

    // Định nghĩa mối quan hệ với bảng 'users'
    public function user()
    {
        return $this->belongsTo(User::class, 'user_code', 'student_code');
    }
    // Định nghĩa mối quan hệ với bảng 'classrooms'
    public function classroom()
    {
        return $this->belongsTo(Classroom::class, 'class_code', 'class_code');
    }
}
