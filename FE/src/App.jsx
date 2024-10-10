import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AdminLayout from "./layouts/Admin/AdminLayout";
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
import AddClassroom from "./pages/admin/Rooms/AddClassRoom";
import EditClassroom from "./pages/admin/Rooms/EditClassroom";
import ListAccount from "./pages/admin/Account/ListAccount";
import ListSemester from "./pages/admin/Semester/ListSemester";
import AddSemester from "./pages/admin/Semester/AddSemester";
import EditSemester from "./pages/admin/Semester/EditSemester";
import ListTimeslot from "./pages/admin/TimeSlot/ListTimeSlot";
import AddTimeslot from "./pages/admin/TimeSlot/AddTimeSlot";
import EditTimeslot from "./pages/admin/TimeSlot/EditTimeSlot";

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
                    <AdminLayout />
                </CheckRole>
            ),
            children: [
                {
                    path: "",
                    element: <Dashboard />,
                },
                {
                    path: "account/list",
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
                    element: <AddClassroom />,
                },
                {
                    path: "classrooms/edit/:class_code",
                    element: <EditClassroom />,
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
                    path: "time_slots",
                    element: <ListTimeslot />,
                },
                {
                    path: "time_slots/add",
                    element: <AddTimeslot />,
                },
                {
                    path: "time_slots/edit/:class_code",
                    element: <EditTimeslot />,
                },
            ],
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
