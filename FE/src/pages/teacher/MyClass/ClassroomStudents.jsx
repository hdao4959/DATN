import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ClassroomStudents = () => {
    const { class_code } = useParams();
    const [students, setStudents] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const token = JSON.parse(localStorage.getItem("token"));
                const accessToken = token?.access_token;

                if (!accessToken) {
                    setErrorMessage(
                        "Vui lòng đăng nhập để xem danh sách sinh viên."
                    );
                    setLoading(false);
                    return;
                }

                const response = await fetch(
                    `http://127.0.0.1:8000/api/teacher/classrooms/${class_code}/students`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    setStudents(data);
                } else {
                    setErrorMessage(
                        "Lỗi khi tải danh sách sinh viên. Vui lòng thử lại sau."
                    );
                }
            } catch (error) {
                setErrorMessage("Đã xảy ra lỗi: " + error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, [class_code]);

    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4 fs-5">
                Danh sách sinh viên của lớp {class_code}
            </h1>

            {loading ? (
                <div className="d-flex justify-content-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            ) : errorMessage ? (
                <div className="alert alert-danger" role="alert">
                    {errorMessage}
                </div>
            ) : (
                <table className="table table-hover table-bordered text-center">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Mã sinh viên</th>
                            <th scope="col">Họ và tên</th>
                            <th scope="col">Email</th>
                            <th scope="col">Số điện thoại</th>
                            <th scope="col">Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student, index) => (
                            <tr key={student.id}>
                                <td>{index + 1}</td>
                                <td>{student.user_code}</td>
                                <td>{student.full_name}</td>
                                <td>{student.email}</td>
                                <td>{student.phone_number}</td>
                                <td>
                                    {student.is_active ? (
                                        <i
                                            className="fas fa-check-circle"
                                            style={{
                                                color: "green",
                                            }}
                                        ></i>
                                    ) : (
                                        <i
                                            className="fas fa-times-circle"
                                            style={{
                                                color: "red",
                                            }}
                                        ></i>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ClassroomStudents;
