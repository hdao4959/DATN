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
            amount: new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
            }).format(service.amount), // Định dạng tiền sang VND
            status: service.status,
            reason: service.reason,
            createdAt: service.created_at,
            sortOrder: index,
        }));
    };
    const openPaymentPopup = (id, code) => {
        const popup = window.open(
            "",
            "Thanh toán",
            "width=500,height=400,scrollbars=no,resizable=no"
        );

        // Nội dung HTML trong popup
        popup.document.write(`
                <html>
                    <head>
                        <title>Chọn phương thức thanh toán</title>
                        <style>
                            body {
                                font-family: Arial, sans-serif; 
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                                justify-content: center;
                                height: 100vh; 
                                margin: 0;
                                text-align: center;
                            }
                            button {
                                margin: 10px; 
                                padding: 10px 20px; 
                                font-size: 16px;
                                cursor: pointer;
                                border: none;
                                border-radius: 5px;
                            }
                            .momo-btn { background-color: #ff0080; color: white; }
                            .vnpay-btn { background-color: #007bff; color: white; }
                        </style>
                    </head>
                    <body>
                        <h2>Chọn phương thức thanh toán</h2>
                        <button class="momo-btn" onclick="window.location.href='https://admin.feduvn.com/api/total_momo/service?id=${id}&user_code=${code}'">Thanh toán bằng Momo</button>
                        <button class="vnpay-btn" onclick="window.location.href='https://admin.feduvn.com/api/total_vnpay/service?id=${id}&user_code=${code}'">Thanh toán bằng VNPay</button>
                    </body>
                </html>
            `);

        popup.document.close();
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
                            } else if (data === "paid") {
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
                            let actionButtons = `<div class="d-flex justify-content-center">`;

                            // Chỉ hiển thị nút Hủy nếu trạng thái không phải 'approved', 'rejected', 'paid'
                            if (row.status !== "approved" && row.status !== "rejected" && row.status !== "paid") {
                                actionButtons += `
                                    <button class="delete-btn btn btn-danger btn-sm">
                                        Hủy
                                    </button>
                                `;
                            }

                            // Chỉ hiển thị nút Thanh toán khi trạng thái là 'pending' và số tiền khác 0
                            if (row.status === "pending" && row.amount != 0) {
                                actionButtons += `
                                    <a class="pay-btn btn btn-success btn-sm ml-2">
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
                        .on("click", () => openPaymentPopup(rowData.id)); // Gọi handlePayment khi nhấn vào nút thanh toán
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
