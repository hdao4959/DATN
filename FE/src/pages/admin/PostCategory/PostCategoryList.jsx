import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../../../config/axios";
import Spinner from "../../../components/Spinner/Spinner";
import PostCategoryTable from "./PostCategoryTable";
import { getToken } from "../../../utils/getToken";
import 'datatables.net-dt/css/dataTables.dataTables.css';
import $ from 'jquery';
import 'datatables.net';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from "../../../utils/getImageUrl";


const PostCategoryList = () => {
    const accessToken = getToken();
    const navigate = useNavigate();
    const { data, isFetching } = useQuery({
        queryKey: ["POST_CATEGORY"],
        queryFn: async () => {
            const res = await api.get("/admin/categories");
            return res.data.data ?? [];
        },
    });

    useEffect(() => {

        if (data) {
            $('#classroomsTable').DataTable({
                data: data,
                columns: [
                    { title: "Mã danh mục", data: "cate_code" },
                    { title: "Tên danh mục", data: "cate_name" },
                    {
                        title: "Hình ảnh",
                        data: "image",
                        render: (data, type, row) => {
                            return data != null ?
                                `<img src='${getImageUrl(row.image)}' alt="${row.cate_name}">     style=" height: 40px;"` :
                                `<img src='https://media.istockphoto.com/id/1128826884/vector/no-image-vector-symbol-missing-available-icon-no-gallery-for-this-moment.jpg?s=612x612&w=0&k=20&c=390e76zN_TJ7HZHJpnI7jNl7UBpO3UP7hpR2meE1Qd4=' style=" height: 40px;" alt="${row.cate_name}">`
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

                        navigate(`/admin/post-category/${cate_code}/edit`);

                    });
                }
            })
        }
    }, [data]);

    if (isFetching && !data) return <Spinner />;

    return (
        <>
            <div className="mb-3 mt-2 flex items-center justify-between">
                <Link to="/admin/post-category/add">
                    <button className="btn btn-primary">
                        Thêm danh mục bài viết
                    </button>
                </Link>
            </div>

            <div className="card">
                <div className="card-header">
                    <h4 className="card-title">Post Category Management</h4>
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

                            <PostCategoryTable data={data} />

                            <div className="row">
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
        </>
    );
};

export default PostCategoryList;
