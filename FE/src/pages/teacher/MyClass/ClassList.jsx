import React, { useEffect } from "react";
import "datatables.net-dt/css/dataTables.dataTables.css";
import $ from "jquery";
import "datatables.net";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query"; // Import useQuery

const ClassroomList = () => {
    const navigate = useNavigate();

    const { data: classrooms, isLoading, error, refetch } = useQuery({
        queryKey: ["classrooms"],
        queryFn: async () => {
            const token = JSON.parse(localStorage.getItem("token"));
            const accessToken = token?.access_token;

            if (!accessToken) {
                throw new Error("Vui lòng đăng nhập để xem danh sách lớp học.");
            }

            const response = await fetch("http://127.0.0.1:8000/api/teacher/classrooms", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Lỗi khi tải danh sách lớp học. Vui lòng thử lại sau.");
            }

            const data = await response.json() || [];
            if (data.length === 0) {
                throw new Error("Không có dữ liệu lớp học nào.");
            }
            return data;
        }
    });
    useEffect(() => {
        refetch();
    }, [])

    // Khởi tạo DataTable sau khi dữ liệu được load
    useEffect(() => {
        if (classrooms) {
            if ($.fn.dataTable.isDataTable("#classroomTable")) {
                $("#classroomTable").DataTable().destroy(true);
            }
            $("#classroomTable").DataTable({
                data: classrooms?.map((classes, index) => ({
                    stt: index + 1,
                    // class_code: classes.class_code,
                    class_name: classes.class_name,
                    // subject_code: classes.subject_code,
                    subject_name: classes.subject_name,
                    teacher_code: classes.teacher_code,
                    teacher_name: classes.teacher_name,
                    total_student: classes.total_student,
                    room_name: classes?.room_name,
                    session_name: classes.session_name,
                    start: classes?.value?.['start'],
                    end: classes?.value?.['end'],
                })),
                columns: [
                    {
                        title: "#",
                        data: 'stt',
                    },
                    {
                        title: "<i class='fas fa-chalkboard-teacher'> Lớp</i>",
                        data: null,
                        render: (row) => `${row.class_code ? row.class_code : ''} - ${row.class_name ? row.class_name : ''}`
                    },
                    {
                        title: "<i class='fas fa-book'> Môn</i>",
                        data: null,
                        render: (row) => `${row.subject_code ? row.subject_code : ''} - ${row.subject_name ? row.subject_name : ''}`
                    },
                    {
                        title: "<i class='fas fa-users'> Số sinh viên</i>",
                        data: null,
                        render: (row) => `${row.total_student ? row.total_student : '0'} <i class='far fa-user-graduate'></i>`,
                        className: "text-center"
                    },
                    {
                        title: "<i class='fas fa-building'> Phòng học</i>",
                        data: null,
                        render: (row) => `${row.room_name ? row.room_name : 'Chưa có phòng'}`
                    },
                    {
                        title: "<i class='fas fa-clock'> Ca học</i>",
                        data: null,
                        render: (row) => {
                            return `<div>${row.session_name ? row.session_name : 'Chưa xếp ca'}</div>
                                    <div>(${row.start ? row.start : ''} - ${row.end ? row.end : ''})</div>`
                        }
                    },
                    {
                        title: "Xem Lớp",
                        data: null,
                        render: function (row) {
                            return `<span class="class-link" data-id="${row.class_code}" style="color:blue; cursor:pointer;">
                                    <i class="fas fa-eye"></i>
                                </span>`;
                        },
                        className: 'text-center'
                    },
                    {
                        title: "<i class='fas fa-calendar-alt'> Lịch học</i>",
                        data: null,
                        render: function (row) {
                            return `<span class="schedule-link" data-id="${row.class_code}" style="color:blue; cursor:pointer;">
                                    <i class="fas fa-eye"></i>
                                </span>`;
                        },
                        className: 'text-center'
                    },
                    {
                        title: "<i class='fas fa-calendar-check'> Lịch thi</i>",
                        data: null,
                        render: function (row) {
                            return `<span class="schedule-exam-link" data-id="${row.classCode}" style="color:blue; cursor:pointer;">
                                    <i class="fas fa-eye"></i>
                                </span>`;
                        },
                        className: 'text-center'
                    },
                    {
                        title: "<i class='fas fa-user-check'> Điểm danh</i>",
                        data: null,
                        render: function (row) {
                            return `<span class="attendances-link" data-id="${row.class_code}" style="color:blue; cursor:pointer;">
                                    <i class="fas fa-eye"></i>
                                </span>`;
                        },
                        className: 'text-center'
                    },
                    {
                        title: "<i class='fas fa-trophy'> Điểm số</i>",
                        data: null,
                        render: function (row) {
                            return `<span class="grades-link" data-id="${row.class_code}" style="color:blue; cursor:pointer;">
                                    <i class="fas fa-eye"></i>
                                </span>`;
                        },
                        className: 'text-center'
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
                headerCallback: function (thead, data, start, end, display) {
                    $(thead).find("th").css({
                        backgroundColor: "#007bff",
                        color: "white",
                        padding: "10px",
                        borderRadius: "5px",
                    });
                },
                createdRow: function (row, data, dataIndex) {
                    // Thêm màu nền cho hàng chẵn và lẻ
                    if (dataIndex % 2 === 0) {
                        $(row).css("background-color", "#f9f9f9");
                    } else {
                        $(row).css("background-color", "#e9ecef");
                    }
                },
            });
            $("#classroomTable tbody").on("click", ".schedule-link", function () {
                const classCode = $(this).data("id");
                navigate(`/teacher/class/${classCode}/schedules`);
            });
            $("#classroomTable tbody").on("click", ".class-link", function () {
                const classCode = $(this).data("id");
                navigate(`/teacher/class/${classCode}/students`);
            });
            $("#classroomTable tbody").on("click", ".attendances-link", function () {
                const classCode = $(this).data("id");
                navigate(`/teacher/class/${classCode}/attendances`);
            });
            $("#classroomTable tbody").on("click", ".grades-link", function () {
                const classCode = $(this).data("id");
                navigate(`/teacher/class/${classCode}/grades`);
            });
        }
    }, [classrooms, navigate]);

    return (
        <div className="row">
            <div className="col-md-12">
                <div className="card">
                    <div className="card-header">
                        <div className="card-title text-center">Danh sách lớp học</div>
                    </div>
                    <div className='card-body'>
                        {isLoading ? (
                            <div>
                                <div className="spinner-border" role="status"></div>
                                <p>Đang tải dữ liệu</p>
                            </div>
                        ) : (
                                <table id="classroomTable" className="table table-hover table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Mã lớp</th>
                                            <th>Tên lớp</th>
                                            <th>Tên môn học</th>
                                            <th>Lịch học</th>
                                            <th>Trạng thái</th>
                                        </tr>
                                    </thead>
                                </table>
                        )}
                        {error && (
                            <div>
                                <div className="alert alert-danger">{error.message}</div>;
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClassroomList;
