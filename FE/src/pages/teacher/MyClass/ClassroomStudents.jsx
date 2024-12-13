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

    const {
        data: classDetails,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ["class"],
        queryFn: async () => {
            const response = await api.get(`/teacher/classrooms/${class_code}`);
            const data = response?.data;
            return data;
        },
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

                const response = await api.get(
                    `/teacher/classrooms/${class_code}/students`
                );

                if (response) {
                    const data = response?.data;
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
    }, []);

    useEffect(() => {
        if (students) {
            if ($.fn.dataTable.isDataTable("#studentsTable")) {
                $("#studentsTable").DataTable().destroy();
            }
            
            $("#studentsTable").DataTable({
                data: students,
                paging: false,
                info: false,
                language: {
                    search: "<i class='fas fa-search'> Tìm kiếm: </i>",
                },
                columns: [
                    {
                        title: "#",
                        data: null,
                        render: (data, type, row, meta) => meta.row + 1,
                    },
                    {
                        title: "Mã sinh viên",
                        data: "user_code",
                        className: "text-left",
                    },
                    {
                        title: "Họ và tên",
                        data: "full_name",
                        className: "text-left",
                    },
                    {
                        title: 'Email',
                        data: 'email',
                        className: 'text-left',
                        render: (data) => data ? `<a href="mailto:${data}">${data}</a>` : '',
                    },
                    {
                        title: 'Số điện thoại',
                        data: 'phone_number',
                        className: 'text-left',
                        render: (data) => data ? `<a href="tel:${data}">${data}</a>` : '',
                    },
                ],
            });
        }
    }, [students]);

    const handleSendMail = () => {
        const emails = students.map((student) => student.email).join(",");
        const subject = `Thông báo lớp học ${class_code}`;
        const body = `Chào các bạn sinh viên,\n\nĐây là thông báo về lớp học ${class_code}.\n\nTrân trọng.`;

        const mailtoLink = `mailto:${emails}?subject=${encodeURIComponent(
            subject
        )}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoLink;
    };

    return (
        <div className="row">
            <div className="col-md-12">
                <div className="card">
                    <div className="card-header">
                        <div className="card-title text-center">
                            Thông tin lớp {class_code}
                        </div>
                    </div>
                    <div className="card-body">
                        {classDetails ? (
                            <>
                                <div className="row mb-3">
                                    <div className="col-md-4">
                                        <strong>Tên lớp học:</strong>{" "}
                                        {classDetails?.class_name || "Chưa cập nhật"}
                                    </div>
                                    <div className="col-md-4">
                                        <strong>Mã môn học:</strong>{" "}
                                        {classDetails?.subject_code || "Chưa cập nhật"}
                                    </div>
                                    <div className="col-md-4">
                                        <strong>Môn học:</strong>{" "}
                                        {classDetails?.subject_name || "Chưa cập nhật"}
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-md-4">
                                        <strong>Ngày bắt đầu:</strong>{" "}
                                        {classDetails?.date_start
                                            ? new Date(
                                                classDetails?.date_start
                                            ).toLocaleDateString()
                                            : "Chưa cập nhật"}
                                    </div>
                                    <div className="col-md-4">
                                        <strong>Giảng viên:</strong>{" "}
                                        {classDetails?.teacher_name ?? "Chưa cập nhật"}
                                    </div>
                                    <div className="col-md-4">
                                        <strong>Mã giảng viên:</strong>{" "}
                                        {classDetails?.teacher_code ?? "Chưa cập nhật"}
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-md-4">
                                        <strong>Email giảng viên:</strong>{" "}
                                        {classDetails?.teacher_email ? (
                                            <a
                                                href={`mailto:${classDetails?.teacher?.email || ""
                                                    }`}
                                            >
                                                {classDetails?.teacher?.email || ""}
                                            </a>
                                        ) : "Chưa cập nhật"}
                                    </div>
                                    <div className="col-md-4">
                                        <strong>Số điện thoại giảng viên:</strong>{" "}
                                        {classDetails?.teacher_phone_number ?? "Chưa cập nhật"}
                                    </div>
                                    <div className="col-md-4">
                                        <strong>Mô tả:</strong>{" "}
                                        {classDetails?.description || "Không có"}
                                    </div>
                                </div>
                                {/* <div className="mb-4">
                                <p>Mã lớp học: {classDetails?.class_code}</p>
                                <p>Tên lớp học: {classDetails?.class_name}</p>
                                <p>Mô tả: {classDetails?.description}</p>
                                <p>
                                    Mã môn học:{" "}
                                    {classDetails?.subject.subject_code}
                                </p>
                                <p>
                                    Môn học:{" "}
                                    {classDetails?.subject.subject_name}
                                </p>
                                <p>
                                    Chuyên ngành:{" "}
                                    {classDetails?.subject.major.cate_code} -{" "}
                                    {classDetails?.subject.major.cate_name}
                                </p>
                                <p>
                                    Giảng viên:{" "}
                                    {classDetails?.teacher?.full_name || ""}
                                </p>
                                <p>
                                    Mã giảng viên:{" "}
                                    {classDetails?.teacher?.user_code || ""}
                                </p>
                                <p>
                                    Email giảng viên:
                                    <a
                                        href={`mailto:${
                                            classDetails?.teacher?.email || ""
                                        }`}
                                    >
                                        {classDetails?.teacher?.email || ""}
                                    </a>
                                </p>
                            </div> */}
                            </>
                        ) : (
                            <div className="d-flex justify-content-center">
                                <div
                                    className="spinner-border text-primary"
                                    role="status"
                                ></div>
                                <p>Đang tải thông tin Lớp học</p>
                            </div>
                        )}
                    </div>
                    <div className="card-body">
                        {loading ? (
                            <div className="d-flex justify-content-center">
                                <div
                                    className="spinner-border text-primary"
                                    role="status"
                                ></div>
                                <p>Đang tải thông tin danh sách sinh viên</p>
                            </div>
                        ) : errorMessage ? (
                            <div className="alert alert-danger" role="alert">
                                {errorMessage}
                            </div>
                        ) : (
                            <>
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={handleSendMail}
                                    id="getSelectedButton"
                                >
                                    <i class="fa fa-paper-plane"></i> Gửi mail
                                    cho cả Lớp {class_code}
                                </button>
                                <table
                                    id="studentsTable"
                                    className="table table-hover table-bordered text-center"
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClassroomStudents;
