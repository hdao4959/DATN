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

    const { data, refetch, isFetching } = useQuery({
        queryKey: ["SERVICE_LIST"],
        queryFn: async () => {
            const res = await api.get("/student/services", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            });
            return res?.data?.data ?? [];
        },
    });

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null);

    const onModalVisible = () => setModalOpen((prev) => !prev);

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

            $("#service-table").DataTable({
                pageLength: 10,
                lengthMenu: [10, 20, 50],
                data: flattenServiceData(data),
                columns: [
                    { title: "Mã sinh viên", data: "code" },
                    { title: "Tên dịch vụ", data: "serviceName" },
                    {
                        title: "Trạng thái",
                        data: "status",
                        render: (data) => {
                            if (data === "approved") {
                                return `<span class="text-green-500">Đã xác nhận</span>`;
                            } else if (data === "rejected") {
                                return `<span class="text-red-500">Đã từ chối</span>`;
                            }
                            return `<span class="text-yellow-500">Đang chờ</span>`;
                        },
                        className: "text-center",
                    },
                    {
                        title: "Số tiền",
                        data: "amount",
                        render: (data) =>
                            `${new Intl.NumberFormat("vi-VN").format(data)} đ`,
                        width: "90px",
                    },
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
                                row.status === "approved" ||
                                row.status === "rejected";
                            return `
                                <div class="d-flex justify-content-center">
                                    <button 
                                        class="fs-4 ${
                                            disableCancel ? "opacity-50" : ""
                                        }" 
                                        ${disableCancel ? "disabled" : ""}
                                        data-id="${row.id}">
                                        <i class="fas fa-times-circle hover:text-red-100"></i>
                                    </button>
                                </div>`;
                        },
                        className: "text-center",
                    },
                    {
                        title: "Thứ tự sắp xếp",
                        data: "sortOrder",
                        visible: false,
                    },
                ],
                order: [[6, "asc"]],
                createdRow: (row, rowData) => {
                    $(row)
                        .find("button")
                        .on("click", () => handleCancel(rowData.id));
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

    const handleCancel = (id) => {
        setSelectedService(id);
        onModalVisible();
    };

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

            <Modal
                title="Hủy dịch vụ"
                description={`Bạn có chắc chắn muốn hủy dịch vụ ${
                    data?.find((service) => service.id === selectedService)
                        ?.service_name || ""
                }?`}
                visible={modalOpen}
                onVisible={onModalVisible}
                onOk={() => {
                    api.delete(`/student/services/${selectedService}`, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            "Content-Type": "application/json",
                        },
                    })
                        .then(() => {
                            toast.success("Hủy dịch vụ thành công");
                            onModalVisible();
                            refetch();
                        })
                        .catch(() => {
                            toast.error("Có lỗi xảy ra khi hủy dịch vụ");
                        });
                }}
                closeTxt="Huỷ"
                okTxt="Xác nhận"
            />
        </>
    );
};

export default ServicesList;
