import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../../config/axios';
import { toast } from 'react-toastify';

const AttendanceTeacherDate = () => {
    const { class_code, date } = useParams();
    const [attendanceDetails, setAttendanceDetails] = useState([]);

    const { data: att, refetch, isLoading } = useQuery({
        queryKey: ["ATTENDANCE", class_code, date],
        queryFn: async () => {
            const response = await api.get(`/teacher/attendances/${class_code}/${date}`);
            const res = response?.data;
            const formattedData = res?.flatMap(item =>
                item.attendance.map(att => ({
                    student_code: item.student_code,
                    full_name: item.full_name || "",
                    status: att.status || null,
                    noted: att.noted || ""
                }))
            );
            setAttendanceDetails(formattedData || []);
            return res;     
        },
    });

    const handleToggleStatus = (student) => {
        const newStatus = student.status === 'present' ? 'absent' : 'present';

        setAttendanceDetails((prevDetails) =>
            prevDetails.map((studentItem) => {
                if (studentItem.student_code === student.student_code) {
                    return {
                        ...studentItem,
                        status: newStatus,
                    };
                }
                return studentItem;
            })
        );
    };

    const handleSave = async () => {
        try {
            let response;
            response = await api.put(`/teacher/attendances/${class_code}`, attendanceDetails);
            if (response.status === 200) {
                toast.success("Cập nhật điểm danh thành công!");
                refetch();
            } else {
                toast.error(response?.data?.message);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Cập nhật điểm danh thất bại!");
        }
    };

    const isToday = new Date(date).toDateString() === new Date().toDateString();
    // const isToday = true;
    const totalStudents = attendanceDetails.length;
    const presentCount = attendanceDetails.filter(student => student.status === 'present').length;
    const absentCount = attendanceDetails.filter(student => student.status === 'absent').length;

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const [year, month, day] = dateString.split("-");
        return `${day}/${month}/${year}`;
    };
    const hasUpdates = attendanceDetails.some((student) => {
        const originalStatus = att.find(item => item.student_code === student.student_code)?.attendance[0]?.status;

        // Lấy giờ bắt đầu và giờ kết thúc của ca học
        const sessionStart = att.find(item => item.student_code === student.student_code)?.session?.start || '00:00';
        const sessionEnd = att.find(item => item.student_code === student.student_code)?.session?.end || '00:00';

        // Chuyển đổi giờ ca học và giờ hiện tại
        const currentTime = new Date();
        const [startHour, startMinute] = sessionStart.split(":").map(Number);
        const [endHour, endMinute] = sessionEnd.split(":").map(Number);

        const sessionStartDate = new Date(currentTime.setHours(startHour, startMinute, 0, 0));
        const sessionEndDate = new Date(currentTime.setHours(endHour, endMinute, 0, 0));

        // Kiểm tra thời gian hiện tại so với giờ ca học
        const fifteenMinutesAfterStart = new Date(sessionStartDate.getTime() + 15 * 60000);

        // Nếu thời gian hiện tại đã qua giờ kết thúc hoặc quá 15 phút sau giờ bắt đầu, không cho phép thay đổi trạng thái từ absent thành present
        if (
            (originalStatus === 'absent' && student.status === 'present' && currentTime > fifteenMinutesAfterStart) ||
            currentTime > sessionEndDate
        ) {
            return true;
        }
        return (
            (originalStatus === 'absent' && student.status === 'present')
        );
    });

    const [timeRemaining, setTimeRemaining] = useState(15 * 60); // Thời gian đếm ngược 15 phút (tính bằng giây)
    const [isTimeUp, setIsTimeUp] = useState(false); // Kiểm tra nếu hết thời gian
    // const sessionStart = att[0]?.session?.start || '00:00';
    const sessionStart = att?.session?.start || '00:00';
    // const sessionStart = '18:30';
    useEffect(() => {
        // Tạo đối tượng Date từ chuỗi sessionStart kiểu '09:00'
        const [hours, minutes] = sessionStart.split(':');
        const startSessionTime = new Date();
        startSessionTime.setHours(hours, minutes, 0, 0); // Thiết lập giờ, phút và giây cho ngày hiện tại

        const fifteenMinutesAfterStart = new Date(startSessionTime.getTime() + 15 * 60000); // Thêm 15 phút vào giờ bắt đầu

        const interval = setInterval(() => {
            const currentTime = new Date();
            const timeDifference = (fifteenMinutesAfterStart - currentTime) / 1000; // Thời gian còn lại tính bằng giây

            if (timeDifference <= 0) {
                setIsTimeUp(true);
                setTimeRemaining(0);
                clearInterval(interval); // Dừng đếm ngược khi hết thời gian
            } else {
                setTimeRemaining(timeDifference);
            }
        }, 1000); // Cập nhật mỗi giây

        return () => clearInterval(interval); // Dọn dẹp interval khi component bị hủy
    }, [sessionStart]);

    // Chuyển đổi giây thành phút và giây
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = Math.floor(timeRemaining % 60);

    return (
        <div className="row">

            <div className="col-md-12">
                <div className="card">
                    <div className="card-header">
                        <div className="card-title text-center">Điểm danh Lớp {class_code}</div>
                        <strong>Ngày: {formatDate(date)}</strong>
                        <p className="text-danger">
                            1. Thời gian điểm danh giới hạn 15 phút kể từ thời gian ca học bắt đầu.
                        </p>
                        <p className="text-danger">
                            2. Trạng thái điểm danh mặc định là{" "}
                            <strong className="text-success">Có mặt</strong>.
                        </p>
                        <div className="d-flex justify-content-end">
                            <div className=''>
                                <strong>Sĩ số: <strong className='text-primary'>{totalStudents}</strong></strong>
                            </div>
                            <div className='ms-2'>
                                <strong>Có mặt: <strong className='text-success'>{presentCount}</strong></strong>
                            </div>
                            <div className='ms-2'>
                                <strong>Vắng: <strong className='text-danger'>{absentCount}</strong></strong>
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Mã sinh viên</th>
                                    <th>Họ tên</th>
                                    <th className='text-center w-80'>Ghi chú</th>
                                    <th className='text-center'>Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading && (
                                    <div className='text-center'>
                                        <div className='spinner-border' role='status'></div>
                                        <p>Đag tải dữ liệu</p>
                                    </div>
                                )}
                                {attendanceDetails?.map((student) => (
                                    <tr key={student.student_code}>
                                        <td>{student.student_code}</td>
                                        <td>{student.full_name}</td>
                                        <td>
                                            <div>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={student.noted || ""}
                                                    onChange={(e) => {
                                                        const newNote = e.target.value;
                                                        setAttendanceDetails((prevDetails) =>
                                                            prevDetails.map((studentItem) => {
                                                                if (studentItem.student_code === student.student_code) {
                                                                    return { ...studentItem, noted: newNote };
                                                                }
                                                                return studentItem;
                                                            })
                                                        );
                                                    }}
                                                />
                                            </div>
                                        </td>
                                        <td className="text-center">
                                            {/* <div className="form-check form-switch d-flex align-items-center justify-content-center">
                                                <input
                                                    className="form-check-input attendance-checkbox btn-sm"
                                                    type="checkbox"
                                                    checked={student?.status === 'present'}
                                                    style={{ transform: 'scale(2.5)' }}
                                                    onChange={() => handleToggleStatus(student)}
                                                    disabled={isToday === false}
                                                />
                                            </div> */}
                                            <label class="switch">
                                                <input type="checkbox"
                                                    checked={student?.status === 'present'}
                                                    onChange={() => handleToggleStatus(student)}
                                                    disabled={isToday === false}
                                                    style={{ transform: 'scale(3.5)' }} />
                                                <span class="slider"></span>
                                            </label>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <span>
                            {isTimeUp ? (
                                'Thời gian điểm danh đã hết'
                            ) : (
                                <>
                                    Thời gian còn lại: <strong className="text-danger">
                                        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                                    </strong>
                                </>
                            )}
                        </span>
                        <button
                            className="btn btn-primary"
                            style={{ float: 'right' }}
                            onClick={handleSave}
                            disabled={
                                hasUpdates ||
                                isToday === false}
                        >
                            <i className="fas fa-save"> Lưu Điểm Danh</i>
                        </button>
                    </div>
                </div>
            </div>
            <style>
                {`
                .switch {
                    position: relative;
                    display: inline-block;
                    width: 100px;
                    height: 34px;
                    }

                    .switch input { 
                    opacity: 0;
                    width: 0;
                    height: 0;
                    }

                    .slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: red;
                    transition: 0.4s;
                    }

                    .slider:before {
                    position: absolute;
                    display: flex; /* Thêm flexbox */
                    justify-content: center; /* Căn giữa theo chiều ngang */
                    align-items: center; /* Căn giữa theo chiều dọc */
                    // content: "Vắng";
                    content: "";
                    height: 26px;
                    width: 50px;
                    left: 4px;
                    bottom: 4px;
                    background-color: white;
                    transition: 0.4s;
                    }

                    input:checked + .slider {
                    background-color: green;
                    }

                    input:focus + .slider {
                    box-shadow: 0 0 1px #2196F3;
                    }

                    input:checked + .slider:before {
                    transform: translateX(40px);
                    // content: "Có mặt";
                    content: "";
                    }

                    /* Rounded sliders */
                    .slider.round {
                    border-radius: 34px;
                    }

                    .slider.round:before {
                    border-radius: 50%;
                    }
                `}
            </style>
        </div>
    );
};

export default AttendanceTeacherDate;
