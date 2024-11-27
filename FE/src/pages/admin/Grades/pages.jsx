import React, { useState, useEffect } from "react";
import "datatables.net-dt/css/dataTables.dataTables.css";
import $ from "jquery";
import "datatables.net";
import { toast } from "react-toastify";
import api from "../../../config/axios";
import { useMutation } from "@tanstack/react-query";

const ShowGrades = ({ classCode, onClose }) => {
    const [selectedGrade, setSelectedGrade] = useState(null);
    const [isTableLoading, setIsTableLoading] = useState(true);

    const { mutate } = useMutation({
        mutationFn: async (data) => {
            await api.put(`/admin/grades/${classCode}`, data);
        },
        onSuccess: () => {
            toast.success("Chỉnh sửa thành công!");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra");
        },
    });

    useEffect(() => {
        const fetchGrades = async () => {
            try {
                const response = await api.get(`/admin/grades/${classCode}`);
                setSelectedGrade(response?.data);
            } catch (error) {
                toast.error("Không thể tải dữ liệu bảng điểm");
            }
        };

        if (classCode) {
            fetchGrades();
        }
    }, [classCode]);

    useEffect(() => {
        if (selectedGrade && selectedGrade.score?.length > 0) {
            if ($.fn.dataTable.isDataTable("#modalGradesTable")) {
                $("#modalGradesTable").DataTable().clear().destroy();
            }

            const totalValue = selectedGrade?.score[0]?.scores?.reduce(
                (total, score) => total + score.value,
                0
            );

            $("#modalGradesTable").DataTable({
                pageLength: 10,
                lengthMenu: [10, 20, 50, 100],
                language: {
                    paginate: {
                        previous: "Trước",
                        next: "Tiếp theo",
                    },
                    lengthMenu: "Hiển thị _MENU_ mục mỗi trang",
                    info: "Hiển thị từ <strong>_START_</strong> đến <strong>_END_</strong> trong <strong>_TOTAL_</strong> mục",
                    search: "Tìm kiếm:",
                },
                data: selectedGrade?.score?.map((student, index) => ({
                    stt: index + 1,
                    student_code: student.student_code,
                    student_name: student.student_name,
                    scores: student.scores,
                    average_score: student.average_score,
                    note: student.scores.map((score) => score.note).join(", "),
                })),
                columns: [
                    { title: "STT", data: "stt", className: "text-center" },
                    {
                        title: "Mã SV",
                        data: "student_code",
                        className: "text-center",
                    },
                    {
                        title: "Tên SV",
                        data: "student_name",
                        className: "text-center",
                    },
                    ...selectedGrade?.score[0]?.scores
                        .map((exam, index) => [
                            {
                                title: `${exam.name} (${
                                    exam.value
                                        ? (
                                              (exam.value / totalValue) *
                                              100
                                          ).toFixed(2)
                                        : 0
                                }%)`,
                                data: null,
                                render: function (data, type, row) {
                                    const scoreData =
                                        row.scores[index]?.score || 0;
                                    return `<input type="number" 
                                    value="${scoreData}" 
                                    min="0" 
                                    max="10" 
                                    class="form-control form-control-sm text-center score-input"
                                    data-index="${row.stt - 1}"
                                    data-exam-index="${index}" 
                                    oninput="this.value = Math.min(Math.max(this.value, 0), 10)"
                                />`;
                                },
                                className: "text-center",
                            },
                            {
                                title: "Ghi chú",
                                data: null,
                                render: function (data, type, row) {
                                    const noteData =
                                        row.scores[index]?.note || "";
                                    return `<input type="text"
                                    value="${noteData}"
                                    class="form-control form-control-sm text-center note-input w-10"
                                    data-index="${row.stt - 1}"
                                    data-exam-index="${index}"
                                    style="width: 80px"
                                />`;
                                },
                                className: "text-center",
                            },
                        ])
                        .flat(),
                    {
                        title: "Điểm Tổng",
                        data: "average_score",
                        className: "text-center",
                        render: (data) => `<strong>${data || 0}</strong>`,
                    },
                ],
                scrollX: true,
                scrollY: true,
            });
        }

        return () => {
            $("#modalGradesTable").DataTable().clear().destroy();
        };
    }, [selectedGrade]);

    const handleSaveClick = () => {
        mutate(selectedGrade);
    };

    return (
        <div>
            <div
                className="modal fade show d-block"
                tabIndex="-1"
                aria-labelledby="gradesModalLabel"
                role="dialog"
            >
                <div className="modal-dialog modal-xl" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="gradesModalLabel">
                                Bảng điểm
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={onClose}
                            ></button>
                        </div>
                        <div className="modal-body">
                            {selectedGrade ? (
                                <div className="table-responsive">
                                    <table
                                        id="modalGradesTable"
                                        className="display table-striped"
                                    ></table>
                                </div>
                            ) : (
                                <p>Đang tải dữ liệu...</p>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-success"
                                onClick={handleSaveClick}
                            >
                                Lưu điểm
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={onClose}
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShowGrades;
