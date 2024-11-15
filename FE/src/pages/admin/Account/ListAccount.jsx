import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../../config/axios";
import Modal from "../../../components/Modal/Modal";
import { toast } from "react-toastify";
import { getToken } from "../../../utils/getToken";
import 'datatables.net-dt/css/dataTables.dataTables.css';
import $ from 'jquery';
import 'datatables.net';
import { useNavigate } from 'react-router-dom';
const ListAccount = () => {
    const accessToken = getToken();
    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedGradeComponent, setSelectedGradeComponent] = useState();

    const onModalVisible = () => setModalOpen((prev) => !prev);
    const { data, refetch } = useQuery({
        queryKey: ["LIST_ACCOUNT"],
        queryFn: async () => {
            const res = await api.get("/admin/students");
            return res.data;
        },
    });
    const users = data?.data || [];
    console.log(users);

    const { mutate, isLoading } = useMutation({
        mutationFn: (user_code) => api.delete(`/admin/users/${user_code}`),
        onSuccess: () => {
            toast.success("Xóa tài khoản thành công");
            onModalVisible();
            refetch();
        },
        onError: () => {
            toast.error("Có lỗi xảy ra khi xóa tài khoản");
        },
    });
    const handleDelete = (user_code) => {
        console.log('user_code', user_code);

        // if (window.confirm("Bạn có chắc chắn muốn xóa tài khoản này không?")) {
        //     mutate(user_code);
        // }
        setSelectedGradeComponent(user_code);
        onModalVisible();
    };
    useEffect(() => {
        if (users) {
            $('#usersTable').DataTable({
                data: users,
                ajax: async (data, callback) => {
                    try {
                        const page = data.start / data.length + 1;
                        const response = await api.get(`/admin/students`, {
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
                    { title: "Mã sinh viên", data: "user_code" },
                    { title: "Họ và tên", data: "full_name" },
                    { title: "Email", data: "email" },
                    {
                        title: "Khóa học",
                        data: "course",
                        render: (data, type, row) => {
                            return data?.cate_name;
                        }
                    },
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
                                    <i class="fas fa-edit" style="cursor: pointer; font-size: 20px;" data-id="${row.user_code}" id="edit_${row.user_code}"></i>
                                    <i class="fas fa-trash" 
                                        style="cursor: pointer; color: red; font-size: 20px;" 
                                        data-id="${row.user_code}" 
                                        id="delete_${row.user_code}"></i>
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

                        navigate(`/admin/users/${classCode}/edit`);

                    });
                }
            })
        }
    }, [users]);

    if (!data) return <div>Loading...</div>;

    return (
        <>
            <div className="mb-3 mt-2 flex items-center justify-between">
                <Link to="/admin/account/create">
                    <button className="btn btn-primary">Thêm tài khoản</button>
                </Link>
            </div>

            <div className="card">
                <div className="card-header">
                    <h4 className="card-title">Account Management</h4>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table id="usersTable" className="display"></table>
                        {/* <div className="dataTables_wrapper container-fluid dt-bootstrap4">
                            <div className="row">
                                <div className="col-sm-12 col-md-6">
                                    <div
                                        id="basic-datatables_filter"
                                        className="dataTables_filter"
                                    >
                                        <label>
                                            Search:
                                            <input
                                                type="search"
                                                className="form-control form-control-sm"
                                                placeholder=""
                                                aria-controls="basic-datatables"
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12">
                                    <table
                                        id="basic-datatables"
                                        className="display table table-striped table-hover dataTable"
                                        role="grid"
                                        aria-describedby="basic-datatables_info"
                                    >
                                        <thead>
                                            <tr role="row">
                                                <th>ID</th>
                                                <th>Mã người dùng</th>
                                                <th>Họ và tên</th>
                                                <th>Email</th>
                                                <th>Khóa học</th>
                                                <th>Trạng thái</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map((it, index) => (
                                                <tr
                                                    role="row"
                                                    key={index}
                                                    className="odd"
                                                >
                                                    <td>{it.id}</td>
                                                    <td>{it.user_code}</td>
                                                    <td>{it.full_name}</td>
                                                    <td>{it.email}</td>
                                                    <td>{it.course?.cate_name}</td>
                                                    <td>
                                                        {it.is_active == 1 ? (
                                                            <i
                                                                className="fas fa-check-circle"
                                                                style={{
                                                                    color: "green",
                                                                }}
                                                            ></i>
                                                        ) : (
                                                            <i
                                                                className="fa-solid fa-ban"
                                                                style={{
                                                                    color: "red",
                                                                }}
                                                            ></i>
                                                        )}
                                                    </td>

                                                    <td>
                                                        <div>
                                                            <Link
                                                                to={`/admin/users/edit/${it.user_code}`}
                                                            >
                                                                <i className="fas fa-edit"></i>
                                                            </Link>

                                                            <i
                                                                className="fas fa-trash ml-6"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        it.user_code
                                                                    )
                                                                }
                                                                disabled={
                                                                    isLoading
                                                                }
                                                            ></i>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12 col-md-5">
                                    <div className="dataTables_info">
                                        Showing 1 to 10 of {data.length} entries
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-7">
                                    <div className="dataTables_paginate paging_simple_numbers">
                                        <ul className="pagination">
                                            <li className="paginate_button page-item previous disabled">
                                                <a
                                                    href="#"
                                                    className="page-link"
                                                >
                                                    Previous
                                                </a>
                                            </li>
                                            <li className="paginate_button page-item active">
                                                <a
                                                    href="#"
                                                    className="page-link"
                                                >
                                                    1
                                                </a>
                                            </li>
                                            <li className="paginate_button page-item ">
                                                <a
                                                    href="#"
                                                    className="page-link"
                                                >
                                                    2
                                                </a>
                                            </li>
                                            <li className="paginate_button page-item ">
                                                <a
                                                    href="#"
                                                    className="page-link"
                                                >
                                                    3
                                                </a>
                                            </li>

                                            <li className="paginate_button page-item next">
                                                <a
                                                    href="#"
                                                    className="page-link"
                                                >
                                                    Next
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
            <Modal
                title="Xóa sinh viên"
                description="Bạn có chắc chắn muốn xoá sinh viên này?"
                closeTxt="Huỷ"
                okTxt="Xác nhận"
                visible={modalOpen}
                onVisible={onModalVisible}
                onOk={() => mutate(selectedGradeComponent)}
            />
        </>
    );
};

export default ListAccount;
