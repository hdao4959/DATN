import React, { useEffect } from "react";
import "datatables.net-dt/css/dataTables.dataTables.css";
import $ from "jquery";
import "datatables.net";
import api from "../../../config/axios";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

const ViewClassrooms = () => {
    const {
        data: classrooms,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["LIST_CLASSROOMS"],
        queryFn: async () => {
            try {
                const res = await api.get(`/student/classrooms`);
                return res?.data || []; // Trả về mảng rỗng nếu không có dữ liệu
            } catch (error) {
                console.error("Lỗi khi gọi API:", error);
                return []; // Trả về mảng rỗng nếu có lỗi
            }
        },
    });

    useEffect(() => {
        if (classrooms && classrooms.length > 0) {
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

    // Kiểm tra trạng thái lỗi hoặc không có dữ liệu
    if (isLoading) {
        return (
            <div className="loading-spinner text-center">
                <div className="spinner-border" role="status"></div>
                <p>Đang tải dữ liệu...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-center">
                <p>Lỗi khi tải dữ liệu. Vui lòng thử lại sau.</p>
            </div>
        );
    }

    if (!classrooms || classrooms.length === 0) {
        return (
            <div className="text-center">
                <p>Không có lớp học nào được tìm thấy.</p>
            </div>
        );
    }

    return (
        <div>
            <div className="card" style={{ minHeight: "800px" }}>
                <div className="card-header">
                    <h4 className="card-title">Danh sách lớp học</h4>
                </div>
                <div className="card-body">
                    <table
                        id="classroomsTable"
                        className="table table-bordered table-striped"
                    >
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Tên lớp</th>
                                <th>Môn học</th>
                                <th>Giảng viên</th>
                                <th>Phòng học</th>
                                <th>Ca học</th>
                                <th>Thời gian</th>
                                <th>Lịch học</th>
                            </tr>
                        </thead>
                        <tbody>
                            {classrooms?.map((classroom, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>
                                        {classroom.class_name ||
                                            "Không có tên lớp"}
                                    </td>
                                    <td>
                                        {classroom.subject_name ||
                                            "Không có môn học"}
                                    </td>
                                    <td>
                                        {classroom.teacher_name ||
                                            "Không có giảng viên"}
                                    </td>
                                    <td>
                                        {classroom.room_name ||
                                            "Không có phòng học"}
                                    </td>
                                    <td>
                                        {classroom.session_name ||
                                            "Không có ca học"}
                                    </td>
                                    <td>
                                        {classroom.value &&
                                        classroom.value.start &&
                                        classroom.value.end
                                            ? `${classroom.value.start} - ${classroom.value.end}`
                                            : "Không có thời gian"}
                                    </td>
                                    <td>
                                        <Link
                                            to={`/student/classrooms/schedule/${classroom.class_code}`}
                                        >
                                            <i className="fas fa-eye"></i>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ViewClassrooms;
