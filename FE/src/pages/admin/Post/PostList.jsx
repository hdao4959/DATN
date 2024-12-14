import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import api from "../../../config/axios";
import { getToken } from "../../../utils/getToken";
import Spinner from "../../../components/Spinner/Spinner";
import { toast } from "react-toastify";
import Modal from "../../../components/Modal/Modal";
import "datatables.net-dt/css/dataTables.dataTables.css";
import $ from "jquery";
import "datatables.net";

const PostList = () => {
    const accessToken = getToken();
    const { data, refetch, isFetching } = useQuery({
        queryKey: ["POST_LIST"],
        queryFn: async () => {
            const res = await api.get("/admin/newsletters", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            });
            return res?.data?.newsletter?.data ?? [];
        },
    });

    const [modalOpen, setModalOpen] = useState(false); // Modal xóa bài viết
    const [confirmationModalOpen, setConfirmationModalOpen] = useState(false); // Modal xác nhận trạng thái
    const [selectedPost, setSelectedPost] = useState(); // ID bài viết được chọn
    const [currentPostCode, setCurrentPostCode] = useState(null); // Post code để cập nhật trạng thái

    const onModalVisible = () => setModalOpen((prev) => !prev);
    const toggleConfirmationModal = () => setConfirmationModalOpen((prev) => !prev);

    // Mutation cập nhật trạng thái
    const updateStatusMutation = useMutation({
        mutationFn: (code) => api.post(`/admin/newsletters/updateActive/${code}`),
        onSuccess: () => {
            toast.success("Cập nhật trạng thái thành công");
            refetch();
        },
        onError: () => {
            toast.error("Có lỗi xảy ra khi cập nhật trạng thái");
        },
    });

    // Mutation xóa bài viết
    const deleteMutation = useMutation({
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

    // Khi nhấn icon trạng thái
    const handleUpdateStatus = (code) => {
        setCurrentPostCode(code);
        toggleConfirmationModal();
    };

    // Xác nhận cập nhật trạng thái
    const confirmUpdateStatus = () => {
        if (currentPostCode) {
            updateStatusMutation.mutate(currentPostCode);
        }
        toggleConfirmationModal();
    };

    // Khi nhấn nút xóa
    const handleDelete = (id) => {
        setSelectedPost(id);
        onModalVisible();
    };

    // Chuyển đổi dữ liệu từ API thành format DataTable
    const flattenPostData = (data) => {
        return data.map((post, index) => ({
            id: post.id,
            code: post.code,
            title: post.title,
            image: post.image,
            is_active: post.is_active,
            author: post.full_name,
            sortOrder: index,
        }));
    };

    useEffect(() => {
        if (data) {
            if ($.fn.dataTable.isDataTable("#post-table")) {
                $("#post-table").DataTable().clear().destroy();
            }

            $("#post-table").DataTable({
                
                pageLength: 10,
                lengthMenu: [10, 20, 50],
                data: flattenPostData(data),
                columns: [
                    { title: "Mã bài viết", data: "code" },
                    { title: "Tiêu đề", data: "title" },
                    {
                        title: "Trạng thái",
                        data: "is_active",
                        render: (data) =>
                            `<i class="change-status fas ${data === 1
                                ? "fa-check-circle text-green-500"
                                : "fa-ban text-red-500"
                            }" style="font-size: 20px;"></i>`,
                        className: "text-center",
                    },
                    {
                        title: "Hình ảnh",
                        data: "image",
                        render: (data) =>
                            `<img src="${data
                                ? `https://admin.feduvn.com/storage/${data}`
                                : "https://thumbs.dreamstime.com/b/no-image-icon-vector-available-picture-symbol-isolated-white-background-suitable-user-interface-element-205805243.jpg"
                            }" alt="image" width="50" height="50" />`,
                        className: "text-center d-flex justify-content-center",
                    },
                    {
                        title: "Hành động",
                        data: null,
                        render: (data, type, row) => `
                            <div class="d-flex justify-content-center">
                                <button class="fs-4">
                                    <a href="/sup-admin/post/${row.code}/edit">
                                        <i class='fas fa-edit hover:text-blue-500'></i>
                                    </a>
                                </button>
                                <button class="delete-btn ml-2 fs-4">
                                    <i class="fas fa-trash hover:text-red-500"></i>
                                </button>
                            </div>`,
                        className: "text-center",
                    },
                    { title: "Thứ tự sắp xếp", data: "sortOrder", visible: false },
                ],
                order: [[4, "asc"]], // Sắp xếp theo cột thứ 5 (sortOrder)
                createdRow: (row, rowData) => {
                    $(row)
                        .find(".change-status")
                        .on("click", () => handleUpdateStatus(rowData.code));
                    $(row)
                        .find(".delete-btn")
                        .on("click", () => handleDelete(rowData.code));
                },
                language: {
                    paginate: {
                        previous: "Trước",
                        next: "Tiếp theo",
                    },
                    lengthMenu: "Hiển thị _MENU_ mục mỗi trang",
                    info: "Hiển thị từ _START_ đến _END_ trong _TOTAL_ mục",
                    search: "Tìm kiếm:",
                },
                scrollX: true,
            });
        }

        return () => {
            if ($.fn.dataTable.isDataTable("#post-table")) {
                $("#post-table").DataTable().clear().destroy();
            }
        };
    }, [data]);

    if (isFetching && !data) return <Spinner />;

    return (
        <>
            <div className="mb-3 mt-2 flex items-center justify-between">
                <Link to="/sup-admin/post/add">
                    <button className="btn btn-primary">Thêm bài viết</button>
                </Link>
            </div>
            <div className="card">
                <div className="card-header">
                    <h4 className="card-title">Quản lý bài viết</h4>
                </div>
                <div className="card-body">
                    <table id="post-table" className="table"></table>
                </div>
            </div>

            {/* Modal xác nhận cập nhật trạng thái */}
            <Modal
                title="Cập nhật trạng thái"
                description="Bạn có chắc chắn muốn cập nhật trạng thái bài viết này?"
                visible={confirmationModalOpen}
                onVisible={toggleConfirmationModal}
                onOk={confirmUpdateStatus}
                closeTxt="Huỷ"
                okTxt="Xác nhận"
            />

            {/* Modal xóa bài viết */}
            <Modal
                title="Xoá bài viết"
                description="Bạn có chắc chắn muốn xoá bài viết này?"
                visible={modalOpen}
                onVisible={onModalVisible}
                onOk={() => deleteMutation.mutate(selectedPost)}
                closeTxt="Huỷ"
                okTxt="Xác nhận"
            />
        </>
    );
};

export default PostList;
