import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../../config/axios";
import { getToken } from "../../../utils/getToken";
import "datatables.net-dt/css/dataTables.dataTables.css";
import $ from "jquery";
import "datatables.net";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Modal from "../../../components/Modal/Modal";

const ClassRoomsList = () => {
    const accessToken = getToken();
    const navigate = useNavigate();
    const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
    const [currentClassCode, setCurrentClassCode] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [classrooms, setClassRooms] = useState([]);
    const [startDate, setStartDate] = useState("");

    const {
        data,
        refetch,
        isLoading: isLoadingClasses,
    } = useQuery({
        queryKey: ["LIST_ROOMS"],
        queryFn: async () => {
            const res = await api.get("/admin/classrooms", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            });
            setClassRooms(res?.data || []);
            return res?.data || [];
        },
    });

    useEffect(() => {
        setClassRooms(data || []);
    }, [data]);

    const deleteClassMutation = useMutation({
        mutationFn: (classCode) =>
            api.delete(`/admin/classrooms/${classCode}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            }),
        onSuccess: () => {
            toast.success("Xóa lớp học thành công");
            refetch();
            setDeleteModalOpen(false);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Có lỗi xảy ra!");
        },
    });

    const toggleDeleteModal = (classCode) => {
        setCurrentClassCode(classCode);
        setDeleteModalOpen((prev) => !prev);
    };

    const confirmDeleteClass = () => {
        if (currentClassCode) {
            deleteClassMutation.mutate(currentClassCode);
        }
    };

    const handleDeleteClass = (classCode) => {
        toggleDeleteModal(classCode);
    };

    useEffect(() => {
        if (classrooms) {
            $("#classroomsTable").DataTable({
                data: classrooms.map((cls) => ({
                    class_name: cls.class_name,
                    class_code: cls.class_code,
                    subject_name: cls.subject_name,
                    teacher_code: cls.teacher_code,
                    teacher_name: cls.teacher_name,
                    students_count: cls.students_count || 0,
                    session_name: cls.session_name || "Chưa xếp ca",
                    room_time: cls.session_value
                        ? JSON.parse(cls.session_value)
                        : { start: "", end: "" },
                })),
                columns: [
                    {
                        title: "<i class='fas fa-chalkboard-teacher'> Lớp</i>",
                        data: "class_name",
                    },
                    {
                        title: "<i class='fas fa-book'> Môn</i>",
                        data: "subject_name",
                    },
                    {
                        title: "<i class='fas fa-user-tie'> Giảng viên</i>",
                        data: null,
                        render: (data) =>
                            `${data.teacher_code || ""} - ${
                                data.teacher_name || ""
                            }`,
                    },
                    {
                        title: "<i class='fas fa-users'> Số sinh viên</i>",
                        data: "students_count",
                        className: "text-center",
                    },
                    {
                        title: "<i class='fas fa-clock'> Ca học</i>",
                        data: null,
                        render: (data) =>
                            `${data.session_name} (${
                                data.room_time.start || ""
                            } - ${data.room_time.end || ""})`,
                    },
                    {
                        title: "",
                        className: "text-center",
                        data: null,
                        render: (data) => {
                            return `
            <div style="display: flex; gap: 10px; justify-content: center">
                <button class="btn btn-info btn-sm" data-class_code="${data.class_code}">Xem điểm</button>
                <button class="btn btn-warning btn-sm" data-class_code="${data.class_code}">Chi tiết</button>
                <button class="btn btn-danger btn-sm delete-btn" data-class_code="${data.class_code}">Xóa</button>
            </div>`;
                        },
                    },
                ],
                destroy: true,
            });

            $("#classroomsTable tbody").on("click", ".delete-btn", function () {
                const classCode = $(this).data("class_code");
                handleDeleteClass(classCode);
            });

            $("#classroomsTable tbody").on(
                "click",
                "[data-class_code]",
                function () {
                    const classCode = $(this).data("class_code");
                    if ($(this).text() === "Xem điểm") {
                        navigate(`/admin/classrooms/view/${classCode}/grades`);
                    } else if ($(this).text() === "Chi tiết") {
                        navigate(`/admin/classrooms/view/${classCode}/detail`);
                        console.log(classCode);
                    }
                }
            );
        }
    }, [classrooms]);

    const { mutate: autoSchedule } = useMutation({
        mutationFn: async () => {
            if (!startDate) {
                return toast.error("Vui lòng chọn ngày bắt đầu.");
            }
            try {
                const res = await api.post(
                    "/admin/classrooms/auto-schedule",
                    { startDate },
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
                toast.success("Tạo lịch tự động thành công!");
                refetch();
            } catch (error) {
                toast.error(
                    error.response?.data?.message ||
                        "Có lỗi xảy ra khi tạo lịch tự động!"
                );
            }
        },
    });

    const handleAutoSchedule = () => {
        autoSchedule();
    };

    return (
        <>
            <div className="mb-3 mt-2 flex items-center justify-between">
                <Link to="/admin/classrooms/add">
                    <button className="btn btn-primary">Tạo lớp học mới</button>
                </Link>
            </div>

            <div className="card">
                <div className="card-header d-flex justify-content-between">
                    <h4 className="card-title">Quản lý lớp học</h4>
                    <div className="d-flex justify-content-center gap-2">
                        <input
                            type="date"
                            className="form-control"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            placeholder="Chọn ngày bắt đầu"
                        />
                        <button
                            className="btn btn-primary"
                            onClick={handleAutoSchedule}
                            disabled={!startDate}
                        >
                            <i className="fa fa-calendar"></i> Tạo tự động
                        </button>
                    </div>
                </div>
                <div className="card-body">
                    {isLoadingClasses && (
                        <div>
                            <div className="spinner-border" role="status"></div>
                            <p>Đang tải dữ liệu</p>
                        </div>
                    )}
                    <div className="table-responsive">
                        <table
                            id="classroomsTable"
                            className="display text-nowrap"
                        ></table>
                    </div>
                </div>
            </div>

            {/* Modal xác nhận xóa */}
            <Modal
                title="Xóa lớp học"
                description="Bạn có chắc chắn muốn xóa lớp học này?"
                visible={deleteModalOpen}
                onVisible={toggleDeleteModal}
                onOk={confirmDeleteClass}
                closeTxt="Hủy"
                okTxt="Xác nhận"
            />
        </>
    );
};

export default ClassRoomsList;
