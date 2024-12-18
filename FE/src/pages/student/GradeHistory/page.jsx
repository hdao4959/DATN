import React, { useEffect, useState } from "react";
import "datatables.net-dt/css/dataTables.dataTables.css";
import $ from "jquery";
import "datatables.net";
import { useQuery } from "@tanstack/react-query";
import api from "../../../config/axios";
import { toast } from "react-toastify";

const StudentCourseHistory = () => {
    const [totalCredits, setTotalCredits] = useState(0);
    const [earnedCredits, setEarnedCredits] = useState(0);
    const { data: studentHistory, refetch } = useQuery({
        queryKey: ["HISTORY"],
        queryFn: async () => {
            const res = await api.get(`/student/scoreTable`);
            const data = res?.data[0];
            if (data) {
                data.subjects = data.subjects.sort((a, b) => {
                    const semesterA = parseInt(a.semester_code.replace("S", ""));
                    const semesterB = parseInt(b.semester_code.replace("S", ""));
                    return semesterA - semesterB;
                });
                const { totalCredits, earnedCredits } = calculateCredits(data?.subjects || []);
                setTotalCredits(totalCredits);
                setEarnedCredits(earnedCredits);
            }
            return data;
        },
        onError: (error) => {
            toast.error("Lấy dữ liệu thất bại:", error);
        },
    });
    const calculateCredits = (subjects) => {
        const totalCredits = subjects.reduce((sum, subject) => sum + subject.credit_number, 0) || 0;
        const earnedCredits = subjects
            .filter((subject) => subject.is_pass === "Passed" || subject.is_pass === "Failed")
            .reduce((sum, subject) => sum + subject.credit_number, 0) || 0;
        return { totalCredits, earnedCredits };
    };

    useEffect(() => {
        if (studentHistory) {
            if ($.fn.DataTable.isDataTable(`#subjectHistoryTable`)) {
                $(`#subjectHistoryTable`).DataTable().destroy();
            }

            $("#subjectHistoryTable").DataTable({
                paging: false,
                // ordering: true,
                ordering: false,
                info: false,
                language: {
                    search: "<i class='fas fa-search'> Tìm kiếm </i>",
                },
                data: null,
            });
            if ($.fn.DataTable.isDataTable(`#filTable`)) {
                $(`#filTable`).DataTable().destroy();
            }

            $("#filTable").DataTable({
                paging: false,
                ordering: true,
                info: false,
                searching: false,
            });
        }
    }, [studentHistory, refetch]);

    return (
        <div>
            <div className="card" style={{ minHeight: "800px" }}>
                <div className="card-header">
                    <div className="container mt-4">
                        <table
                            id="subjectHistoryTable"
                            className="table table-striped table-bordered"
                            style={{ width: "100%" }}
                        >
                            <thead>
                                <tr>
                                    <th>Mã Môn</th>
                                    <th>Tên Môn Học</th>
                                    <th>Tín Chỉ</th>
                                    <th>Điểm</th>
                                    <th>Kỳ Học</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {studentHistory?.subjects ? (
                                    studentHistory.subjects.map((subject, index) => (
                                        <tr key={index}>
                                            <td>{subject.subject_code}</td>
                                            <td>{subject.subject_name}</td>
                                            <td>{subject.credit_number}</td>
                                            <td
                                                className={
                                                    subject.score === null
                                                        ? "text-secondary"
                                                        : subject.score < 5
                                                            ? "text-danger"
                                                            : "text-success"
                                                }
                                            >
                                                <strong>{subject.score !== null ? subject.score : "N/A"}</strong>
                                            </td>
                                            <td>{subject.semester_name}</td>
                                            <td>
                                                <span
                                                    className={
                                                        subject.is_pass === "Passed"
                                                            ? "text-success"
                                                            : subject.is_pass === "Studying"
                                                                ? "text-primary"
                                                                : subject.is_pass === "Notyet"
                                                                    ? "text-dark"
                                                                    : "text-danger"
                                                    }
                                                >
                                                    {subject.is_pass === "Passed"
                                                            ? "Đã qua"
                                                            : subject.is_pass === "Studying"
                                                                ? "Đang học"
                                                                : subject.is_pass === "Notyet"
                                                                    ? "Chưa học"
                                                                    : "Trượt"
                                                    }
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center">Chưa có dữ liệu</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <div className="d-flex justify-content-between my-3">
                            <div>
                                <strong>Số tín chỉ đã học:</strong> {earnedCredits || 0} / {totalCredits || 0}
                            </div>
                            <div>
                                <strong>Điểm trung bình:</strong> {studentHistory?.averageScore || 0.00}
                            </div>
                        </div>
                        <table
                            id="filTable"
                            className="table table-striped table-bordered"
                            style={{ width: "100%" }}
                        >
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>##</th>
                                    <th>###</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>Số môn đang học</td>
                                    <td>{studentHistory?.countStudying}</td>
                                </tr>
                                <tr>
                                    <td>2</td>
                                    <td>Số môn đã qua</td>
                                    <td>{studentHistory?.countPassed}</td>
                                </tr>
                                <tr>
                                    <td>3</td>
                                    <td>Số môn Chưa học</td>
                                    <td>{studentHistory?.countNotyet}</td>
                                </tr>
                                <tr>
                                    <td>4</td>
                                    <td>Số môn đã trượt</td>
                                    <td>{studentHistory?.countFailed}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentCourseHistory;
