import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../../config/axios";
import Modal from "../../../components/Modal/Modal";
import { toast } from "react-toastify";
import "datatables.net-dt/css/dataTables.dataTables.css";
import $ from "jquery";
import "datatables.net";

const ListTeacher = () => {
    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState();

    const onModalVisible = () => setModalOpen((prev) => !prev);

    const { data, refetch } = useQuery({
        queryKey: ["LIST_TEACHER"],
        queryFn: async () => {
            const res = await api.get("/admin/teachers");
            return res.data;
        },
    });

    const teachers = data?.data || [];

    const { mutate, isLoading } = useMutation({
        mutationFn: (user_code) => api.delete(`/admin/teachers/${user_code}`),
        onSuccess: () => {
            toast.success("Xóa giảng viên thành công");
            onModalVisible();
            refetch();
        },
        onError: () => {
            toast.error("Có lỗi xảy ra khi xóa giảng viên");
        },
    });

    const handleDelete = (user_code) => {
        setSelectedTeacher(user_code);
        onModalVisible();
    };

    useEffect(() => {
        if (teachers) {
            if ($.fn.DataTable.isDataTable("#teachersTable")) {
                $("#teachersTable").DataTable().destroy();
            }

            $("#teachersTable").DataTable({
                data: teachers,
                serverSide: true,
                processing: true,
                ajax: async (data, callback) => {
                    try {
                        const page = data.start / data.length + 1;
                        const response = await api.get(`/admin/teachers`, {
                            params: { page, per_page: data.length, search: data.search.value || '' },
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
                    { title: "Mã giảng viên", data: "user_code" },
                    { title: "Họ và tên", data: "full_name" },
                    { title: "Email", data: "email" },
                    {
                        title: "Giới tính",
                        data: "sex",
                        render: (data) => (data === "male" ? "Nam" : "Nữ"),
                    },
                    {
                        title: "Trạng thái",
                        data: "is_active",
                        className: "text-center",
                        render: (data) =>
                            data
                                ? `<i class="fas fa-check-circle" style="color: green; font-size: 20px;"></i>`
                                : `<i class="fas fa-times-circle" style="color: red; font-size: 20px;"></i>`,
                    },
                    {
                        title: "Hành động",
                        data: null,
                        render: (data, type, row) => `
                            <div style="display: flex; justify-content: center; align-items: center; gap: 10px">

                            <a href="/admin/teachers/edit/${row.user_code}">
               <i class="fas fa-edit" style="cursor: pointer; font-size: 20px;" data-id="${row.user_code}" id="edit_${row.user_code}"></i>
            </a>
                            
                             <a href="/admin/teachers/${row.user_code}">
                <i class="fas fa-eye" style="cursor: pointer; font-size: 20px;"></i>
            </a>
                                <i class="fas fa-trash" style="cursor: pointer; color: red; font-size: 20px;" data-id="${row.user_code}" id="delete_${row.user_code}"></i>
                            </div>
                        `,
                    },
                ],
                pageLength: 10,
                lengthMenu: [10, 20, 50, 100],
                language: {
                    paginate: { previous: "Trước", next: "Tiếp theo" },
                    lengthMenu: "Hiển thị _MENU_ mục mỗi trang",
                    info: "Hiển thị từ _START_ đến _END_ trong _TOTAL_ mục",
                    search: "Tìm kiếm:",
                },
                createdRow: (row, data) => {
                    $(row)
                        .find(".fa-trash")
                        .on("click", () => {
                            handleDelete(data.user_code);
                        });
                    $(row)
                        .find(".fa-edit")
                        .on("click", () => {
                            navigate(`/admin/teachers/${data.user_code}`);
                        });
                },
            });
        }
    }, [teachers]);

    if (!data) return <div>Loading...</div>;

    return (
        <>
            <div className="mb-3 mt-2 flex items-center justify-between">
                <Link to="/admin/teachers/create">
                    <button className="btn btn-primary">Thêm giảng viên</button>
                </Link>
            </div>

            <div className="card">
                <div className="card-header">
                    <h4 className="card-title">Teacher Management</h4>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table id="teachersTable" className="display"></table>
                    </div>
                </div>
            </div>
            <Modal
                title="Xóa giảng viên"
                description="Bạn có chắc chắn muốn xoá giảng viên này?"
                closeTxt="Huỷ"
                okTxt="Xác nhận"
                visible={modalOpen}
                onVisible={onModalVisible}
                onOk={() => mutate(selectedTeacher)}
            />
        </>
    );
};

export default ListTeacher;
