import React, { useEffect, useState } from "react";
import "datatables.net-dt/css/dataTables.dataTables.css";
import $ from "jquery";
import "datatables.net";
import { toast } from "react-toastify";
import api from "../../../config/axios";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

const ShowAttendance = () => {
    const [changedRecords, setChangedRecords] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const { class_code } = useParams();
    const navigate = useNavigate();

    const { data: attendanceData, error, isLoading, refetch } = useQuery({
        queryKey: ["attendances"],
        queryFn: async () => {
            const response = await api.get(`/admin/attendances/${class_code}`);
            return response?.data;
        },
        onError: () => {
            toast.error("Không thể tải dữ liệu");
        },
    });

    const formatDate = (dateString) => {
        const options = { day: "2-digit", month: "2-digit", year: "numeric" };
        const formattedDate = new Date(dateString).toLocaleDateString(
            "vi-VN",
            options
        );
        const dayOfWeek = new Date(dateString).toLocaleDateString("vi-VN", {
            weekday: "long",
        });
        return `<div>${formattedDate}</div> 
                <div>(${dayOfWeek})</div>`;
    };

    useEffect(() => {
        if (attendanceData && attendanceData != []) {
            const students = {};

            attendanceData.forEach((record) => {
                const { student_code, full_name, date, status, noted } = record;
                // Kiểm tra và xử lý định dạng date
                const formattedDate = date.includes("T")
                    ? new Date(date).toISOString().split("T")[0] // Trường hợp dateTtime
                    : date; // Trường hợp chỉ chứa ngày

                if (!students[student_code]) {
                    students[student_code] = {
                        student_code,
                        full_name,
                        attendance: {},
                    };
                }

                students[student_code].attendance[formattedDate] = {
                    status,
                };
            });

            const firstStudent = Object.values(students)[0];
            const sortedDates = firstStudent
                ? Object.keys(firstStudent.attendance).sort(
                    (a, b) => new Date(a) - new Date(b)
                )
                : [];
            const tableData = Object.values(students);

            const table = $("#attendanceTable").DataTable({
                pageLength: 10,
                lengthMenu: [10, 20, 50, 100],
                language: {
                    paginate: { previous: "Trước", next: "Tiếp theo" },
                    lengthMenu: "Hiển thị _MENU_ mục mỗi trang",
                    info: "Hiển thị từ _START_ đến _END_ trong _TOTAL_ mục",
                    search: "Tìm kiếm:",
                },
                destroy: true,
                data: tableData,
                columns: [
                    {
                        title: "STT",
                        data: null,
                        render: (data, type, row, meta) =>
                            meta.row + meta.settings._iDisplayStart + 1,
                    },
                    { title: "Mã SV", data: "student_code" },
                    { title: "Tên SV", data: "full_name" },
                    ...sortedDates.map((date) => ({
                        title: formatDate(date),
                        className: 'text-center',
                        data: null,
                        render: (data, type, row) => {
                            const attendance = row.attendance[date] || {};

                            if (!isEditing) {
                                // Chế độ xem: Hiển thị trạng thái (P, A, C)
                                const status = attendance.status || "C";
                                const displayStatus = status === 'present' ? 'P' : (status === 'absent' ? 'A' : 'C');
                                let statusClass = '';
                                let statusText = '';
                                if (displayStatus === 'P') {
                                    statusClass = 'text-success';
                                    statusText = 'Có mặt';
                                } else if (displayStatus === 'A') {
                                    statusClass = 'text-danger';
                                    statusText = 'Vắng';
                                } else {
                                    statusClass = 'text-secondary';
                                    statusText = 'Chưa điểm danh';
                                }
                                return `<div class="${statusClass} text-center" title="${statusText}">${displayStatus}</div>`;
                            }

                            const checked = attendance.status === "present" ? "checked" : "";
                            return `
                                <div class="form-check form-switch d-flex justify-content-center">
                                    <input class="form-check-input attendance-checkbox" style='transform: scale(1.5);' type="checkbox" ${checked} data-student="${row.student_code}" data-date="${date}" />
                                </div>
                            `;
                        }

                    })),
                ],
                scrollX: true,
                autoWidth: true,
                scrollCollapse: true,
                scrollY: "100%", 
                fixedHeader: true, // Cố định hàng tiêu đề
                fixedColumns: {
                    left: 3, // Cố định 3 cột đầu
                },
            });

            // Lắng nghe sự kiện thay đổi trên input-status
            $("#attendanceTable").on("change", ".attendance-checkbox", function () {
                const studentCode = $(this).data("student");
                const date = $(this).data("date");
                const isChecked = $(this).is(":checked");
                const newStatus = isChecked ? "present" : "absent";

                // Cập nhật changedRecords
                setChangedRecords((prevRecords) => {
                    const updatedRecords = prevRecords.filter(
                        (record) => !(record.student_code === studentCode && record.date === date)
                    );
                    updatedRecords.push({
                        student_code: studentCode,
                        date,
                        status: newStatus,
                        class_code: class_code,
                        noted: '',
                    });
                    return updatedRecords;
                });
            });
        }
    }, [attendanceData, isEditing]);


    const saveChanges = async () => {
        if (changedRecords.length === 0) {
            toast.info("Chưa có thay đổi nào để lưu.");
            return;
        }

        try {
            await api.put(`/admin/attendances/${class_code}`, changedRecords);
            toast.success("Lưu thành công!");
            setChangedRecords([]);
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi lưu.");
            console.error(error);
        }
    };

    return (
        <div className="row">
            <div className="col-md-12">
                <div className="card">
                    <div className="card-header">
                        <div className="card-title text-center">Điểm danh Lớp {class_code}</div>
                    </div>
                    <div className='card-body'>
                        <div className="table-responsive">
                            <table
                                id="attendanceTable"
                                className="table-striped display"
                            ></table>
                        </div>
                        <div style={{ marginTop: "20px", float: "right" }}>
                            <button
                                className="btn btn-danger"
                                onClick={() => navigate(-1)}
                            >
                                <i className="fas fa-backward"> Quay lại</i>
                            </button>
                            {/* Thêm nút sửa */}
                            <button
                                type="button"
                                className="btn btn-secondary ms-2"
                                onClick={() => setIsEditing(!isEditing)} // Chuyển chế độ sửa
                            >
                                {isEditing ? <i className='fas fa-redo'> Hủy</i> : <i className='fas fa-recycle'> Sửa</i>}
                            </button>

                            <button
                                type="button"
                                className="btn btn-primary ms-2"
                                onClick={saveChanges}
                            >
                                <i className='fas fa-save'> Lưu</i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShowAttendance;
