import React, { useEffect } from "react";
import "datatables.net-dt/css/dataTables.dataTables.css";
import $ from "jquery";
import "datatables.net";
import api from "../../../config/axios";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

const ViewClassrooms = () => {
    const { data: classrooms, isLoading } = useQuery({
        queryKey: ["LIST_CLASSROOMS"],
        queryFn: async () => {
            const res = await api.get(`/student/classrooms`);
            return res?.data;
        },
    });

    useEffect(() => {
        if (classrooms) {
            $("#classroomsTable").DataTable({
                pageLength: 10,
                lengthMenu: [10, 20, 50, 100],
                language: {
                    paginate: {
                        previous: "Trước",
                        next: "Tiếp theo",
                    },
                    lengthMenu: "Hiển thị _MENU_ mục mỗi trang",
                    info: "Hiển thị từ _START_ đến _END_ trong _TOTAL_ mục",
                },
                destroy: true,
            });
        }
    }, [classrooms]);

    return (
        <div>
            <div className="card" style={{ minHeight: "800px" }}>
                <div className="card-header">
                    <h4 className="card-title">Danh sách lớp học</h4>
                </div>
                <div className="card-body">
                    {isLoading ? (
                        <div className="loading-spinner text-center">
                            <div className="spinner-border" role="status"></div>
                            <p>Đang tải dữ liệu...</p>
                        </div>
                    ) : (
                        <table
                            id="classroomsTable"
                            className="table table-bordered table-striped"
                        >
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Mã Lớp</th>
                                    <th>Tên môn học</th>
                                    <th>Lịch học</th>
                                </tr>
                            </thead>
                            <tbody>
                                {classrooms?.map((classroom, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{classroom.class_name}</td>
                                        <td>
                                            {classroom.subject?.subject_name}
                                        </td>
                                        <td>
                                            <Link
                                                to={`/student/classrooms/schedule/${classroom.class_code}`}
                                            >
                                                <i class="fas fa-eye"></i>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewClassrooms;
