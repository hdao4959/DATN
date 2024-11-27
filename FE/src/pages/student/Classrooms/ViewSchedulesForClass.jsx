import React, { useEffect } from "react";
import "datatables.net-dt/css/dataTables.dataTables.css";
import $ from "jquery";
import "datatables.net";
import api from "../../../config/axios";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

const ViewSchedulesForClass = () => {
    const { class_code } = useParams();

    const {
        data: schedules,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["LIST_SCHEDULES_FOR_CLASSS", class_code],
        queryFn: async () => {
            const res = await api.get(
                `/student/classrooms/${class_code}/schedules`
            );
            return res?.data;
        },
        onError: (error) => {
            console.error("Error fetching schedules:", error);
        },
    });

    useEffect(() => {
        if (schedules && schedules.length > 0) {
            const table = $("#schedulesTable").DataTable({
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

            return () => {
                table.destroy();
            };
        }
    }, [schedules]);

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
                <p className="text-danger">
                    Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.
                </p>
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
                    {!schedules?.length ? (
                        <p className="text-center">
                            Không có lịch học nào để hiển thị.
                        </p>
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
                                {schedules.map((schedule, index) => {
                                    const sessionValue = JSON.parse(
                                        schedule.session.value
                                    );
                                    return (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{schedule.class_code}</td>
                                            <td>{schedule.date}</td>
                                            <td>{schedule.room.cate_name}</td>
                                            <td>
                                                {schedule.session.cate_name}
                                            </td>
                                            <td>
                                                {`${sessionValue.start} - ${sessionValue.end}`}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewSchedulesForClass;
