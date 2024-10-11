<?php


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\MajorController;
use App\Http\Controllers\Admin\ClassRoomController;
use App\Http\Controllers\Admin\SchoolRoomController;
use App\Http\Controllers\Api\CategoryController;
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
    Route::put('/major/bulk-update-type', [MajorController::class, 'bulkUpdateType']);
    
    Route::apiResource('schoolrooms', SchoolRoomController::class);
    Route::apiResource('category', CategoryController::class);
    Route::get('getAllCategory/{type}', [CategoryController::class, 'getAllCategory']);
    Route::get('getListCategory/{type}', [CategoryController::class, 'getListCategory']);
    Route::get('automaticClassroom', [CategoryController::class, 'automaticClassroom']);
});
