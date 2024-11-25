import React, { useEffect, useState } from 'react';
import 'datatables.net-dt/css/dataTables.dataTables.css';
import $ from 'jquery';
import 'datatables.net';
import api from '../../../config/axios';
import { useQuery } from '@tanstack/react-query';

const ShowStudentAttendance = () => {
    const [semesterCode, setSemesterCode] = useState('');
    const [semesterCodeDefault, setSemesterCodeDefault] = useState('');
    const [attendanceData, setAttendanceData] = useState([]);
    const [semesters, setSemesters] = useState([]);

    const { data, isLoading: isLoadingClasses, refetch } = useQuery({
        queryKey: ["LIST_CLASSES"],
        queryFn: async () => {
            const response = await api.get('/student/attendances', {
                params: { search: semesterCode }
            });
            setAttendanceData(response?.data?.attendances);
            setSemesters(response?.data?.semesters);
            setSemesterCodeDefault(response?.data?.semesterCode)
            console.log(response?.data);
            return res?.data;
        }
    });

    useEffect(() => {
        refetch();
    }, [semesterCode]);

    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    }

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
                    status: item.status === 'present'
                        ? "<strong class='text-green-500'>Có mặt</strong>"
                        : item.status === 'absent'
                            ? "<strong class='text-red-500'>Vắng</strong>"
                            : "<strong class='text-gray-500'>Chưa học</strong>",
                })),
                columns: [
                    {
                        title: "STT",
                        data: null,
                        render: (data, type, row, meta) => meta.row + meta.settings._iDisplayStart + 1
                    },
                    { title: "Trạng thái", data: "status" },
                    { title: "Ghi chú", data: "noted" },
                    { title: "Giảng viên", data: "full_name" },
                    {
                        title: "Ngày",
                        data: "date",
                        render: function (data) {
                            return formatDate(data);
                        }
                    },
                    {
                        title: "Ca học",
                        data: "cate_name",
                        render: (data) => data || ""
                    },
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
                            value={semesterCodeDefault}
                            onChange={(e) => setSemesterCode(e.target.value)}
                            className="form-control"
                        >
                            {semesters?.map((sem) => (
                                <option key={sem.cate_code} value={sem.cate_code}>
                                    {sem.cate_name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="card-body">
                    {isLoadingClasses ? (
                        <div className="loading-spinner text-center">
                            <div className='spinner-border' role='status'></div>
                            <p>Đang tải dữ liệu...</p>
                        </div>)
                        : ('')
                    }
                    {attendanceData?.map((classData, index) => (
                        <div key={index} className="attendance-table table-striped card-body border-spacing-3"
                            style={{ border: '2px solid #ccc', borderRadius: '8px', padding: '15px', margin: '20px 0' }}>
                            <div
                                className="d-flex justify-content-between align-items-center"
                                style={{ marginBottom: '10px' }}
                            >
                                <h3 className="strong" style={{ color: 'black' }}>
                                    #{index + 1} Lớp: {classData.class_name} - Môn: {classData.subject_name}
                                </h3>
                                <div>
                                    Vắng{' '}
                                    <span className="text-danger strong">
                                        {classData.total_absent}
                                    </span>{' '}
                                    / {classData.total_schedule ? classData.total_schedule : 0}
                                </div>
                            </div>
                            <div className="table-responsive">
                                <table id={`attendanceTable-${index}`} className="display" style={{ width: '100%' }}></table>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div >
    );
};

export default ShowStudentAttendance;
