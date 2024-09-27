import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AdminLayout from "./layouts/Admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard/Dashboard";
import SubjectsList from "./pages/admin/Subject/list";
import AddSubject from "./pages/admin/Subject/add";
import EditSubject from "./pages/admin/Subject/edit";

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
                    path: "subjects",
                    element: <SubjectsList />,
                },
                {
                    path: "subjects/add",
                    element: <AddSubject />,
                },
                {
                    path: "subjects/edit",
                    element: <EditSubject />,
                }
            ],
        },
    ]);

    return <RouterProvider router={router} />;
}

export default App;
