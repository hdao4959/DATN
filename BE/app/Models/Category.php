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
    /**
    * Quan hệ với các danh mục con.
    */
    public function children()
    {
        return $this->hasMany(Category::class, 'parent_code', 'cate_code');
    }

    /**
    * Quan hệ với danh mục cha.
    */
    public function parent()
    {
        return $this->belongsTo(Category::class, 'parent_code', 'cate_code');
    }
}
