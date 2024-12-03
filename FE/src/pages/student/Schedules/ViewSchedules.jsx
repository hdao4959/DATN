import React, { useEffect } from "react";
import "datatables.net-dt/css/dataTables.dataTables.css";
import $ from "jquery";
import "datatables.net";
import api from "../../../config/axios";
import { useQuery } from "@tanstack/react-query";

const ViewSchedules = () => {
    const { data: schedules, isLoading } = useQuery({
        queryKey: ["LIST_SCHEDULES"],
        queryFn: async () => {
            const res = await api.get(`/student/schedules`);
            return res?.data;
        },
    });

    useEffect(() => {
        if (schedules) {
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

    return (
        <div>
            <div className="card" style={{ minHeight: "800px" }}>
                <div className="card-header">
                    <h4 className="card-title">Lịch Học</h4>
                </div>
                <div className="card-body">
                    {isLoading ? (
                        <div className="loading-spinner text-center">
                            <div className="spinner-border" role="status"></div>
                            <p>Đang tải dữ liệu...</p>
                        </div>
                    ) : (
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
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{schedule.class_code}</td>
                                        <td>{schedule.date}</td>
                                        <td>{schedule?.room_code}</td>
                                        <td>{schedule?.session_code}</td>
                                        {/* <td>
                                            {JSON.parse(schedule.session.value)
                                                .start +
                                                " - " +
                                                JSON.parse(
                                                    schedule.session.value
                                                ).end}
                                        </td> */}
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

export default ViewSchedules;
