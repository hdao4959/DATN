import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../config/axios";
import { toast } from "react-toastify";

const ClassExams = () => {
    const { class_code } = useParams();
    const navigate = useNavigate();

    const [studentsData, setStudentsData] = useState([]);

    const { data, isLoading, error } = useQuery({
        queryKey: ["examDays", class_code],
        queryFn: async () => {
            const response = await api.get(
                `/teacher/classrooms/${class_code}/examdays`
            );
            if (response.data?.students) {
                setStudentsData(response.data.students);
            }
            return response.data;
        },
    });

    const mutation = useMutation({
        mutationFn: async () => {
            const payload = {
                class_code,
                students: studentsData,
            };
            return await api.post(
                `/teacher/classrooms/${class_code}/examdays`,
                payload
            );
        },
        onSuccess: (response) => {
            toast.success(response.data?.message || "Lưu thành công!");
        },
        onError: (err) => {
            toast.error(
                err.response?.data?.message || `Lỗi khi lưu: ${err.message}`
            );
        },
    });

    const handleStudentExamChange = (user_code, exam_day) => {
        setStudentsData((prev) =>
            prev.map((student) =>
                student.user_code === user_code
                    ? { ...student, exam_day }
                    : student
            )
        );
    };

    const handleSave = () => {
        mutation.mutate();
    };

    if (isLoading) {
        return (
            <div className="text-center">
                <div className="spinner-border" role="status"></div>
                <p>Đang tải dữ liệu...</p>
            </div>
        );
    }

    if (error) {
        toast.error(`Lỗi khi tải dữ liệu: ${error.message}`);
        return (
            <div className="alert alert-danger" role="alert">
                Lỗi khi tải dữ liệu: {error.message}
            </div>
        );
    }

    const { exam_days } = data || {};

    return (
        <div className="container">
            <h3 className="text-center my-4">
                Danh sách ngày thi và phân công sinh viên lớp{" "}
                <strong>{class_code}</strong>
            </h3>

            <div className="card mb-4">
                <div className="card-header">
                    <h5>Danh sách lịch thi</h5>
                </div>
                <div className="card-body">
                    {exam_days && exam_days.length > 0 ? (
                        <div className="table-responsive">
                            <table className="table table-hover table-bordered">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Tên môn học</th>
                                        <th>Ngày thi</th>
                                        <th>Phòng học</th>
                                        <th>Ca thi</th>
                                        <th>Thời gian</th>
                                        <th>Số lượng sinh viên</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {exam_days.map((exam, index) => (
                                        <tr key={exam.id}>
                                            <td>{index + 1}</td>
                                            <td>
                                                {exam.subject_name ||
                                                    "Đang cập nhật"}
                                            </td>
                                            <td>
                                                {exam.date ||
                                                    "Chưa có ngày thi"}
                                            </td>
                                            <td>
                                                {exam.room_name ||
                                                    "Chưa có phòng"}
                                            </td>
                                            <td>
                                                {exam.session_name ||
                                                    "Chưa có ca thi"}
                                            </td>
                                            <td>
                                                {exam.session_value
                                                    ? `${
                                                          JSON.parse(
                                                              exam.session_value
                                                          ).start
                                                      } - ${
                                                          JSON.parse(
                                                              exam.session_value
                                                          ).end
                                                      }`
                                                    : "Không có thời gian"}
                                            </td>
                                            <td>
                                                {exam.students_count || "0"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p>Chưa có lịch thi cho lớp này.</p>
                    )}
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <h5>Phân công ngày thi cho sinh viên</h5>
                </div>
                <div className="card-body">
                    {studentsData && studentsData.length > 0 ? (
                        <table className="table table-hover table-bordered text-center">
                            <thead>
                                <tr>
                                    <th style={{ width: "5%" }}>#</th>
                                    <th style={{ width: "15%" }}>
                                        Mã sinh viên
                                    </th>
                                    <th style={{ width: "20%" }}>
                                        Tên sinh viên
                                    </th>
                                    <th style={{ width: "50%" }}>
                                        Chọn ngày thi
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {studentsData.map((student, index) => (
                                    <tr key={student.user_code}>
                                        <td>{index + 1}</td>
                                        <td>
                                            {student.user_code ||
                                                "Đang cập nhật"}
                                        </td>
                                        <td>
                                            {student.user_name ||
                                                "Đang cập nhật"}
                                        </td>
                                        <td>
                                            {(exam_days &&
                                                exam_days.map((exam) => (
                                                    <div
                                                        className="form-check form-check-inline"
                                                        key={exam.id}
                                                    >
                                                        <input
                                                            type="radio"
                                                            className="form-check-input"
                                                            name={`exam_day_${student.user_code}`}
                                                            value={exam.id}
                                                            onChange={() =>
                                                                handleStudentExamChange(
                                                                    student.user_code,
                                                                    exam.id
                                                                )
                                                            }
                                                            checked={
                                                                student.exam_day ===
                                                                exam.id
                                                            }
                                                        />
                                                        <label className="form-check-label">
                                                            {exam.date} -{" "}
                                                            {exam.session_name}
                                                        </label>
                                                    </div>
                                                ))) ||
                                                "Đang cập nhật"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>Không có sinh viên nào trong lớp.</p>
                    )}
                </div>
            </div>

            <div className="text-center mt-4">
                <button
                    className="btn btn-primary"
                    onClick={handleSave}
                    disabled={mutation.isLoading}
                >
                    {mutation.isLoading ? "Đang lưu..." : "Lưu lịch thi"}
                </button>
            </div>
        </div>
    );
};

export default ClassExams;
