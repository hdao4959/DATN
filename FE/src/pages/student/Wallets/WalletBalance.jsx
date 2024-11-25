import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../../config/axios";
import Modal from "../../../components/Modal/Modal";
import { toast } from "react-toastify";
import { getToken } from "../../../utils/getToken";
import 'datatables.net-dt/css/dataTables.dataTables.css';
import $ from 'jquery';
import 'datatables.net';
import { useNavigate } from 'react-router-dom';
const StudentWalletList = () => {
    const accessToken = getToken();
    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedGradeComponent, setSelectedGradeComponent] = useState();
    const onModalVisible = () => setModalOpen((prev) => !prev);
    const { data, refetch } = useQuery({
        queryKey: ["LIST_WALLET_STUDENT"],
        queryFn: async () => {
            const res = await api.get("student/transaction");
            return res.data;
        },
    });
    const transactions = data?.transactions;
    const wallets = data?.wallets;
    useEffect(() => {
        if (transactions) {
            $('#walletsTable').DataTable({
                data: transactions,
                // processing: true,
                // serverSide: true,
                ajax: async (data, callback) => {
                },
                columns: [
                    {
                        title: "Số tiền",
                        className: 'fw-bold',
                        data: "amount_paid",
                        render: function (data, type, row) {
                            return `<span class="text-success">+ ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data)}</span>`;
                        }
                    },
                    {
                        title: "Học kỳ",
                        className: 'text-center',
                        data: "fee",
                        render: (data, type, row) => {
                            return data?.semester_code;
                        }
                    },

                    {
                        title: "Phương thức thanh toán",
                        data: "payment_method",
                        render: (data, type, row) => {
                            if (data == 'transfer') {
                                return `<span >Thanh toán online</span>`
                            } else if (data == 'cash') {
                                return `<span >Thanh toán tiền mặt</span>`
                            } else {
                                return `<span >Thanh toán online</span>`
                            }
                        }

                    },
                    {
                        title: "Ngày",
                        data: "payment_date",
                        className: "text-center",
                        render: function (data, type, row) {
                            if (data) {
                                // Chuyển đổi ngày sang định dạng dd/MM/yyyy
                                const date = new Date(data);
                                return date.toLocaleDateString('vi-VN', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric'
                                });
                            }
                            return ""; // Trả về chuỗi rỗng nếu không có dữ liệu
                        }
                    },
                ],
                pageLength: 10,
                lengthMenu: [10, 20, 50, 100],
                language: {
                    paginate: { previous: 'Trước', next: 'Tiếp theo' },
                    lengthMenu: 'Hiển thị _MENU_ mục mỗi trang',
                    info: 'Hiển thị từ _START_ đến _END_ trong _TOTAL_ mục',
                    search: 'Tìm kiếm:'
                },
                destroy: true,
                createdRow: (row, data, dataIndex) => {
                    $('#select_all').on('click', function () {
                        const isChecked = $(this).is(':checked');
                        $('.row-checkbox').prop('checked', isChecked);
                    });
                    $(document).on('change', '.row-checkbox', function () {
                        const allChecked = $('.row-checkbox').length === $('.row-checkbox:checked').length;
                        $('#select_all').prop('checked', allChecked);
                    });
                }
            })
        }
    }, [transactions]);

    return (
        <>
            <div className=" mt-5">
                <div className="card text-center shadow-sm" style={{ width: "18rem;" }}>
                    <div className="card-body">
                        <div className="mb-3">
                            <i className="fa fa-wallet" style={{ fontSize: "50px", color: "#28a745" }}></i>
                        </div>
                        <h2 className="card-title fw-bold">
                            <div>
                                <div>
                                    {wallets?.length > 0 && wallets[0]?.total && wallets[0]?.paid
                                        ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(wallets[0].total - wallets[0].paid)
                                        : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(0)}
                                </div>

                            </div>
                        </h2>
                        <p className="card-text text-muted">Ví học phí</p>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-header d-flex justify-content-between">
                    <h4 className="card-title">Thông tin giao dịch, hoá đơn
                    </h4>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table id="walletsTable" className="display"></table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default StudentWalletList;
