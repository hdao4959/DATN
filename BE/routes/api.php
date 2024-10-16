<?php


use App\Http\Controllers\CategoryController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\SemesterController;
use App\Http\Controllers\TimeSlotController;
use App\Http\Controllers\Admin\MajorController;

use App\Http\Controllers\Admin\ClassRoomController;
use App\Http\Controllers\Admin\PointHeadController;
use App\Http\Controllers\Admin\SchoolRoomController;

use App\Http\Controllers\GradesController;

use App\Http\Controllers\Admin\NotificationController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/


Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);

Route::prefix('/admin')->as('admin.')->group(function () {

    Route::apiResource('users', UserController::class);
    Route::get('/subjects', [SubjectController::class, 'index']);
    Route::get('/subjects/{id}', [SubjectController::class, 'show']);
    Route::post('/subjects', [SubjectController::class, 'store']);
    Route::put('/subjects/{id}', [SubjectController::class, 'update']);
    Route::delete('/subjects/{id}', [SubjectController::class, 'destroy']);


    Route::apiResource('classrooms', ClassRoomController::class);

    Route::post('/classrooms/render_schedule', [ClassRoomController::class, 'renderScheduleForClassroom']);

    Route::apiResource('users', UserController::class);

    Route::apiResource('major', MajorController::class);
    Route::get('getAllMajor/{type}', [MajorController::class, 'getAllMajor']);
    Route::get('getListMajor/{type}', [MajorController::class, 'getListMajor']);


    Route::apiResource('category', CategoryController::class);
    Route::get('getAllCategory/{type}', [CategoryController::class, 'getAllCategory']);
    Route::get('getListCategory/{type}', [CategoryController::class, 'getListCategory']);

    Route::apiResource('time_slots', TimeSlotController::class);

    Route::apiResource('semesters', SemesterController::class);

    Route::put('/major/bulk-update-type', [MajorController::class, 'bulkUpdateType']);

    Route::apiResource('grades', GradesController::class);
    Route::get('grades', [GradesController::class, 'getByParam']);
    Route::patch('grades/{id}',[GradesController::class, 'update']);



    Route::apiResource('schoolrooms', SchoolRoomController::class);
    Route::apiResource('pointheads', PointHeadController::class);
    Route::apiResource('notifications', NotificationController::class);

});

