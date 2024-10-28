<?php

use App\Http\Controllers\Admin\ClassRoomController;
use App\Http\Controllers\Admin\UserController;
use App\Models\ClassRoom;
use App\Models\User;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
  
    return view('welcome');
});

