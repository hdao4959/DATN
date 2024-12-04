import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../../config/axios";
import { toast } from "react-toastify";
import { getToken } from "../../../utils/getToken";
import "datatables.net-dt/css/dataTables.dataTables.css";
import $ from "jquery";
import "datatables.net";

const StudentWalletList = () => {
    const accessToken = getToken();
    const [modalOpen, setModalOpen] = useState(false);
    const onModalVisible = () => setModalOpen((prev) => !prev);

    // Fetch dữ liệu thông qua React Query
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ["LIST_WALLET_STUDENT"],
        queryFn: async () => {
            const res = await api.get("student/transaction");
            return res.data;
        },
    });

    const transactions = data?.transactions;
    const wallets = data?.wallets;

    // Xử lý DataTable khi có dữ liệu
    useEffect(() => {
        if (transactions) {
            $("#walletsTable").DataTable({
                data: transactions,
                columns: [
                    {
                        title: "ID",
                        data: "id",
                        visible: false, // Ẩn cột ID nếu không cần hiển thị
                    },
                    {
                        title: "STT",
                        data: null,
                        className: "text-center",
                        render: function (data, type, row, meta) {
                            return meta.row + 1; // Tính số thứ tự dựa trên index của hàng
                        },
                    },
                    {
                        title: "Số tiền",
                        className: "fw-bold text-center fs-5",
                        data: "amount_paid",
                        render: function (data, type, row) {
                            const sign = row.is_deposit ? "+" : "-";
                            return `<span>${sign} ${new Intl.NumberFormat(
                                "vi-VN",
                                { style: "currency", currency: "VND" }
                            ).format(data)}</span>`;
                        },
                    },
                    {
                        title: "Học kỳ",
                        className: "text-center",
                        data: "fee",
                        render: (data) => data?.semester_code,
                    },
                    {
                        title: "Phương thức thanh toán",
                        className: "text-center",
                        data: "payment_method",
                        render: (data) => {
                            if (data === "transfer") {
                                return `<span>Thanh toán online</span>`;
                            } else if (data === "cash") {
                                return `<span>Thanh toán tiền mặt</span>`;
                            } else {
                                return `<span>Thanh toán online</span>`;
                            }
                        },
                    },
                    {
                        title: "Ngày",
                        data: "payment_date",
                        className: "text-center",
                        render: function (data) {
                            if (data) {
                                const date = new Date(data);
                                return date.toLocaleDateString("vi-VN", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                });
                            }
                            return "";
                        },
                    },
                ],
                order: [[0, "desc"]], // Sắp xếp theo cột ID giảm dần
                pageLength: 10,
                lengthMenu: [10, 20, 50, 100],
                language: {
                    paginate: { previous: "Trước", next: "Tiếp theo" },
                    lengthMenu: "Hiển thị _MENU_ mục mỗi trang",
                    info: "Hiển thị từ _START_ đến _END_ trong _TOTAL_ mục",
                    search: "Tìm kiếm:",
                },
                destroy: true,
                dom: "tip",
                createdRow: (row, data, dataIndex) => {
                    // Màu nền cho các dòng có is_deposit = true
                    if (data.is_deposit) {
                        $(row).css("background-color", "#d1e7dd");
                    } else {
                        $(row).css("background-color", "#f8d7da");
                    }
                },
            });
        }
    }, [transactions]);

    return (
        <>
            <div className="mt-5">
                <div
                    className="card text-center shadow-sm"
                    style={{ width: "18rem;" }}
                >
                    <div className="card-body">
                        <div className="mb-3">
                            <i
                                className="fa fa-wallet"
                                style={{ fontSize: "50px", color: "#28a745" }}
                            ></i>
                        </div>
                        <h2 className="card-title fw-bold">
                            <div>
                                <div>
                                    {wallets?.length > 0 &&
                                    wallets[0]?.total &&
                                    wallets[0]?.paid
                                        ? new Intl.NumberFormat("vi-VN", {
                                              style: "currency",
                                              currency: "VND",
                                          }).format(
                                              wallets[0].paid - wallets[0].total
                                          )
                                        : new Intl.NumberFormat("vi-VN", {
                                              style: "currency",
                                              currency: "VND",
                                          }).format(0)}
                                </div>
                            </div>
                        </h2>
                        <p className="card-text text-muted">Ví học phí</p>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-header d-flex justify-content-between">
                    <h4 className="card-title">Thông tin giao dịch, hoá đơn</h4>
                </div>
                <div className="card-body">
                    {isLoading ? (
                        <p className="text-center">Đang tải dữ liệu...</p>
                    ) : transactions && transactions.length > 0 ? (
                        <div className="table-responsive">
                            <table
                                id="walletsTable"
                                className="display"
                            ></table>
                        </div>
                    ) : (
                        <p className="text-center">Không có dữ liệu</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default StudentWalletList;
