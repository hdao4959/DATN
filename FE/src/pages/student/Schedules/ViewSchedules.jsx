import React, { useEffect } from "react";
import "datatables.net-dt/css/dataTables.dataTables.css";
import $ from "jquery";
import "datatables.net";
import api from "../../../config/axios";
import { useQuery } from "@tanstack/react-query";

const ViewSchedules = () => {
    const {
        data: schedules,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["LIST_SCHEDULES"],
        queryFn: async () => {
            try {
                const res = await api.get(`/student/schedules`);
                return res?.data;
            } catch (error) {
                console.error("Lỗi khi gọi API:", error);
                return null; // Trả về null khi có lỗi
            }
        },
    });

    useEffect(() => {
        if (schedules && schedules.length > 0) {
            $("#schedulesTable").DataTable({
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
    }, [schedules]);

    // Kiểm tra trạng thái dữ liệu
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

    if (!schedules || schedules.length === 0) {
        return (
            <div className="text-center">
                <p>Không có lịch học nào được tìm thấy.</p>
            </div>
        );
    }

    return (
        <div>
            <div className="card" style={{ minHeight: "800px" }}>
                <div className="card-header">
                    <h4 className="card-title">Lịch Học</h4>
                </div>
                <div className="card-body">
                    <table
                        id="schedulesTable"
                        className="table table-bordered table-striped"
                    >
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Mã Lớp</th>
                                <th>Ngày</th>
                                <th>Phòng</th>
                                <th>Ca Học</th>
                                <th>Thời Gian</th>
                            </tr>
                        </thead>
                        <tbody>
                            {schedules?.map((schedule, index) => (
                                <tr key={schedule.id}>
                                    <td>{index + 1}</td>
                                    <td>{schedule.class_code || "N/A"}</td>{" "}
                                    {/* Kiểm tra nếu class_code không có */}
                                    <td>
                                        {schedule.date
                                            ? new Date(
                                                  schedule.date
                                              ).toLocaleDateString()
                                            : "Không xác định"}{" "}
                                        {/* Kiểm tra nếu date không có */}
                                    </td>
                                    <td>
                                        {schedule.room_code ||
                                            "Không có thông tin"}
                                    </td>{" "}
                                    {/* Kiểm tra nếu room_code không có */}
                                    <td>
                                        {schedule.session_code ||
                                            "Không có thông tin"}
                                    </td>{" "}
                                    {/* Kiểm tra nếu session_code không có */}
                                    <td>
                                        {schedule.session_code
                                            ? `${schedule.session_code} (Thời gian chưa có trong data)`
                                            : "Không có thông tin"}
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

export default ViewSchedules;
