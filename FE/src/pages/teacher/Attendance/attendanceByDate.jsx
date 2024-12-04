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
            const response = await api.get(`/teacher/attendances/${class_code}/${date}`);
            const res = response?.data;

            setAttendanceDetails(res);

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
            response = await api.put(`/teacher/attendances/${class_code}`, attendanceUpdates);
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
    const hasUpdates = attendanceDetails.some(
        (student) => student.status !== 'present' || student.noted
    );



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
                                                <input type="text" className='form-control' name="" id="" value={student.noted} />
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
                        <button
                            className="btn btn-primary"
                            style={{ float: 'right' }}
                            onClick={handleSave}
                            disabled={
{/*                             !hasUpdates || */}
                            !isToday}
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
