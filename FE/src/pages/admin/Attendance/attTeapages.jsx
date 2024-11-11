import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useQuery } from '@tanstack/react-query';

const AttendanceManagement = () => {
    const [selectedClassCode, setSelectedClassCode] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [attendanceStudentDetails, setAttendanceStudentDetails] = useState([]);
    const [attendanceFormatData, setAttendanceFormatData] = useState([]);
    const [sortedDates, setSortedDates] = useState([]);
    const [viewMode, setViewMode] = useState('');
    const [expandedRows, setExpandedRows] = useState({});

    const { data: classes, isLoading: isLoadingClasses } = useQuery({
        queryKey: ["LIST_CLASSES"],
        queryFn: async () => {
            const response = await api.get(`/teacher/attendances`);
            return response?.data?.data;
        }
    });
    const { data: attendanceData, refetch: fetchAttendanceData } = useQuery({
        queryKey: ["ATTENDANCE", selectedClassCode],
        queryFn: async () => {
            const response = await api.get(`/teacher/attendances/${selectedClassCode}`);
            setAttendanceStudentDetails(response?.data);
            return response?.data;
        },
        enabled: false
    });

    useEffect(() => {
        const students = {};
        attendanceStudentDetails?.forEach(record => {
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

        let table = null;
        if (table) {
            table = $('#modalAttendanceTable').DataTable({
                destroy: true,
                language: {
                    search: 'Tìm kiếm'
                },
                paging: false,
            })
        }

        setAttendanceFormatData(tableData);
        setSortedDates(sortedDates);
    }, [attendanceData, attendanceStudentDetails])

    const handleShowDetails = (classItem, mode, date) => {
        setViewMode(mode);
        setSelectedDate(date);
        setSelectedClassCode(classItem.class_code);
        fetchAttendanceData(classItem.class_code);
        const modal = new window.bootstrap.Modal(document.getElementById('attendanceModal'));
        modal.show();
    };
    const convertToDateTime = (date) => {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        return `${date} ${hours}:${minutes}:${seconds}`;
    };


    const handleToggleStatus = (studentCode, date) => {
        const dateTime = convertToDateTime(date);
        const ctd = (date) => {
            return new Date(date).toISOString().split("T")[0]
        }
        setAttendanceStudentDetails((prevDetails) =>
            prevDetails.map((student) => {
                if (student.student_code === studentCode && ctd(student.date) === date) {
                    return {
                        ...student,
                        status: student.status === 'present' ? 'absent' : 'present',
                        date: dateTime,
                    };
                }
                return student;
            })
        );
    };


    const handleSaveAttendance = async () => {
        const updatedAttendance = attendanceStudentDetails.map(student => ({
            student_code: student.student_code,
            attendance: student.attendance
        }));

        try {
            const response = await axios.put('/teacher/attendances', { class_code: selectedClassCode, attendance: updatedAttendance });
            if (response.data.success) {
                toast.success('Lưu điểm danh thành công!');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error('Lưu điểm danh thất bại!');
        }
    };

    const toggleRow = (classCode) => {
        if (!attendanceData) {
            fetchAttendanceData(classCode);
        }
        setExpandedRows(prev => ({
            ...prev,
            [classCode]: !prev[classCode]
        }));
    };
    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        const formattedDate = new Date(dateString).toLocaleDateString('vi-VN', options);
        const dayOfWeek = new Date(dateString).toLocaleDateString('vi-VN', { weekday: 'long' });
        return `${formattedDate} - (${dayOfWeek})`;
    };

    return (
        <div>
            <div className="card" style={{ minHeight: '800px' }}>
                <div className="card-header">
                    <h4 className="card-title">Quản lý điểm danh</h4>
                </div>
                <div className="card-body">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Mã lớp</th>
                                <th>Tên lớp</th>
                                <th>Điểm danh</th>
                            </tr>
                        </thead>
                        <tbody>
                            {classes?.map((classItem) => (
                                <React.Fragment key={classItem.id}>
                                    <tr key={classItem.id}>
                                        <td>{classItem.class_code}</td>
                                        <td>{classItem.class_name}</td>
                                        <td>
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => toggleRow(classItem.class_code)}
                                            >
                                                Xem lịch điểm danh
                                            </button>
                                            <button
                                                className="btn btn-secondary ml-2"
                                                onClick={() => handleShowDetails(classItem, 'overview', '')}
                                            >
                                                Xem tổng quan
                                            </button>
                                        </td>
                                    </tr>
                                    {expandedRows[classItem.class_code] && (
                                        <tr className="nested-row">
                                            <td colSpan={3}>
                                                {!sortedDates ? '' : 
                                                    <div className='text-center'>
                                                        Chưa cập nhật lịch!!!
                                                    </div>
                                                }
                                                <div style={{ paddingLeft: '20px' }}>
                                                    {sortedDates?.map((date, index) => (
                                                        <button
                                                            key={index}
                                                            className="btn btn-success"
                                                            onClick={() => handleShowDetails(classItem, 'detail', date)}
                                                            style={{ marginRight: '10px', marginBottom: '5px' }}
                                                        >
                                                            <strong>{formatDate(date)}</strong>
                                                        </button>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>

                    <div className="modal fade" id="attendanceModal" tabIndex="-1" aria-labelledby="attendanceModalLabel" aria-hidden="true">
                        <div className="modal-dialog modal-xl">
                            <div className="modal-content" style={{ width: '100%' }}>
                                <div className="modal-header">
                                    <h5 className="modal-title strong text-lg">Bảng điểm danh {viewMode === 'detail' ? (`- Ngày ${formatDate(selectedDate)} - Lớp ${selectedClassCode}`) : (`- Lớp ${selectedClassCode}`)}</h5>
                                    <button type="button" className="close" onClick={() => setModalIsOpen(false)} aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body table-responsive">
                                    <table id='modalAttendanceTable' className="table">
                                        <thead>
                                            <tr>
                                                <th>Mã sinh viên</th>
                                                <th>Họ và tên</th>
                                                {viewMode === 'overview' && sortedDates.map((date, index) => (
                                                    <th key={index} className='text-center'>{formatDate(date)}</th>
                                                ))}
                                                {viewMode === 'detail' && <th className='text-center'>Trạng thái</th>}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {attendanceFormatData?.length > 0 ? (
                                                attendanceFormatData?.map((student, index) => (
                                                    <tr key={student.student_code}>
                                                        <td>{student.student_code}</td>
                                                        <td>{student.full_name}</td>
                                                        {viewMode === 'overview' ? (
                                                            sortedDates?.map((date) => (
                                                                <td key={date} className='text-center'>
                                                                    <div className="form-check form-switch d-flex align-items-center justify-content-center">
                                                                        <input className="form-check-input attendance-checkbox"
                                                                            type="checkbox"
                                                                            disabled
                                                                            style={{ transform: 'scale(1.5)' }}
                                                                            checked={student.attendance[date]?.status === 'present'}
                                                                        />
                                                                    </div>
                                                                </td>
                                                            ))
                                                        ) :
                                                            (
                                                                <td className="text-center">
                                                                    <div className="form-check form-switch d-flex align-items-center justify-content-center">
                                                                        <input className="form-check-input attendance-checkbox"
                                                                            type="checkbox"
                                                                            checked={student.attendance[selectedDate]?.status === 'present'}
                                                                            style={{ transform: 'scale(2.8)' }}
                                                                            onChange={() => handleToggleStatus(student.student_code, selectedDate)}
                                                                        />
                                                                    </div>
                                                                </td>
                                                            )
                                                        }
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr><td colSpan={3}>Không có dữ liệu điểm danh.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                                    {viewMode == 'detail' ?
                                        <button type="button" className="btn btn-primary" onClick={handleSaveAttendance}>Lưu</button>
                                        : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttendanceManagement;
