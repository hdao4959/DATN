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
import ListSubject from "./pages/admin/Subject/ListSubject";
import AddSubject from "./pages/admin/Subject/AddSubject";
import EditSubject from "./pages/admin/Subject/EditSubject";
import CreateAccount from "./pages/admin/Account/CreateAccount";
import ViewMyAccount from "./pages/admin/Account/ViewMyAccount";
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
import AddClassroomTest from "./pages/admin/Rooms/AddClassroomTest";
import ClassroomDetails from "./pages/admin/Rooms/ClassroomDetails";
import StudentWalletList from "./pages/admin/StudentWallet/StudentWalletList";
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
// import MyCalendar from "./pages/teacher/TeachSchedule";
// import MyClass from "./pages/teacher/myClass/MyClass";
import AttendanceManagement from "./pages/admin/Attendance/page.jsx";
import AttendanceTeacher from "./pages/teacher/Attendance/page.jsx";
import ShowStudentAttendance from "./pages/student/Attendance/page.jsx";
import StudentGradesA from "./pages/admin/Grades/graStupages.jsx";
import ShowGradesTeacherA from "./pages/admin/Grades/graTeapages.jsx";
import StudentLayout from "./layouts/Student/StudentLayout.jsx";
import StudentGrades from "./pages/student/Grade/page.jsx";
import ShowGradesTeacher from "./pages/teacher/Grade/page.jsx";
import MultiStepForm from "./pages/admin/Rooms/MultiRooms.jsx";

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
        {
            path: "admin",
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
                    path: "account",
                    element: <ListAccount />,
                },
                {
                    path: "account/create",
                    element: <CreateAccount />,
                },
                {
                    path: "account/details/:user_code",
                    element: <ViewMyAccount />,
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
                    element: <AddClassroomTest />,
                },
                {
                    path: "classrooms/edit/:class_code",
                    element: <EditClassroom />,
                },
                {
                    path: "classrooms/view/:class_code",
                    element: <ClassroomDetails />,
                },
                {
                    path: "classrooms/step",
                    element: <MultiStepForm />,
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
                },
                {
                },
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
                    path: "schedule",
                    element: <TeachSchedule />,
                },
                {
                    path: "class",
                    element: <ClassList />,
                },
                {
                    path: "class/:class_code/students",
                    element: <ClassroomStudents />,
                },
                {
                    path: "class/:class_code/schedules",
                    element: <ClassSchedules />,
                },
                {
                    path: "attendances",
                    element: <AttendanceTeacher />,
                },
                {
                    path: "grades",
                    element: <ShowGradesTeacher />,
                },
            ],
        },
        {
            path: "/student",
            element: (
                //<CheckRole>
                    <StudentLayout />
                //</CheckRole>
            ),
            children: [
                {
                    path: "attendances",
                    element: <ShowStudentAttendance />,
                },
                {
                    path: "grades",
                    element: <StudentGrades />,
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
