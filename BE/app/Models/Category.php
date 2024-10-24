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
        'parent_code',
        'value',
        'image',
        'description',
        'type',
        'is_active'
    ];

    public $incrementing = false; // Nếu 'cate_code' không phải là số tự động tăng.
    protected $keyType = 'string'; // Nếu 'cate_code' là chuỗi.
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

    // Định nghĩa mối quan hệ với bảng 'newsletters'
    public function newsletter()
    {
        return $this->hasMany(Newsletter::class, 'cate_code', 'cate_code');
    }
}
