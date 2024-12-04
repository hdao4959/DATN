import React, { useEffect } from "react";
import "datatables.net-dt/css/dataTables.dataTables.css";
import $ from "jquery";
import "datatables.net";
import api from "../../../config/axios";
import { useQuery } from "@tanstack/react-query";

const ViewExamSchedule = () => {
    const {
        data: examDays,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["LIST_EXAM_DAYS"],
        queryFn: async () => {
            try {
                const res = await api.get(`/student/examDays`);
                return res?.data?.examDays || [];
            } catch (error) {
                console.error("Lỗi khi gọi API:", error);
                return [];
            }
        },
    });

    useEffect(() => {
        if (examDays && examDays.length > 0) {
            $("#examDaysTable").DataTable({
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
    }, [examDays]);

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

    if (!examDays || examDays.length === 0) {
        return (
            <div className="text-center">
                <p>Không có ngày thi nào được tìm thấy.</p>
            </div>
        );
    }

    return (
        <div>
            <div className="card" style={{ minHeight: "800px" }}>
                <div className="card-header">
                    <h4 className="card-title">Lịch Thi</h4>
                </div>
                <div className="card-body">
                    <table
                        id="examDaysTable"
                        className="table table-bordered table-striped"
                    >
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Mã Môn</th>
                                <th>Tên Môn</th>
                                <th>Ngày Thi</th>
                                <th>Phòng Thi</th>
                                <th>Ca Thi</th>
                                <th>Thời Gian</th>
                                <th>Giảng Viên</th>
                            </tr>
                        </thead>
                        <tbody>
                            {examDays?.map((examDay, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{examDay.subject_code || "N/A"}</td>
                                    <td>{examDay.subject_name || "N/A"}</td>
                                    <td>
                                        {examDay.date
                                            ? new Date(
                                                  examDay.date
                                              ).toLocaleDateString("vi-VN", {
                                                  day: "2-digit",
                                                  month: "2-digit",
                                                  year: "numeric",
                                              })
                                            : "Không xác định"}
                                    </td>
                                    <td>
                                        {examDay.room_code ||
                                            "Không có thông tin"}
                                    </td>
                                    <td>
                                        {examDay.session_name ||
                                            "Không có thông tin"}
                                    </td>
                                    <td>
                                        {examDay.session_value
                                            ? `${
                                                  JSON.parse(
                                                      examDay.session_value
                                                  ).start
                                              } - ${
                                                  JSON.parse(
                                                      examDay.session_value
                                                  ).end
                                              }`
                                            : "Không có thông tin"}
                                    </td>
                                    <td>{examDay.teacher_code || "N/A"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ViewExamSchedule;
