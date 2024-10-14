<?php


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\SemesterController;
use App\Http\Controllers\TimeSlotController;
use App\Http\Controllers\Admin\MajorController;

use App\Http\Controllers\Admin\ClassRoomController;
use App\Http\Controllers\Admin\PointHeadController;
use App\Http\Controllers\Admin\SchoolRoomController;
use App\Http\Controllers\GradesController;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);


Route::prefix('/admin')->as('admin.')->group(function () {

    Route::apiResource('users', UserController::class);


    //môn học
    Route::get('/subjects', [SubjectController::class, 'index']);
    Route::get('/subjects/{id}', [SubjectController::class, 'show']);
    Route::post('/subjects', [SubjectController::class, 'store']);
    Route::put('/subjects/{id}', [SubjectController::class, 'update']);
    Route::delete('/subjects/{id}', [SubjectController::class, 'destroy']);


    Route::apiResource('classrooms', ClassRoomController::class);
    Route::apiResource('users', UserController::class);

    Route::apiResource('major', MajorController::class);
    Route::get('getAllMajor/{type}', [MajorController::class, 'getAllMajor']);
    Route::get('getListMajor/{type}', [MajorController::class, 'getListMajor']);


    Route::apiResource('category', CategoryController::class);
    Route::get('getAllCategory/{type}', [CategoryController::class, 'getAllCategory']);
    Route::get('getListCategory/{type}', [CategoryController::class, 'getListCategory']);

    Route::apiResource('timeslot', TimeSlotController::class);

    Route::apiResource('semester', SemesterController::class);

    Route::put('/major/bulk-update-type', [MajorController::class, 'bulkUpdateType']);

    Route::apiResource('schoolrooms', SchoolRoomController::class);
    Route::apiResource('pointhead', PointHeadController::class);

    Route::apiResource('grades', GradesController::class);
    Route::get('grades', [GradesController::class, 'getByParam']);
    Route::patch('grades/{id}',[GradesController::class, 'update']);


});
