import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../../config/axios";
import { toast } from "react-toastify";
import Modal from "../../../components/Modal/Modal";
import 'datatables.net-dt/css/dataTables.dataTables.css';
import $ from 'jquery';
import 'datatables.net';

const GradeComponentList = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [statusModalOpen, setStatusModalOpen] = useState(false);
    const [selectedGradeComponent, setSelectedGradeComponent] = useState();
    const [currentCateCode, setCurrentCateCode] = useState(null);

    const navigate = useNavigate();
    const toggleModal = () => setModalOpen((prev) => !prev);
    const toggleStatusModal = () => setStatusModalOpen((prev) => !prev);

    const { data, refetch, isFetching, isLoading } = useQuery({
        queryKey: ["GRADE_COMPONENTS"],
        queryFn: async () => {
            const res = await api.get("/admin/pointheads");
            return res.data.data ?? [];
        },
    });

    const { mutate: deleteGradeComponent } = useMutation({
        mutationFn: (id) => api.delete(`/admin/pointheads/${id}`),
        onSuccess: () => {
            toast.success("Xóa điểm thành phần thành công");
            toggleModal();
            refetch();
        },
        onError: () => {
            toast.error("Có lỗi xảy ra khi xóa điểm thành phần");
        },
    });

    const { mutate: updateStatus } = useMutation({
        mutationFn: (id) => api.post(`/admin/updateActive/${id}`),
        onSuccess: () => {
            toast.success("Cập nhật trạng thái thành công");
            refetch();
        },
        onError: () => {
            toast.error("Có lỗi xảy ra khi cập nhật trạng thái");
        },
    });

    const handleDelete = (id) => {
        setSelectedGradeComponent(id);
        toggleModal();
    };

    const confirmUpdateStatus = () => {
        if (currentCateCode) {
            updateStatus(currentCateCode);
            toggleStatusModal();
        }
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
                        render: (data) => {
                            return data
                                ? `<i class="fas fa-check-circle toggleStatus" style="color: green; font-size: 20px; cursor: pointer;"></i>`
                                : `<i class="fas fa-times-circle toggleStatus" style="color: red; font-size: 20px; cursor: pointer;"></i>`;
                        },
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
                        },
                    },
                ],
                pageLength: 10,
                lengthMenu: [10, 20, 50, 100],
                language: {
                    paginate: { previous: 'Trước', next: 'Tiếp theo' },
                    lengthMenu: 'Hiển thị _MENU_ mục mỗi trang',
                    info: 'Hiển thị từ _START_ đến _END_ trong _TOTAL_ mục',
                    search: 'Tìm kiếm:',
                },
                destroy: true,
                createdRow: (row, data) => {
                    $(row)
                        .find('.fa-trash')
                        .on('click', function () {
                            const cate_code = $(this).data('id');
                            handleDelete(cate_code);
                        });

                    $(row)
                        .find('.fa-edit')
                        .on('click', function () {
                            const cate_code = $(this).data('id');
                            navigate(`/admin/grade-components/${cate_code}/edit`);
                        });

                    $(row)
                        .find('.toggleStatus')
                        .on('click', function () {
                            const cate_code = data.cate_code;
                            setCurrentCateCode(cate_code);
                            toggleStatusModal();
                        });
                },
            });
        }
    }, [data]);

    return (
        <>
            <div className="mb-3 mt-2 flex items-center justify-between">
                <Link to="/sup-admin/grade-components/add">
                    <button className="btn btn-primary">
                        Thêm điểm thành phần
                    </button>
                </Link>
            </div>

            <div className="card">
                <div className="card-header">
                    <h4 className="card-title">Quản lý đầu điểm</h4>
                </div>
                <div className="card-body">
                    {isLoading && (
                        <div>
                            <div className='spinner-border' role='status'></div>
                            <p>Đang tải dữ liệu</p>
                        </div>
                    )}
                    <div className="table-responsive">
                        <table id="classroomsTable" className="display"></table>
                    </div>
                </div>
            </div>

            <Modal
                title="Xoá điểm thành phần"
                description="Bạn có chắc chắn muốn xoá điểm thành phần này?"
                closeTxt="Huỷ"
                okTxt="Xác nhận"
                visible={modalOpen}
                onVisible={toggleModal}
                onOk={() => deleteGradeComponent(selectedGradeComponent)}
            />

            <Modal
                title="Cập nhật trạng thái"
                description="Bạn có chắc chắn muốn cập nhật trạng thái của điểm thành phần này?"
                closeTxt="Huỷ"
                okTxt="Xác nhận"
                visible={statusModalOpen}
                onVisible={toggleStatusModal}
                onOk={confirmUpdateStatus}
            />
        </>
    );
};

export default GradeComponentList;
