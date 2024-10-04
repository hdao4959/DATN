import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CheckRole = ({ children }) => {
    const navigate = useNavigate();
    const user = localStorage.getItem('user');

    useEffect(() => {
        if (!user && window.confirm('Bạn không có quyền truy cập, vui lòng đăng nhập lại')) {
            navigate('/signin');
        }
    }, [user, navigate]);

    if (user) {
        return <div>{children}</div>;
    }

    return null;
};

export default CheckRole;
