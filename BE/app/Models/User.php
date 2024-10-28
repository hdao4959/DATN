<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_code',
        'full_name',
        'email',
        'password',
        'phone_number',
        'address',
        'sex',
        'birthday',
        'citizen_card_number',
        'issue_date',
        'place_of_grant',
        'nation',
        'avatar',
        'role',
        'major_code',
        'narrow_major_code',
        'semester_code',
        'course_code',
        'is_active'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'is_active' => 'boolean',
        'password' => 'hashed'
    ];


    // Định nghĩa mối quan hệ với bảng 'newsletters'
    public function newsletter()
    {
        return $this->hasMany(Newsletter::class, 'user_code', 'user_code');
    }

    public function major(){
        return $this->belongsTo(Category::class, 'major_code', 'cate_code');
    }

    public function course(){
        return $this->belongsTo(Category::class, 'course_code', 'cate_code');
    }

    public function semester(){
        return $this->belongsTo(Category::class, 'semester_code', 'cate_code');
    }


    public function isAdmin()
    {
        return $this->role === 0;
    }

    public function isTeacher()
    {
        return $this->role === '2';
    }

    public function isStudent()
    {
        return $this->role === '3';
    }

    public function classrooms()
    {
        return $this->belongsToMany(Classroom::class, 'classroom_user', 'user_code', 'class_code', 'user_code' ,'class_code');
    }
    
    

}
