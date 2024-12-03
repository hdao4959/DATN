import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../../config/axios';
import { toast } from 'react-toastify';

const AttendanceTeacherDate = () => {
    const { class_code, date } = useParams();
    const [attendanceDetails, setAttendanceDetails] = useState([]);

    const { refetch, isLoading } = useQuery({
        queryKey: ["ATTENDANCE", class_code, date],
        queryFn: async () => {
            // const res = [
            //     {
            //         student_code: "SV001",
            //         full_name: "Nguyễn Văn A",
            //         date: "2024-11-01",
            //         status: 'absent',
            //         noted: 'abc',
            //     },
            //     {
            //         student_code: "SV002",
            //         full_name: "Trần Thị B",
            //         date: "2024-11-01",
            //         noted: '',
            //         status: 'absent',
            //     },
            //     {
            //         student_code: "SV003",
            //         full_name: "Lê Minh C",
            //         date: "2024-11-01",
            //         noted: '',
            //         status: 'absent',
            //     },
            // ];
            const response = await api.get(/teacher/attendances/${class_code}/${date});
            const res = response?.data;

            const updatedAttendanceData = res.map((item) => ({
                ...item,
                status: item.status === null ? 'present' : item.status,
                class_code: class_code
            }));

            setAttendanceDetails(updatedAttendanceData);

            return updatedAttendanceData;
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
            const isAllDefault = attendanceDetails.every(student => student.status === 'present');
    
            const attendanceUpdates = attendanceDetails.map(student => ({
                ...student,
                student_code: student.student_code,
                class_code: class_code,
                date: student.date,
                status: student.status === null ? 'present' : student.status
            }));
    
            let response;
            if (isAllDefault) {
                response = await api.post(`/teacher/attendances/${class_code}`, attendanceUpdates );
            } else {
                response = await api.put(`/teacher/attendances/${class_code}`, attendanceUpdates );
            }
            if (response.status === 200) {
                toast.success("Cập nhật điểm danh thành công!");
                refetch(); 
            }
        } catch (error) {
            toast.error("Cập nhật điểm danh thất bại!");
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
                                {attendanceDetails?.map((student) => (
                                    <tr key={student.student_code}>
                                        <td>{student.student_code}</td>
                                        <td>{student.full_name}</td>
                                        <td>
                                            <div>
                                                <input type="text" className='form-control' name="" id="" value={student.noted}/>
                                            </div>
                                        </td>
                                        <td className="text-center">
                                            <div className="form-check form-switch d-flex align-items-center justify-content-center">
                                                <input
                                                    className="form-check-input attendance-checkbox btn-sm"
                                                    type="checkbox"
                                                    checked={student?.status === 'present'}
                                                    style={{ transform: 'scale(2.5)' }}
                                                    onChange={() => handleToggleStatus(student)}
                                                    disabled={isToday === false}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button className="btn btn-primary" style={{float: 'right'}} onClick={handleSave}>
                            <i className='fas fa-save'> Lưu Điểm Danh</i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttendanceTeacherDate;
