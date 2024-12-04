<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_code',
        'name',
        'content',
        'status',
        'reason',
        'amount',
        'file_path'
    ];
}
