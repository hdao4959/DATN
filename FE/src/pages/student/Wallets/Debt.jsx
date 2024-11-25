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
    const { data: debts, refetch } = useQuery({
        queryKey: ["LIST_DEBT_STUDENT"],
        queryFn: async () => {
            const res = await api.get("student/getListDebt");
            return res.data;
        },
    });
    console.log(debts);
    useEffect(() => {
        if (debts) {
            $('#debtTable').DataTable({
                data: debts,
                // processing: true,
                // serverSide: true,
                ajax: async (data, callback) => {

                },
                columns: [
                    {
                        title: "Số tiền cần đóng",
                        className: 'fw-bold',
                        data: null, // Không lấy từ cột dữ liệu, sẽ tính toán từ `row`
                        render: function (data, type, row) {
                            // Tính số tiền cần đóng
                            const amountDue = row.total_amount - row.amount;

                            // Định dạng và hiển thị
                            return `<span class="text-danger">${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amountDue)}</span>`;
                        }
                    },
                    {
                        title: "Học kỳ",
                        className: 'text-center',
                        data: "semester_code",
                        // render: (data, type, row) => {
                        //     return data?.semester_code;
                        // }
                    },
                    {
                        title: "Hạn thanh toán",
                        data: "due_date",
                        className: "text-center",
                        render: function (data, type, row) {
                            if (data) {
                                const date = new Date(data);
                                return date.toLocaleDateString('vi-VN', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric'
                                });
                            }
                            return "";
                        }
                    },
                    {
                        title: "Trạng thái",
                        className: "text-center",
                        data: "status",
                        render: (data, type, row) => {
                            if (data == 'unpaid') {
                                return `<span >Chưa đóng</span>`
                            } else if (data == 'pending') {
                                return `<span >Đang chờ xử lý</span>`
                            } else {
                                return `<span >Chưa đóng</span>`
                            }
                        }
                    },{
                        title: "Hành động",
                        data: null, // Không cần dữ liệu từ cột cụ thể
                        render: (data, type, row) => {
                            return `
                                <div style="display: flex; justify-content: center; align-items: center; gap: 10px">
                                    <a href="http://127.0.0.1:8000/total_momo?fee_id=${row.id}" class="text-primary fw-bold" data-id="${row.id}" id="edit_${row.id}">
                                        Thanh toán ngay
                                    </a>
                                </div>
                            `;
                        }
                    }
                    

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
                
            })
        }
    }, [debts]);
    useEffect(() => {
        const handleGetSelected = async () => {
            const selectedUserCodes = getSelectedUserCodes();
            if (selectedUserCodes.length == 0) {
                return toast.error('Vui lòng chọn sinh viên muốn gửi mail')
            }
            await api.get(`/send-email2`, {
                params: { UserCode: selectedUserCodes },
            });

        };

        $('#getSelectedButton').off('click').on('click', handleGetSelected);
    }, []);

    function getSelectedUserCodes() {
        const selected = $('.row-checkbox:checked');
        const userCodes = selected.map(function () {
            return $(this).data('id');
        }).get();

        return userCodes;
    }


    return (
        <>
            <div className="card">
                <div className="card-header d-flex justify-content-between">
                    <h4 className="card-title">Danh sách công nợ còn thiếu
                    </h4>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table id="debtTable" className="display"></table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default StudentWalletList;
