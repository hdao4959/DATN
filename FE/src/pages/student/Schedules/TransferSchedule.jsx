import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import api from "../../../config/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Modal from "../../../components/Modal/Modal";

const TransferSchedule = () => {
    const [newClasses, setNewClasses] = useState([]);
    const [selectedClassCode, setSelectedClassCode] = useState(null);
    const [selectedNewClass, setSelectedNewClass] = useState(null);
    const [isLoadingNewClasses, setIsLoadingNewClasses] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false); // State to control modal visibility
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

    const {
        data: myClassesData,
        isError: isErrorClasses,
        isLoading: isLoadingClasses,
    } = useQuery({
        queryKey: ["MY_CLASSES"],
        queryFn: async () => {
            const response = await api.get("/student/transferSchedules");
            return response?.data || [];
        },
        onError: () => {
            toast.error("Không thể tải danh sách lớp học!");
        },
    });

    const { data: listSessions, isError: isErrorSessions } = useQuery({
        queryKey: ["LIST_SESSIONS"],
        queryFn: async () => {
            const response = await api.get("/listSessionsForForm");
            return response?.data || [];
        },
        onError: () => {
            toast.error("Không thể tải danh sách ca học!");
        },
    });

    const {
        data: userData,
        isError: isErrorUser,
        isLoading: isLoadingUser,
    } = useQuery({
        queryKey: ["USER_DATA"],
        queryFn: async () => {
            const response = await api.get("/user");
            return response?.data || {};
        },
        onError: () => {
            toast.error("Không thể tải thông tin người dùng!");
        },
    });

    const handleShiftChange = async (class_code, session_code) => {
        try {
            setSelectedClassCode(class_code);
            setIsLoadingNewClasses(true);

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

            setNewClasses(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                "Không thể tải danh sách lớp!";
            toast.error(message);
            setNewClasses([]);
        } finally {
            setIsLoadingNewClasses(false);
        }
    };

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
            navigate("/student/schedules");
        } catch (error) {
            const message =
                error?.response?.data?.message || "Không thể đổi lịch học!";
            toast.error(message);
        }
    };

    const handleConfirmTransfer = () => {
        if (selectedClassCode && selectedNewClass) {
            handleScheduleChange(
                selectedClassCode,
                selectedNewClass.class_code
            );
            setShowConfirmModal(false); // Close modal after confirming
        }
    };

    const handleShowModal = (newClass) => {
        setSelectedNewClass(newClass); // Store the class to transfer to
        setShowConfirmModal(true); // Show the confirmation modal
    };

    if (isErrorClasses || isErrorSessions || isErrorUser) {
        return (
            <div className="text-danger">Đã xảy ra lỗi khi tải dữ liệu!</div>
        );
    }

    if (isLoadingClasses || isLoadingUser) {
        return <div>Loading...</div>;
    }

    const isStringData = typeof myClassesData === "string";
    const myClasses =
        !isStringData && Array.isArray(myClassesData) ? myClassesData : [];

    return (
        <div className="container mt-4">
            <h1
                style={{
                    fontSize: "1.5rem",
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <i
                    style={{ color: "blue", marginRight: "0.5rem" }}
                    className="fa fa-calendar"
                ></i>
                Thay đổi lịch học
            </h1>
            <div className="row mt-5">
                <div className="col-md-6">
                    {isStringData ? (
                        <p className="text-danger fs-10 bold">
                            {myClassesData}
                        </p>
                    ) : myClasses.length === 0 ? (
                        <p className="text-warning">
                            Không có lớp học nào để đổi lịch!
                        </p>
                    ) : (
                        myClasses.map((item, index) => {
                            return (
                                <div className="card mb-3" key={index}>
                                    <div className="card-body">
                                        <h6>{item.subject_name}</h6>
                                        <p>
                                            <strong>Mã Môn:</strong>{" "}
                                            {item.subject_code}
                                        </p>
                                        <p>
                                            <strong>Lớp học hiện tại:</strong>{" "}
                                            {item.class_name}
                                        </p>
                                        <p>
                                            <strong>
                                                Số lượng thành viên:
                                            </strong>{" "}
                                            {item.users_count} /{" "}
                                            {item.room_slot}
                                        </p>
                                        <p>
                                            <strong>Ca học hiện tại:</strong>{" "}
                                            {item.session_name}
                                        </p>
                                        <p>
                                            <strong>Thời gian học:</strong>{" "}
                                            {item.study_days}
                                        </p>
                                        <p>
                                            <strong>Ngày bắt đầu:</strong>{" "}
                                            {item.date_from}
                                        </p>
                                        <div>
                                            <strong>
                                                Ca học có thể chuyển tới:
                                            </strong>
                                            <div className="mt-2">
                                                {listSessions?.map(
                                                    (ss, idx) => (
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
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
                <div className="col-md-6">
                    {isLoadingNewClasses ? (
                        <div className="text-center my-3">
                            <div
                                className="spinner-border text-primary"
                                role="status"
                            >
                                <span className="visually-hidden">
                                    Loading...
                                </span>
                            </div>
                        </div>
                    ) : (!Array.isArray(newClasses) ||
                          newClasses.length === 0) &&
                      selectedClassCode ? (
                        <p className="text-info">
                            Không tìm thấy lớp học phù hợp để chuyển!
                        </p>
                    ) : (
                        Array.isArray(newClasses) &&
                        newClasses.map((newClass, index) => {
                            return (
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
                                            <strong>Số lượng:</strong>{" "}
                                            {newClass.users_count} /{" "}
                                            {newClass.room_slot}
                                        </p>
                                        <p>
                                            <strong>
                                                Ngày học trong tuần:
                                            </strong>{" "}
                                            {newClass.study_days}
                                        </p>
                                        <p>
                                            <strong>Ngày bắt đầu:</strong>{" "}
                                            {newClass.date_from}
                                        </p>

                                        <button
                                            className="btn btn-success btn-sm"
                                            onClick={() =>
                                                handleShowModal(newClass)
                                            }
                                        >
                                            Đổi lịch
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            <Modal
                title="Xác nhận đổi lịch"
                description={
                    <>
                        <p>
                            Bạn có chắc chắn muốn đổi lịch sang lớp{" "}
                            <strong>{selectedNewClass?.class_name}</strong> cho
                            môn{" "}
                            <strong>{selectedNewClass?.subject_name}</strong>?
                        </p>
                        <p style={{ color: "red", fontWeight: "bold" }}>
                            * Mỗi môn học chỉ được đổi lịch một lần.
                        </p>
                    </>
                }
                closeTxt="Hủy"
                okTxt="Xác nhận"
                visible={showConfirmModal}
                onVisible={() => setShowConfirmModal(false)}
                onOk={handleConfirmTransfer}
            />
        </div>
    );
};

export default TransferSchedule;
