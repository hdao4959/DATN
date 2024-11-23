import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import api from "../../../config/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const TransferSchedule = () => {
    const [newClasses, setNewClasses] = useState([]);
    const [selectedClassCode, setSelectedClassCode] = useState(null);
    const navigate = useNavigate();

    const daysMap = {
        Monday: "Thứ hai",
        Tuesday: "Thứ ba",
        Wednesday: "Thứ tư",
        Thursday: "Thứ năm",
        Friday: "Thứ sáu",
        Saturday: "Thứ bảy",
        Sunday: "Chủ nhật",
    };

    // Fetch sessions
    const { data: listSessions, isError: isErrorSessions } = useQuery({
        queryKey: ["LIST_SESSIONS"],
        queryFn: async () => {
            const response = await api.get("/listSessionsForForm");
            return response?.data;
        },
        onError: () => {
            toast.error("Không thể tải danh sách ca học!");
        },
    });

    // Fetch user's classes
    const {
        data: myClasses,
        isError: isErrorClasses,
        isLoading: isLoadingClasses,
        refetch,
    } = useQuery({
        queryKey: ["MY_CLASSES"],
        queryFn: async () => {
            const response = await api.get("/student/transferSchedules");
            return response?.data;
        },
        onError: () => {
            toast.error("Không thể tải danh sách lớp học!");
        },
    });
    // Fetch user data
    const {
        data: userData,
        isError: isErrorUser,
        isLoading: isLoadingUser,
    } = useQuery({
        queryKey: ["USER_DATA"],
        queryFn: async () => {
            const response = await api.get("/user");
            return response?.data;
        },
        onError: () => {
            toast.error("Không thể tải thông tin người dùng!");
        },
    });

    // Handle shift change
    const handleShiftChange = async (class_code, session_code) => {
        try {
            setSelectedClassCode(class_code);

            const course_code = userData?.course_code;
            const payload = {
                course_code,
                class_code,
                session_code,
            };

            const response = await api.post(
                "/student/listSchedulesCanBeTransfer",
                payload
            );
            toast.warning(response.data.message);

            setNewClasses(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                "Không thể tải danh sách lớp!";
            toast.error(message);

            setNewClasses([]);
        }
    };

    // Handle schedule change

    const handleScheduleChange = async (
        class_code_current,
        class_code_target
    ) => {
        if (!class_code_current) {
            toast.error("Vui lòng chọn lớp học cần đổi trước!");
            return;
        }

        try {
            const course_code = userData?.course_code;
            const payload = {
                class_code_current,
                course_code,
                class_code_target,
            };

            const response = await api.post(
                "/student/handleTransferSchedule",
                payload
            );

            toast.success(response.data.message);
            await refetch(); // Refetch updated classes
            navigate("/student/schedules"); // Optional: Navigate after updating
        } catch (error) {
            const message =
                error?.response?.data?.message || "Không thể đổi lịch học!";
            toast.error(message);
        }
    };

    if (isErrorSessions || isErrorClasses || isErrorUser) {
        return (
            <div className="text-danger">Đã xảy ra lỗi khi tải dữ liệu!</div>
        );
    }

    if (isLoadingClasses || isLoadingUser) return <div>Loading...</div>;

    return (
        <div className="container mt-4">
            <h1>
                <i style={{ color: "blue" }} className="fa fa-calendar"></i>{" "}
                Thay đổi lịch học
            </h1>
            <div className="row mt-5">
                {/* My Classes */}
                <div className="col-md-6">
                    {myClasses?.length === 0 && (
                        <p className="text-warning">
                            Không có lớp học nào để đổi lịch!
                        </p>
                    )}
                    {myClasses?.map((item, index) => (
                        <div className="card mb-3" key={index}>
                            <div className="card-body">
                                <h6>{item.subject_name}</h6>
                                <p>
                                    <strong>Mã Môn:</strong> {item.subject_code}
                                </p>
                                <p>
                                    <strong>Lớp học hiện tại:</strong>{" "}
                                    {item.class_name}
                                </p>
                                <p>
                                    <strong>Số lượng thành viên:</strong>{" "}
                                    {item.users_count} / {item.room_slot}
                                </p>
                                <p>
                                    <strong>Ca học hiện tại:</strong>{" "}
                                    {item.session_name}
                                </p>
                                <p>
                                    <strong>Thời gian học:</strong>{" "}
                                    {item.study_days
                                        .map((day) => daysMap[day.trim()])
                                        .join(", ")}{" "}
                                </p>
                                <p>
                                    <strong>Ngày bắt đầu:</strong>{" "}
                                    {item.date_from}
                                </p>
                                <div>
                                    <strong>Ca học có thể chuyển tới:</strong>
                                    <div className="mt-2">
                                        {listSessions?.map((ss, idx) => (
                                            <button
                                                key={idx}
                                                className="btn btn-primary btn-sm mx-1"
                                                onClick={() =>
                                                    handleShiftChange(
                                                        item.class_code,
                                                        ss.cate_code
                                                    )
                                                }
                                            >
                                                {ss.cate_name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* New Classes */}
                <div className="col-md-6">
                    {(!Array.isArray(newClasses) || newClasses.length === 0) &&
                        selectedClassCode && (
                            <p className="text-info">
                                Không tìm thấy lớp học phù hợp để chuyển!
                            </p>
                        )}
                    {Array.isArray(newClasses) &&
                        newClasses.map((newClass, index) => (
                            <div className="card mb-3" key={index}>
                                <div className="card-body">
                                    <h6>{newClass.subject_name}</h6>
                                    <p>
                                        <strong>Mã lớp:</strong>{" "}
                                        {newClass.class_code}
                                    </p>
                                    <p>
                                        <strong>Tên lớp:</strong>{" "}
                                        {newClass.class_name}
                                    </p>
                                    <p>
                                        <strong>Ca học:</strong>{" "}
                                        {newClass.session_name}
                                    </p>
                                    <p>
                                        <strong>Phòng:</strong>{" "}
                                        {newClass.room_name}
                                    </p>
                                    <p>
                                        <strong>Số lượng:</strong>{" "}
                                        {newClass.users_count} /{" "}
                                        {newClass.room_slot}
                                    </p>
                                    <p>
                                        <strong>Ngày học trong tuần:</strong>{" "}
                                        {newClass.study_days
                                            .map((day) => daysMap[day.trim()])
                                            .join(", ")}{" "}
                                    </p>

                                    <button
                                        className="btn btn-success btn-sm"
                                        onClick={() =>
                                            handleScheduleChange(
                                                selectedClassCode,
                                                newClass.class_code
                                            )
                                        }
                                    >
                                        Đổi lịch
                                    </button>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default TransferSchedule;
