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
                    class_code: classes?.class_code,
                    class_name: classes?.class_name,
                    subject_name: classes?.subject_name,
                    teacher_code: classes?.teacher_code,
                    teacher_name: classes?.teacher_name,
                    total_student: classes?.total_student,
                    room_name: classes?.room_name,
                    session_name: classes?.session_name,
                    start: classes?.value?.["start"],
                    end: classes?.value?.["end"],
                })),
                columns: [
                    {
                        title: "#",
                        data: "stt",
                    },
                    {
                        title: "Lớp",
                        data: null,
                        render: function (row) {
                            return `<div class="class-link hover:text-blue-500" data-id="${
                                row.class_code
                            }">
                                   ${row.class_name ? row.class_name : ""}
                                </div>`;
                        },
                    },
                    {
                        title: "Môn",
                        data: null,
                        render: (row) =>
                            ` ${row.subject_name ? row.subject_name : ""}`,
                    },
                    {
                        title: "Số sinh viên",
                        data: null,
                        render: (row) =>
                            `${row.total_student ? row.total_student : "0"}`,
                        className: "text-center",
                    },
                    {
                        title: "Phòng học",
                        data: null,
                        render: (row) =>
                            `${
                                row.room_name ? row.room_name : "Chưa có phòng"
                            }`,
                    },
                    {
                        title: "Ca học",
                        data: null,
                        render: (row) => {
                            return `<div>${
                                row.session_name
                                    ? row.session_name
                                    : "Chưa xếp ca"
                            }</div>
                                    <div>(${row.start ? row.start : ""} - ${
                                row.end ? row.end : ""
                            })</div>`;
                        },
                    },
                    // {
                    //     title: "Lịch thi",
                    //     data: null,
                    //     render: function (row) {
                    //         return `<span class="schedule-exam-link" data-id="${row.class_code}" style="color:blue; cursor:pointer;">
                    //                 <i class="fas fa-eye"></i>
                    //             </span>`;
                    //     },
                    //     className: "text-center",
                    // },
                    {
                        title: "Hành động",
                        data: null,
                        render: function (row) {
                            return `
                                <button class="btn btn-primary btn-sm schedule-link" data-id="${row.class_code}" style="margin-right: 5px;">
                                    Lịch học
                                </button>
                                 <button class="btn btn-info btn-sm exam-link" data-id="${row.class_code}">
                               
                                    Lịch thi
                                </button>
                                <button class="btn btn-secondary btn-sm attendances-link" data-id="${row.class_code}" style="margin-right: 5px;">
                                    Điểm danh
                                </button>
                                <button class="btn btn-info btn-sm grades-link" data-id="${row.class_code}">
                                <i class='fas fa-list'></i>
                                    Điểm số
                                </button>
                            `;
                        },
                        className: "text-center text-nowrap",
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
                ".schedule-exam-link",
                function () {
                    const classCode = $(this).data("id");
                    navigate(`/teacher/class/${classCode}/examdays`);
                }
            );

            $("#classroomTable tbody").on(
                "click",
                ".schedule-link",
                function () {
                    const classCode = $(this).data("id");
                    navigate(`/teacher/class/${classCode}/schedules`);
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
            $("#classroomTable tbody").on("click", ".exam-link", function () {
                const classCode = $(this).data("id");
                navigate(`/teacher/class/${classCode}/examdays`);
            });
        }
    }, [classrooms, navigate]);

    return (
        <div className="row">
            <div className="col-md-12">
                <div className="card">
                    <div className="card-header">
                        <div className="card-title text-center">
                            Danh sách lớp học
                        </div>
                    </div>
                    <div className="card-body">
                        {isLoading ? (
                            <div>
                                <div
                                    className="spinner-border"
                                    role="status"
                                ></div>
                                <p>Đang tải dữ liệu</p>
                            </div>
                        ) : (
                            <table
                                id="classroomTable"
                                className="table table-hover table-bordered"
                            ></table>
                        )}
                        {error && (
                            <div>
                                <div className="alert alert-danger">
                                    {error.message}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClassroomList;
