<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'cate_code',
        'cate_name',
        'parrent_code',
        'value',
        'image',
        'description',
        'type',
        'is_active'
    ];
}
