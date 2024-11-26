import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../../config/axios";
import { getToken } from "../../../utils/getToken";
import { toast } from "react-toastify";
import Modal from "../../../components/Modal/Modal";
import "datatables.net-dt/css/dataTables.dataTables.css";
import $ from "jquery";
import "datatables.net";

const ClassRoomsList = () => {
    const accessToken = getToken();
    const { data, refetch, isLoading } = useQuery({
        queryKey: ["LIST_ROOMS"],
        queryFn: async () => {
            const res = await api.get("/admin/classrooms", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            });
            return res?.data?.classrooms || [];
        },
    });
    const classrooms = data?.data;

    const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
    const [currentClassCode, setCurrentClassCode] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false); // Modal xác nhận xóa

    // Mutation cập nhật trạng thái lớp học
    const updateStatusMutation = useMutation({
        mutationFn: (classCode) =>
            api.post(
                `/admin/classrooms/updateActive/${classCode}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                }
            ),
        onSuccess: () => {
            toast.success("Cập nhật trạng thái lớp học thành công");
            refetch();
        },
        onError: () => {
            toast.error("Có lỗi xảy ra khi cập nhật trạng thái lớp học");
        },
    });

    // Mutation xóa lớp học
    const deleteClassMutation = useMutation({
        mutationFn: (classCode) =>
            api.delete(`/admin/classrooms/${classCode}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            }),
        onSuccess: () => {
            toast.success("Xóa lớp học thành công");
            refetch();
            setDeleteModalOpen(false); // Đóng modal khi xóa thành công
        },
        onError: (error) => {
            toast.error(error.response.data.message);
        },
    });

    // Mở/đóng modal xác nhận trạng thái
    const toggleConfirmationModal = (classCode) => {
        setCurrentClassCode(classCode);
        setConfirmationModalOpen((prev) => !prev);
    };

    // Mở/đóng modal xác nhận xóa lớp học
    const toggleDeleteModal = (classCode) => {
        setCurrentClassCode(classCode);
        setDeleteModalOpen((prev) => !prev);
    };

    // Xác nhận cập nhật trạng thái
    const confirmUpdateStatus = () => {
        if (currentClassCode) {
            updateStatusMutation.mutate(currentClassCode);
        }
        setConfirmationModalOpen(false);
    };

    // Xác nhận xóa lớp học
    const confirmDeleteClass = () => {
        if (currentClassCode) {
            deleteClassMutation.mutate(currentClassCode);
        }
    };

    // Khi nhấn vào biểu tượng trạng thái, thay đổi trạng thái lớp học
    const handleToggleStatus = (classCode) => {
        toggleConfirmationModal(classCode);
    };

    // Khi nhấn vào biểu tượng xóa lớp học
    const handleDeleteClass = (classCode) => {
        toggleDeleteModal(classCode);
    };

    // Chuyển đổi dữ liệu thành định dạng DataTable
    useEffect(() => {
        if (classrooms) {
            if ($.fn.dataTable.isDataTable("#classroomsTable")) {
                $("#classroomsTable").DataTable().clear().destroy();
            }

            $("#classroomsTable").DataTable({
                data: classrooms,
                processing: true,
                serverSide: true,
                columns: [
                    { title: "Mã lớp", data: "class_code" },
                    { title: "Tên lớp", data: "class_name" },
                    { title: "Mã môn", data: "subject_code" },
                    {
                        title: "Trạng thái",
                        data: "is_active",
                        render: (data) =>
                            `<i class="fas ${
                                data === 1
                                    ? "fa-times-circle text-red-500"
                                    : "fa-check-circle text-green-500"
                            } toggle-status" style="font-size: 20px; cursor: pointer;"></i>`,
                        className: "text-center",
                    },
                    {
                        title: "Hành động",
                        data: null,
                        render: (data, type, row) => `
                           <div class="d-flex justify-content-center">
                           <button class="btn btn-info btn-sm" title="Xem điểm" id="view_grades_${row.class_code}" style="margin-right: 10px;">Xem điểm</button>
                           <button class="btn btn-secondary btn-sm" title="Xem điểm danh" id="view_attendance_${row.class_code}" style="margin-right: 10px;">Xem điểm danh</button>
                           <button class="btn btn-danger btn-sm delete-btn" title="Xóa" id="delete_${row.class_code}">Xóa</button>
                          </div>
`,
                        className: "text-center",
                    },
                ],
                createdRow: (row, data, dataIndex) => {
                    // Lắng nghe sự kiện toggle trạng thái
                    $(row)
                        .find(".toggle-status")
                        .on("click", () => handleToggleStatus(data.class_code));

                    // Lắng nghe sự kiện xóa lớp học
                    $(row)
                        .find(".delete-btn")
                        .on("click", () => handleDeleteClass(data.class_code));
                },
                language: {
                    paginate: { previous: "Trước", next: "Tiếp theo" },
                    lengthMenu: "Hiển thị _MENU_ mục mỗi trang",
                    info: "Hiển thị từ _START_ đến _END_ trong _TOTAL_ mục",
                    search: "Tìm kiếm:",
                },
            });
        }

        return () => {
            if ($.fn.dataTable.isDataTable("#classroomsTable")) {
                $("#classroomsTable").DataTable().clear().destroy();
            }
        };
    }, [classrooms]);

    return (
        <>
            <div className="mb-3 mt-2 flex items-center justify-between">
                <Link to="/admin/classrooms/add">
                    <button className="btn btn-primary">Tạo lớp học mới</button>
                </Link>
            </div>

            <div className="card">
                <div className="card-header">
                    <h4 className="card-title">Quản lý lớp học</h4>
                </div>
                <div className="card-body">
                    {isLoading && (
                        <>
                        <div className="spinner-border" role="status"></div>
                        <p>Đang tải dữ liệu</p>
                        </>
                    )}
                    <table id="classroomsTable" className="table table-bordered"></table>
                </div>
            </div>

            {/* Modal xác nhận thay đổi trạng thái */}
            <Modal
                title="Cập nhật trạng thái"
                description="Bạn có chắc chắn muốn thay đổi trạng thái của lớp học này?"
                visible={confirmationModalOpen}
                onVisible={toggleConfirmationModal}
                onOk={confirmUpdateStatus}
                closeTxt="Huỷ"
                okTxt="Xác nhận"
            />

            {/* Modal xác nhận xóa lớp học */}
            <Modal
                title="Xóa lớp học"
                description="Bạn có chắc chắn muốn xóa lớp học này?"
                visible={deleteModalOpen}
                onVisible={toggleDeleteModal}
                onOk={confirmDeleteClass}
                closeTxt="Huỷ"
                okTxt="Xác nhận"
            />
        </>
    );
};

export default ClassRoomsList;
