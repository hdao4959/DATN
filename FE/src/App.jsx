import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./layouts/Layout";
import Dashboard from "./pages/admin/Dashboard/Dashboard";
import MajorList from "./pages/admin/Major/MajorList";
import AddMajor from "./pages/admin/Major/AddMajor";
import EditMajor from "./pages/admin/Major/EditMajor";
import Signin from "./pages/admin/Auth/Signin";
import ForgotPassword from "./pages/admin/Auth/ForgotPassword";
import ResetPassword from "./pages/admin/Auth/ResetPassword";


import ListSubject from "./pages/admin/Subject/ListSubject";
import AddSubject from "./pages/admin/Subject/AddSubject";
import EditSubject from "./pages/admin/Subject/EditSubject";
import CreateAccount from "./pages/admin/Account/CreateAccount";
import ViewMyAccount from "./pages/admin/Account/ViewMyAccount";
import ChangePassword from "./pages/admin/Account/ChangePassword";
import CheckRole from "./pages/admin/Auth/CheckRole";
import ClassRoomsList from "./pages/admin/Rooms/ListRooms";
import EditClassroom from "./pages/admin/Rooms/EditClassroom";
import ListAccount from "./pages/admin/Account/ListAccount";
import ListSemester from "./pages/admin/Semester/ListSemester";
import AddSemester from "./pages/admin/Semester/AddSemester";
import EditSemester from "./pages/admin/Semester/EditSemester";
import ListTimeslot from "./pages/admin/TimeSlot/ListTimeSlot";
import AddTimeslot from "./pages/admin/TimeSlot/AddTimeSlot";
import EditTimeslot from "./pages/admin/TimeSlot/EditTimeSlot";
import AddSchoolRoom from "./pages/admin/SchoolRoom/AddSchoolRoom";
import RoomSchoolList from "./pages/admin/SchoolRoom/RoomSchoolList";
import EditSchoolRooms from "./pages/admin/SchoolRoom/EditSchoolRooms";
import ShowGrades from "./pages/admin/Grades/pages.jsx";
import GradeComponentList from "./pages/admin/GradeComponents/GradeComponentList";
import AddGradeComponents from "./pages/admin/GradeComponents/AddGradeComponents";
import UpdateGradeComponents from "./pages/admin/GradeComponents/UpdateGradeComponents";
import ClassroomDetails from "./pages/admin/Rooms/ClassroomDetails";
import StudentWalletList from "./pages/admin/StudentWallet/StudentWalletList";
import EditStudentWallet from "./pages/admin/StudentWallet/EditStudentWallet";
import AddPost from "./pages/admin/Post/AddPost";
import PostCategoryList from "./pages/admin/PostCategory/PostCategoryList";
import AddPostCategory from "./pages/admin/PostCategory/AddPostCategory";
import UpdatePostCategory from "./pages/admin/PostCategory/UpdatePostCategory";
import PostList from "./pages/admin/Post/PostList";
import UpdatePost from "./pages/admin/Post/UpdatePost";
import TeacherLayout from "./layouts/Teacher/TeacherLayout";
import TeachSchedule from "./pages/teacher/TeachSchedule";
import ClassList from "./pages/teacher/MyClass/ClassList";
import ClassroomStudents from "./pages/teacher/MyClass/ClassroomStudents";
import ClassSchedules from "./pages/teacher/MyClass/ClassSchedules";
import NotFound from "./pages/NotFound";
import AttendanceManagement from "./pages/admin/Attendance/page.jsx";
import AttendanceTeacher from "./pages/teacher/Attendance/page.jsx";
import ShowStudentAttendance from "./pages/student/Attendance/page.jsx";
import StudentLayout from "./layouts/Student/StudentLayout.jsx";
import StudentGrades from "./pages/student/Grade/page.jsx";
import ShowGradesTeacher from "./pages/teacher/Grade/page.jsx";
import ReEnrollment from "./pages/student/Service/ReEnrollment/page.jsx";
import FAQs from "./pages/student/Suport/Suport.jsx";
import TeacherAddPost from "./pages/teacher/Post/AddPost";
import TeacherPostList from "./pages/teacher/Post/PostList";
import TeacherUpdatePost from "./pages/teacher/Post/UpdatePost";
import StudentNews from "./pages/student/Post/page.jsx";
import StudentDetailNews from "./pages/student/Post/detail.jsx";
import ListTeacher from "./pages/admin/Teacher/ListTeacher.jsx";
import TeacherAccountDetails from "./pages/admin/Teacher/TeacherAccountDetails.jsx";
import CreateTeacherAccount from "./pages/admin/Teacher/CreateTeacherAccount.jsx";
import AddClassroom from "./pages/admin/Rooms/AddClassroom.jsx";
import ViewSchedules from "./pages/student/Schedules/ViewSchedules.jsx";
import ViewClassrooms from "./pages/student/Classrooms/ViewClassrooms.jsx";
import TransferSchedule from "./pages/student/Schedules/TransferSchedule.jsx";
import WalletBalance from "./pages/student/Wallets/WalletBalance.jsx";
import Debt from "./pages/student/Wallets/Debt.jsx";
import ScheduleTimeFrame from "./pages/admin/ScheduleTimeFrame/ScheduleTimeFrame.jsx";
import ViewSchedulesForClass from "./pages/student/Classrooms/ViewSchedulesForClass.jsx";
import StudentAccountDetails from "./pages/admin/Account/StudentAccountDetails.jsx";
import EditStudentAccount from "./pages/admin/Account/EditStudentAccount.jsx";
import EditTeacherAccount from "./pages/admin/Teacher/EditTeacherAccount.jsx";
import ViewTimeFrame from "./pages/admin/ScheduleTimeFrame/ViewTimeFrame.jsx";
import DegreeProgramList from "./pages/admin/DegreeProgram/DegreeProgramList.jsx";
import AddDegreeProgram from "./pages/admin/DegreeProgram/AddDegreeProgram.jsx";
import EditDegreeProgram from "./pages/admin/DegreeProgram/EditDegreeProgram.jsx";
import SessionList from "./pages/admin/Sessions/SessionList.jsx";
import AddSession from "./pages/admin/Sessions/AddSession.jsx";
import EditSession from "./pages/admin/Sessions/EditMajor.jsx";
import AttendanceTeacherDate from "./pages/teacher/Attendance/attendanceByDate.jsx";
import ClassExams from "./pages/teacher/MyClass/ClassExams.jsx";
import ViewExamSchedule from "./pages/student/Schedules/ViewExamSchedule.jsx";
import RequesAcademicTranscript from "./pages/student/Service/RequestAcademicTranscript/page.jsx";
import ServicesList from "./pages/student/Service/ServicesList.jsx";

