import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AdminLayout from "./layouts/Admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard/Dashboard";

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
            ],
        },
    ]);

    return <RouterProvider router={router} />;
}

export default App;
