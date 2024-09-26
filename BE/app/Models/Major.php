<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Major extends Model
{
    use HasFactory;

    protected $fillable = [
        'major_code',
        'title',
        'is_active',
        'description',
        'image',
        'parent_major_code',
        'type'
    ];
}
