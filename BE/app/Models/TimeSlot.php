<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TimeSlot extends Model
{
    // ca học
    use HasFactory;

    protected $fillable = [
        "name",
        "start_time",
        "end_time"
    ];
}
