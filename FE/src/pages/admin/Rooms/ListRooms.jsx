import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    useMutation,
    useQuery,
} from "@tanstack/react-query";
import api from "../../../config/axios";
import { getToken } from "../../../utils/getToken";
import "datatables.net-dt/css/dataTables.dataTables.css";
import $ from "jquery";
import "datatables.net";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ShowGrades from "../Grades/pages";
import ShowAttendance from "../Attendance/page";
const ClassRoomsList = () => {
    const accessToken = getToken();
    const navigate = useNavigate(); // Hook dùng để điều hướng trong React Router v6
    const [selectedClassCodeForGrades, setSelectedClassCodeForGrades] =
        useState(null);
    const [
        selectedClassCodeForAttendances,
        setSelectedClassCodeForAttendances,
    ] = useState(null);
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
    console.log(classrooms);

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

    const { mutate: updateStatus } = useMutation({
        mutationFn: async (data) => {
            return api.put('/admin/classrooms/bulk-update-type', data, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            });
        },
        onSuccess: () => {
            toast.success("Cập nhật trạng thái thành công!");
            refetch(); // Reload lại danh sách classrooms
        },
        onError: (error) => {
            // console.error("onError Callback:", error.response || error.message || error); // Log lỗi trong onError
            toast.error("Có lỗi xảy ra khi cập nhật trạng thái!");
        },
    });

    useEffect(() => {
        if (classrooms) {
            $("#classroomsTable").DataTable({
                data: classrooms,
                // processing: true,
                // serverSide: true,
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
                    {
                        title: "Trạng thái",
                        data: "is_active",
                        className: "text-center",
                        render: (data) => {
                            return data
                                ? `<i class="fas fa-check-circle toggleStatus" style="color: green; font-size: 20px; cursor: pointer;"></i>`
                                : `<i class="fas fa-times-circle toggleStatus" style="color: red; font-size: 20px; cursor: pointer;"></i>`;
                        },
                    },
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
                                    <i class="fas fa-edit" 
                                        style="cursor: pointer; font-size: 20px;" 
                                        data-id="${row.class_code}" 
                                        id="edit_${row.class_code}" 
                                        title="Chỉnh sửa"></i>
                                    <i class="fas fa-trash" 
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
                    // Gắn sự kiện xóa sau khi bảng được vẽ
                    $(row)
                        .find(".fa-trash")
                        .on("click", function () {
                            const classCode = $(this).data("id");
                            handleDelete(classCode);
                        });

                    $(row)
                        .find(".fa-edit")
                        .on("click", function () {
                            const classCode = $(this).data("id");
                            console.log(classCode);

                            navigate(`/admin/classrooms/edit/${classCode}`);
                        });
                    $(row)
                        .find(".toggleStatus")
                        .on("click", function () {
                            const currentStatus = data.is_active;
                            const newStatus = !currentStatus;

                            // Gọi API thay đổi trạng thái
                            updateStatus({
                                is_active: {
                                    [data.class_code]: newStatus,
                                },
                            });
                        });
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
    }, [classrooms]);

    // if (!isLoadingClasses) return <div><div className='spinner-border' role='status'></div><p>Đang tải dữ liệu</p></div>;
    return (
        <>
            <div className="mb-3 mt-2 flex items-center justify-between">
                <Link to="/admin/classrooms/add">
                    <button className="btn btn-primary">Tạo lớp học mới</button>
                </Link>
            </div>

            <div className="card">
                <div className="card-header">
                    <h4 className="card-title">Quản lý lớp học</h4>
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
                    <div className="table-responsive">
                        <table id="classroomsTable" className="display"></table>
                        {/* <table className="display table table-striped table-hover">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Mã lớp học</th>
                                        <th>Tên lớp</th>
                                        <th>Số lượng sinh viên</th>
                                        <th>Môn học</th>
                                        <th>Trạng thái</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {classrooms.map((it, index) => (
                                        <tr key={index} className="odd text-center">
                                            <Link
                                                to={`/admin/classrooms/view/${it.class_code}`}
                                                style={{ display: "contents" }}
                                            >
                                                <td>{it.id}</td>
                                                <td>{it.class_code}</td>
                                                <td>{it.class_name}</td>
                                                <td>30</td>
                                                <td>LTWE</td>
                                                <td>
                                                    {it.is_active == true ? (
                                                        <i
                                                            className="fas fa-check-circle"
                                                            style={{
                                                                color: "green",
                                                            }}
                                                        ></i>
                                                    ) : (
                                                        <i
                                                            className="fas fa-times-circle"
                                                            style={{
                                                                color: "red",
                                                            }}
                                                        ></i>
                                                    )}
                                                </td>
                                            </Link>
                                            <td>
                                                <div>
                                                    <Link
                                                        to={`/admin/classrooms/edit/${it.class_code}`}
                                                    >
                                                        <i className="fas fa-edit"></i>
                                                    </Link>
                                                    <i
                                                        className="fas fa-trash ml-6"
                                                        onClick={() =>
                                                            handleDelete(
                                                                it.class_code
                                                            )
                                                        }
                                                        disabled={isLoading}
                                                    ></i>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table> */}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ClassRoomsList;