import ServiceList from "./pages/admin/Service/ListService.jsx"
import ServiceShow from "./pages/admin/Service/ServiceShow.jsx"

import StudentCourseHistory from "./pages/student/GradeHistory/page.jsx";
import UpdateInformationForm from "./pages/student/Service/RequestChangeInfo/page.jsx";

function App() {
    const router = createBrowserRouter([
        {
            path: "",
            element: <Signin />,
        },
        {
            path: "/signin",
            element: <Signin />,
        },
        // quên mật khẩu
        {
            path: "/forgot-password",
            element: <ForgotPassword />,
        },
        {
            path: "/reset-password/:token/:email",
            element: <ResetPassword />
        },
        {

            path: "/sup-admin",
            element: (
                <CheckRole>
                    <Layout />
                </CheckRole>
            ),
            children: [
                {
                    path: "",
                    element: <Dashboard />,
                },
                {
                    path: "students",
                    element: <ListAccount />,
                },
                {
                    path: "students/create",
                    element: <CreateAccount />,
                },
                {
                    path: "students/:user_code",
                    element: <StudentAccountDetails />,
                },
                {
                    path: "students/edit/:user_code",
                    element: <EditStudentAccount />,
                },
                {
                    path: "account",
                    element: <ViewMyAccount />,
                },
                {
                    path: "teachers",
                    element: <ListTeacher />,
                },
                {
                    path: "teachers/create",
                    element: <CreateTeacherAccount />,
                },
                {
                    path: "teachers/edit/:user_code",
                    element: <EditTeacherAccount />,
                },
                {
                    path: "teachers/:user_code",
                    element: <TeacherAccountDetails />,
                },
                {
                    path: "major",
                    element: <MajorList />,
                },
                {
                    path: "major/add",
                    element: <AddMajor />,
                },
                {
                    path: "major/:id/edit",
                    element: <EditMajor />,
                },
                {
                    path: "subjects",
                    element: <ListSubject />,
                },
                {
                    path: "subjects/add",
                    element: <AddSubject />,
                },

                {
                    path: "subjects/:id/edit",
                    element: <EditSubject />,
                },

                {
                    path: "classrooms",
                    element: <ClassRoomsList />,
                },
                {
                    path: "classrooms/add",
                    element: <AddClassroom />,
                },
                {
                    path: "classrooms/edit/:class_code",
                    element: <EditClassroom />,
                },
                {
                    path: "classrooms/view/:class_code/detail",
                    element: <ClassroomDetails />,
                },
                {
                    path: "classrooms/view/:class_code/grades",
                    element: <ShowGrades />,
                },
                {
                    path: "class/:class_code/attendances",
                    element: <AttendanceTeacher />,
                }, {
                    path: "classrooms/view/:class_code/attendances",
                    element: <AttendanceManagement />,
                },


                {
                    path: "semesters",
                    element: <ListSemester />,
                },
                {
                    path: "semesters/add",
                    element: <AddSemester />,
                },
                {
                    path: "semesters/:id/edit",
                    element: <EditSemester />,
                },
                {
                    path: "timeslot",
                    element: <ListTimeslot />,
                },
                {
                    path: "timeslot/add",
                    element: <AddTimeslot />,
                },
                {
                    path: "timeslot/:id/edit",
                    element: <EditTimeslot />,
                },
                {
                    path: "schoolrooms/add",
                    element: <AddSchoolRoom />,
                },
                {
                    path: "schoolrooms",
                    element: <RoomSchoolList />,
                },
                {
                    path: "schoolrooms/:id/edit",
                    element: <EditSchoolRooms />,
                },
                {
                    path: "grades",
                    element: <ShowGrades />,
                },
                {
                    path: "grade-components",
                    element: <GradeComponentList />,
                },
                {
                    path: "grade-components/add",
                    element: <AddGradeComponents />,
                },
                {
                    path: "grade-components/:id/edit",
                    element: <UpdateGradeComponents />,
                },
                {
                    path: "student-wallet",
                    element: <StudentWalletList />,
                },

                {
                    path: "wallets/:id/edit",
                    element: <EditStudentWallet />,
                },

                {
                    path: "post",
                    element: <PostList />,
                },
                {
                    path: "post/add",
                    element: <AddPost />,
                },
                {
                    path: "post/:id/edit",
                    element: <UpdatePost />,
                },

                {
                    path: "post-category",
                    element: <PostCategoryList />,
                },
                {
                    path: "post-category/add",
                    element: <AddPostCategory />,
                },
                {
                    path: "post-category/:id/edit",
                    element: <UpdatePostCategory />,
                },
                {
                    path: "attendance",
                    element: <AttendanceManagement />,
                },
                {
                    path: "timeframes",
                    element: <ScheduleTimeFrame />,
                },
                {
                    path: "viewtimeframes",
                    element: <ViewTimeFrame />,
                },
                {
                    path: "degree-program",
                    element: <DegreeProgramList />,
                },
                {
                    path: "degree-program/add",
                    element: <AddDegreeProgram />,
                },
                {
                    path: "degree-program/:id/edit",
                    element: <EditDegreeProgram />,
                },
                {
                    path: "sessions",
                    element: <SessionList />,
                },
                {
                    path: "sessions/add",
                    element: <AddSession />,
                },
                {
                    path: "sessions/:id/edit",
                    element: <EditSession />,
                },
                {
                    path: "services",
                    element: <ServiceList />,
                },
                {
                    path: "services/:id",
                    element: <ServiceShow/>,
                }
            ],
        },
        {
            path: "/teacher",
            element: (
                <CheckRole>
                    <TeacherLayout />
                </CheckRole>
            ),
            children: [
                {
                    path: "",
                    element: <TeachSchedule />,
                },
                {
                    path: "schedule",
                    element: <TeachSchedule />,
                },
                {
                    path: "account/details/:user_code",
                    element: <ViewMyAccount />,
                },
                {
                    path: "class",
                    element: <ClassList />,
                },
                {
                    path: "class/:class_code/detail",
                    element: <ClassroomStudents />,
                },
                {
                    path: "class/:class_code/schedules",
                    element: <ClassSchedules />,
                },
                {
                    path: "class/:class_code/attendances",
                    element: <AttendanceTeacher />,
                },
                {
                    path: "class/:class_code/grades",
                    element: <ShowGradesTeacher />,
                },
                {
                    path: "class/:class_code/examdays",
                    element: <ClassExams />,
                },
                {
                    path: "attendances",
                    element: <AttendanceTeacher />,
                },
                {
                    path: "class/:class_code/attendances/:date",
                    element: <AttendanceTeacherDate />,
                },
                {
                    path: "grades",
                    element: <ShowGradesTeacher />,
                },
                {
                    path: "post",
                    element: <TeacherPostList />,
                },
                {
                    path: "post/add",
                    element: <TeacherAddPost />,
                },
                {
                    path: "post/:id/edit",
                    element: <TeacherUpdatePost />,
                }
            ],
        },
        {
            path: "/student",
            element: (
                <CheckRole>
                    <StudentLayout />
                </CheckRole>
            ),
            children: [
                {
                    path: "",
                    element: <StudentNews />,
                },
                {
                    path: "attendances",
                    element: <ShowStudentAttendance />,
                },
                {
                    path: "account",
                    element: <ViewMyAccount />,
                },
                {
                    path: "account/change-password",
                    element: <ChangePassword/>
                },
                {
                    path: "grades",
                    element: <StudentGrades />,
                },
                {
                    path: "grades-all",
                    element: <StudentCourseHistory />,
                },
                {
                    path: "services/yeu-cau-cap-bang-diem",
                    element: <RequesAcademicTranscript />,
                },
                {
                    path: "services/yeu-cau-thay-doi-thong-tin",
                    element: <UpdateInformationForm />,
                },
                {
                    path: "services/list",
                    element: <ServicesList />,
                },
                {
                    path: "services/re-enrollment",
                    element: <ReEnrollment />,
                },
                {
                    path: "FAQS",

                    element: <FAQs />,
                },
                // {
                //     path: "change-major",
                //     element: <ChangeMajorForm />,
                // },
                // {
                //     path: "request-attendance",
                //     element: <AttendanceRequestForm />,
                // },

                {
                    path: "news",
                    element: <StudentNews Type="news" />,
                },
                {
                    path: "news/:id/detail",
                    element: <StudentDetailNews />,
                },
                {
                    path: "notifications",
                    element: <StudentNews Type="notification" />,
                },
                {
                    path: "FAQS",
                    element: <FAQs />,
                },
                {
                    path: "schedules",
                    element: <ViewSchedules />,
                },
                {
                    path: "schedules/transfer",
                    element: <TransferSchedule />,
                },
                {
                    path: "schedules/exam-schedule",
                    element: <ViewExamSchedule />,
                },
                {
                    path: "classrooms",
                    element: <ViewClassrooms />,
                },
                {
                    path: "classrooms/schedule/:class_code",
                    element: <ViewSchedulesForClass />,
                },

                {
                    path: "wallet-balance",
                    element: <WalletBalance />,
                },
                {
                    path: "debt",
                    element: <Debt />,
                },
            ],
        },
        {
            path: "*",
            element: <NotFound />,
        },
    ]);

    return (
        <>
            <ToastContainer />
            <RouterProvider router={router} />;
        </>
    );
}

export default App;
