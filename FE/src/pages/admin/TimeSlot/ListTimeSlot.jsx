import React, { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../../../config/axios';
import { toast, ToastContainer } from 'react-toastify';
import 'datatables.net-dt/css/dataTables.dataTables.css';
import $ from 'jquery';

const ListTimeslot = () => {
    const queryClient = useQueryClient();

    const { data: timeslots, isLoading } = useQuery({
        queryKey: ['timeslot'],
        queryFn: async () => {
            const response = await api.get('/admin/timeslot');
            return response?.data;
        }
    });

    const mutation = useMutation({
        mutationFn: async (id) => {
            await api.delete(`/admin/timeslot/${id}`);
        },
        onSuccess: () => {
            toast.success("Xóa ca học thành công!");
            queryClient.invalidateQueries(['timeslot']);
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra");
        },
    });

    const handleDelete = (id) => {
        const confirmed = window.confirm("Bạn có chắc chắn muốn xóa ca học này không?");
        if (confirmed) {
            mutation.mutate(id);
        }
    };

    useEffect(() => {
        if (timeslots) {
            if ($.fn.dataTable.isDataTable('#timeslotList')) {
                $('#timeslotList').DataTable().destroy();
            }

            $('#timeslotList').DataTable({
                data: timeslots,
                columns: [
                    { title: "Tên Ca Học", data: "name" },
                    { title: "Thời Gian Bắt Đầu", data: "start_time" },
                    { title: "Thời Gian Kết Thúc", data: "end_time" },
                    {
                        title: "Action",
                        data: null,
                        render: (data, type, row) => {
                            return `
                            <div className="whitespace-nowrap">
                                <button>
                                  <a href="/admin/timeslot/${row.id}/edit">
                                    <i class='fas fa-edit hover:text-blue-500'></i>
                                  </a>
                                </button>
                                <button class="delete-button ml-2" data-id="${row.id}">
                                  <i class='fas fa-trash hover:text-red-500'></i>
                                </button>
                            </div>`;
                          }
                    }
                ],
                pageLength: 10,
                lengthMenu: [10, 20, 50, 100],
                language: {
                    paginate: {
                        previous: 'Trước',
                        next: 'Tiếp theo'
                    },
                    lengthMenu: 'Hiển thị _MENU_ mục mỗi trang',
                    info: 'Hiển thị từ <strong>_START_</strong> đến <strong>_END_</strong> trong <strong>_TOTAL_</strong> mục',
                    search: 'Tìm kiếm:'
                },
                destroy: true
            });

            $('#timeslotList tbody').off('click', '.delete-button');
            $('#timeslotList tbody').on('click', '.delete-button', function () {
                const id = $(this).data('id');
                handleDelete(id);
            });
        }
    }, [timeslots]);

    if (isLoading) return <div>Loading...</div>;

    return (
        <div>
            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">
                            <div className="card-title text-center">Quản lý Ca Học</div>
                        </div>
                        <div className='card-body'>
                            <div className="mb-3 mt-2 flex items-center justify-between">
                                <Link to={`/admin/timeslot/add`}>
                                    <button className="btn btn-success">
                                        <i className='fas fa-plus'></i> Thêm ca học
                                    </button>
                                </Link>
                            </div>
                            <table id="timeslotList" className="table table-striped"></table>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default ListTimeslot;
