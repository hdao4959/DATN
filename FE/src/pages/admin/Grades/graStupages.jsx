import React, { useEffect } from 'react';
import 'datatables.net-dt/css/dataTables.dataTables.css';
import $ from 'jquery';
import 'datatables.net';

const StudentGrades = () => {
    // Dữ liệu giả lập cho nhiều môn học
    const subjects = [
        {
            subject_name: 'Web Development',
            grades: [
                { name: 'Đánh giá Assignment GĐ 2', weight: 10, score: 9.0, note: '' },
                { name: 'Lab 5', weight: 3.5, score: 10.0, note: '' },
                { name: 'Quiz 5', weight: 1.5, score: 10.0, note: '' },
                { name: 'Bảo vệ Assignment', weight: 40, score: 8.0, note: '' },
                { name: 'Đánh giá Assignment GĐ 1', weight: 10, score: 7.0, note: '' },
            ]
        },
        {
            subject_name: 'Data Science',
            grades: [
                { name: 'Assignment 1', weight: 15, score: 8.0, note: '' },
                { name: 'Lab 1', weight: 5, score: 9.5, note: '' },
                { name: 'Quiz 1', weight: 2, score: 8.0, note: '' },
                { name: 'Final Project', weight: 40, score: 9.0, note: '' },
                { name: 'Lab 2', weight: 5, score: 10.0, note: '' },
            ]
        }
    ];

    useEffect(() => {
        subjects.forEach((_, index) => {
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
    }, [subjects]);

    const calculateAverage = (grades) => {
        const totalWeight = grades.reduce((sum, grade) => sum + grade.weight, 0);
        const weightedScoreSum = grades.reduce((sum, grade) => sum + (grade.score * grade.weight), 0);
        return (weightedScoreSum / totalWeight).toFixed(2);
    };

    return (
        <div>
            <div className="card" style={{ minHeight: '800px' }}>
                <div className="card-header">
                    <h4 className="card-title">Bảng Điểm</h4>
                </div>
                <div className="card-body">
                    {subjects?.map((subject, index) => {
                        const average = <strong className='text-red-500'>{calculateAverage(subject.grades)}</strong> || '';
                        const status = average < 5 ? <strong className='text-red-500'>Attendance Faile</strong> : <strong className='text-green-500'>Passed</strong> || '';
                        console.log(subject);

                        return (
                            <div className="card mb-4" key={index} style={{ border: '1px solid #ccc' }}>
                                <div className="card-header">
                                    <h5>{`Bảng điểm Môn: ${subject.subject_name}`}</h5>
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
                                            {subject?.grades?.map((grade, i) => (
                                                <tr key={i}>
                                                    <td>{i + 1}</td>
                                                    <td>{grade.name}</td>
                                                    <td>{grade.weight}</td>
                                                    <td>{grade.score}</td>
                                                    <td>{grade.note}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <td colspan={3} style={{ fontWeight: 'bold' }}>Trung bình: {average}</td>
                                                <td colspan={2} style={{ fontWeight: 'bold' }}>Trạng thái: {status}</td>
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
