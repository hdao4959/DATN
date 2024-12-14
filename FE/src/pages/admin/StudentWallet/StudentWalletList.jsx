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
    const { data: wallets, refetch } = useQuery({
        queryKey: ["LIST_WALLET"],
        queryFn: async () => {
            const res = await api.get("admin/fees");
            return res.data;
        },
    });
    const updateStatusFeeMutation = useMutation({
        mutationFn: async (data) => {
            // Kiểm tra giá trị id và data
            console.log("Mutation ID: ", data.id);
            console.log("Mutation Data: ", data);
            await api.put(`/admin/fees/${data.id}`, data.data);
        },
        onSuccess: () => {
            toast.success("Cập nhật công nợ thành công");
            refetch();
        },
        onError: (error) => {
            const msg = error.response?.data?.message || "Có lỗi xảy ra";
            toast.error(msg);
        },
    });
    
    const handleUpdateStatusFee = (id, newStatus) => {
        updateStatusFeeMutation.mutate({
            id, data: { status: newStatus },
        });
    };

    console.log(wallets);
    useEffect(() => {
        if (wallets) {
            $('#walletsTable').DataTable({
                data: wallets,
                processing: true,
                serverSide: true,
                ajax: async (data, callback) => {
                    try {
                        const page = data.start / data.length + 1;
                        const response = await api.get(`/admin/fees`, {
                            params: { page, per_page: data.length },
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
                    {
                        title: '<input type="checkbox" id="select_all">', // Checkbox chọn tất cả
                        data: null,
                        orderable: false, // Vô hiệu hóa sắp xếp cho cột này
                        className: 'text-center',
                        render: function (data, type, row) {
                            return `<input type="checkbox" class="row-checkbox" data-id="${row.user_code}">`;
                        }
                    },
                    { title: "Mã sinh viên", data: "user_code" },
                    // {
                    //     title: "Họ và tên", data: "user",
                    //     render: (data, type, row) => {
                    //         return data?.full_name;
                    //     }
                    // },
                    {
                        title: "Email", data: "user",
                        render: (data, type, row) => {
                            return data?.email;
                        }
                    },

                    // {
                    //     title: "Số điện thoại",
                    //     data: "user",
                    //     render: (data, type, row) => {
                    //         return data?.phone_number;
                    //     }
                    // },
                    {
                        title: "Học kỳ",
                        className: 'text-center',
                        data: "semester_code"
                    },
                    {
                        title: "Học phí",
                        data: "total_amount",
                        render: function (data, type, row) {
                            // Định dạng tiền Việt Nam
                            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data);
                        }

                    },
                    {
                        title: "Đã đóng",
                        data: "amount",
                        render: function (data, type, row) {
                            // Định dạng tiền Việt Nam
                            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data);
                        }

                    },
                    // {
                    //     title: "Trạng thái",
                    //     data: "status",
                    //     className: "text-center, fw-bold",
                    //     render: (data, type, row) => {
                    //         if (data == 'pending') {
                    //             return `<span Style="color:#ffad46">Đang chờ</span>`
                    //         } else if (data == 'paid') {
                    //             return `<span Style="color:green">Đã thanh toán</span>`
                    //         } else if (data == 'unpaid') {
                    //             return `<span Style="color:red">Chưa thanh toán</span>`
                    //         } else {
                    //             return `<span Style="color:red">Chưa thanh toán</span>`
                    //         }
                    //     }

                    // },
                    {
                        title: "Trạng thái",
                        data: "status",
                        className: "text-center, fw-bold",
                        render: (data, type, row) => {
                            const color = data === 'pending' ? '#ffad46' : data === 'paid' ? 'green' : 'red';
                            const isDisabled = data === 'paid' ? 'disabled' : ''; 
                            return `
                                <select class="status-select p-2" style="background:none; color:${color};" data-id="${row.id}" ${isDisabled}>
                                    <option style="color:#ffad46" value="pending" ${data === 'pending' ? 'selected' : ''}>Đang chờ</option>
                                    <option style="color:green"  value="paid" ${data === 'paid' ? 'selected' : ''}>Đã thanh toán</option>
                                    <option style="color:red"  value="unpaid" ${data === 'unpaid' ? 'selected' : ''}>Chưa thanh toán</option>
                                </select>
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
                createdRow: (row, data, dataIndex) => {
                    //     // Gắn sự kiện xóa sau khi bảng được vẽ
                    //     $(row).find('.fa-trash').on('click', function () {
                    //         const classCode = $(this).data('id');
                    //         // handleDelete(classCode);
                    //     });

                    $(row).find('.fa-edit').on('click', function () {
                        const classCode = $(this).data('id');
                        console.log(classCode);
                        navigate(`/sup-admin/wallets/${classCode}/edit`);
                    });

                    $('#select_all').on('click', function () {
                        const isChecked = $(this).is(':checked');
                        $('.row-checkbox').prop('checked', isChecked);
                    });
                    $(document).on('change', '.row-checkbox', function () {
                        const allChecked = $('.row-checkbox').length === $('.row-checkbox:checked').length;
                        $('#select_all').prop('checked', allChecked);
                    });
                    $(document).off('change', '.status-select').on('change', '.status-select', function () {
                        const status = $(this).val();
                        const id = $(this).data('id');
                        handleUpdateStatusFee(id, status);
                    });
                    

                }
            })
        }
    }, [wallets]);
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
        $('#createFee').off('click').on('click', handleCreateFee);
    }, []);

    function getSelectedUserCodes() {
        const selected = $('.row-checkbox:checked');
        const userCodes = selected.map(function () {
            return $(this).data('id');
        }).get();

        return userCodes;
    }
    const [isLoading, setIsLoading] = useState(false); // State loading
    const { mutate } = useMutation({
        mutationKey: ["ADD_FEES_ALL"],
        mutationFn: async () => {
            return await api.post("/fees");
        },
        onSuccess: () => {
            setIsLoading(false); // Bắt đầu loading
            toast.success("Tạo học phí cho kỳ mới thành công");
            refetch(); // Làm mới danh sách
        },
        onError: (error) => {
            const msg = formatErrors(error);
            toast.error(msg || "Có lỗi xảy ra");
        },
        onSettled: () => {
            setIsLoading(false); // Tắt loading sau khi hoàn thành
        },
    });
    function handleCreateFee() {
        setIsLoading(true); // Bắt đầu loading
        console.log(isLoading);
        mutate();
    }



    return (
        <>
            {isLoading &&
                (
                    <>
                        <div
                            className="modal fade show d-block text-center my-auto d-flex justify-content-center align-items-center"
                            tabIndex="-1"
                            aria-labelledby="gradesModalLabel"
                            role="dialog"
                        >
                            <div
                                className=""

                            >
                                {/* Bootstrap Spinner */}

                                <div className="spinner-border text-primary" role="status">

                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        </div>
                        <div className="modal-backdrop fade show"></div>
                    </>
                )
            }
            <div className="card">
                <div className="card-header d-flex justify-content-between">
                    <h4 className="card-title">Học phí sinh viên</h4>
                    <div>
                        <button className='btn btn-primary' id="getSelectedButton"><i class="fa fa-paper-plane"></i> Gửi mail</button>
                        <button className='btn btn-primary ml-3' id="createFee"><i class="fa fa-money-check"></i> Tạo học phí</button>
                    </div>
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
