import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../../config/axios";
import Modal from "../../../components/Modal/Modal";
import { toast } from "react-toastify";
import { getToken } from "../../../utils/getToken";
import "datatables.net-dt/css/dataTables.dataTables.css";
import $ from "jquery";
import "datatables.net";

const ListAccount = () => {
    const accessToken = getToken();
    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedGradeComponent, setSelectedGradeComponent] = useState();

    const onModalVisible = () => setModalOpen((prev) => !prev);

    const { data, refetch } = useQuery({
        queryKey: ["LIST_ACCOUNT"],
        queryFn: async () => {
            const res = await api.get("/admin/students");
            return res.data;
        },
    });

    const users = data?.data || [];

    const { mutate, isLoading } = useMutation({
        mutationFn: (user_code) => api.delete(`/admin/users/${user_code}`),
        onSuccess: () => {
            toast.success("Xóa tài khoản thành công");
            onModalVisible();
            refetch();
        },
        onError: () => {
            toast.error("Có lỗi xảy ra khi xóa tài khoản");
        },
    });

    const handleDelete = (user_code) => {
        setSelectedGradeComponent(user_code);
        onModalVisible();
    };

    useEffect(() => {
        if (users) {
            if ($.fn.DataTable.isDataTable("#usersTable")) {
                $("#usersTable").DataTable().destroy();
            }

            // Khởi tạo DataTable
            $("#usersTable").DataTable({
                data: users,
                serverSide: true,
                processing: true,
                ajax: async (data, callback) => {
                    try {
                        // Tính toán số trang dựa trên DataTables truyền vào
                        const page = data.start / data.length + 1;
                        const searchValue = data.search.value;

                        // Gửi request đến API với các tham số phù hợp
                        const response = await api.get(`/admin/students`, {
                            // params: { page, per_page: data.length },
                            params: {
                                page: page, // Trang hiện tại
                                per_page: data.length, // Số bản ghi mỗi trang
                                search: data.search.value || "", // Từ khóa tìm kiếm
                                // order_column: data.order[0].column, // Cột được sắp xếp
                                // order_dir: data.order[0].dir, // Hướng sắp xếp
                            },
                        });

                        // Dữ liệu trả về từ API
                        const result = response.data;

                        // Gọi callback để DataTables hiển thị dữ liệu
                        callback({
                            draw: data.draw,
                            recordsTotal: result.total,
                            recordsFiltered: result.total,
                            data: result.data,
                        });
                    } catch (error) {
                        console.error("Error fetching data:", error);
                        callback({
                            draw: data.draw,
                            recordsTotal: 0,
                            recordsFiltered: 0,
                            data: [],
                        });
                    }
                },
                columns: [
                    { title: "Mã sinh viên", data: "user_code" },
                    { title: "Họ và tên", data: "full_name" },
                    { title: "Email", data: "email" },
                    {
                        title: "Khóa học",
                        data: "course",
                        render: (data) => data?.cate_name || "",
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
                            <a href="/sup-admin/students/edit/${row.user_code}">
               <i class="fas fa-edit" style="cursor: pointer; font-size: 20px;" data-id="${row.user_code}" id="edit_${row.user_code}"></i>
            </a>
                             <a href="/sup-admin/students/${row.user_code}">
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
                destroy: true,
                createdRow: (row, data) => {
                    $(row)
                        .find(".fa-trash")
                        .on("click", () => {
                            handleDelete(data.user_code);
                        });
                    $(row)
                        .find(".fa-edit")
                        .on("click", () => {
                            navigate(`/sup-admin/students/${data.user_code}`);
                        });
                },
            });
        }
    }, [users]);

    if (!data) return <div>Loading...</div>;

    return (
        <>
            <div className="mb-3 mt-2 flex items-center justify-between">
                <Link to="/sup-admin/students/create">
                    <button className="btn btn-primary">Thêm tài khoản</button>
                </Link>
            </div>

            <div className="card">
                <div className="card-header">
                    <h4 className="card-title">Danh sách sinh viên</h4>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table id="usersTable" className="display"></table>
                    </div>
                </div>
            </div>
            <Modal
                title="Xóa sinh viên"
                description="Bạn có chắc chắn muốn xoá sinh viên này?"
                closeTxt="Huỷ"
                okTxt="Xác nhận"
                visible={modalOpen}
                onVisible={onModalVisible}
                onOk={() => mutate(selectedGradeComponent)}
            />
        </>
    );
};

export default ListAccount;
