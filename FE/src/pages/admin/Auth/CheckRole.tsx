import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Modal from "../../../components/Modal/Modal";

const CheckRole = ({ children }) => {
    const navigate = useNavigate();
    const [isModalVisible, setIsModalVisible] = useState(false);

    const accessToken = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    useEffect(() => {
        if (!accessToken || !user.role) {
            setIsModalVisible(true); // Hiển thị modal nếu không có quyền truy cập
        } else {
            if (user.role === "3") {
                navigate("/student");
            } else if (user.role === "2") {
                navigate("/teacher");
            } else if (user.role === "0") {
                navigate("/admin");
            }
        }
    }, [accessToken, user.role, navigate]);

    const handleConfirm = () => {
        setIsModalVisible(false);
        navigate("/signin");
    };

    if (accessToken && (user.role === "0" || user.role === "2" || user.role === "3" )) {
        return <div>{children}</div>;
    }

    return (
        <>
            <Modal
                title="Thông báo quyền truy cập"
                description="Bạn không có quyền truy cập, vui lòng đăng nhập lại."
                closeTxt="Hủy"
                okTxt="Đăng nhập"
                visible={isModalVisible}
                onVisible={() => setIsModalVisible(false)} // Đóng modal khi nhấn nút hủy
                onOk={handleConfirm} // Xử lý khi nhấn nút Đăng nhập
            />
        </>
    );
};

export default CheckRole;
