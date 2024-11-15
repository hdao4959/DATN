import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../../config/axios";
import { toast } from "react-toastify";
import Spinner from "../../../components/Spinner/Spinner";
import Modal from "../../../components/Modal/Modal";
import { getToken } from "../../../utils/getToken";
import 'datatables.net-dt/css/dataTables.dataTables.css';
import $ from 'jquery';
import 'datatables.net';
import { useNavigate } from 'react-router-dom';
const GradeComponentList = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedGradeComponent, setSelectedGradeComponent] = useState();
    const accessToken = getToken();
    const navigate = useNavigate(); // Hook dùng để điều hướng trong React Router v6
    const onModalVisible = () => setModalOpen((prev) => !prev);

    const { data, refetch, isFetching } = useQuery({
        queryKey: ["GRADE_COMPONENTS"],
        queryFn: async () => {
            const res = await api.get("/admin/pointheads");
            return res.data.data ?? [];
        },
    });

    const { mutate } = useMutation({
        mutationFn: (id) => api.delete(`/admin/pointheads/${id}`),
        onSuccess: () => {
            toast.success("Xóa điểm thành phần thành công");
            onModalVisible();
            refetch();
        },
        onError: () => {
            toast.error("Có lỗi xảy ra khi xóa điểm thành phần");
        },
    });
    const handleDelete = (id) => {
        setSelectedGradeComponent(id);
        onModalVisible();
    };

    useEffect(() => {

        if (data) {
            
            $('#classroomsTable').DataTable({
                
                data: data,
                columns: [
                    { title: "Mã điểm", data: "cate_code" },
                    { title: "Tên điểm", data: "cate_name" },
                    { title: "Trọng số", data: "value" },
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
                                    <i class="fas fa-edit" style="cursor: pointer; font-size: 20px;" data-id="${row.cate_code}" id="edit_${row.cate_code}"></i>
                                    <i class="fas fa-trash" 
                                        style="cursor: pointer; color: red; font-size: 20px;" 
                                        data-id="${row.cate_code}" 
                                        id="delete_${row.cate_code}"></i>
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
                        const cate_code = $(this).data('id');
                        handleDelete(cate_code);
                    });

                    $(row).find('.fa-edit').on('click', function () {
                        const cate_code = $(this).data('id');
                        console.log(cate_code);
                        
                        navigate(`/admin/grade-components/edit/${cate_code}`);

                    });
                }
            })
        }
    }, [data]);

    if (isFetching && !data) return <Spinner />;
    if (data.error) {
        toast.error(data.message);
    }
    return (
        <>
            <div className="mb-3 mt-2 flex items-center justify-between">
                <Link to="/admin/grade-components/add">
                    <button className="btn btn-primary">
                        Thêm điểm thành phần
                    </button>
                </Link>
            </div>

            <div className="card">
                <div className="card-header">
                    <h4 className="card-title">Grade Components Management</h4>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <div className="dataTables_wrapper container-fluid dt-bootstrap4">
                        <table id="classroomsTable" className="display"></table>
                            {/* <div className="row">
                                <div className="col-sm-12 col-md-6">
                                    <div
                                        className="dataTables_length"
                                        id="basic-datatables_length"
                                    >
                                        <label>
                                            Show{" "}
                                            <select
                                                name="basic-datatables_length"
                                                aria-controls="basic-datatables"
                                                className="form-control form-control-sm"
                                            >
                                                <option value={10}>10</option>
                                                <option value={25}>25</option>
                                                <option value={50}>50</option>
                                                <option value={100}>100</option>
                                            </select>{" "}
                                            entries
                                        </label>
                                    </div>
                                </div>
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
                                    <i className="fa-solid fa-circle-check fs-20 color-green"></i>
                                    <table
                                        id="basic-datatables"
                                        className="display table table-striped table-hover dataTable"
                                        role="grid"
                                        aria-describedby="basic-datatables_info"
                                    >
                                        <thead>
                                            <tr role="row">
                                                <th>ID</th>
                                                <th>Mã điểm TP</th>
                                                <th>Tên điểm TP</th>
                                                <th>Trọng số</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.map((it, index) => (
                                                <tr
                                                    role="row"
                                                    key={index}
                                                    className="odd"
                                                >
                                                    <td>{it.id}</td>
                                                    <td>{it.cate_code}</td>
                                                    <td>{it.cate_name}</td>
                                                    <td className="text-center">{it.value}</td>
                                                    <td>
                                                        <div className="flex gap-x-2 items-center">
                                                            <Link
                                                                to={`/admin/grade-components/${it.cate_code}/edit`}
                                                            >
                                                                <i className="fas fa-edit"></i>
                                                            </Link>

                                                            <div
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        it.cate_code
                                                                    )
                                                                }
                                                                className="cursor-pointer"
                                                            >
                                                                <i className="fas fa-trash ml-6"></i>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div> */}
                            {/* <div className="row">
                                <div className="col-sm-12 col-md-7 ml-auto">
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
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                title="Xoá điểm thành phần"
                description="Bạn có chắc chắn muốn xoá điểm thành phần này?"
                closeTxt="Huỷ"
                okTxt="Xác nhận"
                visible={modalOpen}
                onVisible={onModalVisible}
                onOk={() => mutate(selectedGradeComponent)}
            />
        </>
    );
};

export default GradeComponentList;
