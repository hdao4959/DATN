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
            // return [
            //     {
            //         "id": 68,
            //         "class_code": "MH015.1",
            //         "class_name": "Lớp MH015.k18.1",
            //         "score": null,
            //         "description": "Lớp học cho môn MH015",
            //         "is_active": true,
            //         "subject_code": "MH015",
            //         "user_code": null,
            //         "deleted_at": null,
            //         "created_at": "2024-10-31T18:43:46.000000Z",
            //         "updated_at": "2024-10-31T18:43:46.000000Z"
            //     },
            //     {
            //         "id": 69,
            //         "class_code": "MH015.2",
            //         "class_name": "Lớp MH015.k18.1",
            //         "score": null,
            //         "description": "Lớp học cho môn MH015",
            //         "is_active": true,
            //         "subject_code": "MH015",
            //         "user_code": null,
            //         "deleted_at": null,
            //         "created_at": "2024-10-31T18:43:46.000000Z",
            //         "updated_at": "2024-10-31T18:43:46.000000Z"
            //     },
            // ]
        }
    });
    const { data: attendanceData, refetch: fetchAttendanceData } = useQuery({
        queryKey: ["ATTENDANCE", selectedClassCode],
        queryFn: async () => {
            const response = await api.get(`/teacher/attendances/${selectedClassCode}`);
            setAttendanceStudentDetails(response?.data);
            return response?.data;
            // const response = [
            //     {
            //         "id": 3,
            //         "student_code": "student04",
            //         "full_name": "Student 4",
            //         "class_code": "MH001.1",
            //         "date": "2024-11-01 09:02:36",
            //         "status": "present",
            //         "noted": "Test"
            //     },
            //     {
            //         "id": 4,
            //         "student_code": "student04",
            //         "full_name": "Student 4",
            //         "class_code": "MH001.1",
            //         "date": "2024-11-02 09:02:36",
            //         "status": "present",
            //         "noted": "Test"
            //     },
            //     {
            //         "id": 5,
            //         "student_code": "student05",
            //         "full_name": "Student 5",
            //         "class_code": "MH001.1",
            //         "date": "2024-11-01 01:02:36",
            //         "status": "absent",
            //         "noted": "Test"
            //     },
            //     {
            //         "id": 5,
            //         "student_code": "student05",
            //         "full_name": "Student 5",
            //         "class_code": "MH001.1",
            //         "date": "2024-11-02 01:02:36",
            //         "status": "absent",
            //         "noted": "Test"
            //     },
            //     {
            //         "id": 5,
            //         "student_code": "student04",
            //         "full_name": "Student 5",
            //         "class_code": "MH001.1",
            //         "date": "2024-11-08 01:02:36",
            //         "status": "absent",
            //         "noted": "Test"
            //     },
            //     {
            //         "id": 5,
            //         "student_code": "student04",
            //         "full_name": "Student 5",
            //         "class_code": "MH001.1",
            //         "date": "2024-11-09 01:02:36",
            //         "status": "absent",
            //         "noted": "Test"
            //     },
            //     {
            //         "id": 5,
            //         "student_code": "student04",
            //         "full_name": "Student 5",
            //         "class_code": "MH001.1",
            //         "date": "2024-11-07 01:02:36",
            //         "status": "absent",
            //         "noted": "Test"
            //     },
            //     {
            //         "id": 5,
            //         "student_code": "student04",
            //         "full_name": "Student 5",
            //         "class_code": "MH001.1",
            //         "date": "2024-11-06 01:02:36",
            //         "status": "absent",
            //         "noted": "Test"
            //     },
            //     {
            //         "id": 5,
            //         "student_code": "student04",
            //         "full_name": "Student 5",
            //         "class_code": "MH001.1",
            //         "date": "2024-11-11 01:02:36",
            //         "status": "absent",
            //         "noted": "Test"
            //     },
            //     {
            //         "id": 5,
            //         "student_code": "student04",
            //         "full_name": "Student 5",
            //         "class_code": "MH001.1",
            //         "date": "2024-11-12 01:02:36",
            //         "status": "absent",
            //         "noted": "Test"
            //     },
            // ]
            // setAttendanceStudentDetails(response);
            // return response;
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
