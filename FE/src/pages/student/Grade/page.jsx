import React, { useEffect, useState } from 'react';
import 'datatables.net-dt/css/dataTables.dataTables.css';
import $ from 'jquery';
import 'datatables.net';
import api from '../../../config/axios';
import { useQuery } from '@tanstack/react-query';

const StudentGrades = () => {
    const [subjects, setSubjects] = useState([]);
    const [semesterCode, setSemesterCode] = useState('');
    const [semesterCodeDefault, setSemesterCodeDefault] = useState('');
    const [semesters, setSemesters] = useState([]);
    const { data, isLoading: isLoadingClasses, refetch } = useQuery({
        queryKey: ["LIST_CLASSES"],
        queryFn: async () => {
            console.log(semesterCode);

            const res = await api.get(`/student/grades`, {
                params: { search: semesterCode }
            });
            setSubjects(res?.data?.data || []);
            setSemesters(res?.data?.semesters);
            setSemesterCodeDefault(res?.data?.semesterCode);
            return res?.data;
        }
    });

    useEffect(() => {
        refetch();
    }, [semesterCode]);

    useEffect(() => {
        subjects?.forEach((_, index) => {
            // // Hủy bảng cũ trước khi tạo lại
            // if ($(`#gradesTable${index}`).DataTable()) {
            //     $(`#gradesTable${index}`).DataTable().clear().destroy();
            // }
            // Tạo bảng mới
            $(`#gradesTable${index}`).DataTable({
                pageLength: 10,
                lengthMenu: [10, 20, 50, 100],
                searching: false,
                language: {
                    paginate: {
                        previous: 'Trước',
                        next: 'Tiếp theo'
                    },
                    lengthMenu: 'Hiển thị _MENU_ mục mỗi trang',
                    info: 'Hiển thị từ <strong>_START_</strong> đến <strong>_END_</strong> trong <strong>_TOTAL_</strong> mục',
                },
                destroy: true
            });
        });
    }, [subjects, semesterCode]);

    const calculateAverage = (score) => {
        const totalWeight = score?.scores?.reduce((sum, scores) => sum + scores.value, 0);
        const valueedScoreSum = score?.scores?.reduce((sum, scores) => sum + (scores.score * scores.value), 0);
        return (valueedScoreSum / totalWeight).toFixed(2);
    };

    return (
        <div>
            <div className="card" style={{ minHeight: '800px' }}>
                <div className="card-header">
                    <h4 className="card-title">Bảng điểm</h4>
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
                    {subjects?.map((subject, index) => {
                        let average = Number(calculateAverage(subject.score));
                        if (Number.isNaN(average)) {
                            average = 0;
                        }
                        const averageFormat = <strong className='text-red-500'>{average}</strong> || '';
                        const status = (average < 5) ? <strong className='text-red-500'>Attendance Faile</strong> : <strong className='text-green-500'>Passed</strong> || '';
                        return (
                            <div className="card mb-4" key={index} style={{ border: '1px solid #ccc' }}>
                                <div className="card-header">
                                    <h5>{`Bảng điểm Môn: ${subject.subject_name} - ${subject.subject_code}`}</h5>
                                </div>
                                <div className="card-body">
                                    <table id={`gradesTable${index}`} className="table table-bordered table-striped">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Tên đầu điểm</th>
                                                <th>Trọng số</th>
                                                <th>Điểm</th>
                                                <th>Ghi chú</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {subject?.score?.scores?.map((scores, i) => (
                                                <tr key={i}>
                                                    <td>{i + 1}</td>
                                                    <td>{scores.name}</td>
                                                    <td>{scores.value}</td>
                                                    <td>{scores.score}</td>
                                                    <td>{scores.note}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <td colSpan={3} style={{ fontWeight: 'bold' }}>Trung bình: {averageFormat}</td>
                                                <td colSpan={2} style={{ fontWeight: 'bold' }}>Trạng thái: {status}</td>
                                            </tr>
                                        </tfoot>

                                    </table>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default StudentGrades;
