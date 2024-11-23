import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../../config/axios";
import Modal from "./Modal";
import { toast } from "react-toastify";
import Spinner from "../../../components/Spinner/Spinner";
import 'datatables.net-dt/css/dataTables.dataTables.css';
import $ from 'jquery';
import 'datatables.net';
import { useNavigate } from 'react-router-dom';

const RoomSchoolList = () => {
    const [modalOpen, setModalOpen] = useState(false); // Modal xóa phòng học
    const [confirmationModalOpen, setConfirmationModalOpen] = useState(false); // Modal xác nhận trạng thái
    const [selectedSchoolRoom, setSelectedSchoolRoom] = useState(); // ID phòng học được chọn để xóa
    const [currentCateCode, setCurrentCateCode] = useState(null); // Cate code để cập nhật trạng thái
    const navigate = useNavigate();

    const onModalVisible = () => setModalOpen((prev) => !prev);
    const toggleConfirmationModal = () => setConfirmationModalOpen((prev) => !prev);

    const { data: roomSchool, refetch, isFetching } = useQuery({
        queryKey: ["LIST_SCHOOLROOMS"],
        queryFn: async () => {
            const res = await api.get("/admin/schoolrooms");
            return res.data.data;
        },
    });

    // Mutation xóa phòng học
    const deleteMutation = useMutation({
        mutationFn: (cateCode) => api.delete(`/admin/schoolrooms/${cateCode}`),
        onSuccess: () => {
            toast.success("Xóa phòng học thành công");
            onModalVisible();
            refetch();
        },
        onError: () => {
            toast.error("Có lỗi xảy ra khi xóa phòng học");
        },
    });

    // Mutation cập nhật trạng thái
    const updateStatusMutation = useMutation({
        mutationFn: (code) => api.post(`/admin/updateActive/${code}`),
        onSuccess: () => {
            toast.success("Cập nhật trạng thái thành công");
            refetch();
        },
        onError: () => {
            toast.error("Có lỗi xảy ra khi cập nhật trạng thái");
        },
    });

    // Xử lý khi nhấn xóa
    const handleDelete = (cateCode) => {
        setSelectedSchoolRoom(cateCode);
        onModalVisible();
    };

    // Xử lý khi nhấn icon trạng thái
    const handleUpdateStatus = (code) => {
        setCurrentCateCode(code);
        toggleConfirmationModal();
    };

    // Xác nhận cập nhật trạng thái
    const confirmUpdateStatus = () => {
        if (currentCateCode) {
            updateStatusMutation.mutate(currentCateCode);
        }
        toggleConfirmationModal();
    };

    useEffect(() => {
        if (roomSchool) {
            $('#roomSchoolTable').DataTable({
                data: roomSchool,
                pageLength: 10,
                lengthMenu: [10, 20, 50],
                columns: [
                    { title: "Mã phòng học", data: "cate_code" },
                    { title: "Tên phòng học", data: "cate_name" },
                    {
                        title: "Sinh viên",
                        className: "text-center",
                        data: "value"
                    },
                    {
                        title: "Trạng thái",
                        data: "is_active",
                        className: "text-center",
                        render: (data) => {
                            return data
                                ? `<i class="fas fa-check-circle toggleStatus" style="color: green; font-size: 20px;"></i>`
                                : `<i class="fas fa-times-circle toggleStatus" style="color: red; font-size: 20px;"></i>`;
                        }
                    },
                    {
                        title: "Hành động",
                        data: null,
                        render: (data, type, row) => {
                            return `
                                <div style="display: flex; justify-content: center; align-items: center; gap: 10px">
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
                language: {
                    paginate: { previous: 'Trước', next: 'Tiếp theo' },
                    lengthMenu: 'Hiển thị _MENU_ mục mỗi trang',
                    info: 'Hiển thị từ _START_ đến _END_ trong _TOTAL_ mục',
                    search: 'Tìm kiếm:'
                },
                destroy: true,
                createdRow: (row, rowData) => {
                    $(row).find('.fa-trash').on('click', function () {
                        const classCode = $(this).data('id');
                        handleDelete(classCode);
                    });

                    $(row).find('.fa-edit').on('click', function () {
                        const classCode = $(this).data('id');
                        navigate(`/admin/schoolrooms/edit/${classCode}`);
                    });

                    $(row).find('.toggleStatus').on('click', function () {
                        const classCode = $(this).closest('tr').find('.fa-trash').data('id');
                        handleUpdateStatus(classCode);
                    });
                }
            });
        }
    }, [roomSchool]);

    if (isFetching && !roomSchool) return <Spinner />;

    return (
        <>
            <div className="mb-3 mt-2 flex items-center justify-between">
                <Link to="/admin/schoolrooms/add">
                    <button className="btn btn-primary">Thêm phòng học</button>
                </Link>
            </div>

            <div className="card">
                <div className="card-header">
                    <h4 className="card-title">School Room Management</h4>
                </div>
                <div className="card-body">
                    <table id="roomSchoolTable" className="display"></table>
                </div>
            </div>

            {/* Modal xác nhận cập nhật trạng thái */}
            <Modal
                title="Cập nhật trạng thái"
                description="Bạn có chắc chắn muốn cập nhật trạng thái phòng học này?"
                visible={confirmationModalOpen}
                onVisible={toggleConfirmationModal}
                onOk={confirmUpdateStatus}
                closeTxt="Huỷ"
                okTxt="Xác nhận"
            />

            {/* Modal xóa phòng học */}
            <Modal
                title="Xoá phòng học"
                description="Bạn có chắc chắn muốn xoá phòng học này?"
                visible={modalOpen}
                onVisible={onModalVisible}
                onOk={() => deleteMutation.mutate(selectedSchoolRoom)}
                closeTxt="Huỷ"
                okTxt="Xác nhận"
            />
        </>
    );
};

export default RoomSchoolList;
