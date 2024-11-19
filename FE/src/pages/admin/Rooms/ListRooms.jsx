import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../../config/axios";
import { getToken } from "../../../utils/getToken";
import 'datatables.net-dt/css/dataTables.dataTables.css';
import $ from 'jquery';
import 'datatables.net';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
const ClassRoomsList = () => {
    const accessToken = getToken();
    const navigate = useNavigate(); // Hook dùng để điều hướng trong React Router v6

    const { data, refetch } = useQuery({
        queryKey: ["LIST_ROOMS"],
        queryFn: async () => {
            const res = await api.get("/admin/classrooms", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            });
            return res.data;
        },
    });
    const classrooms = data?.classrooms?.data || [];

    const { mutate, isLoading } = useMutation({
        mutationFn: (class_code) =>
            api.delete(`/admin/classrooms/${class_code}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            }),
        onSuccess: () => {
            alert("Xóa phòng học thành công");
            refetch();
        },
        onError: () => {
            alert("Có lỗi xảy ra khi xóa phòng học");
        },
    });

    const handleDelete = (class_code) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa phòng học này không?")) {
            mutate(class_code);
        }
    };

    useEffect(() => {
        if (classrooms) {
            $('#classroomsTable').DataTable({
                data: classrooms,
                processing: true,
                serverSide: true, 
                ajax: async (data, callback) => {
                    try {
                        const page = data.start / data.length + 1;
                        const response = await api.get(`/admin/attendances`, {
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
                columns: [
                    { title: "Mã lớp", data: "class_code" },
                    { title: "Tên lớp", data: "class_name" },
                    { title: "Mã môn", data: "subject_code" },
                    {
                        title: "Trạng thái",
                        data: "is_active",
                        className: "text-center",
                        render: (data, type, row) => {
                            return data === true
                                ? `<i class="fas fa-check-circle toggleStatus" style="color: green; font-size: 20px;"></i>`
                                : `<i class="fas fa-times-circle toggleStatus" style="color: red; font-size: 20px;"></i>`;
                        }
                    },
                    {
                        title: "Hành động",
                        data: null,
                        render: (data, type, row) => {
                            return `
                                <div style="display: flex; justify-content: center; align-items: center;gap: 10px">
                                    <i class="fas fa-edit" style="cursor: pointer; font-size: 20px;" data-id="${row.class_code}" id="edit_${row.class_code}"></i>
                                    <i class="fas fa-trash" 
                                        style="cursor: pointer; color: red; font-size: 20px;" 
                                        data-id="${row.class_code}" 
                                        id="delete_${row.class_code}"></i>
                                </div>
                            `;
                        }
                    }
                ],
                pageLength: 10,
                lengthMenu: [10, 20, 50, 100],
                language: {
                    paginate: { previous: 'Trước', next: 'Tiếp theo' },
                    lengthMenu: 'Hiển thị _MENU_ mục mỗi trang',
                    info: 'Hiển thị từ _START_ đến _END_ trong _TOTAL_ mục',
                    search: 'Tìm kiếm:'
                },
                destroy: true,
                createdRow: (row, data, dataIndex) => {
                    // Gắn sự kiện xóa sau khi bảng được vẽ
                    $(row).find('.fa-trash').on('click', function () {
                        const classCode = $(this).data('id');
                        handleDelete(classCode);
                    });

                    $(row).find('.fa-edit').on('click', function () {
                        const classCode = $(this).data('id');
                        console.log(classCode);
                        
                        navigate(`/admin/classrooms/edit/${classCode}`);

                    });
                }
            })
        }
    }, [classrooms]);

    if (!data) return <div>Loading...</div>;

    return (
        <>
            <div className="mb-3 mt-2 flex items-center justify-between">
                <Link to="/admin/classrooms/step">
                    <button className="btn btn-primary">
                        Tạo lớp học mới
                    </button>
                </Link>
            </div>

            <div className="card">
                <div className="card-header">
                    <h4 className="card-title">Classrooms Management</h4>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table id="classroomsTable" className="display"></table>
                            {/* <table className="display table table-striped table-hover">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Mã lớp học</th>
                                        <th>Tên lớp</th>
                                        <th>Số lượng sinh viên</th>
                                        <th>Môn học</th>
                                        <th>Trạng thái</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {classrooms.map((it, index) => (
                                        <tr key={index} className="odd text-center">
                                            <Link
                                                to={`/admin/classrooms/view/${it.class_code}`}
                                                style={{ display: "contents" }}
                                            >
                                                <td>{it.id}</td>
                                                <td>{it.class_code}</td>
                                                <td>{it.class_name}</td>
                                                <td>30</td>
                                                <td>LTWE</td>
                                                <td>
                                                    {it.is_active == true ? (
                                                        <i
                                                            className="fas fa-check-circle"
                                                            style={{
                                                                color: "green",
                                                            }}
                                                        ></i>
                                                    ) : (
                                                        <i
                                                            className="fas fa-times-circle"
                                                            style={{
                                                                color: "red",
                                                            }}
                                                        ></i>
                                                    )}
                                                </td>
                                            </Link>
                                            <td>
                                                <div>
                                                    <Link
                                                        to={`/admin/classrooms/edit/${it.class_code}`}
                                                    >
                                                        <i className="fas fa-edit"></i>
                                                    </Link>
                                                    <i
                                                        className="fas fa-trash ml-6"
                                                        onClick={() =>
                                                            handleDelete(
                                                                it.class_code
                                                            )
                                                        }
                                                        disabled={isLoading}
                                                    ></i>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table> */}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ClassRoomsList;
