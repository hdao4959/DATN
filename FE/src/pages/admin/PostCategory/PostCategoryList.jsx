import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import api from "../../../config/axios";
import Spinner from "../../../components/Spinner/Spinner";
import Modal from "../../../components/Modal/Modal";
import { getToken } from "../../../utils/getToken";
import "datatables.net-dt/css/dataTables.dataTables.css";
import $ from "jquery";
import "datatables.net";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../../../utils/getImageUrl";

const PostCategoryList = () => {
    const accessToken = getToken();
    const navigate = useNavigate();

    const [modalOpen, setModalOpen] = useState(false); // Modal xóa danh mục
    const [confirmationModalOpen, setConfirmationModalOpen] = useState(false); // Modal xác nhận trạng thái
    const [selectedCategory, setSelectedCategory] = useState(); // ID danh mục được chọn để xóa
    const [currentCategoryCode, setCurrentCategoryCode] = useState(null); // Mã danh mục để cập nhật trạng thái

    const onModalVisible = () => setModalOpen((prev) => !prev);
    const toggleConfirmationModal = () => setConfirmationModalOpen((prev) => !prev);

    const { data, refetch, isFetching } = useQuery({
        queryKey: ["POST_CATEGORY"],
        queryFn: async () => {
            const res = await api.get("/admin/categories", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            });
            return res.data.data ?? [];
        },
    });

    // Mutation xóa danh mục
    const deleteMutation = useMutation({
        mutationFn: (cateCode) => api.delete(`/admin/categories/${cateCode}`),
        onSuccess: () => {
            toast.success("Xóa danh mục thành công");
            onModalVisible();
            refetch();
        },
        onError: () => {
            toast.error("Có lỗi xảy ra khi xóa danh mục");
        },
    });

    // Mutation cập nhật trạng thái
    const updateStatusMutation = useMutation({
        mutationFn: (cateCode) => api.post(`/admin/updateActive/${cateCode}`),
        onSuccess: () => {
            toast.success(response.data.message);
            refetch();
        },
        onError: () => {
            toast.error("Có lỗi xảy ra khi cập nhật trạng thái");
        },
    });

    // Xử lý khi nhấn xóa danh mục
    const handleDelete = (cateCode) => {
        setSelectedCategory(cateCode);
        onModalVisible();
    };

    // Xử lý khi nhấn vào trạng thái
    const handleUpdateStatus = (cateCode) => {
        setCurrentCategoryCode(cateCode);
        toggleConfirmationModal();
    };

    // Xác nhận cập nhật trạng thái
    const confirmUpdateStatus = () => {
        if (currentCategoryCode) {
            updateStatusMutation.mutate(currentCategoryCode);
        }
        toggleConfirmationModal();
    };

    useEffect(() => {
        if (data) {
            $("#classroomsTable").DataTable({
                data: data,
                pageLength: 10,
                lengthMenu: [10, 20, 50, 100],
                columns: [
                    { title: "Mã danh mục", data: "cate_code" },
                    { title: "Tên danh mục", data: "cate_name" },
                    {
                        title: "Hình ảnh",
                        data: "image",
                        render: (data, type, row) => {
                            return data != null
                                ? `<img src='${getImageUrl(row.image)}' alt="${row.cate_name}" style="height: 40px;">`
                                : `<img src='https://media.istockphoto.com/id/1128826884/vector/no-image-vector-symbol-missing-available-icon-no-gallery-for-this-moment.jpg?s=612x612&w=0&k=20&c=390e76zN_TJ7HZHJpnI7jNl7UBpO3UP7hpR2meE1Qd4=' style="height: 40px;" alt="${row.cate_name}">`;
                        },
                    },
                    {
                        title: "Trạng thái",
                        data: "is_active",
                        className: "text-center",
                        render: (data) =>
                            data
                                ? `<i class="fas fa-check-circle toggleStatus" style="color: green; font-size: 20px;"></i>`
                                : `<i class="fas fa-times-circle toggleStatus" style="color: red; font-size: 20px;"></i>`,
                    },
                    {
                        title: "Hành động",
                        data: null,
                        render: (data, type, row) => `
                            <div style="display: flex; justify-content: center; align-items: center; gap: 10px">
                                <i class="fas fa-edit" style="cursor: pointer; font-size: 20px;" data-id="${row.cate_code}" id="edit_${row.cate_code}"></i>
                                <i class="fas fa-trash" 
                                    style="cursor: pointer; color: red; font-size: 20px;" 
                                    data-id="${row.cate_code}" 
                                    id="delete_${row.cate_code}"></i>
                            </div>
                        `,
                    },
                ],
                destroy: true,
                createdRow: (row, rowData) => {
                    $(row)
                        .find(".fa-trash")
                        .on("click", function () {
                            const cateCode = $(this).data("id");
                            handleDelete(cateCode);
                        });

                    $(row)
                        .find(".fa-edit")
                        .on("click", function () {
                            const cateCode = $(this).data("id");
                            navigate(`/admin/post-category/${cateCode}/edit`);
                        });

                    $(row)
                        .find(".toggleStatus")
                        .on("click", function () {
                            const cateCode = $(this).closest("tr").find(".fa-trash").data("id");
                            handleUpdateStatus(cateCode);
                        });
                },
                language: {
                    paginate: { previous: "Trước", next: "Tiếp theo" },
                    lengthMenu: "Hiển thị _MENU_ mục mỗi trang",
                    info: "Hiển thị từ _START_ đến _END_ trong _TOTAL_ mục",
                    search: "Tìm kiếm:",
                },
            });
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
                    <table id="classroomsTable" className="display"></table>
                </div>
            </div>

            {/* Modal xác nhận cập nhật trạng thái */}
            <Modal
                title="Cập nhật trạng thái"
                description="Bạn có chắc chắn muốn cập nhật trạng thái danh mục này?"
                visible={confirmationModalOpen}
                onVisible={toggleConfirmationModal}
                onOk={confirmUpdateStatus}
                closeTxt="Huỷ"
                okTxt="Xác nhận"
            />

            {/* Modal xóa danh mục */}
            <Modal
                title="Xoá danh mục"
                description="Bạn có chắc chắn muốn xoá danh mục này?"
                visible={modalOpen}
                onVisible={onModalVisible}
                onOk={() => deleteMutation.mutate(selectedCategory)}
                closeTxt="Huỷ"
                okTxt="Xác nhận"
            />
        </>
    );
};

export default PostCategoryList;
