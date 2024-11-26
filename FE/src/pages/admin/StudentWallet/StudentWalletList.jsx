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
                    {
                        title: "Trạng thái",
                        data: "status",
                        className: "text-center, fw-bold",
                        render: (data, type, row) => {
                            if (data == 'pending') {
                                return `<span Style="color:#ffad46">Đang chờ</span>`
                            } else if(data == 'paid'){
                                return `<span Style="color:green">Đã thanh toán</span>`
                            }else if(data == 'unpaid'){
                                return `<span Style="color:red">Chưa thanh toán</span>`
                            }else{
                                 return `<span Style="color:red">Chưa thanh toán</span>`
                            }
                        }

                    },
                    {
                        title: "Hành động",
                        data: null,
                        render: (data, type, row) => {
                            return `
                                <div style="display: flex; justify-content: center; align-items: center;gap: 10px">
                                    <i class="fas fa-edit" style="cursor: pointer; font-size: 20px;" data-id="${row.id}" id="edit_${row.id}"></i>
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
                createdRow: (row, data, dataIndex) => {
                    //     // Gắn sự kiện xóa sau khi bảng được vẽ
                    //     $(row).find('.fa-trash').on('click', function () {
                    //         const classCode = $(this).data('id');
                    //         // handleDelete(classCode);
                    //     });

                        $(row).find('.fa-edit').on('click', function () {
                            const classCode = $(this).data('id');
                            console.log(classCode);

                            navigate(`/admin/wallets/${classCode}/edit`);

                        });

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
                    <h4 className="card-title">Học phí sinh viên</h4>
                    <button className='btn btn-primary' id="getSelectedButton"><i class="fa fa-paper-plane"></i> Gửi mail</button>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table id="walletsTable" className="display"></table>
                        {/* <div className="dataTables_wrapper container-fluid dt-bootstrap4">
                            <div className="row justify-between items-center">
                                <div className="col-sm-12 col-md-6 text-left">
                                    <label className="flex items-center gap-2">
                                        Search:
                                        <input
                                            type="search"
                                            className="form-control form-control-sm w-auto !h-9"
                                            placeholder="Enter student name"
                                            aria-controls="basic-datatables"
                                        />
                                    </label>
                                </div>

                                <div className="col-sm-12 col-md-6 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <label htmlFor="smallSelect m-0">
                                            Filter
                                        </label>
                                        <select
                                            className="form-select form-control-sm w-44 h-9"
                                            id="smallSelect"
                                        >
                                            <option>Select status</option>
                                            <option>Hoàn thành</option>
                                            <option>Đang kiểm tra</option>
                                            <option>Đã xong</option>
                                            <option>Huỷ</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12">
                                    <i className="fa-solid fa-circle-check fs-20 color-green"></i>
                                    <table
                                        id="basic-datatables"
                                        className="display table table-striped table-hover dataTable"
                                        role="grid"
                                        aria-describedby="basic-datatables_info"
                                    >
                                        <thead>
                                            <tr role="row">
                                                <th></th>
                                                <th>ID</th>
                                                <th>Tên sinh viên</th>
                                                <th>Số tiền nợ</th>
                                                <th>Kỳ học</th>
                                                <th>Trạng thái</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr role="row" className="odd">
                                                <td>
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        defaultValue=""
                                                        id="flexCheckDefault"
                                                    />
                                                </td>
                                                <td>1</td>
                                                <td>Nguyễn Hữu An</td>
                                                <td>90.000đ</td>
                                                <td>Kỳ 1</td>
                                                <td>
                                                    <p className="text-success">
                                                        Hoàn thành
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr role="row" className="odd">
                                                <td>
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        defaultValue=""
                                                        id="flexCheckDefault"
                                                    />
                                                </td>
                                                <td>2</td>
                                                <td>Lê Hữu An</td>
                                                <td>100.000đ</td>
                                                <td>Kỳ 1</td>
                                                <td>
                                                    <p className="text-warning">
                                                        Đang kiểm tra
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr role="row" className="odd">
                                                <td>
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        defaultValue=""
                                                        id="flexCheckDefault"
                                                    />
                                                </td>
                                                <td>3</td>
                                                <td>Hoàng Hữu An</td>
                                                <td>900.000.000đ</td>
                                                <td>Kỳ 10</td>
                                                <td>
                                                    <p className="text-danger">
                                                        Đã xong
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr role="row" className="odd">
                                                <td>
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        defaultValue=""
                                                        id="flexCheckDefault"
                                                    />
                                                </td>
                                                <td>4</td>
                                                <td>Đặng Hữu An</td>
                                                <td>1.000đ</td>
                                                <td>Kỳ 11</td>
                                                <td>
                                                    <p className="text-danger">
                                                        Huỷ
                                                    </p>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12 col-md-7 ml-auto">
                                    <div className="dataTables_paginate paging_simple_numbers">
                                        <ul className="pagination">
                                            <li className="paginate_button page-item previous disabled">
                                                <a
                                                    href="#"
                                                    className="page-link"
                                                >
                                                    Previous
                                                </a>
                                            </li>
                                            <li className="paginate_button page-item active">
                                                <a
                                                    href="#"
                                                    className="page-link"
                                                >
                                                    1
                                                </a>
                                            </li>
                                            <li className="paginate_button page-item ">
                                                <a
                                                    href="#"
                                                    className="page-link"
                                                >
                                                    2
                                                </a>
                                            </li>
                                            <li className="paginate_button page-item ">
                                                <a
                                                    href="#"
                                                    className="page-link"
                                                >
                                                    3
                                                </a>
                                            </li>

                                            <li className="paginate_button page-item next">
                                                <a
                                                    href="#"
                                                    className="page-link"
                                                >
                                                    Next
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
        </>
    );
};

export default StudentWalletList;
