import React, { useEffect, useState } from 'react';
import 'datatables.net-dt/css/dataTables.dataTables.css';
import $ from 'jquery';
import 'datatables.net';
import api from '../../../config/axios';

const ShowStudentAttendance = () => {
    const [semesterCode, setSemesterCode] = useState(''); 
    const [attendanceData, setAttendanceData] = useState([]);
    const [semesters, setSemesters] = useState([]); 

    const fetchAttendances = async () => {
        try {
            // setLoading(true);
            const response = await api.get('/student/attendances', {
                params: { search: semesterCode }
            });
            setAttendanceData(response?.data?.attendances);
            setSemesters(response?.data?.semesters);
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu:', error);
        } finally {
            // setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendances();
    }, []);

    useEffect(() => {
        attendanceData.forEach((subjectData, index) => {
            $(`#attendanceTable-${index}`).DataTable({
                pageLength: 10,
                lengthMenu: [10, 20, 50],
                language: {
                    paginate: { previous: 'Trước', next: 'Tiếp theo' },
                    lengthMenu: 'Hiển thị _MENU_ mục mỗi trang',
                    info: 'Hiển thị từ _START_ đến _END_ trong _TOTAL_ mục',
                    search: 'Tìm kiếm:'
                },
                destroy: true,
                data: subjectData.attendance.map((item) => ({
                    ...item,
                    status: item.status === 1 ? `<strong class='text-green-500'>Có mặt</strong>` : `<strong class='text-red-500'>Vắng</strong>`,
                })),
                columns: [
                    {
                        title: "STT",
                        data: null,
                        render: (data, type, row, meta) => meta.row + meta.settings._iDisplayStart + 1
                    },
                    { title: "Mã sinh viên", data: "student_code" },
                    { title: "Trạng thái", data: "status" },
                    { title: "Ghi chú", data: "noted" },
                    { title: "Giảng viên", data: "teacher_name" },
                    { title: "Buổi học", data: "session_cate_name" }
                ],
                scrollX: true,
                scrollY: true,
            });
        });

        // return () => {
        //     attendanceData.forEach((_, index) => {
        //         $(`#attendanceTable-${index}`).DataTable().destroy(true);
        //     });
        // };
    }, [attendanceData]);

    return (
        <div>
            <div className="card" style={{ minHeight: '800px' }}>
                <div className="card-header">
                    <h4 className="card-title">Điểm danh</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <select
                            value={semesterCode}
                            onChange={(e) => setSemesterCode(e.target.value)}
                            className="form-control"
                        >
                            <option value="">Chọn kỳ học</option>
                            {semesters.map((sem) => (
                                <option key={sem.cate_code} value={sem.cate_code}>
                                    {sem.cate_name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                {attendanceData ? (
                    <div className='text-center'>Chưa có dữ liệu</div>
                ): ('')}
                <div className="">
                    {attendanceData.map((classData, index) => (
                        <div key={index} className="attendance-table table-striped card-body border-spacing-3"
                            style={{ border: '2px solid #ccc', borderRadius: '8px', padding: '15px', margin: '20px 0' }}>
                            <h3 className='strong' style={{ color: 'black', marginBottom: '10px' }}>
                                #{index + 1} Lớp: {classData.class_name} - Môn: {classData.subject_name}
                            </h3>
                            <div className="table-responsive">
                                <table id={`attendanceTable-${index}`} className="display" style={{ width: '100%' }}></table>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ShowStudentAttendance;
