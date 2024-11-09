import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ClassroomList = () => {
    const [classrooms, setClassrooms] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClassrooms = async () => {
            try {
                const token = JSON.parse(localStorage.getItem("token"));
                const accessToken = token?.access_token;

                if (!accessToken) {
                    setErrorMessage(
                        "Vui lòng đăng nhập để xem danh sách lớp học."
                    );
                    setLoading(false);
                    return;
                }

                const response = await fetch(
                    "http://127.0.0.1:8000/api/teacher/classrooms",
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    if (data.length === 0) {
                        setErrorMessage("Không có dữ liệu lớp học nào.");
                    } else {
                        setClassrooms(data);
                    }
                } else {
                    setErrorMessage(
                        "Lỗi khi tải danh sách lớp học. Vui lòng thử lại sau."
                    );
                }
            } catch (error) {
                setErrorMessage("Đã xảy ra lỗi: " + error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchClassrooms();
    }, []);

    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4 fs-5">Danh sách lớp học</h1>

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
                            <th scope="col">Mã lớp</th>
                            <th scope="col">Tên lớp</th>
                            <th scope="col">Tên môn học</th>
                            <th scope="col">Lịch học</th>
                            <th scope="col">Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {classrooms.map((classroom, index) => (
                            <tr key={index}>
                                <td>
                                    <Link
                                        to={`/teacher/class/${classroom.class_code}/students`}
                                    >
                                        {classroom.class_code}
                                    </Link>
                                </td>
                                <td>{classroom.class_name}</td>
                                <td>{classroom.subject.subject_name}</td>
                                <td>
                                    <Link
                                        to={`/teacher/class/${classroom.class_code}/schedules`}
                                    >
                                        <i className="fas fa-eye"></i>
                                    </Link>
                                </td>
                                <td>
                                    {classroom.is_active ? (
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

export default ClassroomList;
