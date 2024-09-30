import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AdminLayout from "./layouts/Admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard/Dashboard";
import MajorList from "./pages/admin/Major/MajorList";
import AddMajor from "./pages/admin/Major/AddMajor";
import EditMajor from "./pages/admin/Major/EditMajor";
import Signin from "./pages/admin/Auth/Signin";

function App() {
    const router = createBrowserRouter([
        {
            path: "",
            element: <h1>Hello World!</h1>,
        },
        {
            path: "/signin",
            element: <Signin />,
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
            ],
        },
    ]);

    return <RouterProvider router={router} />;
}

export default App;
