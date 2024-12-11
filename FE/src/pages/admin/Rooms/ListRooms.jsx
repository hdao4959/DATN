import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../../config/axios";
import { getToken } from "../../../utils/getToken";
import "datatables.net-dt/css/dataTables.dataTables.css";
import $ from "jquery";
import "datatables.net";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Modal from "../../../components/Modal/Modal";

const ClassRoomsList = () => {
    const queryClient = useQueryClient();
    const accessToken = getToken();
    const navigate = useNavigate();

    const [classrooms, setClassRooms] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [currentClassCode, setCurrentClassCode] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const { data, refetch, isLoading, isError, error } = useQuery({
        queryKey: ["LIST_ROOMS"],
        queryFn: async () => {
            const res = await api.get("/admin/classrooms", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            });

            if (!res?.data?.classrooms?.data) {
                throw new Error("Dữ liệu trả về không hợp lệ");
            }

            return res.data.classrooms.data;
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
            toast.success("Xóa lớp học thành công!");
            queryClient.invalidateQueries("LIST_ROOMS");
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

    const { mutate: autoSchedule } = useMutation({
        mutationFn: async () => {
            const payload = {
                startDate: startDate,
            };
            try {
                const res1 = await api.post(
                    "/getListClassByRoomAndSession",
                    payload
                );
                if (res1.data.error) {
                    toast.error(
                        res1.data.message ||
                            "Có lỗi xảy ra khi lấy thông tin lớp học."
                    );
                    throw new Error(
                        res1.data.message || "Lỗi lấy thông tin lớp học."
                    );
                }

                const res2 = await api.get("/addStudent");
                if (res2.data.error) {
                    toast.error(
                        res2.data.message ||
                            "Có lỗi xảy ra khi thêm sinh viên vào lớp học."
                    );
                    throw new Error(res2.data.message || "Lỗi thêm sinh viên.");
                }

                const res3 = await api.get("/addTeacher");
                if (res3.data.error) {
                    toast.error(
                        res3.data.message ||
                            "Có lỗi xảy ra khi thêm giảng viên vào lớp học."
                    );
                    throw new Error(
                        res3.data.message || "Lỗi thêm giảng viên."
                    );
                }

                const res4 = await api.get("/generateSchedule");
                if (res4.data.error) {
                    toast.error(
                        res4.data.message ||
                            "Có lỗi xảy ra khi tạo lịch học và lịch thi."
                    );
                    throw new Error(
                        res4.data.message || "Lỗi tạo lịch học và lịch thi."
                    );
                }

                const res5 = await api.get("/generateAttendances");
                if (res5.data.error) {
                    toast.error(
                        res5.data.message ||
                            "Có lỗi xảy ra khi tạo danh sách điểm danh."
                    );
                    throw new Error(
                        res5.data.message || "Lỗi tạo danh sách điểm danh."
                    );
                }

                return { res1, res2, res3, res4, res5 };
            } catch (error) {
                throw new Error(error.response?.data?.message || error.message);
            }
        },
        onSuccess: (response) => {
            toast.success("Tạo lịch tự động thành công!");
            console.log("Response:", response);
            refetch();
        },
        onError: (error) => {
            console.error("Error:", error.message);
            toast.error(error.message || "Có lỗi xảy ra khi tạo lịch tự động.");
        },
    });

    const handleAutoSchedule = () => {
        autoSchedule();
    };

    useEffect(() => {
        if (classrooms.length > 0) {
            $("#classroomsTable").DataTable({
                data: classrooms.map((cls) => ({
                    class_name: cls.class_name || "N/A",
                    class_code: cls.class_code || "N/A",
                    subject_name: cls.subject_name || "N/A",
                    teacher_code: cls.teacher_code || "N/A",
                    teacher_name: cls.teacher_name || "N/A",
                    students_count: cls.students_count || 0,
                    session_name: cls.session_name || "Chưa xếp ca",
                    room_time: cls.session_value
                        // ? JSON.parse(cls.session_value.value)
                        // : { start: "", end: "" },
                })),
                columns: [
                    {
                        title: "Lớp học",
                        data: null,
                        render: (data) =>
                            // `<a href='/admin/classrooms/view/${data.class_code}/detail' class='text-dark'>
                            //     ${data.class_name}
                            // </a>`,
                            `<span class="viewDetail" data-class_code="${data.class_code}" style="margin-right: 5px;">
                                     ${data.class_name}
                                </span>`
                    },
                    {
                        title: "<i class='fas fa-book'> Môn</i>",
                        data: "subject_name",
                    },
                    {
                        title: "Giảng viên",
                        data: null,
                        render: (data) =>
                            `<a href='/admin/teachers/edit/${data.teacher_code}' class='text-dark'>
                                ${data.teacher_name}
                            </a>`,
                    },
                    {
                        title: "<i class='fas fa-users'> Số sinh viên</i>",
                        data: null,
                        className: "text-center",
                        render: (data) =>
                            `<a href='/admin/classrooms/view/${data.class_code}/detail' class='text-dark'>${data.students_count}<a>`,
                    },
                    {
                        title: "Ca học",
                        data: null,
                        render: (data) =>
                            `<a href='/admin/sessions/${data.class_code}/edit' class='text-dark'>
                ${data.session_name} (${data.room_time.start} - ${data.room_time.end})
            </a>`,
                    },
                    {
                        title: "",
                        className: "text-center",
                        data: null,
                        render: (data) => `
                            <div style="display: flex; gap: 10px; justify-content: center">
                                <button class="btn btn-info btn-sm" data-class_code="${data.class_code}">Xem điểm</button>
                                <button class="btn btn-primary btn-sm" data-class_code="${data.class_code}">Xem điểm danh</button>
                                <button class="btn btn-danger btn-sm delete-btn" data-class_code="${data.class_code}">Xóa</button>
                            </div>`,
                    },
                ],
                destroy: true,
            });

            $("#classroomsTable tbody").on("click", ".delete-btn", function () {
                const classCode = $(this).data("class_code");
                toggleDeleteModal(classCode);
            });
            $("#classroomsTable tbody").on("click", ".viewDetail", function () {
                const classCode = $(this).data("class_code");
                console.log(classCode);
                
                navigate(`/admin/classrooms/view/${classCode}/detail`);
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
                    } else if ($(this).text() === "Xem điểm danh") {
                        navigate(
                            `/admin/classrooms/view/${classCode}/attendances`
                        );
                    }
                }
            );
        }
    }, [classrooms]);

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
                            // min={new Date(
                            //     new Date().setDate(new Date().getDate() + 1)
                            // ).toLocaleDateString("en-CA")}
                        />
                        <button
                            className="btn btn-primary text-nowrap"
                            onClick={handleAutoSchedule}
                            disabled={!startDate}
                        >
                            <i className="fa fa-calendar"></i> Tạo tự động
                        </button>
                    </div>
                </div>
                <div className="card-body">
                    {isLoading && (
                        <div>
                            <div className="spinner-border" role="status"></div>
                            <p>Đang tải dữ liệu...</p>
                        </div>
                    )}
                    {isError && (
                        <p className="text-danger">
                            {error?.message || "Có lỗi xảy ra khi tải dữ liệu."}
                        </p>
                    )}
                    {!isLoading && !isError && classrooms.length === 0 && (
                        <p>Không có lớp học nào để hiển thị.</p>
                    )}
                    <div className="table-responsive">
                        <table
                            id="classroomsTable"
                            className="display text-nowrap"
                        ></table>
                    </div>
                </div>
            </div>

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
