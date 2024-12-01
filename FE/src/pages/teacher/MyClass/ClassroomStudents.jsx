import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "datatables.net-dt/css/dataTables.dataTables.css";
import $ from "jquery";
import "datatables.net";
import api from "../../../config/axios";
import { useQuery } from "@tanstack/react-query";

const ClassroomStudents = () => {
    const { class_code } = useParams();

    const [students, setStudents] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(true);

    const { data: classDetails, isLoading, error, refetch } = useQuery({
        queryKey: ["class"],
        queryFn: async () => {
            const response = await api.get(`/teacher/classrooms/${class_code}`);
            const data = response?.data;
            return data;
        }
    });

    useEffect(() => {
        refetch();
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

    useEffect(() => {
        if (students) {
            if ($.fn.dataTable.isDataTable("#studentsTable")) {
                $("#studentsTable").DataTable().destroy(true);
            }
            $("#studentsTable").DataTable({
                paging: false,
                info: false,
                language: {
                    search: "<i class='fas fa-search'> Tìm kiếm: </i>",
                },
                data: students,
                columns: [
                    {
                        title: '#',
                        data: null,
                        render: (data, type, row, meta) => meta.row + 1,
                    },
                    {
                        title: 'Mã sinh viên',
                        data: 'user_code',
                        className: 'text-left',
                    },
                    {
                        title: 'Họ và tên',
                        data: 'full_name',
                        className: 'text-left',
                    },
                    {
                        title: 'Email',
                        data: 'email',
                        className: 'text-left',
                    },
                    {
                        title: 'Số điện thoại',
                        data: 'phone_number',
                        className: 'text-left',
                    },
                ]
            });
        }
    }, [loading, errorMessage]);

    return (
        <div className="row">
            <div className="col-md-12">
                <div className="card">
                    <div className="card-header">
                        <div className="card-title text-center">Thông tin lớp {class_code}</div>
                    </div>
                    <div className='card-body'>
                        {classDetails ? (
                            <div className="mb-4">
                                <p>Mã lớp học: {classDetails?.class_code}</p>
                                <p>Tên lớp học: {classDetails?.class_name}</p>
                                <p>Mô tả: {classDetails?.description}</p>
                                <p>Mã môn học: {classDetails?.subject.subject_code}</p>
                                <p>Môn học: {classDetails?.subject.subject_name}</p>
                                <p>Chuyên ngành: {classDetails?.subject.major.cate_code} - {classDetails?.subject.major.cate_name}</p>
                                <p>Giảng viên: {classDetails?.teacher.full_name}</p>
                                <p>Mã giảng viên: {classDetails?.teacher.user_code}</p>
                                <p>Email giảng viên: {classDetails?.teacher.email}</p>
                            </div>
                        ) : (
                            <div className="d-flex justify-content-center">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className='card-body'>
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
                            <table
                                id="studentsTable"
                                className="table table-hover table-bordered text-center"
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClassroomStudents;
