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
    const [deleteModalOpen, setDeleteModalOpen] = useState(false); // Modal xác nhận xóa
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
    }, [data])

    // useEffect(() => {
    //     refetch();
    // }, [])

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
                data: classrooms?.map((classes, index) => ({
                    class_code: classes.class_code,
                    class_name: classes.class_name,
                    // subject_code: classes.subject_code,
                    subject_name: classes.subject_name,
                    teacher_code: classes.teacher_code,
                    teacher_name: classes.teacher_name,
                    total_student: classes.total_student,
                    room_name: classes.schedule?.room_name,
                    session_name: classes.schedule.session_name,
                    start: classes.schedule?.value?.['start'],
                    end: classes.schedule?.value?.['end'],
                })),
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
                        const classrooms = response?.data;
                        const data3 = classrooms?.map((classes, index) => ({
                            class_code: classes.class_code,
                            class_name: classes.class_name,
                            // subject_code: classes.subject_code,
                            subject_name: classes.subject_name,
                            teacher_code: classes.teacher_code,
                            teacher_name: classes.teacher_name,
                            total_student: classes.total_student,
                            room_name: classes.schedule?.room_name,
                            session_name: classes.schedule.session_name,
                            start: classes.schedule?.value?.['start'],
                            end: classes.schedule?.value?.['end'],
                        }));
                        callback({
                            draw: data.draw,
                            recordsTotal: classrooms.total || 0,
                            recordsFiltered: classrooms.total || 0, 
                            data: data3 || [], 
                        });
                    } catch (error) {
                        console.error("Error fetching data:", error);
                        callback({
                            draw: data.draw,
                            recordsTotal: 0,
                            recordsFiltered: 0,
                            data: [],
                        });
                    }
                },

                columns: [
                    {
                        title: "Lớp",
                        data: null,
                        render: (row) => `${row.class_name ? row.class_name : ''} ${row.class_code ? row.class_code : ''}`
                    },
                    {
                        title: "Môn",
                        data: null,
                        render: (row) => `${row.subject_code ? row.subject_code : ''} - ${row.subject_name ? row.subject_name : ''}`
                    },
                    {
                        title: "Giảng viên",
                        data: null,
                        render: (row) =>    `<div class='hover:text-blue-400' data-id="${row.class_code}" id="view_user_${row.class_code}" >
                                                ${row.teacher_code ? row.teacher_code : ''} - ${row.teacher_name ? row.teacher_name : ''}
                                            </div>`
                    },
                    {
                        title: "Số sinh viên",
                        data: null,
                        render: (row) => `${row.total_student ? row.total_student : '0'}`,
                        className: "text-center"
                    },
                    {
                        title: "Phòng học",
                        data: null,
                        render: (row) => `${row.room_name ? row.room_name : 'Chưa có phòng'}`
                    },
                    {
                        title: "Ca học",
                        data: null,
                        render: (row) => `${row.session_name ? row.session_name : 'Chưa xếp ca'} (${row.start ? row.start : ''} - ${row.end ? row.end : ''})`
                    },
                    {
                        title: "",
                        className: "text-center",
                        data: null,
                        render: (data, type, row) => {
                            return `
                                <div style="display: flex; justify-content: center; align-items: center; gap: 10px">
                                    <button 
                                        class="btn btn-info btn-sm" 
                                        data-id="${row.class_code}" 
                                        id="view_grades_${row.class_code}" 
                                        title="Xem điểm">
                                        <i class='fas fa-list'></i>
                                        Xem điểm
                                    </button>
                                    <button 
                                        class="btn btn-secondary btn-sm" 
                                        data-id="${row.class_code}" 
                                        id="view_attendance_${row.class_code}" 
                                        title="Xem điểm danh">
                                        Xem điểm danh
                                    </button>
                                    <button class="btn btn-warning btn-sm"
                                        data-id="${row.class_code}" 
                                        id="view_detail_${row.class_code}" 
                                    >
                                        Xem chi tiết lớp học
                                    </button>
                                    <button class="btn btn-sm"  >
                                        <i class="fas fa-trash delete-btn my-link hover:text-red-500" 
                                            style="cursor: pointer; font-size: 20px;" 
                                            data-id="${row.class_code}" 
                                            id="delete_${row.class_code}" 
                                            title="Xóa">
                                        </i>
                                    </button>
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
                    processing: 'Đang tải dữ liệu',
                    emptyTable: "Không có dữ liệu nào để hiển thị",
                    loadingRecords: "Đang tải dữ liệu, vui lòng chờ...",
                },
                destroy: true,
                createdRow: (row, data, dataIndex) => {
                    // Xử lý nút xóa
                    $(row)
                        .find(".delete-btn")
                        .on("click", () => handleDeleteClass(data.class_code));
                },
            });
            $("#classroomsTable tbody").on("click", '[id^="view_grades_"]', function () {
                const classCode = $(this).data("id");
                navigate(`/admin/classrooms/view/${classCode}/grades`);
            });

            $("#classroomsTable tbody").on("click", '[id^="view_attendance_"]', function () {
                const classCode = $(this).data("id");
                navigate(`/admin/classrooms/view/${classCode}/attendances`);
            });

            $("#classroomsTable tbody").on("click", '[id^="view_detail_"]', function () {
                const classCode = $(this).data("id");
                navigate(`/admin/classrooms/view/${classCode}/detail`);
            });

            $("#classroomsTable tbody").on("click", '[id^="view_user_"]', function () {
                const user_code = $(this).data("id");
                navigate(`/admin/teachers/${user_code}`);
            });
        }
    }, [classrooms]);
    const { mutate: autoSchedule, isLoading: isAutoScheduling } = useMutation({
        mutationKey: ["AUTO_SCHEDULE_CLASSES"],
        mutationFn: async () => {
            if (!startDate) {
                toast.error("Vui lòng chọn ngày bắt đầu.");
            }
            try {
                // Bước 1: Gọi API getListClassByRoomAndSession
                const res1 = await api.post("/getListClassByRoomAndSession", startDate, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                });
                if (res1.data.error) {
                    return toast.error(res1.data.message || "Có lỗi xảy ra khi lấy thông tin lớp học.");
                }
                const res2 = await api.get("/addStudent", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                });
                if (res2.data.error) {
                    return toast.error(res2.data.message || "Có lỗi xảy ra khi thêm sinh viên vào lớp học.");
                }
                const res3 = await api.get("/addTeacher", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                });
                if (res3.data.error) {
                    return toast.error(res3.data.message || "Có lỗi xảy ra khi thêm giảng viên vào lớp học.");
                }
                const res4 = await api.get("/generateSchedule", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                });
                if (res4.data.error) {
                    return toast.error(res4.data.message || "Có lỗi xảy ra khi tạo lịch học và lịch thi.");
                }
                return { res1, res2, res3, res4 };

            } catch (error) {
                return toast.error(error.response?.data?.message || error.message || "Có lỗi xảy ra khi tạo lịch tự động.");
            }
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
                    <div className="d-flex justify-content-center gap-2">
                        <input
                            type="date"
                            className="form-control"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            placeholder="Chọn ngày bắt đầu"
                            min={new Date(new Date().setDate(new Date().getDate() + 1)).toLocaleDateString('en-CA')}
                        />
                        <button className='btn btn-primary w-100' id="AutoSchedule"
                                // onClick={handleAutoSchedule}
                        ><i class="fa fa-calendar"></i> Tạo tự động</button>
                    </div>
                </div>
                <div className="card-body">
                    {isLoadingClasses && (
                        <>
                            <div className="spinner-border" role="status"></div>
                            <p>Đang tải dữ liệu</p>
                        </>
                    )}
                    <div className="table-responsive">
                        <table id="classroomsTable" className="display text-nowrap"></table>
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