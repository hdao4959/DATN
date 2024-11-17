<?php

use App\Models\User;
use App\Models\Category;
use Illuminate\Http\Request;
use App\Models\AssessmentItem;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\GradesController;
use App\Http\Controllers\SessionController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\SemesterController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\MajorController;
use App\Http\Controllers\Admin\ScoreController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Admin\CategoryNewsletter;
use App\Http\Controllers\AssessmentItemController;
use App\Http\Controllers\GetDataForFormController;
use App\Http\Controllers\Admin\ClassroomController;
use App\Http\Controllers\Admin\PointHeadController;
use App\Http\Controllers\Admin\AttendanceController;
use App\Http\Controllers\Admin\NewsletterController;
use App\Http\Controllers\Admin\SchoolRoomController;
use App\Http\Controllers\FeeController;
use App\Http\Controllers\FeedbackController;

use App\Http\Controllers\SendEmailController;
use App\Http\Controllers\Teacher\ScheduleController as TeacherScheduleController;

use App\Http\Controllers\Teacher\ClassroomController as TeacherClassroomController;
use App\Http\Controllers\Teacher\AttendanceController as TeacherAttendanceController;
use App\Http\Controllers\TeacherGradesController;
use App\Http\Controllers\Teacher\NewsletterController as TeacherNewsletterController;
use App\Http\Controllers\Student\ScoreController as StudentScoreController;
use App\Http\Controllers\Student\AttendanceController as StudentAttendanceController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\WalletController;
use App\Http\Controllers\Student\ClassroomController as StudentClassroomController;
use App\Http\Controllers\StudentGradesController;
use App\Http\Controllers\Student\NewsletterController as StudentNewsletterController;
use App\Http\Controllers\Student\ScheduleController as StudentScheduleController;

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


Route::post('/login', [AuthController::class, 'login']);
Route::get('automaticClassroom', [CategoryController::class, 'automaticClassroom']);
Route::post('getListClassByRoomAndSession', [CategoryController::class, 'getListClassByRoomAndSession']);
Route::get('addStudent', [CategoryController::class, 'addStudent']);
Route::controller(UserController::class)->group(function () {
    Route::post('users/data/import', 'import');
    Route::get('users/data/export', 'export');
    Route::get('students', 'getListSudent');
});
// Route::apiResource('majors', MajorController::class);
// Route::get('getListMajor/{type}', [MajorController::class, 'getListMajor']);


