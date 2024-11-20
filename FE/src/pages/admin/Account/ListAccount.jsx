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

        mutationFn: (user_code) => api.delete(`/admin/students/${user_code}`),

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
                processing: true,
                serverSide: true, 
                ajax: async (data, callback) => {
                    try {
                        // Tính toán số trang dựa trên DataTables truyền vào
                        const page = data.start / data.length + 1;
                        // Gửi request đến API với các tham số phù hợp
                        const response = await api.get(`/admin/students`, {
                            params: {
                                page: page, // Trang hiện tại
                                per_page: data.length, // Số bản ghi mỗi trang
                                search: data.search.value || '', // Từ khóa tìm kiếm
                                order_column: data.order[0].column, // Cột được sắp xếp
                                order_dir: data.order[0].dir, // Hướng sắp xếp
                            },
                        })
                        // Dữ liệu trả về từ API
                        const result = response.data;
                
                        // Gọi callback để DataTables hiển thị dữ liệu
                        callback({
                            draw: data.draw, // ID của lần gọi này
                            recordsTotal: result.total, // Tổng số bản ghi (trong DB)
                            recordsFiltered: result.filtered || result.total, // Tổng số bản ghi sau khi lọc
                            data: result.data, // Dữ liệu bản ghi
                        });
                    } catch (error) {
                        console.error("Error fetching data:", error);
                        callback({
                            draw: data.draw,
                            recordsTotal: 0,
                            recordsFiltered: 0,
                            data: [],
                        });
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
                // pageLength: 10,
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
    const handleExport = async () => {
        try {
            const response = await api.get("/admin/export-students", {
                responseType: "blob", // Đảm bảo nhận dữ liệu dạng nhị phân (blob)
            });

            // Tạo URL từ blob và kích hoạt tải file
            const url = URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "exported_data.xlsx"); // Đặt tên file mong muốn
            document.body.appendChild(link);
            link.click();

            // Dọn dẹp sau khi tải
            link.parentNode.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error exporting data:", error);
            alert("Failed to export data. Please try again later.");
        }
    };
    const handleImport = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("data", file);  // Gửi file dưới dạng 'data'

        api.post("/admin/import-students", formData)
            .then((response) => {
                console.log(response);

                toast.success("Import thành công");
                refetch();
            })
            .catch((error) => {
                toast.error("Có lỗi xảy ra khi import dữ liệu");
                console.error(error);
            });
    };

    if (!data) return <div>Loading...</div>;

    return (
        <>
            <div className="mb-3 mt-2 flex justify-between">
                <div>
                    <Link to="/admin/account/create">
                        <button className="btn btn-primary mx-2">Thêm tài khoản</button>
                    </Link>
                </div>
                <div>
                    <button className="btn btn-success mx-2" onClick={() => document.getElementById('importFile').click()}> <i className="fa fa-file-import"></i> Import</button>
                    <button onClick={handleExport} className="btn btn-secondary mx-2"> <i className="fa fa-download"></i> Export</button>
                </div>
            </div>

            <div className="card">
                <div className="card-header d-flex" style={{ alignItems: "center", justifyContent: "space-between" }}>
                    <h4 className="card-title">Account Management</h4>
                    <div>
                        <i className="fa export-excel-user fa-file-excel fs-2 text-success mr-2" onClick={handleExport} style={{ cursor: "pointer" }} ></i>
                        <input
                            type="file"
                            accept=".xlsx"
                            onChange={handleImport}
                            style={{ display: 'none' }}
                            id="importFile"
                        />
                        <i
                            className="fa fa-file-import import-excel-user fa-file-excel fs-2 text-Secondary mr-2"
                            style={{ cursor: 'pointer' }}
                            onClick={() => document.getElementById('importFile').click()}
                        ></i>
                    </div>
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



                                                                to={`/admin/students/edit/${it.user_code}`}

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
