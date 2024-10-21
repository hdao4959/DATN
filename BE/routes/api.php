<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GradesController;
use App\Http\Controllers\SessionController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\SemesterController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\MajorController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Admin\ClassroomController;
use App\Http\Controllers\Admin\PointHeadController;
use App\Http\Controllers\Admin\NewsletterController;
use App\Http\Controllers\Admin\SchoolRoomController;
use App\Http\Controllers\Admin\ScoreController;

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


    Route::apiResource('classrooms', ClassroomController::class);

    Route::post('/classrooms/render_schedule', [ClassroomController::class, 'renderScheduleForClassroom']);

    Route::apiResource('users', UserController::class);

    Route::apiResource('major', MajorController::class);
    Route::get('getAllMajor/{type}', [MajorController::class, 'getAllMajor']);
    Route::get('getListMajor/{type}', [MajorController::class, 'getListMajor']);


    Route::apiResource('category', CategoryController::class);
    Route::get('getAllCategory/{type}', [CategoryController::class, 'getAllCategory']);
    Route::get('getListCategory/{type}', [CategoryController::class, 'getListCategory']);
    Route::post('uploadImage', [CategoryController::class, 'uploadImage']);

    Route::apiResource('sessions', SessionController::class);
    Route::apiResource('semesters', SemesterController::class);
    Route::put('/major/bulk-update-type', [MajorController::class, 'bulkUpdateType']);

    Route::apiResource('grades', GradesController::class);
    Route::get('grades', [GradesController::class, 'getByParam']);
    Route::patch('grades/{id}',[GradesController::class, 'update']);

    Route::apiResource('schoolrooms', SchoolRoomController::class);
    Route::post('updateActive/{id}', [CategoryController::class, 'updateActive']);
    Route::get('automaticClassroom', [CategoryController::class, 'automaticClassroom']);

    Route::apiResource('pointheads', PointHeadController::class);

    Route::apiResource('newsletters', NewsletterController::class);

    Route::get('examscore', [ScoreController::class,'getById']);
    Route::post('examscore/{id}', [ScoreController::class,'create']);

    Route::get('addstudents',[ScoreController::class, 'addStudent']);

});

