import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../../config/axios";
import { toast } from "react-toastify";
import Spinner from "../../../components/Spinner/Spinner";
import Modal from "../../../components/Modal/Modal";
import { getImageUrl } from "../../../utils/getImageUrl";
import { getToken } from "../../../utils/getToken";
import 'datatables.net-dt/css/dataTables.dataTables.css';
import $ from 'jquery';
import 'datatables.net';
import { useNavigate } from 'react-router-dom';
const PostList = () => {
    const accessToken = getToken();
    const navigate = useNavigate();

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState();

    const onModalVisible = () => setModalOpen((prev) => !prev);

    const { data, refetch, isFetching } = useQuery({
        queryKey: ["POST_LIST"],
        queryFn: async () => {
            const res = await api.get("/teacher/newsletters");
            return res.data.newsletter ?? [];
        },
    });
    // const { data: classes, refetch: refetchClasses } = useQuery({
    //     queryKey: ["LIST_CLASSES"],
    //     queryFn: async () => {
    //         const response = await fetch(
    //             "http://127.0.0.1:8000/api/teacher/classrooms",
    //             {
    //                 headers: {
    //                     Authorization: `Bearer ${accessToken}`,
    //                     "Content-Type": "application/json",
    //                 },
    //             }
    //         );
    //         console.log(response?.data);
            
    //         return response?.data;
    //     },
    // });

    console.log(data);

    const { mutate } = useMutation({
        mutationFn: (id) => api.delete(`/teacher/newsletters/${id}`),
        onSuccess: () => {
            toast.success("Xóa bài viết thành công");
            onModalVisible();
            refetch();
        },
        onError: () => {
            toast.error("Có lỗi xảy ra khi xóa bài viết");
        },
    });
    const handleDelete = (id) => {
        setSelectedPost(id);
        onModalVisible();
    };
    useEffect(() => {
        if (data) {
            $('#classroomsTable').DataTable({

                data: data,
                ajax: async (data, callback) => {
                    try {
                        const page = data.start / data.length + 1;
                        const response = await api.get(`/teacher/newsletters`, {
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
                    { title: "Mã bài viết", data: "code" },
                    { title: "Tiêu đề", data: "title" },
                    {
                        title: "Hình ảnh",
                        data: "image",
                        render: (data, type, row) => {
                            return data != null ?
                                `<img src='${getImageUrl(row.image)}' alt="${row.title}" style=" height: 40px;display: block !important;">` :
                                `<img src='https://media.istockphoto.com/id/1128826884/vector/no-image-vector-symbol-missing-available-icon-no-gallery-for-this-moment.jpg?s=612x612&w=0&k=20&c=390e76zN_TJ7HZHJpnI7jNl7UBpO3UP7hpR2meE1Qd4=' style=" height: 40px;display: block;" alt="${row.title}">`
                        }

                    },
                    { title: "Danh mục", data: "cate_name" },
                    { title: "Tác giả", data: "full_name" },
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
                                    <i class="fas fa-edit" style="cursor: pointer; font-size: 20px;" data-id="${row.code}" id="edit_${row.code}"></i>
                                    <i class="fas fa-trash" 
                                        style="cursor: pointer; color: red; font-size: 20px;" 
                                        data-id="${row.code}" 
                                        id="delete_${row.code}"></i>
                                </div>
                            `;
                        }
                    },
                    {
                        title: null,
                        data: null,
                        render: (data, row) => {
                            return `
                                <button class='btn btn-primary display-flex'>Đăng</button>
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

                        navigate(`/teacher/post/${classCode}/edit`);

                    });
                }
            })
        }
    }, [data]);
    if (isFetching && !data) return <Spinner />;

    return (
        <>
            <div className="mb-3 mt-2 flex items-center justify-between">
                <Link to="/teacher/post/add">
                    <button className="btn btn-primary">Thêm bài viết</button>
                </Link>
            </div>
            <div className="card">
                <div className="card-header">
                    <h4 className="card-title">Quản lý bài viết</h4>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                    <table id="classroomsTable" className="display"></table>
                        {/* <div className="dataTables_wrapper container-fluid dt-bootstrap4">
                            <div className="row">
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
                                                <th>Mã bài viết</th>
                                                <th>Ảnh bìa</th>
                                                <th>Tiêu đề</th>
                                                <th>Danh mục</th>
                                                <th>Tác giả</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data?.map((it, index) => (
                                                <tr
                                                    role="row"
                                                    key={index}
                                                    className="odd"
                                                >
                                                    <td>{it.id}</td>
                                                    <td>{it.code}</td>
                                                    <td>
                                                        <img
                                                            src={getImageUrl(
                                                                it.image
                                                            )}
                                                            alt="Thumbnail"
                                                            className="w-24 h-24 object-cover border rounded"
                                                        />
                                                    </td>
                                                    <td>{it.title}</td>
                                                    <td>{it.cate_name}</td>
                                                    <td>{it.full_name}</td>
                                                    <td>
                                                        <div className="flex gap-x-2 items-center">
                                                            <Link
                                                                to={`/teacher/post/${it.code}/edit`}
                                                            >
                                                                <i className="fas fa-edit"></i>
                                                            </Link>

                                                            <div
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        it.code
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
                            </div>
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
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>

            <Modal
                title="Xoá bài viết"
                description="Bạn có chắc chắn muốn xoá bài viết này?"
                closeTxt="Huỷ"
                okTxt="Xác nhận"
                visible={modalOpen}
                onVisible={onModalVisible}
                onOk={() => mutate(selectedPost)}
            />
        </>
    );
};

export default PostList;
