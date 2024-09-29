import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AdminLayout from "./layouts/Admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard/Dashboard";
import MajorList from "./pages/admin/Major/MajorList";
import AddMajor from "./pages/admin/Major/AddMajor";
import EditMajor from "./pages/admin/Major/EditMajor";
import ListSubject from "./pages/admin/Subject/ListSubject";
import AddSubject from "./pages/admin/Subject/AddSubject";
import EditSubject from "./pages/admin/Subject/EditSubject";

function App() {
    const router = createBrowserRouter([
        {
            path: "",
            element: <h1>Hello World!</h1>,
        },
        {
            path: "admin",
            element: <AdminLayout />,
            children: [
                {
                    path: "",
                    element: <Dashboard />,
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
            ],
        },
    ]);

    return <RouterProvider router={router} />;
}

export default App;
