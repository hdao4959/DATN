import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../../config/axios";
import { useQuery } from "@tanstack/react-query";
import $ from "jquery";
import "datatables.net-dt/css/dataTables.dataTables.css";
import dayjs from "dayjs";

const ClassSchedules = () => {
    const { class_code } = useParams();

    const { data, error, isLoading } = useQuery({
        queryKey: ["classSchedules", class_code],
        queryFn: async () => {
            const response = await api.get(
                `/teacher/classrooms/${class_code}/schedules`
            );
            return response.data;
        },
    });

    useEffect(() => {
        if (data && data.schedules && !isLoading) {
            $("#scheduleTable").DataTable({
                data: data.schedules,
                columns: [
                    {
                        title: "Ngày",
                        data: "date",
                        render: (date) =>
                            date
                                ? dayjs(date).format("DD/MM/YYYY")
                                : "Không xác định",
                    },
                    { title: "Ca học", data: "session_name" },
                    { title: "Phòng", data: "room_code" },
                    { title: "Loại", data: "type" },
                    { title: "Giảng viên", data: "teacher_name" },
                    {
                        title: "Thời gian",
                        data: "session_value",
                        render: (sessionValue) => {
                            const session = sessionValue
                                ? JSON.parse(sessionValue)
                                : {};
                            return session.start
                                ? `${session.start} - ${
                                      session.end || "Không xác định"
                                  }`
                                : "Không xác định";
                        },
                    },
                ],
                destroy: true,
            });
        }
    }, [data, isLoading]);

    if (isLoading) {
        return (
            <div
                className="d-flex justify-content-center align-items-center"
                style={{ height: "100%" }}
            >
                <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <p style={{ color: "red", textAlign: "center" }}>
                Lỗi khi tải dữ liệu: {error.message || "Không rõ nguyên nhân"}
            </p>
        );
    }

    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4 fs-5">
                Lịch học của lớp {class_code || "Không xác định"}
            </h1>
            <div className="table-responsive">
                <table
                    id="scheduleTable"
                    className="table table-bordered table-hover display"
                ></table>
            </div>
        </div>
    );
};

export default ClassSchedules;
