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
    const [statusModalOpen, setStatusModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null); // Trạng thái mới

    const onModalVisible = () => setModalOpen((prev) => !prev);
    const onStatusModalVisible = () => setStatusModalOpen((prev) => !prev);

    const { data, refetch, isFetching } = useQuery({
        queryKey: ["POST_LIST"],
        queryFn: async () => {
            const res = await api.get("/teacher/newsletters");
            return res.data.newsletter ?? [];
        },
    });

    const { mutate: deletePost } = useMutation({
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

    const { mutate: updateStatus } = useMutation({
        mutationFn: (code) => api.post(`/teacher/newsletters/updateActive/${code}`),
        onSuccess: () => {
            toast.success("Cập nhật trạng thái thành công");
            onStatusModalVisible();
            refetch();
        },
        onError: () => {
            toast.error("Có lỗi xảy ra khi thay đổi trạng thái");
        },
    });

    const handleDelete = (id) => {
        setSelectedPost(id);
        onModalVisible();
    };

    const handleStatusChange = (code, currentStatus) => {
        setSelectedPost(code);
        setSelectedStatus(!currentStatus); // Đảo ngược trạng thái hiện tại
        onStatusModalVisible();
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
                            return data == true
                                ? `<i class="fas fa-check-circle toggleStatus" style="color: green; font-size: 20px;" data-id="${row.code}"></i>`
                                : `<i class="fas fa-times-circle toggleStatus" style="color: red; font-size: 20px;" data-id="${row.code}"></i>`;
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
                    // Gắn sự kiện xóa và thay đổi trạng thái sau khi bảng được vẽ
                    $(row).find('.fa-trash').on('click', function () {
                        const classCode = $(this).data('id');
                        handleDelete(classCode);
                    });

                    $(row).find('.fa-edit').on('click', function () {
                        const classCode = $(this).data('id');
                        navigate(`/teacher/post/${classCode}/edit`);
                    });

                    $(row).find('.toggleStatus').on('click', function () {
                        const classCode = $(this).data('id');
                        const currentStatus = data.is_active;
                        handleStatusChange(classCode, currentStatus);
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
                    </div>
                </div>
            </div>

            {/* Modal Xóa bài viết */}
            <Modal
                title="Xoá bài viết"
                description="Bạn có chắc chắn muốn xoá bài viết này?"
                closeTxt="Huỷ"
                okTxt="Xác nhận"
                visible={modalOpen}
                onVisible={onModalVisible}
                onOk={() => deletePost(selectedPost)}
            />

            {/* Modal Cập nhật trạng thái */}
            <Modal
                title="Cập nhật trạng thái"
                description={`Bạn có chắc chắn muốn thay đổi trạng thái bài viết này?`}
                closeTxt="Huỷ"
                okTxt="Xác nhận"
                visible={statusModalOpen}
                onVisible={onStatusModalVisible}
                onOk={() => updateStatus(selectedPost)}
            />
        </>
    );
};

export default PostList;
