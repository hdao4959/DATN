import React, { useState, useEffect } from 'react';
import 'datatables.net-dt/css/dataTables.dataTables.css';
import $ from 'jquery';
import 'datatables.net';
import { toast } from 'react-toastify';
import api from '../../../config/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const ShowGrades = () => {
    const [selectedGrade, setSelectedGrade] = useState(null);
    const queryClient = useQueryClient();
    const [idSelected, setIdSelected] = useState();

    const { data: classes, isLoading: isLoadingClasses } = useQuery({
        queryKey: ["LIST_CLASSES"],
        queryFn: async () => {
            const res = await api.get(`/admin/classrooms`);
            return res?.data;
        }
    });

    const { mutate } = useMutation({
        mutationFn: async (data) => {
            await api.put(`/admin/grades/${idSelected}`, data);
            console.log(data);

        },
        onSuccess: () => {
            toast.success("Chỉnh sửa thành công!");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra");
        },
    });

    const handleViewDetails = async (class_code) => {
        const modal = new window.bootstrap.Modal(document.getElementById('gradesModal'));
        modal.show();
        setIdSelected(class_code);
        const response = await api.get(`/admin/grades/cls102`);
        setSelectedGrade(response?.data);
    };

    const handleSaveClick = () => {
        mutate(selectedGrade);
    };

    useEffect(() => {
        if (classes) {
            $('#classesTable').DataTable({
                serverSide: true,
                processing: true,
                pageLength: 10,
                lengthMenu: [10, 20, 50, 100],
                language: {
                    paginate: {
                        previous: 'Trước',
                        next: 'Tiếp theo'
                    },
                    lengthMenu: 'Hiển thị _MENU_ mục mỗi trang',
                    info: 'Hiển thị từ <strong>_START_</strong> đến <strong>_END_</strong> trong <strong>_TOTAL_</strong> mục',
                    search: 'Tìm kiếm:'
                },
                destroy: true,
                data: classes,
                ajax: async (data, callback) => {
                    try {
                        const page = data.start / data.length + 1;
                        const response = await api.get(`/admin/attendances`, {
                            params: { page, per_page: data.length },
                        });

                        const result = response.data;

                        callback({
                            draw: data.draw,
                            recordsTotal: result.total,
                            recordsFiltered: result.total,
                            data: result.data,
                        });
                    } catch (error) {
                        console.error("Error fetching data:", error);
                    }
                },
                columns: [
                    { title: "Mã lớp", data: "class_code" },
                    { title: "Mã môn", data: "subject_code" },
                    { title: "Tên lớp", data: "class_name" },
                    { title: "Giảng viên", data: "user_code" },
                    {
                        title: "Điểm",
                        data: null,
                        render: (data, type, row) => {
                            return `<button class="view-details-button btn btn-success" data-id="${row.class_code}">
                                        <i class="fas fa-table"></i> Bảng điểm
                                    </button>`;
                        }
                    }
                ],
                scrollX: true,
                scrollY: true,
            });

            $('#classesTable tbody').off('click', '.view-details-button');
            $('#classesTable tbody').on('click', '.view-details-button', function () {
                const class_code = $(this).data('id');
                handleViewDetails(class_code);
            });
        }
    }, [classes]);

    useEffect(() => {
        if (selectedGrade) {
            const totalValue = selectedGrade?.students[0]?.scores?.reduce((total, score) => total + score.value, 0);

            $('#modalGradesTable').DataTable({
                pageLength: 10,
                lengthMenu: [10, 20, 50, 100],
                language: {
                    paginate: {
                        previous: 'Trước',
                        next: 'Tiếp theo'
                    },
                    lengthMenu: 'Hiển thị _MENU_ mục mỗi trang',
                    info: 'Hiển thị từ <strong>_START_</strong> đến <strong>_END_</strong> trong <strong>_TOTAL_</strong> mục',
                    search: 'Tìm kiếm:'
                },
                destroy: true,
                data: selectedGrade?.students?.map((student, index) => {
                    let totalScore = student.scores.reduce((sum, scoreSm) => {
                        const studentPoint = scoreSm?.score || 0;
                        const percentage = (scoreSm.value / totalValue) * 100;

                        return sum + (studentPoint * percentage / 100);
                    }, 0);
                    return {
                        stt: index + 1,
                        user_code: student.student_code,
                        student_name: student.name,
                        exam_scores: student.scores,
                        total_score: (totalScore ? totalScore.toFixed(2) : 0),
                        note: student.scores.map(score => score.note).join(', ')
                    };
                }),
                columns: [
                    { title: "STT", data: "stt", className: "text-center" },
                    { title: "Mã SV", data: "user_code", className: "text-center" },
                    { title: "Tên SV", data: "student_name", className: "text-center" },
                    ...selectedGrade?.students[0]?.scores.map((exam, index) => ([
                        {
                            title: `${exam.name} (${(exam.value) ? ((exam.value / totalValue) * 100).toFixed(2) : 0}%)`,
                            data: null,
                            render: function (data, type, row) {
                                const scoreData = row.exam_scores[index]?.score || 0;
                                return `<input type="number" value="${(scoreData ? scoreData : 0)}" min="0" max="10" class="form-control form-control-sm text-center score-input" data-index="${row.stt - 1}" data-exam-index="${index}" />`;
                            }, className: "text-center"
                        },
                        {
                            title: `Ghi chú`,
                            data: null,
                            render: function (data, type, row) {
                                const noteData = row.exam_scores[index]?.note || '';
                                return `
                                    <input 
                                        type="text"
                                        value="${noteData}" 
                                        class="form-control form-control-sm text-center note-input w-10" 
                                        data-index="${row.stt - 1}" 
                                        data-exam-index="${index}" 
                                        style="width: 80px"
                                    />
                                `;
                            }, className: "text-center"
                        }
                    ])).flat(),
                    { title: "Điểm Tổng", data: "total_score", className: "text-center" },
                ],
                scrollX: true,
                scrollY: true,
                rowCallback: function (row, data) {
                    if (data.total_score < 4) {
                        $(row).find('td').eq(1).css('color', 'red');
                        const totalColumns = data.exam_scores.length + 3;
                        $(row).find('td').eq(totalColumns).css('color', 'red');
                    }
                },
                initComplete: function () {
                    $('#modalGradesTable').css('text-transform', 'none');
                }
            });

            $('#modalGradesTable').on('change', '.score-input', function () {
                const rowIndex = $(this).data('index');
                const examIndex = $(this).data('exam-index');
                const newScore = parseFloat($(this).val());

                selectedGrade.students[rowIndex].scores[examIndex].score = newScore;
            });
        }
    }, [selectedGrade]);

    return (
        <div>
            <div className="card" style={{ minHeight: '800px' }}>
                <div className="card-header">
                    <h4 className="card-title">Quản lý Điểm số</h4>
                </div>
                <div className="card-body">
                    {isLoadingClasses ? (
                        <div className="loading-spinner">
                            <p>Đang tải dữ liệu...</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table id="classesTable" className="display"></table>
                            <div className="modal fade" id="gradesModal" tabIndex="-1" aria-labelledby="gradesModalLabel" aria-hidden="true">
                                <div className="modal-dialog modal-xl">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="gradesModalLabel">Bảng điểm</h5>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        {!selectedGrade && (
                                            <div className="modal-body">
                                                <p>Đang tải dữ liệu...</p>
                                            </div>
                                        )}
                                        <div className="modal-body">
                                            <div style={{ maxWidth: '100%', overflowX: 'auto' }}>
                                                <table id="modalGradesTable" className=" table-striped display no-uppercase"></table>
                                            </div>
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-success" onClick={handleSaveClick}>
                                                Lưu điểm
                                            </button>
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShowGrades;