
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useQuery } from '@tanstack/react-query';
import api from '../../../config/axios';


const AttendanceTeacher = () => {
    const [selectedClassCode, setSelectedClassCode] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);

    const [attendanceStudentDetails, setAttendanceStudentDetails] = useState([]);
    const [attendanceStudentDetailsStatus, setAttendanceStudentDetailsStatus] = useState([]);

    const [attendanceFormatData, setAttendanceFormatData] = useState([]);
    const [sortedDates, setSortedDates] = useState([]);
    const [viewMode, setViewMode] = useState("");
    const [expandedRows, setExpandedRows] = useState({});

    const { data: classes, isLoading: isLoadingClasses, refetch } = useQuery({
        queryKey: ["LIST_CLASSES"],
        queryFn: async () => {
            // const response = await api.get(`/teacher/attendances`);
            // return response?.data?.data;
            return [
                {
                    "id": 105,
                    "class_code": "k18_MH107.1",
                    "class_name": "Lớp MH107.1",
                    "score": null,
                    "description": "Lớp học cho môn MH107",
                    "is_active": true,
                    "subject_code": "MH107",
                    "user_code": "TC969",
                    "deleted_at": null,
                    "created_at": "2024-11-03T19:03:34.000000Z",
                    "updated_at": "2024-11-03T19:03:34.000000Z"
                },
                {
                    "id": 121,
                    "class_code": "_MH001.1",
                    "class_name": "Lớp MH001.1",
                    "score": "[{\"scores\": [{\"name\": \"Lab1\", \"note\": \"abc\", \"score\": 8, \"value\": 4}, {\"name\": \"Lab2\", \"note\": \"123\", \"score\": 9, \"value\": 4}], \"student_code\": \"student04\", \"student_name\": \"Student 4\", \"average_score\": \"8.5\"}, {\"scores\": [{\"name\": \"Lab1\", \"note\": null, \"score\": 7, \"value\": 4}, {\"name\": \"Lab2\", \"note\": null, \"score\": 9, \"value\": 4}], \"student_code\": \"student05\", \"student_name\": \"Student 5\", \"average_score\": \"8\"}]",
                    "description": "Lớp học cho môn MH001",
                    "is_active": true,
                    "subject_code": "MH001",
                    "user_code": "TC969",
                    "deleted_at": null,
                    "created_at": "2024-11-03T19:03:46.000000Z",
                    "updated_at": "2024-11-03T19:03:46.000000Z"
                },
                {
                    "id": 142,
                    "class_code": "k18_MH009.1",
                    "class_name": "NodeJsxzzzz",
                    "score": null,
                    "description": null,
                    "is_active": true,
                    "subject_code": "MH009",
                    "user_code": "TC969",
                    "deleted_at": null,
                    "created_at": "2024-11-18T09:34:04.000000Z",
                    "updated_at": "2024-11-18T09:34:04.000000Z"
                }
            ]
        }

    });

    const { data: attendanceData, refetch: fetchAttendanceData, isLoading: isLoadingAtt } = useQuery({
        queryKey: ["ATTENDANCE", selectedClassCode],
        queryFn: async () => {
            // const selectedClassCode = queryKey[1];
            // console.log(selectedClassCode);

            const response = await api.get(`/teacher/attendances/${selectedClassCode}`);
            const res = response?.data;
            console.log(res);

            // let attendanceDataConvert = [];

            if (Array.isArray(res) && res.length > 0) {
                const attendance = res[0];
                let attendanceDataConvert = [];
                if (Array.isArray(attendance.users) && Array.isArray(attendance.schedules)) {
                    attendance.users.forEach(user => {
                        attendance.schedules.forEach(date => {
                            const existingRecord = attendanceDataConvert.find(record => record.student_code === user.student_code && record.date === date);
                            if (!existingRecord) {
                                attendanceDataConvert.push({
                                    student_code: user.student_code,
                                    full_name: user.full_name,
                                    class_code: attendance.class_code,
                                    date: date,
                                    status: 'pabsent', 
                                    noted: 'No issue',
                                });
                            }
                        });
                    });
                }
                console.log('Converted Data:', attendanceDataConvert);
                setAttendanceStudentDetails(attendanceDataConvert);
                // return attendanceDataConvert;
            } else {
                console.error('Invalid data structure:', res);
                // return [];
            }

            // setAttendanceStudentDetails(attendanceDataConvert);
            return response?.data;
        },
        enabled: false

    });
    useEffect(() => {
        fetchAttendanceData();
    }, [selectedClassCode])

    useEffect(() => {
        setAttendanceStudentDetailsStatus(attendanceStudentDetails);
    }, [attendanceStudentDetails])

    useEffect(() => {
        const students = {};
        if (attendanceStudentDetails && attendanceStudentDetails != []) {
            attendanceStudentDetails?.forEach(record => {
                const { student_code, full_name, date, status, noted } = record;
                if (!date) return "N/A";
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
        }
    }, [attendanceData, attendanceStudentDetails])


    const handleShowDetails = (classItem, mode, date) => {
        setViewMode(mode);
        setSelectedDate(date);
        setSelectedClassCode(classItem.class_code);
        fetchAttendanceData();
        console.log(selectedClassCode);

        const modal = new window.bootstrap.Modal(document.getElementById('attendanceModal'));

        modal.show();
    };
    const convertToDateTime = (date) => {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const seconds = String(now.getSeconds()).padStart(2, "0");

        return `${date} ${hours}:${minutes}:${seconds}`;
    };

    const handleToggleStatus = (studentCode, date) => {
        const dateTime = convertToDateTime(date);
        const ctd = (date) => {
            return new Date(date).toISOString().split("T")[0];
        };
        setAttendanceStudentDetails((prevDetails) =>
            prevDetails.map((student) => {
                if (
                    student.student_code === studentCode &&
                    ctd(student.date) === date
                ) {
                    return {
                        ...student,
                        status:
                            student.status === "present" ? "absent" : "present",
                        date: dateTime,
                    };
                }
                return student;
            })
        );
    };

    const handleSaveAttendance = async () => {
        const updatedAttendance = attendanceStudentDetails.map((student) => ({
            student_code: student.student_code,
            attendance: student.attendance,
        }));

        try {

            console.log(attendanceStudentDetails);

            const response = await api.put(`/teacher/attendances/${selectedClassCode}`, attendanceStudentDetails);

            if (response.data.success) {
                toast.success("Lưu điểm danh thành công!");
            } else {
                fetchAttendanceData();
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error('Lưu điểm danh thất bại!');
            console.log(error);


        }
    };

    const toggleRow = (classCode) => {
        if (!attendanceData) {
            fetchAttendanceData(classCode);
        }
        setExpandedRows((prev) => ({
            ...prev,
            [classCode]: !prev[classCode],
        }));
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
                                            <td className='text-center'>
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
                                style={{ width: "100%" }}
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
                                    {isLoadingAtt ? (
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
                                                                            <input className="form-check-input attendance-checkbox btn-sm"
                                                                                type="checkbox"
                                                                                disabled
                                                                                style={{ transform: 'scale(2.5)' }}
                                                                                checked={student.attendance[date]?.status === 'present'}
                                                                            />
                                                                        </div>
                                                                    </td>
                                                                ))
                                                            ) :
                                                                (
                                                                    <td className="text-center">
                                                                        <div className="form-check form-switch d-flex align-items-center justify-content-center">
                                                                            <input className="form-check-input attendance-checkbox btn-sm"
                                                                                type="checkbox"
                                                                                checked={student.attendance[selectedDate]?.status === 'present'}
                                                                                style={{ transform: 'scale(2.5)' }}
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
