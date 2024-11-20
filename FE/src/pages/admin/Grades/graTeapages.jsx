import React, { useState, useEffect } from 'react';
import 'datatables.net-dt/css/dataTables.dataTables.css';
import $ from 'jquery';
import 'datatables.net';
import { toast } from 'react-toastify';
import api from '../../../config/axios';
import { useMutation, useQuery } from '@tanstack/react-query';

const ShowGradesTeacher = () => {
    const [selectedGrade, setSelectedGrade] = useState([]);
    const [idSelected, setIdSelected] = useState();
    const [isTableLoading, setIsTableLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false)

    const { data: classes, isLoading: isLoadingClasses } = useQuery({
        queryKey: ["LIST_CLASSES"],
        queryFn: async () => {
            const res = await api.get(`/teacher/grades`);
            console.log(res?.data);

            return res?.data;
        }
    });

    const { mutate } = useMutation({
        mutationFn: async (data) => {
            await api.put(`/teacher/grades/${idSelected}`, data.score);
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
        setIsModalOpen(true);
        const response = await api.get(`/teacher/grades/${class_code}`);
        setSelectedGrade(response?.data);
    };

    const handleSaveClick = () => {
        mutate(selectedGrade);
    };

    const handleModalClose = () => {
        setSelectedGrade([]);
        setIsModalOpen(false);
    };

    useEffect(() => {
        if (classes) {
            $('#classesTable').DataTable({
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
                columns: [
                    { title: "Mã lớp", data: "class_code" },
                    { title: "Mã môn", data: "subject_code" },
                    { title: "Tên lớp", data: "class_name" },
                    // { title: "Phòng học", data: "room_code" },
                    // { title: "Ca học", data: "section" },
                    // { title: "Giảng viên", data: "user_code" },

                    {
                        title: "Điểm",
                        data: null,
                        render: (data, type, row) => {
                            return `<button class="view-details-button btn btn-success" data-id="${row.class_code}">
                                        <i class="fas fa-table"></i> Bảng điểm
                                    </button>`;
                        }
                    }
                ]
            });

            $('#classesTable tbody').off('click', '.view-details-button');
            $('#classesTable tbody').on('click', '.view-details-button', function () {
                const class_code = $(this).data('id');
                handleViewDetails(class_code);
            });
        }
    }, [classes]);

    const calculateAverageScore = (studentScores, totalValue) => {
        return studentScores.reduce((total, scoreItem) => {
            const score = scoreItem?.score || 0;
            const percentage = (scoreItem?.value || 0) / totalValue;
            return total + score * percentage;
        }, 0).toFixed(2);
    };

    useEffect(() => {
        if (isModalOpen && selectedGrade && selectedGrade.score?.length > 0) {
            if ($.fn.dataTable.isDataTable('#modalGradesTable')) {
                $('#modalGradesTable').DataTable().clear().destroy();
            }
            setIsTableLoading(true);

            if (!(selectedGrade == [])
                && selectedGrade?.score?.length > 0
            ) {
                const totalValue = selectedGrade?.score[0]?.scores?.reduce((total, score) => total + score.value, 0);
                if (!$.fn.dataTable.isDataTable(`#modalGradesTable`)) {
                    setIsTableLoading(true);
                    console.log(isTableLoading);

                    $(`#modalGradesTable`).DataTable({
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
                        data: selectedGrade?.score?.map((student, index) => {
                            // let totalScore = student.scores.reduce((sum, scoreItem) => {
                            //     const studentPoint = scoreItem?.score || 0;
                            //     const percentage = (scoreItem.value / totalValue) * 100;
                            //     return sum + (studentPoint * percentage / 100);
                            // }, 0);
                            // console.log(selectedGrade);

                            return {
                                stt: index + 1,
                                student_code: student.student_code,
                                student_name: student.student_name,
                                scores: student.scores,
                                // total_score: (totalScore ? totalScore.toFixed(2) : 0),
                                average_score: student.average_score,
                                note: student.scores.map(score => score.note).join(', ')
                            };
                        }),
                        columns: [
                            { title: "STT", data: "stt", defaultContent: '', className: "text-center" },
                            { title: "Mã SV", data: "student_code", defaultContent: '', className: "text-center" },
                            { title: "Tên SV", data: "student_name", defaultContent: '', className: "text-center" },
                            ...selectedGrade?.score[0]?.scores.map((exam, index) => [
                                {
                                    title: `${exam.name} (${(exam.value) ? ((exam.value / totalValue) * 100).toFixed(2) : 0}%)`,
                                    data: null,
                                    render: function (data, type, row) {
                                        const scoreData = row.scores[index]?.score || 0;
                                        return `<input type="number" 
                                                    value="${(scoreData ? scoreData : 0)}" 
                                                    min="0" 
                                                    max="10" 
                                                    class="form-control form-control-sm text-center score-input" 
                                                    data-index="${row.stt - 1}" 
                                                    data-exam-index="${index}" 
                                                    oninput="this.value = Math.min(Math.max(this.value, 0), 10)"
                                                />
                                        `;
                                    }, className: "text-center"
                                },
                                {
                                    title: `Ghi chú`,
                                    data: null,
                                    render: function (data, type, row) {
                                        const noteData = row.scores[index]?.note || '';
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
                            ]).flat(),
                            {
                                title: "Điểm Tổng", data: "average_score", className: "text-center",
                                render: (data) => `<strong>${data || 0}</strong>`
                            },
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
                        initComplete: () => setIsTableLoading(false)

                    });
                    setIsTableLoading(false);
                    $('#modalGradesTable').on('change', '.score-input', function () {
                        const rowIndex = $(this).data('index');
                        const examIndex = $(this).data('exam-index');
                        const newScore = parseFloat($(this).val()) || 0;
                        selectedGrade.score[rowIndex].scores[examIndex].score = newScore;

                        const totalValue = selectedGrade.score[rowIndex].scores.reduce((sum, scoreItem) => sum + (scoreItem?.value || 0), 0);
                        const averageScore = calculateAverageScore(selectedGrade.score[rowIndex].scores, totalValue);
                        console.log(averageScore);
                        
                        selectedGrade.score[rowIndex].average_score = parseFloat(averageScore).toFixed(2);

                        // const dataTable = $('#modalGradesTable').DataTable();
                        // dataTable.row(rowIndex).data(selectedGrade.score[rowIndex]).draw(false);
                    });
                }
            } else {
                toast.error("Chưa có dữ liệu");
                setIsTableLoading(true);

            }
        }

        return () => {
            $('#modalGradesTable').DataTable().clear().destroy();
        };
    }, [selectedGrade, isTableLoading]);


    return (
        <div>
            <div className="card" style={{ minHeight: '800px' }}>
                <div className="card-header">
                    <h4 className="card-title">Quản lý điểm số</h4>
                </div>
                <div className="card-body">
                    {isLoadingClasses ? (
                        <div className="loading-spinner">
                            <div className='spinner-border' role='status'></div>
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
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleModalClose} ></button>
                                        </div>
                                        {(selectedGrade == [] && selectedGrade?.scores == [] || isTableLoading) ? (
                                            <div className="modal-body">
                                                <div className='spinner-border' role='status'></div>
                                                <p>Đang tải dữ liệu...</p>
                                            </div>
                                        ) : (
                                            <div className="modal-body">
                                                <div style={{ maxWidth: '100%' }}>
                                                    <table id={`modalGradesTable`} className="display table-tripped"></table>
                                                </div>
                                            </div>
                                        )}
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-success" onClick={handleSaveClick}>
                                                Lưu điểm
                                            </button>
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleModalClose} >Đóng</button>
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

export default ShowGradesTeacher;
