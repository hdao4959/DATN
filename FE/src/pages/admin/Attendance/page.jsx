import React, { useEffect, useState } from "react";
import "datatables.net-dt/css/dataTables.dataTables.css";
import $ from "jquery";
import "datatables.net";
import { toast } from "react-toastify";
import api from "../../../config/axios";
import { useQuery } from "@tanstack/react-query";

const ShowAttendance = ({ classCode, onClose }) => {
    const [attendanceState, setAttendanceState] = useState([]);
    const [changedRecords, setChangedRecords] = useState([]);

    const {
        data: attendanceData,
        refetch: fetchAttendanceData,
        isLoading,
    } = useQuery({
        queryKey: ["ATTENDANCE", classCode],
        queryFn: async () => {
            const response = await api.get(`/admin/attendances/${classCode}`);
            return response?.data;
        },
        enabled: !!classCode, // Chỉ fetch khi classCode có giá trị
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
        return `${formattedDate} - (${dayOfWeek})`;
    };

    useEffect(() => {
        if (attendanceData) {
            setAttendanceState(attendanceData);
            const students = {};

            attendanceData.forEach((record) => {
                const { student_code, full_name, date, status, noted } = record;
                const formattedDate = new Date(date)
                    .toISOString()
                    .split("T")[0];

                if (!students[student_code]) {
                    students[student_code] = {
                        student_code,
                        full_name,
                        attendance: {},
                    };
                }

                students[student_code].attendance[formattedDate] = {
                    status,
                    noted,
                };
            });

            const firstStudent = Object.values(students)[0];
            const sortedDates = firstStudent
                ? Object.keys(firstStudent.attendance).sort(
                      (a, b) => new Date(a) - new Date(b)
                  )
                : [];
            const tableData = Object.values(students);

            $("#modalAttendanceTable").DataTable({
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
                        data: null,
                        render: (data, type, row) => {
                            const attendance = row.attendance[date] || {};
                            const checked =
                                attendance.status === "present"
                                    ? "checked"
                                    : "";

                            return `
                                <div class="form-check form-switch">
                                    <input class="form-check-input attendance-checkbox" type="checkbox" ${checked} data-student="${
                                row.student_code
                            }" data-date="${date}" />
                                    ${
                                        attendance.noted
                                            ? `<small>(${attendance.noted})</small>`
                                            : ""
                                    }
                                </div>
                            `;
                        },
                    })),
                ],
                scrollY: true,
            });
        }
    }, [attendanceData]);

    useEffect(() => {
        $("#modalAttendanceTable").off("change", ".attendance-checkbox");

        $("#modalAttendanceTable").on(
            "change",
            ".attendance-checkbox",
            function () {
                const studentCode = $(this).data("student");
                const date = $(this).data("date");
                const newStatus = $(this).is(":checked") ? "present" : "absent";

                setChangedRecords((prev) => {
                    const updated = [...prev];
                    const index = updated.findIndex(
                        (record) =>
                            record.student_code === studentCode &&
                            record.date.startsWith(date)
                    );

                    if (index >= 0) {
                        updated[index].status = newStatus;
                    } else {
                        updated.push({
                            student_code: studentCode,
                            date,
                            status: newStatus,
                        });
                    }
                    return updated;
                });
            }
        );
    }, [attendanceState]);

    const saveChanges = async () => {
        if (changedRecords.length === 0) {
            toast.success("Không có thay đổi nào để lưu.");
            return;
        }

        try {
            await api.put(`/api/admin/attendance`, changedRecords);
            toast.success("Lưu thành công!");
            setChangedRecords([]);
            fetchAttendanceData();
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi lưu.");
            console.error(error);
        }
    };

    return (
        <div
            className="modal fade show d-block"
            id="attendanceModal"
            tabIndex="-1"
            aria-labelledby="attendanceModalLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog modal-xl">
                <div className="modal-content" style={{ width: "100%" }}>
                    <div className="modal-header">
                        <h3 className="modal-title" id="attendanceModalLabel">
                            Danh sách điểm danh
                        </h3>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body">
                        <div style={{ maxWidth: "100%", overflowX: "auto" }}>
                            {!isLoading ? (
                                attendanceData ? (
                                    <div className="table-responsive">
                                        <table
                                            id="modalAttendanceTable"
                                            className="table-striped display"
                                        ></table>
                                    </div>
                                ) : (
                                    <p>Chưa có dữ liệu</p>
                                )
                            ) : (
                                <p>Đang tải dữ liệu...</p>
                            )}
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={saveChanges}
                        >
                            Lưu điểm danh
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onClose}
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShowAttendance;
