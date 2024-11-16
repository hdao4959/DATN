import React, { useState, useEffect } from 'react';
import 'datatables.net-dt/css/dataTables.dataTables.css';
import $ from 'jquery';
import 'datatables.net';
import { toast } from 'react-toastify';
import api from '../../../config/axios';
import { useQuery } from '@tanstack/react-query';

const ShowAttendance = () => {
    const [idSelected, setIdSelected] = useState(null);
    const [attendanceState, setAttendanceState] = useState([]);

    const { data: classes, isLoading: isLoadingClasses } = useQuery({
        queryKey: ["LIST_CLASSES"],
        queryFn: async () => {
            const response = await api.get(`/admin/attendances`);
            return response?.data?.data;
        }
    });

    const { data: attendanceData, refetch: fetchAttendanceData } = useQuery({
        queryKey: ["ATTENDANCE", idSelected],
        queryFn: async () => {
            const response = await api.get(`/admin/attendances/${idSelected}`);
            return response?.data;
        },
        enabled: false 
    });
    useEffect(() => {
        if (idSelected) {
            fetchAttendanceData();
        }
    }, [idSelected]);
    
    const handleViewDetails = async (class_code) => {
        console.log(class_code);
        
        setIdSelected(class_code);
        // fetchAttendanceData();

        const modal = new window.bootstrap.Modal(document.getElementById('attendanceModal'));
        modal.show();
    };

    useEffect(() => {
        if (classes) {
            $('#classesTable').DataTable({
                // serverSide: true,
                // processing: true,
                pageLength: 10,
                lengthMenu: [10, 20, 50, 100],
                language: {
                    paginate: { previous: 'Trước', next: 'Tiếp theo' },
                    lengthMenu: 'Hiển thị _MENU_ mục mỗi trang',
                    info: 'Hiển thị từ _START_ đến _END_ trong _TOTAL_ mục',
                    search: 'Tìm kiếm:'
                },
                destroy: true,
                data: classes,
                ajax: async (data, callback) => {
                    try {
                        const page = data.start / data.length + 1;
                        const response = await api.get(`/admin/attendances`, {
                            params: { page, per_page: data.length },
                        });

                        const result = response.data;

                        callback({
                            draw: data.draw,
                            recordsTotal: result.total,
                            recordsFiltered: result.total,
                            data: result.data,
                        });
                    } catch (error) {
                        console.error("Error fetching data:", error);
                    }
                },
                columns: [
                    { title: "Mã lớp", data: "class_code" },
                    { title: "Mã môn", data: "subject_code" },
                    { title: "Tên lớp", data: "class_name" },
                    // { title: "Giảng viên", data: "user_code" },
                    {
                        title: "Điểm danh",
                        data: null,
                        render: (data, type, row) => {
                            return `<button class="view-details-button btn btn-primary" data-id="${row.class_code}">Xem điểm danh</button>`;
                        }
                    }
                ]
            });

            $('#classesTable tbody').off('click', '.view-details-button');
            $('#classesTable tbody').on('click', '.view-details-button', function () {
                const class_code = $(this).data('id');
                handleViewDetails(class_code);
            });
        }
    }, [classes]);

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        const formattedDate = new Date(dateString).toLocaleDateString('vi-VN', options);
        const dayOfWeek = new Date(dateString).toLocaleDateString('vi-VN', { weekday: 'long' });
        return `${formattedDate} - (${dayOfWeek})`;
    };


    useEffect(() => {
        if (attendanceData) {
            setAttendanceState(attendanceData);
            const students = {};

            attendanceData.forEach(record => {
                const { student_code, full_name, date, status, noted } = record;

                const formattedDate = new Date(date).toISOString().split("T")[0];

                if (!students[student_code]) {
                    students[student_code] = {
                        student_code,
                        full_name,
                        attendance: {}
                    };
                }

                students[student_code].attendance[formattedDate] = { status, noted };
            });

            const firstStudent = Object.values(students)[0];
            const sortedDates = firstStudent ? Object.keys(firstStudent.attendance).sort((a, b) => new Date(a) - new Date(b)) : [];
            const tableData = Object.values(students);

            console.log("students:", students);
            console.log("sortedDates:", sortedDates);
            console.log("tableData:", tableData);

            $('#modalAttendanceTable').DataTable({
                pageLength: 10,
                lengthMenu: [10, 20, 50, 100],
                language: {
                    paginate: { previous: 'Trước', next: 'Tiếp theo' },
                    lengthMenu: 'Hiển thị _MENU_ mục mỗi trang',
                    info: 'Hiển thị từ _START_ đến _END_ trong _TOTAL_ mục',
                    search: 'Tìm kiếm:'
                },
                destroy: true,
                data: tableData,
                columns: [
                    {
                        title: "STT",
                        data: null,
                        render: (data, type, row, meta) => meta.row + meta.settings._iDisplayStart + 1
                    },
                    { title: "Mã SV", data: "student_code" },
                    { title: "Tên SV", data: "full_name" },
                    ...sortedDates.map(date => ({
                        title: formatDate(date),
                        data: null,
                        render: (data, type, row) => {
                            const attendance = row.attendance[date] || {};
                            const checked = attendance.status === "present" ? "checked" : "";

                            return `
                                <div class="form-check form-switch">
                                    <input class="form-check-input attendance-checkbox" type="checkbox" ${checked} data-student="${row.student_code}" data-date="${date}" />
                                    ${attendance.noted ? `<small>(${attendance.noted})</small>` : ""}
                                </div>
                            `;
                        }
                    }))
                ],
                // scrollX: true,
                scrollY: true
            });
        }

    }, [attendanceData]);

    useEffect(() => {
        $('#modalAttendanceTable').off('change', '.attendance-checkbox');

        let changedRecords = [];

        $('#modalAttendanceTable').on('change', '.attendance-checkbox', function () {
            const studentCode = $(this).data('student');
            const date = $(this).data('date');
            const newStatus = $(this).is(':checked') ? 'present' : 'absent';

            const currentDate = new Date();
            const currentHours = currentDate.getHours();
            const currentMinutes = currentDate.getMinutes();
            const currentSeconds = currentDate.getSeconds();
            const updatedDate = `${date.split(' ')[0]} ${String(currentHours).padStart(2, '0')}:${String(currentMinutes).padStart(2, '0')}:${String(currentSeconds).padStart(2, '0')}`;

            const recordIndex = changedRecords.findIndex(record =>
                record.student_code === studentCode && record.date.startsWith(date.split(' ')[0])
            );

            if (recordIndex >= 0) {
                changedRecords[recordIndex].status = newStatus;
                changedRecords[recordIndex].date = updatedDate;
            } else {
                changedRecords.push({ student_code: studentCode, date: updatedDate, status: newStatus });
            }
        });

    }, [attendanceState]);
    function saveChanges() {
        if (changedRecords.length === 0) {
            toast.success("Không có thay đổi nào để lưu.");
            return;
        }

        $.ajax({
            url: '/api/admin/attendance',
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(changedRecords),
            success: function (response) {
                toast.success("Lưu thành công!");
                changedRecords = [];
            },
            error: function (error) {
                toast.error("Đã xảy ra lỗi khi lưu.");
                console.error(error);
            }
        });
    }

    return (
        <div>
            <div className="card" style={{ minHeight: '800px' }}>
                <div className="card-header">
                    <h4 className="card-title">Quản lý điểm danh</h4>
                </div>
                <div className="card-body">
                    {isLoadingClasses ? (
                        <div className="loading-spinner">
                            <p>Đang tải dữ liệu...</p>
                        </div>
                    ) : (
                    <div className="table-responsive">
                        <table id="classesTable" className="display"></table>
                        <div className="modal fade" id="attendanceModal" tabIndex="-1" aria-labelledby="attendanceModalLabel" aria-hidden="true">
                            <div className="modal-dialog modal-xl">
                                <div className="modal-content" style={{ width: '100%' }}>
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="attendanceModalLabel">Danh sách điểm danh</h5>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        <div style={{ maxWidth: '100%', overflowX: 'auto' }}>
                                            <table id="modalAttendanceTable" className="table-striped display"></table>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-primary" onClick={saveChanges}>Lưu điểm danh</button>
                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShowAttendance;
