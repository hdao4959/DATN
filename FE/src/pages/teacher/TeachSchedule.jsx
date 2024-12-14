import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import api from "../../config/axios";
import "datatables.net-dt/css/dataTables.dataTables.css";
import $ from "jquery";
import "datatables.net";
import dayjs from "dayjs";

import isBetween from "dayjs/plugin/isBetween";

import { useNavigate } from "react-router-dom";

dayjs.extend(isBetween);

const MySchedule = () => {
    const navigate = useNavigate();

    const { data, isLoading } = useQuery({
        queryKey: ["MY_SCHEDULE"],
        queryFn: async () => {
            const res = await api.get("/teacher/schedules");
            return res?.data.data;
        },
    });

    const { currentSchedule, next7DaysSchedule } = useMemo(() => {
        const currentSchedule = data?.filter((it) =>
            dayjs(it.date).isSame(dayjs(), "date")
        );

        const next7DaysSchedule = data?.filter((it) => {
            const status = dayjs(it.date).isBetween(
                dayjs(),
                dayjs().add(7, "day"),
                "day",
                "[)"
            );

            return status;
        });

        return { currentSchedule, next7DaysSchedule };
    }, [data]);

    useEffect(() => {
        const interval = setInterval(() => {
            $(".countdown").each(function () {
                if ($(this).hasClass("c-before")) {
                    const time = parseInt($(this).attr("data-time"), 10) - 1;
                    $(this).attr("data-time", time);
                    $(this).text(`Điểm danh sau ${formatTime(time)}`);
                } else if ($(this).hasClass("c-middle")) {
                    const time = parseInt($(this).attr("data-time"), 10) - 1;
                    $(this).attr("data-time", time);
                    $(this).text(`Điểm danh còn ${formatTime(time)}`);
                } else {
                    const time = parseInt($(this).attr("data-time"), 10) + 1;
                    $(this).attr("data-time", time);
                    $(this).text(`Đã qua ${formatTime(time)}`);
                }
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const formatTime = (totalSeconds) => {
        const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
        const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
        const seconds = String(totalSeconds % 60).padStart(2, "0");
        return `${hours}:${minutes}:${seconds}`;
    };

    useEffect(() => {
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
                title: "Môn học",
                data: "subject_name",
            },
            {
                title: "Sinh viên",
                data: "count_users",
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
                title: "Ca học",
                data: "session_name",
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
            {
                title: "Điểm danh",
                data: null,
                render: (row) => {
                    const isToday = dayjs(row.date).isSame(dayjs(), "date");
                    const sessionValParse = JSON.parse(row.session);
                    const startTime = dayjs(`${row.date}T${sessionValParse.start}`);
                    // const startTime = dayjs(`${row.date}T${'19:40'}`);
                    const endTime = startTime.add(15, "minute");

                    if (isToday) {
                        const now = dayjs();
                        if (now.isBefore(startTime)) {
                            // Trước StartTime
                            const timeLeft = startTime.diff(now, "second");

                            return `<button class="btn btn-secondary btn-sm">
                                        <span class="countdown c-before" data-time="${timeLeft}">
                                            Điểm danh sau ${formatTime(timeLeft)}
                                        </span>
                                        <p> <i class='fas fa-times'> Điểm danh</i></p>
                                    </button>
                                    `;
                        } else if (now.isBetween(startTime, endTime)) {
                            // Trong vòng 15 phút sau StartTime
                            const timeLeft = endTime.diff(now, "second");
                            
                            return `<button class="btn btn-success btn-sm attendances-link" data-id="${row.class_code}" data-date="${row.date}">
                                        <span class="countdown c-middle" data-time="${timeLeft}">
                                            Điểm danh còn ${formatTime(timeLeft)}
                                        </span>
                                        <p> <i class='fas fa-arrow-right'> Điểm danh</i></p>
                                    </button>
                                    `;
                        } else {
                            // Sau 15 phút từ StartTime
                            const timePassed = now.diff(endTime, "second");
                            
                            return `<button class="btn btn-danger btn-sm attendances-link" data-id="${row.class_code}" data-date="${row.date}">
                                        <span class="countdown c-after" data-time="${timePassed}">
                                                    Đã qua ${formatTime(timePassed)}
                                                </span>
                                        <p> <i class='fas fa-arrow-right'> Xem điểm danh</i></p>
                                    </button>
                                    `;
                        }
                    }
                    return "";
                },
                className: "text-nowrap text-center",
            },
        ];

        if (currentSchedule) {
            if ($.fn.dataTable.isDataTable("#major-table")) {
                $("#major-table").DataTable().clear().destroy();
            }
            $("#major-table").DataTable({
                data: currentSchedule,
                pageLength: 10,
                lengthMenu: [10, 20, 50],
                columns,
                order: [[5, "asc"]],
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
            $("#major-table tbody").on("click", ".attendances-link", function () {
                const classCode = $(this).data("id");
                const date = $(this).data("date");
                navigate(`/teacher/class/${classCode}/attendances/${date}`);
            });
        }

        if (next7DaysSchedule) {
            if ($.fn.dataTable.isDataTable("#next-7-days")) {
                $("#next-7-days").DataTable().clear().destroy();
            }
            $("#next-7-days").DataTable({
                pageLength: 10,
                lengthMenu: [10, 20, 50],
                data: next7DaysSchedule,
                processing: true,
                serverSide: true,
                ajax: async (data, callback) => {
                    try {
                        const page = data.start / data.length + 1;
                        const response = await api.get(`/teacher/schedules`, {
                            params: { page, per_page: data.length },
                        });
                        const result = response.data;
                        callback({
                            draw: data.draw,
                            recordsTotal: result.total,
                            recordsFiltered: result.total,
                            data: result.data,
                        });
                    } catch (error) {
                        console.error("Error fetching data:", error);
                    }
                },
                columns,
                order: [[5, "asc"]],
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
            $("#next-7-days tbody").on("click", ".attendances-link", function () {
                const classCode = $(this).data("id");
                const date = $(this).data("date");
                navigate(`/teacher/class/${classCode}/attendances/${date}`);
            });
        }

        return () => {
            if ($.fn.dataTable.isDataTable("#major-table")) {
                $("#major-table").DataTable().clear().destroy();
            }
            if ($.fn.dataTable.isDataTable("#next-7-days")) {
                $("#next-7-days").DataTable().clear().destroy();
            }
        };
    }, [currentSchedule, next7DaysSchedule]);

    return (
        <>
            <div className="card mt-4">
                <div className="card-header">
                    <h4 className="card-title">Lịch dạy hôm nay</h4>
                </div>
                <div className="card-body">
                    <table id="major-table" className="table">
                        {isLoading && <p>Đang tải dữ liệu...</p>}
                    </table>
                </div>
            </div>

            <div className="card mt-4">
                <div className="card-header">
                    <h4 className="card-title">Lịch dạy 7 ngày tới</h4>
                </div>
                <div className="card-body">
                    <table id="next-7-days" className="table">
                        {isLoading && <p>Đang tải dữ liệu...</p>}
                    </table>
                </div>
            </div>
        </>
    );
};

export default MySchedule;
