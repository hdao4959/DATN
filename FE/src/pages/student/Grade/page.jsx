import React, { useEffect, useState } from "react";
import "datatables.net-dt/css/dataTables.dataTables.css";
import $ from "jquery";
import "datatables.net";
import api from "../../../config/axios";
import { useQuery } from "@tanstack/react-query";

const StudentGrades = () => {
    const [semesterCode, setSemesterCode] = useState("");
    const [semesterCodeDefault, setSemesterCodeDefault] = useState("");
    const [subjects, setSubjects] = useState([]);
    const [semesters, setSemesters] = useState([]);

    const { data, isLoading: isLoadingClasses, refetch } = useQuery({
        queryKey: ["LIST_CLASSES"],
        queryFn: async () => {
            const response = await api.get("/student/grades", {
                params: { search: semesterCode },
            });
            return response?.data;
        },
        enabled: !!semesterCode,
    });

    useEffect(() => {
        if (data) {
            setSubjects(data?.scores || []);
            setSemesters(data?.semesters || []);
            setSemesterCodeDefault(data?.semesterCode || "");
        }
    }, [data]);
    useEffect(() => {
        refetch();
    }, [semesterCode]);

    useEffect(() => {
        subjects?.forEach((subject, index) => {
            // Chỉ khởi tạo DataTable nếu lớp có điểm
            if (subject?.scores?.length > 0) {
                if ($.fn.DataTable.isDataTable(`#gradesTable${index}`)) {
                    $(`#gradesTable${index}`).DataTable().destroy();
                }

                $(`#gradesTable${index}`).DataTable({
                    pageLength: 10,
                    lengthMenu: [10, 20, 50, 100],
                    searching: false,
                    language: {
                        paginate: {
                            previous: "Trước",
                            next: "Tiếp theo",
                        },
                        lengthMenu: "Hiển thị _MENU_ mục mỗi trang",
                        info: "Hiển thị từ <strong>_START_</strong> đến <strong>_END_</strong> trong <strong>_TOTAL_</strong> mục",
                    },
                    destroy: true,
                });
            }
        });
    }, [subjects, semesterCode]);

    const calculateAverage = (scores) => {
        if (!scores?.length) return "0.00";
        const totalWeight = scores.reduce((sum, item) => sum + item.weight, 0);
        const weightedScore = scores.reduce(
            (sum, item) => sum + item.score * item.weight,
            0
        );
        return totalWeight ? (weightedScore / totalWeight).toFixed(2) : "0.00";
    };

    return (
        <div>
            <div className="card" style={{ minHeight: "800px" }}>
                <div className="card-header">
                    <h4 className="card-title">Bảng điểm</h4>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                        }}
                    >
                        <select
                            value={semesterCodeDefault}
                            onChange={(e) => setSemesterCode(e.target.value)}
                            className="form-control"
                        >
                            {semesters?.map((sem) => (
                                <option
                                    key={sem.cate_code}
                                    value={sem.cate_code}
                                >
                                    {sem.cate_name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="card-body">
                    {isLoadingClasses ? (
                        <div className="loading-spinner text-center">
                            <div className="spinner-border" role="status"></div>
                            <p>Đang tải dữ liệu...</p>
                        </div>
                    ) : (
                        subjects.map((subject, index) => {
                            {
                                if ($.fn.DataTable.isDataTable(`#gradesTable${index}`)) {
                                    $(`#gradesTable${index}`).DataTable().destroy();
                                } else {

                               
                            const average = calculateAverage(subject.scores);
                            const maxWeightScore = subject.scores.reduce((max, score) => {
                                if ((score.weight || 0) > (max.weight || 0)) {
                                    return score;
                                }
                                return max;
                            }, { weight: 0, score: 0 });

                            const maxWeightScoreValue = parseFloat(
                                (typeof maxWeightScore.score === "string" ? maxWeightScore.score.replace(",", ".") : maxWeightScore.score) || 0
                            );
                            const status =
                                (average < 4 || maxWeightScoreValue < 5) ? (
                                    <strong className="text-red-400">
                                        Không đạt
                                    </strong>
                                ) : (
                                    <strong className="text-green-400">
                                        Đạt
                                    </strong>
                                );

                            return (
                                <div
                                    className="card mb-4"
                                    key={index}
                                    style={{ border: "1px solid #ccc" }}
                                >
                                    <div className="card-header">
                                        <h5>{subject.class_name}</h5>
                                    </div>
                                    <div className="card-body">
                                        {subject?.scores?.length > 0 ? (
                                            <table
                                                id={`gradesTable${index}`}
                                                className="table table-bordered table-striped"
                                            >
                                                <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Tên đầu điểm</th>
                                                        <th>Trọng số</th>
                                                        <th>Điểm</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {subject.scores.map(
                                                        (score, i) => (
                                                            <tr key={i}>
                                                                <td>{i + 1}</td>
                                                                <td>
                                                                    {score?.assessment_name ||
                                                                        "Không xác định"}
                                                                </td>
                                                                <td>
                                                                    {score?.weight ||
                                                                        "0.00"}
                                                                </td>
                                                                <td>
                                                                    {score?.score ||
                                                                        "0.00"}
                                                                </td>
                                                            </tr>
                                                        )
                                                    )}
                                                </tbody>
                                                <tfoot>
                                                    <tr>
                                                        <td></td>
                                                        <td
                                                            style={{
                                                                fontWeight:
                                                                    "bold",
                                                            }}
                                                        >
                                                            Trung bình:{" "}
                                                            <span
                                                                style={{
                                                                    color: "red",
                                                                }}
                                                            >
                                                                {average ||
                                                                    "0.00"}
                                                            </span>
                                                        </td>
                                                        <td colSpan={2}>
                                                            Trạng thái:{" "}
                                                            {status ||
                                                                "0"}
                                                        </td>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        ) : (
                                            <p className="text-center text-muted">
                                                Chưa có điểm
                                            </p>
                                        )}
                                    </div>
                                </div>
                            );
                        }
                
                    }
                        })
                    )}
                    {console.log(subjects)
                    }
                    {(subjects.length == 0 && !isLoadingClasses) ? (
                        <div className="loading-spinner text-center"> Chưa có dữ liệu..</div>
                    ) : ('')}
                </div>
            </div>
        </div>
    );
};

export default StudentGrades;
