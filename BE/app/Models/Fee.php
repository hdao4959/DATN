<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Fee extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'user_code',
        'semester',
        'amount',
        'start_date',
        'due_date',
        'status'
    ];

    public function user(){
        return $this->belongsTo(User::class);
    }
}
