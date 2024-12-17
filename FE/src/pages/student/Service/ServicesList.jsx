import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../../config/axios";
import { getToken } from "../../../utils/getToken";
import Spinner from "../../../components/Spinner/Spinner";
import Modal from "../../../components/Modal/Modal";
import { toast } from "react-toastify";
import "datatables.net-dt/css/dataTables.dataTables.css";
import $ from "jquery";
import "datatables.net";

const ServicesList = () => {
    const accessToken = getToken();

    // Sử dụng React Query để gọi API
    const { data, refetch, isFetching } = useQuery({
        queryKey: ["SERVICE_LIST"],
        queryFn: async () => {
            const res = await api.get("/student/services", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            });
            return res?.data?.data ?? []; // Lấy dữ liệu từ API trả về
        },
    });

    const [modalOpen, setModalOpen] = useState(false); // Modal hủy dịch vụ
    const [selectedService, setSelectedService] = useState(null); // Dịch vụ được chọn

    const onModalVisible = () => setModalOpen((prev) => !prev);

    // Hàm xử lý hủy dịch vụ
    const handleCancel = (id) => {
        setSelectedService(id);
        onModalVisible(); // Hiển thị modal xác nhận
    };

    const confirmCancel = async () => {
        try {
            await api.delete(`/student/services/delete/${selectedService}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            });
            toast.success("Hủy dịch vụ thành công");
            onModalVisible(); // Đóng modal
            refetch(); // Làm mới danh sách dịch vụ
        } catch (error) {
            toast.error("Có lỗi xảy ra khi hủy dịch vụ");
        }
    };

    // Chuyển đổi dữ liệu từ API thành định dạng DataTable
    const flattenServiceData = (data) => {
        return data.map((service, index) => ({
            id: service.id,
            code: service.user_code,
            serviceName: service.service_name,
            amount: service.amount,
            status: service.status,
            reason: service.reason,
            createdAt: service.created_at,
            sortOrder: index,
        }));
    };

    useEffect(() => {
        if (data) {
            if ($.fn.dataTable.isDataTable("#service-table")) {
                $("#service-table").DataTable().clear().destroy();
            }
    
            // Khởi tạo DataTable
            $("#service-table").DataTable({
                pageLength: 10,
                lengthMenu: [10, 20, 50],
                data: flattenServiceData(data),
                columns: [
                    { title: "Tên dịch vụ", data: "serviceName" },
                    {
                        title: "Trạng thái",
                        data: "status",
                        render: (data) => {
                            if (data === "approved") {
                                return `<span class="text-green-500">Đã xác nhận</span>`;
                            } else if (data === "rejected") {
                                return `<span class="text-red-500">Đã từ chối</span>`;
                            } else if (data === "paid"){
                                return `<span class="text-blue  -500">Đã thanh toán</span>`;
                            }
                            return `<span class="text-yellow-500">Đang chờ</span>`;
                        },
                        className: "text-center",
                    },
                    { title: "Số tiền", data: "amount" },
                    {
                        title: "Lý do",
                        data: "reason",
                        render: (data) => (data ? data : "Không có lý do"),
                    },
                    {
                        title: "Ngày tạo",
                        data: "createdAt",
                        render: (data) =>
                            data ? new Date(data).toLocaleString() : "Chưa có",
                    },
                    {
                        title: "Hành động",
                        data: null,
                        render: (data, type, row) => {
                            const disableCancel =
                                row.status === "approved" || row.status === "rejected"
                                    ? "disabled"
                                    : "";
                            const opacity =
                                row.status === "approved" || row.status === "rejected"
                                    ? "opacity-50"
                                    : "";
    
                            let actionButtons = `
                                <div class="d-flex justify-content-center">
                                    <button class="delete-btn btn btn-danger ${opacity}" ${disableCancel}>
                                        Hủy
                                    </button>
                            `;
    
                            if (row.status === "pending") {
                                actionButtons += `
                                    <a href="https://admin.feduvn.com/api/total_vnpay/service?id=${row.id}&user_code=${row.code}" class="pay-btn btn btn-success ${opacity}">
                                        Thanh toán
                                    </a>
                                `;
                            }
    
                            actionButtons += `</div>`;
                            return actionButtons;
                        },
                        className: "text-center",
                    },
                    { title: "Thứ tự sắp xếp", data: "sortOrder", visible: false },
                ],
                order: [[5, "asc"]], // Sắp xếp theo thứ tự
                createdRow: (row, rowData) => {
                    $(row)
                        .find(".delete-btn")
                        .on("click", () => handleCancel(rowData.id)); // Gọi handleCancel khi nhấn vào nút
                    $(row)
                        .find(".pay-btn")
                        .on("click", () => handlePayment(rowData.id)); // Gọi handlePayment khi nhấn vào nút thanh toán
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
            if ($.fn.dataTable.isDataTable("#service-table")) {
                $("#service-table").DataTable().clear().destroy();
            }
        };
    }, [data]);
    

    if (isFetching && !data) return <Spinner />;

    return (
        <>
            <div className="card">
                <div className="card-header">
                    <h4 className="card-title">Danh sách dịch vụ đã đăng ký</h4>
                </div>
                <div className="card-body">
                    <table id="service-table" className="table"></table>
                </div>
            </div>

            {/* Modal xác nhận hủy dịch vụ */}
            <Modal
                title="Hủy dịch vụ"
                description="Bạn có chắc chắn muốn hủy dịch vụ này?"
                visible={modalOpen}
                onVisible={onModalVisible}
                onOk={confirmCancel}
                closeTxt="Huỷ"
                okTxt="Xác nhận"
            />
        </>
    );
};

export default ServicesList;
