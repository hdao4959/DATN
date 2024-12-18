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
    const [selectedUserCode, setSelectedUserCode] = useState();
    const [modalOpen, setModalOpen] = useState(false);
    const [statusModalOpen, setStatusModalOpen] = useState(false);
    const [selectedGradeComponent, setSelectedGradeComponent] = useState();

    const navigate = useNavigate();

    const onModalVisible = () => setModalOpen((prev) => !prev);
    const onStatusModalVisible = () => setStatusModalOpen((prev) => !prev);

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
    const updateStatusMutation = useMutation({
        mutationFn: (user_code) =>
            api.post(`/admin/students/updateActive/${user_code}`),
        onSuccess: () => {
            toast.success("Cập nhật trạng thái thành công");
            refetch();
            onStatusModalVisible();
        },
        onError: () => {
            toast.error("Có lỗi xảy ra khi cập nhật trạng thái");
        },
    });

    // Hàm xử lý khi nhấn vào trạng thái
    const handleUpdateStatus = (user_code) => {
        setSelectedUserCode(user_code); // Lưu mã người dùng vào selectedUserCode
        onStatusModalVisible(); // Hiển thị modal xác nhận
    };

    useEffect(() => {
        if (users) {
            if ($.fn.DataTable.isDataTable("#usersTable")) {
                $("#usersTable").DataTable().destroy();
            }

            $("#usersTable").DataTable({
                data: users,
                serverSide: true,
                processing: true,
                ajax: async (data, callback) => {
                    try {
                        const page = data.start / data.length + 1;
                        const orderColumnIndex = data.order[0]?.column;
                        const orderColumnName =
                            data.columns[orderColumnIndex]?.data ||
                            "created_at"; // Tên cột dựa trên index
                        const orderDirection = data.order[0]?.dir || "desc";

                        // Gửi request đến API với các tham số phù hợp
                        const response = await api.get(`/admin/students`, {
                            params: {
                                page,
                                per_page: data.length,
                                search: data.search.value,
                                orderBy: orderColumnName,
                                orderDirection: orderDirection,
                            },
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
                        title: "Kỳ học",
                        data: "semester",
                        render: (data) => data?.cate_name || "",
                    },
                    {
                        title: "Chuyên ngành",
                        data: "major",
                        render: (data) => data?.cate_name || "Chưa có",
                    },
                    {
                        title: "Chuyên ngành hẹp",
                        data: "narrow_major",
                        render: (data) => data?.cate_name || "Chưa có",
                    },
                    {
                        title: "Trạng thái",
                        data: "is_active",
                        className: "text-center",
                        render: (data) =>
                            data
                                ? `<i class="fas fa-check-circle toggleStatus" style="color: green; font-size: 20px; cursor: pointer;"></i>`
                                : `<i class="fas fa-times-circle toggleStatus" style="color: red; font-size: 20px; cursor: pointer;"></i>`,
                    },
                    {
                        title: "Hành động",
                        data: null,
                        render: (data, type, row) => `
                            <div style="display: flex; justify-content: center; align-items: center; gap: 10px">
                                <i class="fas fa-edit" style="cursor: pointer; font-size: 20px;"></i>
                                <i class="fas fa-eye" style="cursor: pointer; font-size: 20px;"></i>
                                <i class="fas fa-trash" style="cursor: pointer; color: red; font-size: 20px;" data-id="${row.user_code}"></i>
                            </div>git 
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
                    // Xử lý khi nhấn biểu tượng thay đổi trạng thái
                    $(row)
                        .find(".toggleStatus")
                        .on("click", () => handleUpdateStatus(data.user_code));

                    // Xử lý xóa tài khoản
                    $(row)
                        .find(".fa-trash")
                        .on("click", () => handleDelete(data.user_code));
                    $(row)
                        .find(".fa-edit")
                        .on("click", () =>
                            navigate(
                                `/sup-admin/students/edit/${data.user_code}`
                            )
                        );
                    $(row)
                        .find(".fa-eye")
                        .on("click", () =>
                            navigate(`/sup-admin/students/${data.user_code}`)
                        );
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
            <Modal
                title="Cập nhật trạng thái"
                description="Bạn có chắc chắn muốn cập nhật trạng thái của tài khoản này?"
                closeTxt="Huỷ"
                okTxt="Xác nhận"
                visible={statusModalOpen}
                onVisible={onStatusModalVisible}
                onOk={() => updateStatusMutation.mutate(selectedUserCode)} // Gọi mutation khi người dùng xác nhận
            />
        </>
    );
};

export default ListAccount;
