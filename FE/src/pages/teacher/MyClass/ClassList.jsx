
import React, { useEffect } from "react";
import "datatables.net-dt/css/dataTables.dataTables.css";
import $ from "jquery";
import "datatables.net";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../../../config/axios"; // Import module API đã config sẵn


const ClassroomList = () => {
    const navigate = useNavigate();

    const {
        data: classrooms,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ["classrooms"],
        queryFn: async () => {
            const response = await api.get("/teacher/classrooms");
            if (!response.data || response.data.length === 0) {
                throw new Error("Không có dữ liệu lớp học nào.");
            }
            return response.data;
        },
        refetchOnWindowFocus: true,
    });

    useEffect(() => {
        refetch();
    }, [refetch]);

    useEffect(() => {
        if (classrooms) {
            if ($.fn.dataTable.isDataTable("#classroomTable")) {
                $("#classroomTable").DataTable().destroy(true);
            }
            $("#classroomTable").DataTable({
                data: classrooms?.map((classes, index) => ({
                    stt: index + 1,
                    class_code: classes.class_code,
                    class_name: classes.class_name,
                    subject_name: classes.subject_name,
                    teacher_code: classes.teacher_code,
                    teacher_name: classes.teacher_name,
                    total_student: classes.total_student,
                    room_name: classes?.room_name,
                    session_name: classes.session_name,
                    start: classes?.value?.["start"],
                    end: classes?.value?.["end"],
                })),
                columns: [
                    {
                        title: "#",
                        data: "stt",
                    },
                    {
                        title: "<i class='fas fa-chalkboard-teacher'> Lớp</i>",
                        data: "class_name",
                    },
                    {
                        title: "<i class='fas fa-book'> Môn</i>",
                        data: "subject_name",
                    },
                    {
                        title: "<i class='fas fa-users'> Số sinh viên</i>",
                        data: "total_student",
                        className: "text-center",
                    },
                    {
                        title: "<i class='fas fa-building'> Phòng học</i>",
                        data: "room_name",
                        render: (data) => (data ? data : "Chưa có phòng"),
                    },
                    {
                        title: "<i class='fas fa-clock'> Ca học</i>",
                        data: null,
                        render: (row) => {
                            return `<div>${row.session_name
                                    ? row.session_name
                                    : "Chưa xếp ca"
                                }</div>
                                    <div>(${row.start ? row.start : ""} - ${row.end ? row.end : ""
                                })</div>`;
                        },
                    },
                    {
                        title: "Xem Lớp",
                        data: null,
                        render: function (row) {
                            return `<span class="class-link" data-id="${row.class_code}" style="color:blue; cursor:pointer;">
                                    <i class="fas fa-eye"></i>
                                </span>`;
                        },
                        className: "text-center",
                    },
                    {
                        title: "<i class='fas fa-calendar-alt'> Lịch học</i>",
                        data: null,
                        render: function (row) {
                            return `<span class="schedule-link" data-id="${row.class_code}" style="color:blue; cursor:pointer;">
                                    <i class="fas fa-eye"></i>
                                </span>`;
                        },
                        className: "text-center",
                    },
                    {
                        title: "<i class='fas fa-calendar-check'> Lịch thi</i>",
                        data: null,
                        render: function (row) {
                            return `<span class="schedule-exam-link" data-id="${row.class_code}" style="color:blue; cursor:pointer;">
                                    <i class="fas fa-eye"></i>
                                </span>`;
                        },
                        className: "text-center",
                    },
                    {
                        title: "<i class='fas fa-user-check'> Điểm danh</i>",
                        data: null,
                        render: function (row) {
                            return `<span class="attendances-link" data-id="${row.class_code}" style="color:blue; cursor:pointer;">
                                    <i class="fas fa-eye"></i>
                                </span>`;
                        },
                        className: "text-center",
                    },
                    {
                        title: "<i class='fas fa-trophy'> Điểm số</i>",
                        data: null,
                        render: function (row) {
                            return `<span class="grades-link" data-id="${row.class_code}" style="color:blue; cursor:pointer;">
                                    <i class="fas fa-eye"></i>
                                </span>`;
                        },
                        className: "text-center",
                    },
                ],
                language: {
                    processing: "Đang tải...",
                    search: "<i class='fas fa-search'> Tìm kiếm: </i>",
                    lengthMenu: "Hiển thị _MENU_ lớp học",
                    info: "Hiển thị _START_ đến _END_ của _TOTAL_ lớp học",
                    infoEmpty: "Không có dữ liệu",
                    emptyTable: "Không có lớp học nào",
                    paginate: {
                        first: "Đầu",
                        previous: "Trước",
                        next: "Tiếp",
                        last: "Cuối",
                    },
                },
                scrollX: true,
            });

            $("#classroomTable tbody").on(
                "click",
                ".schedule-link",
                function () {
                    const classCode = $(this).data("id");
                    navigate(`/teacher/class/${classCode}/schedules`);
                }
            );
            $("#classroomTable tbody").on(
                "click",
                ".schedule-exam-link",
                function () {
                    const classCode = $(this).data("id");
                    navigate(`/teacher/class/${classCode}/examdays`);
                }
            );
            $("#classroomTable tbody").on("click", ".class-link", function () {
                const classCode = $(this).data("id");
                navigate(`/teacher/class/${classCode}/students`);
            });
            $("#classroomTable tbody").on(
                "click",
                ".attendances-link",
                function () {
                    const classCode = $(this).data("id");
                    navigate(`/teacher/class/${classCode}/attendances`);
                }
            );
            $("#classroomTable tbody").on("click", ".grades-link", function () {
                const classCode = $(this).data("id");
                navigate(`/teacher/class/${classCode}/grades`);
            });
        }
    }, [classrooms, navigate]);

    useEffect(() => {
        if (classrooms.length) {
            $("#classroomTable").DataTable({
                data: classrooms,
                paging: true,
                searching: true,
                ordering: true,
                destroy: true,
                pageLength: 10,
                lengthMenu: [10, 20, 50, 100],
                language: {
                    paginate: {
                        previous: 'Trước',
                        next: 'Tiếp theo',
                    },
                    lengthMenu: 'Hiển thị _MENU_ mục mỗi trang',
                    info: 'Hiển thị từ <strong>_START_</strong> đến <strong>_END_</strong> trong <strong>_TOTAL_</strong> mục',
                    search: 'Tìm kiếm:',
                },
                columns: [
                    {
                        title: "Mã lớp",
                        data: "class_code",
                        render: (data) => (
                            `<a href='/teacher/class/${data}/students'>
                                ${data}
                            </a>`
                        ),
                    },
                    {
                        title: "Tên lớp",
                        data: "class_name",
                    },
                    {
                        title: "Tên môn học",
                        data: "subject",
                        render: (data) => {
                            return data && data.subject_name
                                ? data.subject_name
                                : "Chưa có dữ liệu";
                        },
                    },
                    {
                        title: "Lịch học",
                        data: "class_code",
                        render: (data) => (
                            `<a
                                href='/teacher/class/${data}/schedules'
                            >
                                <i class="fas fa-eye"></i>
                            </a>`
                        ),
                    },
                    {
                        title: "Trạng thái",
                        data: "is_active",
                        render: (data) => {
                            return data ? (
                                `<i class="fas fa-check-circle text-green-500" ></i>`
                            ) : (
                                `<i class="fas fa-times-circle text-red-500"></i>`
                            );
                        },
                    }
                ],
            });
        }
    }, [classrooms]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4 fs-5">Danh sách lớp học</h1>

            {errorMessage ? (
                <div className="alert alert-danger" role="alert">
                    {errorMessage}
                </div>
            ) : (
                <table
                    id="classroomTable" className="table table-hover table-bordered text-center">
                </table>
            )}

        </div>
    );
};

export default ClassroomList;
