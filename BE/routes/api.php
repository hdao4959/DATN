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
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FeeController;
use App\Http\Controllers\FeedbackController;

use App\Http\Controllers\SendEmailController;
use App\Http\Controllers\Teacher\ScheduleController as TeacherScheduleController;
use App\Http\Controllers\Admin\StudentController;
use App\Http\Controllers\Admin\TeacherController;

use App\Http\Controllers\Teacher\ScheduleController;
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
use App\Http\Controllers\Student\ServiceController;
use App\Http\Controllers\Teacher\StudentController as TeacherStudentController;

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
Route::get('/students/{student_code}', [StudentController::class, 'show']);

Route::apiResource('teachers', TeacherController::class);

// Route::apiResource('majors', MajorController::class);
// Route::get('getListMajor/{type}', [MajorController::class, 'getListMajor']);


Route::middleware('auth:sanctum')->group(function () {
    // Lấy thông tin tài khoản đang đăng  nhập
    Route::get('/user', function (Request $request) {
        return response()->json($request->user());
    });
    // Đăng xuất
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('notifications', [StudentNewsletterController::class, 'showNoti']);

    // Route::apiResource('grades', GradesController::class);
    Route::get('grades/{classCode}', [GradesController::class, 'index']);
    Route::patch('grades/{id}', [GradesController::class, 'update']);

    // Khu vực admin
    Route::middleware('role:0')->prefix('/admin')->as('admin.')->group(function () {



        Route::apiResource('teachers', TeacherController::class);

        Route::apiResource('students', StudentController::class);
        Route::controller(StudentController::class)->group(function () {
            Route::post('import-students', 'importStudents');
            Route::get('export-students', 'exportStudents');
        });


        Route::get('/subjects', [SubjectController::class, 'index']);
        Route::get('/subjects/{id}', [SubjectController::class, 'show']);
        Route::post('/subjects', [SubjectController::class, 'store']);
        Route::put('/subjects/{id}', [SubjectController::class, 'update']);
        Route::delete('/subjects/{id}', [SubjectController::class, 'destroy']);


        Route::apiResource('classrooms', ClassroomController::class);
        Route::put('/classrooms/bulk-update-type', [ClassroomController::class, 'bulkUpdateType']);

        Route::controller(ClassroomController::class)->group(function(){
            Route::post('classrooms/handleStep1', 'handleStep1');
            Route::post('classrooms/renderSchedules', 'renderSchedules');
            Route::post('classrooms/renderRoomsAndTeachers', 'renderRoomsAndTeachers');
            Route::post('classrooms/handleStep2', 'handleStep2');

        });

        // Route::controller(ClassroomController::class)->group(function () {
        //     Route::post('classrooms/handle_step1', 'handleStep1');
        //     Route::post('classrooms/handle_step2', 'handleStep2');
        //     Route::post('classrooms/handle_step3', 'handleStep3');
        // });
        Route::get('/majors/{major_code}/teachers', [MajorController::class, 'renderTeachersAvailable']);
        Route::put('/major/bulk-update-type', [MajorController::class, 'bulkUpdateType']);
        Route::apiResource('majors', MajorController::class);
        Route::get('getAllMajor/{type}', [MajorController::class, 'getAllMajor']);

        Route::apiResource('newsletters', NewsletterController::class);
        Route::post('copyNewsletter/{code}', [NewsletterController::class, 'copyNewsletter']);
        Route::put('/newsletters/bulk-update-type', [NewsletterController::class, 'bulkUpdateType']);

        Route::apiResource('assessment', AssessmentItemController::class);

        Route::get('score/{id}', [ScoreController::class, 'create']);

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

        Route::apiResource('grades', GradesController::class);
        Route::get('grades', [GradesController::class, 'getByParam']);
        Route::patch('grades/{id}', [GradesController::class, 'update']);

        Route::apiResource('schoolrooms', SchoolRoomController::class);
        Route::put('/schoolrooms/bulk-update-type', [SchoolRoomController::class, 'bulkUpdateType']);

        Route::post('updateActive/{id}', [CategoryController::class, 'updateActive']);

        Route::apiResource('pointheads', PointHeadController::class);
        Route::put('/pointheads/bulk-update-type', [PointHeadController::class, 'bulkUpdateType']);

        // Route::apiResource('newsletters', NewsletterController::class);

        Route::apiResource('attendances', AttendanceController::class);

        Route::apiResource('categoryNewsletters', CategoryNewsletter::class);
        Route::put('/newsletter/bulk-update-type', [CategoryNewsletter::class, 'bulkUpdateType']);

        Route::apiResource('fees', FeeController::class);

    });

    Route::middleware('role:2')->prefix('teacher')->as('teacher.')->group(function () {
        // Lịch dạy của giảng viên
        Route::get('schedules', [TeacherScheduleController::class, 'index']);
        // Lịch dạy của giảng viên trong 1 lớp học
        Route::get('classrooms/{classcode}/schedules', [TeacherScheduleController::class, 'listSchedulesForClassroom']);

        Route::get('classrooms', [TeacherClassroomController::class, 'index']);
        Route::get('classrooms/{classcode}', [TeacherClassroomController::class, 'show']);
        Route::get('classrooms/{classcode}/students', [TeacherStudentController::class, 'listStudentForClassroom']);

        Route::get('/attendances', [TeacherAttendanceController::class, 'index']);
        Route::get('/attendances/{classCode}', [TeacherAttendanceController::class, 'show']);
        Route::get('/attendances/edit/{classCode}', [TeacherAttendanceController::class, 'edit']);
        Route::post('/attendances/{classCode}', [TeacherAttendanceController::class, 'store']);
        Route::put('/attendances/{classCode}', [TeacherAttendanceController::class, 'update']);
        Route::get('/attendances/showAllAttendance/{classCode}', [TeacherAttendanceController::class, 'showAllAttendance']);

        Route::get('/grades/{id}', [TeacherGradesController::class, 'index']);
        Route::get('/grades', [TeacherGradesController::class, 'getTeacherClass']);
        Route::put('/grades/{id}', [TeacherGradesController::class, 'update']);


        Route::apiResource('newsletters', TeacherNewsletterController::class);
        Route::post('copyNewsletter/{code}', [TeacherNewsletterController::class, 'copyNewsletter']);
        Route::put('/newsletters/bulk-update-type', [NewsletterController::class, 'bulkUpdateType']);

    });

    Route::middleware('role:3')->prefix('student')->as('student.')->group(function () {
        Route::get('/classrooms', [StudentClassroomController::class, 'index']);
        Route::get('/classrooms/{class_code}', [StudentClassroomController::class, 'show']);


        Route::get('schedules', [StudentScheduleController::class, 'index']);
        Route::get('/classrooms/{class_code}/schedules', [StudentScheduleController::class, 'schedulesOfClassroom']);


        Route::get('attendances', [StudentAttendanceController::class, 'index']);

        Route::get('/grades', [StudentGradesController::class, 'index']);

        Route::get('scoreTableByPeriod', [StudentScoreController::class, 'bangDiemTheoKy']);
        Route::get('scoreTable', [StudentScoreController::class, 'bangDiem']);

        Route::get('newsletters', [StudentNewsletterController::class, 'index']);
        Route::get('newsletters/{code}', [StudentNewsletterController::class, 'show']);
        Route::get('newsletters/{cateCode}', [StudentNewsletterController::class, 'showCategory']);

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
Route::get('send-email2', [SendEmailController::class,'sendMailFeeUser']);

// DashboardAdmin
Route::get('count-info',        [DashboardController::class,'getCountInfo']);
Route::get('count-student',     [DashboardController::class,'getStudentCountByMajor']);
Route::get('status-fee-date',   [DashboardController::class,'getStatusFeesByDate']);
Route::get('status-fee-all',    [DashboardController::class,'getStatusFeesAll']);
Route::get('status-attendances',[DashboardController::class,'getStatusAttendances']);
// Admin
Route::post('students/change-major/{id}', [StudentController::class,'changeMajorStudent']);


// Student
Route::post('services/change-major/{user_code}',            [ServiceController::class,'changeMajor']);
Route::post('services/provide-scoreboard/{user_code}',      [ServiceController::class,'provideScoreboard']);
Route::post('services/change-info/{user_code}',             [ServiceController::class,'ChangeInfo']);
Route::post('services/provide-student-card/{user_code}',    [ServiceController::class,'provideStudentCard']);
Route::post('services/drop-out-of-school/{user_code}',      [ServiceController::class,'DropOutOfSchool']);





