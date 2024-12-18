import React, { useEffect, useState, useRef } from "react";
import "datatables.net-dt/css/dataTables.dataTables.css";
import $ from "jquery";
import "datatables.net";
import api from "../../../config/axios";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);

const ViewSchedules = () => {
    const tableRefToday = useRef(null);
    const tableRefAll = useRef(null);
    const [todaySchedules, setTodaySchedules] = useState([]);
    const [allSchedules, setAllSchedules] = useState([]);

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
                return null;
            }
        },
    });

    const columns = [
        {
            title: "Lớp",
            data: "class_code",
        },
        {
            title: "Mã môn",
            data: "subject_code",
        },
        {
            title: "Tên môn",
            data: "subject_name",
        },
        {
            title: "Ca học",
            data: "session_name",
        },
        {
            title: "Thời gian",
            data: "session",
            render: (session) => {
                const sessionValParse = JSON.parse(session);

                return `${sessionValParse.start} - ${sessionValParse.end}`;
            },
        },
        {
            title: "Phòng học",
            data: "room_code",
        },
        {
            title: "Ngày",
            data: "date",
            render: (date) => dayjs(date).format("DD/MM/YYYY"),
        },
    ];

    useEffect(() => {
        if (schedules && schedules.length > 0) {
            const today = new Date();
            const filteredTodaySchedules = schedules.filter((schedule) => {
                const scheduleDate = new Date(schedule.date);
                return scheduleDate.toDateString() === today.toDateString();
            });

            const filteredAllSchedules = schedules.filter((schedule) => {
                const scheduleDate = new Date(schedule.date);
                return scheduleDate >= today;
            });

            setTodaySchedules(filteredTodaySchedules);
            setAllSchedules(filteredAllSchedules);

            // Khởi tạo DataTable cho lịch hôm nay
            if ($.fn.dataTable.isDataTable(tableRefToday.current)) {
                $(tableRefToday.current).DataTable().clear().destroy();
            }
            $(tableRefToday.current).DataTable({
                data: filteredTodaySchedules,
                pageLength: 10,
                lengthMenu: [10, 20, 50],
                columns,
                minWitd: 200,
                order: [[6, "asc"]], // Sắp xếp theo ngày (cột 6)
                language: {
                    paginate: {
                        previous: "Trước",
                        next: "Tiếp theo",
                    },
                    lengthMenu: "Hiển thị _MENU_ mục mỗi trang",
                    info: "Hiển thị từ _START_ đến _END_ trong _TOTAL_ mục",
                    search: "Tìm kiếm:",
                },
                scrollX: true,
                autoWidth: true, // Tự động điều chỉnh chiều rộng cột
                scrollCollapse: true,
            });

            // Khởi tạo DataTable cho tất cả lịch học
            if ($.fn.dataTable.isDataTable(tableRefAll.current)) {
                $(tableRefAll.current).DataTable().clear().destroy();
            }
            $(tableRefAll.current).DataTable({
                data: filteredAllSchedules,
                pageLength: 10,
                lengthMenu: [10, 20, 50],
                columns,
                order: [[6, "asc"]], // Sắp xếp theo ngày (cột 6)
                language: {
                    paginate: {
                        previous: "Trước",
                        next: "Tiếp theo",
                    },
                    lengthMenu: "Hiển thị _MENU_ mục mỗi trang",
                    info: "Hiển thị từ _START_ đến _END_ trong _TOTAL_ mục",
                    search: "Tìm kiếm:",
                },
                scrollX: true,
            });
        }

        // Cleanup khi component unmount
        return () => {
            if ($.fn.dataTable.isDataTable(tableRefToday.current)) {
                $(tableRefToday.current).DataTable().clear().destroy();
            }
            if ($.fn.dataTable.isDataTable(tableRefAll.current)) {
                $(tableRefAll.current).DataTable().clear().destroy();
            }
        };
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
            <div className="card">
                <div className="card-header">
                    <h4 className="card-title">Lịch Học Hôm Nay</h4>
                </div>
                <div className="card-body">
                    <table
                        ref={tableRefToday}
                        id="schedulesTableToday"
                        className="table table-bordered table-striped"
                    >
                        <thead>
                            <tr>
                                <th>Lớp</th>
                                <th>Mã Môn</th>
                                <th>Tên Môn</th>
                                <th>Ca Học</th>
                                <th>Thời Gian</th>
                                <th>Phòng Học</th>
                                <th>Ngày</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Dữ liệu hôm nay sẽ được thêm vào DataTable */}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <h4 className="card-title">Lịch học</h4>
                </div>
                <div className="card-body">
                    <table
                        ref={tableRefAll}
                        id="schedulesTableAll"
                        className="table table-bordered table-striped"
                    >
                        <thead>
                            <tr>
                                <th>Lớp</th>
                                <th>Mã Môn</th>
                                <th>Tên Môn</th>
                                <th>Ca Học</th>
                                <th>Thời Gian</th>
                                <th>Phòng Học</th>
                                <th>Ngày</th>
                            </tr>
                        </thead>
                        <tbody>
                            {schedules?.map((schedule, index) => (
                                <tr key={schedule.id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        {schedule.date
                                            ? // new Date(
                                              schedule.date
                                            : //   ).toLocaleDateString()
                                              "Không xác định"}{" "}
                                        {/* Kiểm tra nếu date không có */}
                                    </td>
                                    <td>{schedule.class_code || "N/A"}</td>{" "}
                                    {/* Kiểm tra nếu class_code không có */}
                                    <td>
                                        {schedule.room_code ||
                                            "Không có thông tin"}
                                    </td>{" "}
                                    {/* Kiểm tra nếu room_code không có */}
                                    <td>
                                        {schedule.session_name ||
                                            "Không có thông tin"}
                                    </td>{" "}
                                    {/* Kiểm tra nếu session_code không có */}
                                    <td>
                                        {schedule.session_value
                                            ? `${
                                                  JSON.parse(
                                                      schedule.session_value
                                                  ).start
                                              }` +
                                              " - " +
                                              `${
                                                  JSON.parse(
                                                      schedule.session_value
                                                  ).end
                                              }`
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
