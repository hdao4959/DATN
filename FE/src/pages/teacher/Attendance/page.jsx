import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useQuery } from '@tanstack/react-query';
import api from '../../../config/axios';

const AttendanceTeacher = () => {
    const [selectedClassCode, setSelectedClassCode] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [attendanceStudentDetailsStatus, setAttendanceStudentDetailsStatus] = useState([]);
    const [attendanceStudentDetails, setAttendanceStudentDetails] = useState([]);
    const [viewMode, setViewMode] = useState("");
    const [expandedRows, setExpandedRows] = useState({});
    const [schedules, setSchedules] = useState([]);

    const { data: classes, isLoading: isLoadingClasses, refetch } = useQuery({
        queryKey: ["LIST_ATTENDANCE_CLASS"],
        queryFn: async () => {
            const response = await api.get(`/teacher/attendances`);
            return response?.data;
        }
    });

    const { data: attendanceData, refetch: fetchAttendanceData, isLoading: isLoadingAtt } = useQuery({
        queryKey: ["ATTENDANCE", selectedClassCode],
        queryFn: async () => {
            setSelectedClassCode(selectedClassCode);
            const response = await api.get(`/teacher/attendances/${selectedClassCode}/${selectedDate}`);
            const res = response?.data;
            setAttendanceStudentDetails(res);
            return res;
        },
        enabled: false
    });
    const { data: AllAttendance, refetch: fetchAllAttendanceData, isLoading: isLoadingAllAtt } = useQuery({
        queryKey: ["ALL_ATTENDANCE", selectedClassCode],
        queryFn: async () => {
            const response = await api.get(`/teacher/attendances/showAllAttendance/${selectedClassCode}`);
            const res = response?.data;
            return res;
        },
        enabled: false
    });
    function getAttendanceSchedule(classCode, classes) {
        const classData = classes?.find(cls => cls.class_code === classCode);

        if (!classData || !classData.schedules) return [];

        return classData.schedules
            .map(schedule => schedule.date)
            .sort((a, b) => new Date(a) - new Date(b));
    }
    useEffect(() => {
        const schedules = getAttendanceSchedule(selectedClassCode, classes);
        setSchedules(schedules);
    }, [selectedClassCode])

    const handleShowDetails = (classItem, mode, date) => {
        setViewMode(mode);
        setSelectedDate(date);
        mode === 'overview' ? (fetchAllAttendanceData()) : (fetchAttendanceData());
        setSelectedClassCode(classItem.class_code);
        const modal = new window.bootstrap.Modal(document.getElementById('attendanceModal'));
        modal.show();
    };

    const handleToggleStatus = (student) => {
        const attendance = student.attendance[0];
        const newStatus = attendance.status === 'present' ? 'absent' : 'present';
        const updatedAttendance = {
            student_code: student.student_code,
            class_code: selectedClassCode,
            date: attendance.date,
            status: newStatus,
            noted: attendance.noted || '',
        };

        setAttendanceStudentDetailsStatus((prevState) => {
            const existingIndex = prevState.findIndex(
                (item) => item.student_code === updatedAttendance.student_code && item.date === updatedAttendance.date
            );
            if (existingIndex !== -1) {
                const newState = [...prevState];
                newState[existingIndex] = updatedAttendance;
                return newState;
            } else {
                return [...prevState, updatedAttendance];
            }
        });

        setAttendanceStudentDetails((prevDetails) =>
            prevDetails.map((studentItem) => {
                if (studentItem.student_code === student.student_code) {
                    const updatedAttendance = {
                        ...studentItem.attendance[0],
                        status: studentItem.attendance[0].status === "present"
                            ? "absent"
                            : studentItem.attendance[0].status === "absent"
                            ? "present"
                            : "absent", // Nếu status ban đầu là null, gán "absent"
                        noted: studentItem.attendance[0].noted || "",
                    };
                    return {
                        ...studentItem,
                        attendance: [updatedAttendance],
                    };
                }
                return studentItem;
            })
        );
        
    };

    const handleSaveAttendance = async () => {
        const today = new Date().toISOString().split('T')[0];
        if (selectedDate !== today) {
            toast.error('Chỉ có thể cập nhật điểm danh trong thời gian cho phép!');
            return; 
        }
        try {
            const response = await api.put(`/teacher/attendances/${selectedClassCode}`, attendanceStudentDetailsStatus);
            if (response.data.success) {
                toast.success("Lưu điểm danh thành công!");
            } else {
                fetchAttendanceData();
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error('Lưu điểm danh thất bại!');
        }
    };

    const toggleRow = (classCode) => {
        setSelectedClassCode(classCode);
        fetchAllAttendanceData(classCode);
        setExpandedRows((prev) => (prev === classCode ? null : classCode));
    };
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

    return (
        <div>
            <div className="card" style={{ minHeight: "800px" }}>
                <div className="card-header">
                    <h4 className="card-title">Quản lý điểm danh</h4>
                </div>
                <div className="card-body">
                    {isLoadingClasses ? (
                        <div className="loading-spinner">
                            <div className='spinner-border' role='status'></div>
                            <p>Đang tải dữ liệu...</p>
                        </div>
                    ) : (
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Mã lớp</th>
                                    <th>Tên lớp</th>
                                    <th className='text-center'>Điểm danh</th>
                                </tr>
                            </thead>
                            <tbody>
                                {classes?.map((classItem) => (
                                    <React.Fragment key={classItem.id}>
                                        <tr key={classItem.id}>
                                            <td>{classItem.class_code}</td>
                                            <td>{classItem.class_name}</td>
                                            <td className='text-center text-nowrap'>
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
                                        {expandedRows == classItem.class_code && (
                                            <tr className="nested-row">
                                                <td colSpan={3}>
                                                    <div style={{ paddingLeft: '20px' }}>
                                                        {schedules?.map((date, index) => {
                                                            const isToday = new Date(date).toDateString() === new Date().toDateString();
                                                            // const isToday = true;
                                                            return (
                                                                <div key={index} className='' style={{ position: 'relative', display: 'inline-block', marginRight: '10px', marginBottom: '5px' }}>
                                                                    <button
                                                                        className={`btn btn-success ${isToday && 'border-5 border-success rounded'}`}
                                                                        onClick={() => handleShowDetails(classItem, 'detail', date)}
                                                                        style={{ position: 'relative', zIndex: 1 }}
                                                                    >
                                                                        <strong>{formatDate(date)}</strong>
                                                                    </button>
                                                                    {isToday && (
                                                                        <span
                                                                            style={{
                                                                                position: 'absolute',
                                                                                top: '-15px',
                                                                                right: '-5px',
                                                                                backgroundColor: 'red',
                                                                                color: 'white',
                                                                                padding: '2px 5px',
                                                                                fontSize: '10px',
                                                                                borderRadius: '5px',
                                                                                zIndex: 2,
                                                                            }}
                                                                        >
                                                                            Hôm nay
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}

                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    )}

                    <div
                        className="modal fade"
                        id="attendanceModal"
                        tabIndex="-1"
                        aria-labelledby="attendanceModalLabel"
                        aria-hidden="true"
                    >
                        <div className="modal-dialog modal-xl">
                            <div
                                className="modal-content"
                                style={{ width: "100%",minHeight: "100vh" }}
                            >
                                <div className="modal-header">
                                    <h5 className="modal-title strong text-lg">
                                        Bảng điểm danh{" "}
                                        {viewMode === "detail"
                                            ? `- Ngày ${formatDate(
                                                selectedDate
                                            )} - Lớp ${selectedClassCode}`
                                            : `- Lớp ${selectedClassCode}`}
                                    </h5>
                                    <button
                                        type="button"
                                        className="close"
                                        onClick={() => setModalIsOpen(false)}
                                        aria-label="Close"
                                    >
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body table-responsive">
                                    {(isLoadingAtt || isLoadingAllAtt) ? (
                                        <div className="loading-spinner">
                                            <div className='spinner-border' role='status'></div>
                                            <p>Đang tải dữ liệu...</p>
                                        </div>
                                    ) : (
                                        <table id='modalAttendanceTable' className="table">
                                            <thead>
                                                <tr>
                                                    <th>Mã sinh viên</th>
                                                    <th>Họ và tên</th>
                                                    {viewMode === 'overview' && schedules.map((date, index) => (
                                                        <th key={index} className='text-center'>{formatDate(date)}</th>
                                                    ))}
                                                    {viewMode === 'detail' && <th className='text-center'>Trạng thái</th>}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {viewMode === 'overview' && AllAttendance?.map((student, index) => {
                                                    const attendanceByDate = student.attendance.reduce((acc, att) => {
                                                        acc[att.date] = att; 
                                                        return acc;
                                                    }, {});

                                                    return (
                                                        <tr key={student.student_code}>
                                                            <td>{student.student_code}</td>
                                                            <td>{student.full_name}</td>
                                                            {schedules?.map((date) => (
                                                                <td key={date} className="text-center">
                                                                    <div className="form-check form-switch d-flex align-items-center justify-content-center">
                                                                        <input
                                                                            className="form-check-input attendance-checkbox btn-sm"
                                                                            type="checkbox"
                                                                            disabled
                                                                            style={{ transform: 'scale(2.5)' }}
                                                                            checked={attendanceByDate[date]?.status === 'present'}
                                                                        />
                                                                    </div>
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    );
                                                })}

                                                {viewMode === 'detail' && attendanceStudentDetails?.map((student, index) => {
                                                    const isToday = new Date(student.attendance[0].date).toDateString() === new Date().toDateString();
                                                    // const isToday = true;
                                                    return (
                                                        <tr key={student.student_code}>
                                                            <td>{student.student_code}</td>
                                                            <td>{student.full_name}</td>
                                                            <td className="text-center">
                                                                <div className="form-check form-switch d-flex align-items-center justify-content-center">
                                                                    <input
                                                                        className="form-check-input attendance-checkbox btn-sm"
                                                                        type="checkbox"
                                                                        checked={student?.attendance[0]?.status === 'present'}
                                                                        style={{ transform: 'scale(2.5)' }}
                                                                        onChange={() => handleToggleStatus(student)}
                                                                        disabled={isToday === false}
                                                                    />
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        data-bs-dismiss="modal"
                                    >
                                        Đóng
                                    </button>
                                    {viewMode == "detail" ? (
                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            onClick={handleSaveAttendance}
                                        >
                                            Lưu
                                        </button>
                                    ) : (
                                        ""
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttendanceTeacher;
