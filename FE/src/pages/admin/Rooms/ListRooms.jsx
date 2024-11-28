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
import ShowGrades from "../Grades/pages";
import ShowAttendance from "../Attendance/page";
import Modal from "../../../components/Modal/Modal";
const ClassRoomsList = () => {
    const accessToken = getToken();
    const navigate = useNavigate(); // Hook dùng để điều hướng trong React Router v6
    const [selectedClassCodeForGrades, setSelectedClassCodeForGrades] =
        useState(null);
    const [
        selectedClassCodeForAttendances,
        setSelectedClassCodeForAttendances,
    ] = useState(null);
    const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
    const [currentClassCode, setCurrentClassCode] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false); // Modal xác nhận xóa

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
            return res?.data?.classrooms || [];
        },
    });
    const classrooms = data?.data;

    const { mutate, isLoading } = useMutation({
        mutationFn: (class_code) =>
            api.delete(`/admin/classrooms/${class_code}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            }),
        onSuccess: () => {
            toast.success("Xóa phòng học thành công");
            refetch();
        },
        onError: () => {
            alert("Có lỗi xảy ra khi xóa phòng học");
        },
    });

    const handleDelete = (class_code) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa phòng học này không?")) {
            mutate(class_code);
        }
    };

    const handleViewGrades = (classCode) => {
        setSelectedClassCodeForGrades(classCode);
    };

    const handleViewAttendances = (classCode) => {
        setSelectedClassCodeForAttendances(classCode);
    };

    const handleCloseModal = () => {
        setSelectedClassCodeForGrades(null);
        setSelectedClassCodeForAttendances(null);
    };
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
            setDeleteModalOpen(false); // Đóng modal khi xóa thành công
        },
        onError: (error) => {
            toast.error(error.response.data.message);
        },
    });

    // Mở/đóng modal xác nhận xóa lớp học
    const toggleDeleteModal = (classCode) => {
        setCurrentClassCode(classCode);
        setDeleteModalOpen((prev) => !prev);
    };

    // Xác nhận xóa lớp học
    const confirmDeleteClass = () => {
        if (currentClassCode) {
            deleteClassMutation.mutate(currentClassCode);
        }
    };

    // Khi nhấn vào biểu tượng xóa lớp học
    const handleDeleteClass = (classCode) => {
        toggleDeleteModal(classCode);
    };

    useEffect(() => {
        if (classrooms) {
            $("#classroomsTable").DataTable({
                data: classrooms,
                processing: true,
                serverSide: true,
                ajax: async (data, callback) => {
                    try {
                        // Tính toán số trang
                        const page = Math.ceil(data.start / data.length) + 1;

                        // Gửi request đến API
                        const response = await api.get(`/admin/classrooms`, {
                            params: {
                                page: page,
                                per_page: data.length,
                                // search: data.search.value || '',
                                // order_column: data.columns[data.order[0].column].data || 'id', // Tên cột
                                // order_dir: data.order[0].dir || 'asc', // Hướng sắp xếp
                            },
                        });

                        const classrooms = response.data.classrooms;

                        // Gọi callback của DataTables
                        callback({
                            draw: data.draw,
                            recordsTotal: classrooms.total || 0,
                            recordsFiltered: classrooms.total || 0, // Sử dụng `filtered` nếu API có
                            data: classrooms.data || [], // Dữ liệu lớp học
                        });
                    } catch (error) {
                        console.error("Error fetching data:", error);
                        // Trả về dữ liệu rỗng nếu có lỗi
                        callback({
                            draw: data.draw,
                            recordsTotal: 0,
                            recordsFiltered: 0,
                            data: [],
                        });
                    }
                },

                columns: [
                    { title: "Mã lớp", data: "class_code" },
                    { title: "Tên lớp", data: "class_name" },
                    { title: "Mã môn", data: "subject_code" },
                    { title: "Giảng viên", data: "user_code" },

                    {
                        title: "Hành động",
                        className: "text-center",
                        data: null,
                        render: (data, type, row) => {
                            return `
                                <div style="display: flex; justify-content: center; align-items: center; gap: 10px">
                                <button 
                                        class="btn btn-info btn-sm" 
                                        style="font-size: 14px;" 
                                        data-id="${row.class_code}" 
                                        id="view_grades_${row.class_code}" 
                                        title="Xem điểm">
                                        Xem điểm
                                    </button>
                                    <button 
                                        class="btn btn-secondary btn-sm" 
                                        style="font-size: 14px;" 
                                        data-id="${row.class_code}" 
                                        id="view_attendance_${row.class_code}" 
                                        title="Xem điểm danh">
                                        Xem điểm danh
                                    </button>
                                     <button class="btn btn-warning btn-sm"  >
                                        <a href="/admin/classrooms/view/${row.class_code}">
               Xem thông tin lớp
            </a>
                                    </button>
                                   
                                    <i class="fas fa-trash delete-btn" 
                                        style="cursor: pointer; color: red; font-size: 20px;" 
                                        data-id="${row.class_code}" 
                                        id="delete_${row.class_code}" 
                                        title="Xóa"></i>
                                </div>
                            `;
                        },
                    },
                ],
                pageLength: 10,
                lengthMenu: [10, 20, 50, 100],
                language: {
                    paginate: { previous: "Trước", next: "Tiếp theo" },
                    lengthMenu: "Hiển thị _MENU_ mục mỗi trang",
                    info: "Hiển thị từ _START_ đến _END_ trong _TOTAL_ mục",
                    search: "Tìm kiếm:",
                },
                destroy: true,
                createdRow: (row, data, dataIndex) => {
                    $(row)
                        .find(".delete-btn")
                        .on("click", () => handleDeleteClass(data.class_code));
                },
            });
            // Lắng nghe sự kiện click cho nút "Xem điểm"
            $("#classroomsTable").on(
                "click",
                '[id^="view_grades_"]',
                function () {
                    const classCode = $(this).data("id"); // Lấy mã lớp học từ data-id của button
                    setSelectedClassCodeForGrades(classCode);
                    handleViewGrades(classCode);
                }
            );

            // Lắng nghe sự kiện click cho nút "Xem điểm danh"
            $("#classroomsTable").on(
                "click",
                '[id^="view_attendance_"]',
                function () {
                    const classCode = $(this).data("id"); // Lấy mã lớp học từ data-id của button
                    setSelectedClassCodeForAttendances(classCode);
                    handleViewAttendances(classCode);
                }
            );
        }
        $('#AutoSchedule').off('click').on('click', handleAutoSchedule);

    }, [classrooms]);

    const { mutate: autoSchedule, isLoading: isAutoScheduling } = useMutation({
        mutationKey: ["AUTO_SCHEDULE_CLASSES"],
        mutationFn: async () => {
            const payload = {
                startDates: ["2024-12-2", "2024-12-3"],
            };
            // Bước 1: Gọi API getListClassByRoomAndSession
            const res1 = await api.post("/getListClassByRoomAndSession", payload, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            });
            const res2 = await api.get("/addStudent", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            });
            const res3 = await api.get("/addTeacher", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            });
            const res4 = await api.get("/generateSchedule", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            });
            return { res1, res2, res3, res4};

        },
        onSuccess: (response) => {
            toast.success("Tạo lịch tự động thành công!");
            console.log("Response:", response);
            refetch(); // Refetch danh sách lớp học
        },
        onError: (error) => {
            console.error("Error:", error);
            toast.error("Có lỗi xảy ra khi tạo lịch tự động.");
        },
    });

    function handleAutoSchedule() {
        autoSchedule();
    }

    // if (!isLoadingClasses) return <div><div className='spinner-border' role='status'></div><p>Đang tải dữ liệu</p></div>;
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
                    <div>
                        <button className='btn btn-primary ml-3' id="AutoSchedule"><i class="fa fa-calendar"></i> Tạo tự động</button>
                    </div>
                </div>
                {selectedClassCodeForGrades && (
                    <ShowGrades
                        classCode={selectedClassCodeForGrades}
                        onClose={handleCloseModal}
                    />
                )}
                {selectedClassCodeForAttendances && (
                    <ShowAttendance
                        classCode={selectedClassCodeForAttendances}
                        onClose={handleCloseModal}
                    />
                )}
                {(selectedClassCodeForGrades ||
                    selectedClassCodeForAttendances) && (
                        <div className="modal-backdrop fade show"></div>
                    )}
                <div className="card-body">
                    {isLoadingClasses && (
                        <>
                            <div className="spinner-border" role="status"></div>
                            <p>Đang tải dữ liệu</p>
                        </>
                    )}
                    <div className="table-responsive">
                        <table id="classroomsTable" className="display"></table>
                    </div>
                </div>
            </div>

            {/* Modal xác nhận xóa lớp học */}
            <Modal
                title="Xóa lớp học"
                description="Bạn có chắc chắn muốn xóa lớp học này?"
                visible={deleteModalOpen}
                onVisible={toggleDeleteModal}
                onOk={confirmDeleteClass}
                closeTxt="Huỷ"
                okTxt="Xác nhận"
            />
        </>
    );
};

export default ClassRoomsList;
