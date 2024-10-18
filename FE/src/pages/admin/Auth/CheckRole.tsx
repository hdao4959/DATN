import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CheckRole = ({ children }) => {
    const navigate = useNavigate();

    const accessToken = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    useEffect(() => {
        if (!accessToken || !user.role) {
            if (window.confirm("Bạn không có quyền truy cập, vui lòng đăng nhập lại")) {
                navigate("/signin");
            }
        } else {
            if (user.role === "student") {
                toast.info("Tính năng của sinh viên sẽ cập nhật sau");
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/signin');
            }
        }
    }, [accessToken, user.role, navigate]);

    if (accessToken && (user.role === "admin" || user.role === "teacher")) {
        return <div>{children}</div>;
    }

    return null;
};

export default CheckRole;
