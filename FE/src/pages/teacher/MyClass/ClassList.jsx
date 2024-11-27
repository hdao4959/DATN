import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import 'datatables.net-dt/css/dataTables.dataTables.css';
import $ from 'jquery';
import 'datatables.net';

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

    useEffect(() => {
        if (classrooms.length) {
            $("#classroomTable").DataTable({
                data: classrooms,
                paging: true,
                searching: true,
                ordering: true,
                destroy: true,
                pageLength: 10,
                lengthMenu: [10, 20, 50, 100],
                language: {
                    paginate: {
                        previous: 'Trước',
                        next: 'Tiếp theo',
                    },
                    lengthMenu: 'Hiển thị _MENU_ mục mỗi trang',
                    info: 'Hiển thị từ <strong>_START_</strong> đến <strong>_END_</strong> trong <strong>_TOTAL_</strong> mục',
                    search: 'Tìm kiếm:',
                },
                columns: [
                    {
                        title: "Mã lớp",
                        data: "class_code",
                        render: (data) => (
                            `<a href='/teacher/class/${data}/students'>
                                ${data}
                            </a>`
                        ),
                    },
                    {
                        title: "Tên lớp",
                        data: "class_name",
                    },
                    {
                        title: "Tên môn học",
                        data: "subject",
                        render: (data) => {
                            return data && data.subject_name
                                ? data.subject_name
                                : "Chưa có dữ liệu";
                        },
                    },
                    {
                        title: "Lịch học",
                        data: "class_code",
                        render: (data) => (
                            `<a
                                href='/teacher/class/${data}/schedules'
                            >
                                <i class="fas fa-eye"></i>
                            </a>`
                        ),
                    },
                    {
                        title: "Trạng thái",
                        data: "is_active",
                        render: (data) => {
                            return data ? (
                                `<i class="fas fa-check-circle text-green-500" ></i>`
                            ) : (
                                `<i class="fas fa-times-circle text-red-500"></i>`
                            );
                        },
                    }
                ],
            });
        }
    }, [classrooms]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4 fs-5">Danh sách lớp học</h1>

            {errorMessage ? (
                <div className="alert alert-danger" role="alert">
                    {errorMessage}
                </div>
            ) : (
                <table
                    id="classroomTable" className="table table-hover table-bordered text-center">
                </table>
            )}
        </div>
    );
};

export default ClassroomList;