Route::middleware('auth:sanctum')->group(function () {
    // Lấy thông tin tài khoản đang đăng  nhập
    Route::get('/user', function (Request $request) {
        return response()->json($request->user());
    });
    // Đăng xuất
    Route::post('/logout', [AuthController::class, 'logout']);

    // Route::apiResource('grades', GradesController::class);
    Route::get('grades/{classCode}', [GradesController::class, 'index']);
    Route::patch('grades/{id}', [GradesController::class, 'update']);

    // Khu vực admin
    Route::middleware('role:0')->prefix('/admin')->as('admin.')->group(function () {
        Route::apiResource('users', UserController::class);
        Route::controller(UserController::class)->group(function () {
            Route::post('users/data/import', 'import');
            Route::get('users/data/export', 'export');
            Route::get('students', 'getListSudent');
        });

        Route::get('/subjects', [SubjectController::class, 'index']);
        Route::get('/subjects/{id}', [SubjectController::class, 'show']);
        Route::post('/subjects', [SubjectController::class, 'store']);
        Route::put('/subjects/{id}', [SubjectController::class, 'update']);
        Route::delete('/subjects/{id}', [SubjectController::class, 'destroy']);


        Route::apiResource('classrooms', ClassroomController::class);
        Route::controller(ClassroomController::class)->group(function () {
            Route::post('classrooms/handle_step1', 'handleStep1');
            Route::post('classrooms/handle_step2', 'handleStep2');
            Route::post('classrooms/handle_step3', 'handleStep3');
        });
        Route::get('/majors/{major_code}/teachers', [MajorController::class, 'renderTeachersAvailable']);

        Route::apiResource('newsletters', NewsletterController::class);
        Route::post('copyNewsletter/{code}', [NewsletterController::class, 'copyNewsletter']);


        Route::apiResource('assessment', AssessmentItemController::class);

        Route::get('score/{id}', [ScoreController::class, 'create']);

        Route::apiResource('majors', MajorController::class);
        Route::get('getAllMajor/{type}', [MajorController::class, 'getAllMajor']);


        Route::apiResource('categories', CategoryController::class);


        Route::controller(CategoryController::class)->group(function () {
            Route::get('/listParentCategories', 'listParentCategories');
            Route::get('/listChildrenCategories/{parent_code}', 'listChildrenCategories');
        });

        Route::get('getAllCategory/{type}', [CategoryController::class, 'getAllCategory']);
        Route::get('getListCategory/{type}', [CategoryController::class, 'getListCategory']);
        Route::post('uploadImage', [CategoryController::class, 'uploadImage']);

        Route::apiResource('sessions', SessionController::class);
        Route::apiResource('semesters', SemesterController::class);
        Route::put('/major/bulk-update-type', [MajorController::class, 'bulkUpdateType']);

        Route::apiResource('grades', GradesController::class);
        Route::get('grades', [GradesController::class, 'getByParam']);
        Route::patch('grades/{id}', [GradesController::class, 'update']);

        Route::apiResource('schoolrooms', SchoolRoomController::class);
        Route::post('updateActive/{id}', [CategoryController::class, 'updateActive']);

        Route::apiResource('pointheads', PointHeadController::class);

        // Route::apiResource('newsletters', NewsletterController::class);

        Route::apiResource('attendances', AttendanceController::class);

        Route::apiResource('categoryNewsletters', CategoryNewsletter::class);
        Route::apiResource('fees', FeeController::class);

    });

    Route::middleware('role:2')->prefix('teacher')->as('teacher.')->group(function () {
        Route::get('schedules', [TeacherScheduleController::class, 'index']);
        Route::get('schedules/{classCode}', [TeacherScheduleController::class, 'show']);

        Route::get('classrooms', [TeacherClassroomController::class, 'index']);
        Route::get('classrooms/{classcode}', [TeacherClassroomController::class, 'show']);
        Route::get('classrooms/{classcode}/list_students', [TeacherClassroomController::class, 'listStudents']);
        Route::get('classrooms/{classcode}/list_schedules', [TeacherClassroomController::class, 'listSchedules']);

        Route::get('/attendances', [TeacherAttendanceController::class, 'index']);
        Route::get('/attendances/{classCode}', [TeacherAttendanceController::class, 'show']);
        Route::post('/attendances/{classCode}', [TeacherAttendanceController::class, 'store']);
        Route::put('/attendances/{classCode}', [TeacherAttendanceController::class, 'update']);
        Route::delete('/attendances/{classCode}', [TeacherAttendanceController::class, 'destroy']);

        Route::get('/grades/{id}', [TeacherGradesController::class, 'index']);
        Route::get('/grades', [TeacherGradesController::class, 'getTeacherClass']);
        Route::put('/grades/{id}', [TeacherGradesController::class, 'update']);

        Route::apiResource('newsletters', TeacherNewsletterController::class);
        Route::post('copyNewsletter/{code}', [TeacherNewsletterController::class, 'copyNewsletter']);

    });

    Route::middleware('role:3')->prefix('student')->as('student.')->group(function () {
        Route::get('/classrooms', [StudentClassroomController::class, 'classrooms']);
        Route::get('/classrooms/{class_code}/schedules', [StudentClassroomController::class, 'schedulesOfClassroom']);

        Route::get('attendances', [StudentAttendanceController::class, 'index']);

        Route::get('/grades', [StudentGradesController::class, 'index']);

        Route::get('scoreTableByPeriod', [StudentScoreController::class, 'bangDiemTheoKy']);
        Route::get('scoreTable', [StudentScoreController::class, 'bangDiem']);

        Route::get('showNewsletter', [StudentNewsletterController::class, 'showNewsletter']);

        Route::get('schedules', [StudentScheduleController::class, 'index']);

    });
});


// Các route phục vụ cho form
Route::controller(GetDataForFormController::class)->group(function () {
    Route::get('/listCoursesForForm', 'listCoursesForFrom');
    Route::get('/listSemestersForForm', 'listSemestersForForm');
    Route::get('/listMajorsForForm', 'listMajorsForForm');
    Route::get('/listParentMajorsForForm', 'listParentMajorsForForm');
    Route::get('/listChildrenMajorsForForm/{parent_code}', 'listChildrenMajorsForForm');
    Route::get('/listSubjectsToMajorForForm/{major_code}',  'listSubjectsToMajorForForm');
    Route::get('/listSessionsForForm', 'listSessionsForForm');
    Route::get('/listRoomsForForm', 'listRoomsForForm');
    Route::get('/listSubjectsForForm', 'listSubjectsForForm');
});

Route::get('haha', function () {
    // $array_student_id = User::where(
    //     [
    //         'major_code' => 'CN01',
    //         'is_active' => true,
    //         'semester_code' => 'S01',
    //         'role' => 'student'
    //     ]
    // )->limit(3)->pluck('id');

    // if ($array_student_id->isEmpty()) {
    //     return response()->json(
    //         [
    //             'message' => 'Không có học sinh nào để có thể tạo lớp học!'
    //         ], 422
    //     );
    // }

    // $classroom = Classroom::create([
    //     'class_code' => '1312' ,
    //     'class_name' => 'Lớp 1',
    //     'section' => 1,
    //     'subject_code' => 'php1',
    //     'user_code' => 'TC277'
    // ]);
    // $classroom->users()->attach($array_student_id);
    // // $user = User::with('classrooms')->where('role', 'student')->first();
    // return response()->json('OK');

    // $classroom = Classroom::with('teacher', 'subject', 'schedules')->where('class_code', 00001)->get();

});

Route::apiResource('transaction', TransactionController::class);
Route::apiResource('wallet', WalletController::class);
Route::apiResource('feedback',FeedbackController::class);


Route::get('send-email', [SendEmailController::class,'sendMailFee']);



