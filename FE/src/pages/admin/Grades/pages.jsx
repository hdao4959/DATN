import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../../config/axios";
import { toast } from "react-toastify";
import "datatables.net-dt/css/dataTables.dataTables.css";
import $ from "jquery";
import "datatables.net";
import { useNavigate, useParams } from "react-router-dom";

const ShowGrades = () => {
    const [selectedGrade, setSelectedGrade] = useState(null);
    const { class_code: classCode } = useParams();
    const navigate = useNavigate();

    const { data, error, isLoading, refetch } = useQuery({
        queryKey: ["grades", classCode],
        queryFn: async () => {
            const response = await api.get(`/admin/grades/${classCode}`);
            if (response?.data?.score && typeof response.data.score === "string") {
                response.data.score = JSON.parse(response.data.score); // Chuyển đổi chuỗi thành mảng
            }
            if (!selectedGrade) {
                setSelectedGrade(response?.data[0]);
            }
            // setSelectedGrade({
            //     class_code: 'abc',
            //     class_name: 'abc',
            //     students: [
            //         {
            //             student_code: 'sv01',
            //             student_name: 'sv01',
            //             scores: [
            //                 {
            //                     assessment_code: 'Lab1',
            //                     assessment_name: 'Lab1',
            //                     score: 5.6,
            //                     weight: 1,
            //                 },
            //                 {
            //                     assessment_code: 'Lab2',
            //                     assessment_name: 'Lab2',
            //                     score: 5,
            //                     weight: 2,
            //                 },
            //             ],
            //             average_score: 3,
            //         }
            //     ]
            // })
            return response?.data;
        },
        onSuccess: () => {
            setSelectedGrade(data);
        },
        onError: () => {
            toast.error("Không thể tải dữ liệu bảng điểm");
        },
    });
    useEffect(() => {
        refetch();
    }, [])
    const { mutate } = useMutation({
        mutationFn: async (data) => {
            console.log(data);
            
            await api.put(`/admin/grades/${classCode}`, data);
        },
        onSuccess: () => {
            toast.success("Chỉnh sửa thành công!");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra");
        },
    });
    const calculateAverageScore = (scores) => {
        const totalWeight = scores?.reduce((sum, score) => sum + (score.weight || 0), 0);
        if (totalWeight === 0) return 0;
        return scores.reduce((sum, score) => {
            const scoreValue = parseFloat(score?.score?.replace(',', '.') || 0);
            return sum + (scoreValue * (score.weight / totalWeight));
        }, 0).toFixed(2);
    };
    useEffect(() => {
        refetch();
    }, [])
    useEffect(() => {
        if (selectedGrade) {
            // Xóa bảng cũ và khởi tạo lại DataTable nếu đã tồn tại
            if ($.fn.dataTable.isDataTable("#gradesTable")) {
                $("#gradesTable").DataTable().clear().destroy();
            }
            console.log(selectedGrade);

            const totalWeight = selectedGrade?.students[0]?.scores.reduce((total, score) => total + score.weight, 0);
            // Khởi tạo DataTable
            $("#gradesTable").DataTable({
                paging: false,
                info: false,
                language: {
                    search: "<i class='fas fa-search'>Tìm kiếm</i>",
                },
                data: selectedGrade?.students?.map((student, index) => ({
                    stt: index + 1,
                    student_code: student.student_code,
                    student_name: student.student_name,
                    scores: student.scores || [],
                    average_score: student.average_score || 0,
                })),
                columns: [
                    { title: "#", data: "stt", className: "text-center" },
                    { title: "Mã SV", data: "student_code", className: "text-center" },
                    { title: "Tên SV", data: "student_name", className: "text-center" },
                    ...selectedGrade?.students[0]?.scores.map((score, index) => ({
                        title: `${score.assessment_name}<br/>(${(score.weight / totalWeight * 100).toFixed(2) || 0}%)`,
                        data: null,
                        render: (data, type, row) => {
                            let scoreData = row.scores[index]?.score || 0;
                            scoreData = parseFloat(
                                (typeof scoreData === 'string' ? scoreData.replace(',', '.') : scoreData) || 0
                            );
                            return `
                                <input type="number" 
                                    value="${scoreData}" 
                                    min="0" 
                                    max="10" 
                                    step="0.25" 
                                    class="form-control form-control-sm text-center score-input"
                                    data-index="${row.stt - 1}" 
                                    data-exam-index="${index}" 
                                    oninput="
                                        const value = parseFloat(this.value);
                                        if (value < 0) this.value = '0.00';
                                        else if (value > 10) this.value = '10.00';
                                        else this.value = value.toFixed(2);
                                    "
                                />
                            `;
                        },
                        className: "text-center",
                    })),
                    {
                        title: "Điểm Tổng",
                        data: "average_score",
                        className: "text-center",
                        render: (data, row) => {
                            console.log(data);
                            const isBelowThreshold = parseFloat(data || 0) < 5;
                            data = parseFloat(
                                (typeof data === 'string' ? data.replace(',', '.') : data) || 0
                            ).toFixed(2);
                            const className = isBelowThreshold ? "text-danger" : "text-success";
                            return `<strong class="${className}">${data || 0}</strong>`;
                        },
                    },
                ],
                rowCallback: function (row, data) {
                    const averageScore = parseFloat(
                        (typeof data.average_score === "string" ? data.average_score.replace(",", ".") : data.average_score) || 0
                    );
                    if (averageScore < 5) {
                        $(row).css("background-color", "rgba(255, 0, 0, 0.1)");
                    }
                },

                scrollX: true,
                scrollY: true,
            });
            const scrollBody = document.querySelector(".dataTables_scrollBody");
            if (scrollBody) {
                scrollBody.style.overflow = "hidden";
                scrollBody.style.scrollbarWidth = "none"; // Firefox
                scrollBody.style.msOverflowStyle = "none"; // IE 10+
            }

            $('#gradesTable').on('change', '.score-input', function () {
                const rowIndex = $(this).data('index');
                const examIndex = $(this).data('exam-index');
                const newScore = parseFloat($(this).val()) || 0;

                // Cập nhật điểm vào selectedGrade
                selectedGrade.students[rowIndex].scores[examIndex].score = newScore;

                // Tính lại điểm trung bình của sinh viên
                const totalWeight = selectedGrade.students[rowIndex].scores.reduce((sum, score) => sum + (score.weight || 0), 0);
                const averageScore = selectedGrade.students[rowIndex].scores.reduce((sum, score) => {
                    const scoreValue = parseFloat(score?.score || 0);
                    return sum + (scoreValue * (score.weight / totalWeight));
                }, 0).toFixed(2);

                selectedGrade.students[rowIndex].average_score = averageScore;

                // Cập nhật điểm trung bình trong bảng
                const $row = $(`#gradesTable tbody tr:nth-child(${rowIndex + 1})`);
                const $averageScoreCell = $row.find('td:last-child strong');

                // Cập nhật giá trị ô `averageScore`
                $averageScoreCell.text(averageScore);
                $row.css('background-color', '');
                // Cập nhật màu cho ô và cả hàng
                if (averageScore < 5) {
                    $averageScoreCell.removeClass('text-success').addClass('text-danger');
                    $row.css('background-color', 'rgba(255, 0, 0, 0.1)');
                } else {
                    $averageScoreCell.removeClass('text-danger').addClass('text-success');
                    $row.removeClass('bg-danger'); // Thay đổi màu cho hàng
                }

            });


            $('#gradesTable').on('change', '.note-input', function (event) {
                const rowIndex = $(this).data('index');
                const examIndex = $(this).data('exam-index');
                const newNote = $(this).val() || '';
                selectedGrade.score[rowIndex].scores[examIndex].score = newNote;
            });

            $("#gradesTable tbody").on("click", '[id^="view_user_"]', function () {
                const user_code = $(this).data("id");
                navigate(`/admin/students/${user_code}`);
            });

            return () => {
                $("#gradesTable").DataTable().clear().destroy();
            };
        }
    }, [selectedGrade, data]);

    const handleSaveClick = () => {
        const updatedData = selectedGrade.students.map(student => ({
            student_code: student.student_code,
            scores: student.scores.map(score => ({
                assessment_name: score.assessment_name,
                assessment_code: score.assessment_code,
                weight: score.weight,
                score: score.score,  // Điểm đã được cập nhật
            })),
        }));

        mutate({
            class_code: selectedGrade.class_code,
            class_name: selectedGrade.class_name,
            students: updatedData,  // Gửi dữ liệu đã cập nhật
        });
    };


    return (
        <div>
            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">
                            <div className="card-title text-center">Bảng điểm Lớp {selectedGrade && selectedGrade?.class_code} {selectedGrade?.subject_code && ` - Môn ${selectedGrade?.subject_code}`} </div>
                        </div>
                        <div className='card-body'>
                            {isLoading ? (
                                <div>
                                    <div className="spinner-border" role="status"></div>
                                    <p>Đang tải dữ liệu...</p>
                                </div>
                            ) : (
                                <>
                                    {(data?.score == null) || !selectedGrade && (
                                        <div>
                                            <div className="spinner-border" role="status"></div>
                                            <p>Chưa có dữ liệu...</p>
                                        </div>
                                    )}
                                    <div className="table-responsive">
                                        <table id="gradesTable" className="display table-striped"></table>
                                    </div>
                                    <button
                                        className="btn btn-danger"
                                        style={{ float: "right" }}
                                        onClick={() => navigate(-1)}
                                    >
                                        <i className="fas fa-backward"> Quay lại</i>
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-success ms-2"
                                        style={{ float: "right" }}
                                        onClick={handleSaveClick}
                                    >
                                        <i className="fas fa-save"> Lưu điểm</i>
                                    </button>
                                </>
                            )}
                            {error && (
                                <div>Không thể tải dữ liệu bảng điểm</div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShowGrades;
