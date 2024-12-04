import React, { useEffect, useState } from "react";
import "datatables.net-dt/css/dataTables.dataTables.css";
import $ from "jquery";
import "datatables.net";
import { toast } from "react-toastify";
import api from "../../../config/axios";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

const ShowAttendance = () => {
    const { class_code } = useParams();
    const navigate = useNavigate();

    const { data: attendanceData, error, isLoading, refetch } = useQuery({
        queryKey: ["attendances", class_code],
        queryFn: async () => {
            const response = await api.get(`/teacher/attendances/${class_code}`);
            return response?.data;
            // const attendanceDataI = [
            //     {
            //         student_code: "SV001",
            //         full_name: "Nguyễn Văn A",
            //         date: "2024-11-01T00:00:00Z",
            //         status: "absent",
            //         noted: "On time",
            //     },
            //     {
            //         student_code: "SV002",
            //         full_name: "Trần Thị B",
            //         date: "2024-11-01T00:00:00Z",
            //         status: "absent",
            //         noted: "Sick",
            //     },
            //     {
            //         student_code: "SV003",
            //         full_name: "Lê Minh C",
            //         date: "2024-11-01T00:00:00Z",
            //         status: "present",
            //         noted: "On time",
            //     },
            //     {
            //         student_code: "SV001",
            //         full_name: "Nguyễn Văn A",
            //         date: "2024-11-02T00:00:00Z",
            //         status: "absent",
            //         noted: "Traveling",
            //     },
            //     {
            //         student_code: "SV001",
            //         full_name: "Nguyễn Văn A",
            //         date: "2024-11-03T00:00:00Z",
            //         status: "absent",
            //         noted: "Traveling",
            //     },
            //     {
            //         student_code: "SV002",
            //         full_name: "Trần Thị B",
            //         date: "2024-11-02T00:00:00Z",
            //         status: "present",
            //         noted: "On time",
            //     },
            // ];
            // return attendanceDataI;
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
        if (attendanceData) {
            const students = {};

            // Xử lý dữ liệu attendance
            attendanceData.forEach((record) => {
                const { student_code, full_name, date, status } = record;
                // Kiểm tra và xử lý định dạng date
                const formattedDate = date; // Trường hợp chỉ chứa ngày


                if (!students[student_code]) {
                    students[student_code] = {
                        student_code,
                        full_name,
                        attendance: {},
                        absentCount: 0, // Khởi tạo số buổi vắng
                    };
                }

                // Cập nhật trạng thái điểm danh
                students[student_code].attendance[formattedDate] = { status };
                if (status === "absent") {
                    students[student_code].absentCount++; // Tăng số buổi vắng
                }
            });

            const firstStudent = Object.values(students)[0];
            const sortedDates = firstStudent
                ? Object.keys(firstStudent.attendance).sort(
                    (a, b) => new Date(a) - new Date(b)
                )
                : [];
            const tableData = Object.values(students);

            // Khởi tạo DataTable
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
                        className: "text-center",
                        data: null,
                        render: (data, type, row) => {
                            const attendance = row.attendance[date] || {};
                            const status = attendance.status || "C";
                            const displayStatus =
                                status === "present" ? "P" : status === "absent" ? "A" : "C";
                            let statusClass = "";
                            if (displayStatus === "P") {
                                statusClass = "text-success";
                            } else if (displayStatus === "A") {
                                statusClass = "text-danger";
                            } else {
                                statusClass = "text-secondary";
                            }
                            return `<div class="${statusClass}">${displayStatus}</div>`;
                        },
                    })),
                ],
                createdRow: (row, data) => {
                    // Kiểm tra số buổi vắng >= 3 và cập nhật màu sắc hàng
                    if (data.absentCount >= 3) {
                        $(row).css("background-color", "rgba(255, 0, 0, 0.1)"); // Sắc đỏ nhạt
                    }
                },
                scrollY: true,
            });
        }
    }, [attendanceData]);

    return (
        <div className="row">
            <div className="col-md-12">
                <div className="card">
                    <div className="card-header">
                        <div className="card-title text-center">Điểm danh Lớp {class_code}</div>
                    </div>
                    <div className='card-body'>
                        {isLoading && (
                            <div>
                                <div className="spinner-border" role="status"></div>
                                <p>Đang tải dữ liệu</p>
                            </div>
                        )}
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShowAttendance;
