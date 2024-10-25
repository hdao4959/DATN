import { Link } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../../config/axios";
import { useState } from "react";
import { toast } from "react-toastify";
import Spinner from "../../../components/Spinner/Spinner";
import Modal from "../../../components/Modal/Modal";
import { getImageUrl } from "../../../utils/getImageUrl";

const PostList = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState();

    const onModalVisible = () => setModalOpen((prev) => !prev);

    const { data, refetch, isFetching } = useQuery({
        queryKey: ["POST_LIST"],
        queryFn: async () => {
            const res = await api.get("/admin/newsletters");
            return res.data.newsletter ?? [];
        },
    });

    console.log(data);

    const { mutate } = useMutation({
        mutationFn: (id) => api.delete(`/admin/newsletters/${id}`),
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

    if (isFetching && !data) return <Spinner />;

    return (
        <>
            <div className="mb-3 mt-2 flex items-center justify-between">
                <Link to="/admin/post/add">
                    <button className="btn btn-primary">Thêm bài viết</button>
                </Link>
            </div>

            <div className="card">
                <div className="card-header">
                    <h4 className="card-title">Post Management</h4>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <div className="dataTables_wrapper container-fluid dt-bootstrap4">
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
                                            {data.map((it, index) => (
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
                                                                to={`/admin/post/${it.code}/edit`}
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
                                {/* <div className="col-sm-12 col-md-5">
                                    <div className="dataTables_info">
                                        Showing 1 to 10 of {data.length} entries
                                    </div>
                                </div> */}
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
                        </div>
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
