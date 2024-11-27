<?php

use App\Http\Controllers\Admin\ClassRoomController;

use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\FeeController;

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

    Route::get('/formCreateSchedule', [ClassRoomController::class, 'formCreateScheduleforClassroom']);
Route::post('/renderScheduleForClassroom', [ClassRoomController::class, 'renderScheduleForClassroom'])->name('renderScheduleForClassroom');


Route::get('send-email',function(){


    $data['email'] = 'quanglocnd2004@gmail.com';
    $data['email'] = 'loctqph42545@fpt.edu.vn';

    dispatch(new App\Jobs\SendEmailJob($data));

    dd('Email Send Successfully');
});

Route::get('total_momo', [CheckoutController::class, 'momo_payment']);
Route::post('/payment-callback', [CheckoutController::class, 'handleCallback']);
Route::get('/payment-success', [CheckoutController::class, 'handleCallback']);
