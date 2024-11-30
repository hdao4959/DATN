import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import api from "../../config/axios";
import "datatables.net-dt/css/dataTables.dataTables.css";
import $ from "jquery";
import "datatables.net";
import dayjs from "dayjs";

import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);

const MySchedule = () => {
    const { data, isLoading } = useQuery({
        queryKey: ["MY_SCHEDULE"],
        queryFn: async () => {
            const res = await api.get("/teacher/schedules");
            return res?.data;
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
        const columns = [
            {
                title: "Lớp",
                data: "class_code",
            },
            {
                title: "Phòng học",
                data: "room_code",
            },
            {
                title: "Môn học",
                data: "classroom",
                render: (classroom) => {
                    return `${classroom.subject_code}`;
                },
            },
            {
                title: "Ngày",
                data: "date",
                render: (date) => dayjs(date).format("DD/MM/YYYY"),
            },
            {
                title: "Ca",
                data: "session",
                render: (session) => {
                    const sessionValParse = JSON.parse(session.value);

                    return `${session.cate_name} (${sessionValParse.start} - ${sessionValParse.end})`;
                },
            },
        ];

        if (currentSchedule) {
            if ($.fn.dataTable.isDataTable("#major-table")) {
                $("#major-table").DataTable().clear().destroy();
            }
            $("#major-table").DataTable({
                pageLength: 10,
                lengthMenu: [10, 20, 50],
                data: currentSchedule,
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
        }

        if (next7DaysSchedule) {
            if ($.fn.dataTable.isDataTable("#next-7-days")) {
                $("#next-7-days").DataTable().clear().destroy();
            }
            $("#next-7-days").DataTable({
                pageLength: 10,
                lengthMenu: [10, 20, 50],
                data: next7DaysSchedule,
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
