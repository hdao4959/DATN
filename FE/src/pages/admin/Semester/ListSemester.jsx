import React, { useEffect } from 'react';
import 'datatables.net-dt/css/dataTables.dataTables.css';
import $ from 'jquery';
import 'datatables.net';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../../config/axios';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ListSemester = () => {
    const queryClient = useQueryClient();

    const { data: semesters, isLoading } = useQuery({
        queryKey: ["LIST_SEMESTER"],
        queryFn: async () => {
            const res = await api.get("/admin/semesters");
            return res?.data?.data; 
        }
    });

    const { mutate } = useMutation({
        mutationFn: (id) => api.delete(`/admin/semesters/${id}`),
        onSuccess: () => {
            toast.success('Xóa học kỳ thành công');
            queryClient.invalidateQueries("LIST_SEMESTER");
        },
        onError: () => {
            toast.error('Có lỗi xảy ra khi xóa học kỳ');
        }
    });

    const handleDelete = (id) => {
        const confirmed = window.confirm('Bạn có chắc chắn muốn xóa học kỳ này không?');
        if (confirmed) {
            mutate(id);
        }
    };
    if (!isLoading && semesters?.length > 0) {
        if ($.fn.dataTable.isDataTable('#semesterList')) {
            $('#semesterList').DataTable().destroy();
        }
        $('#semesterList').DataTable({
            pageLength: 5,
            lengthMenu: [5, 10, 20, 50, 100],
            language: {
                paginate: {
                    previous: 'Trước',
                    next: 'Tiếp theo'
                },
                lengthMenu: 'Hiển thị _MENU_ mục mỗi trang',
                info: 'Hiển thị từ <strong>_START_</strong> đến <strong>_END_</strong> trong <strong>_TOTAL_</strong> mục',
                search: 'Tìm kiếm:'
            },
        });
    }
    useEffect(() => {
        return () => {
            if ($.fn.dataTable.isDataTable('#semesterList')) {
              $('#semesterList').DataTable().destroy();
            }
          };
    }, [semesters]);

    if (isLoading) return <div>Loading...</div>;

    return (
        <>
            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">
                            <div className="card-title text-center">Quản lý Học Kỳ</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mb-3 mt-2 flex items-center justify-between">
                <Link to={`/admin/semesters/add`}>
                    <button className="btn btn-success">
                        <i className='fas fa-plus'></i> Thêm học kỳ
                    </button>
                </Link>
            </div>
            <table id="semesterList" className="table table-striped">
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Mã Học Kỳ</th>
                        <th>Tên Học Kỳ</th>
                        <th>Năm Học</th>
                        <th>Ngày Bắt Đầu</th>
                        <th>Ngày Kết Thúc</th>
                        <th>Trạng Thái</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {semesters?.map((item, index) => (
                        <tr key={item.semester_code}>
                            <td>{index + 1}</td>
                            <td>{item.semester_code}</td>
                            <td>{item.semester_name}</td>
                            <td>{item.academic_year}</td>
                            <td>{new Date(item.start_date).toLocaleDateString()}</td>
                            <td>{new Date(item.end_date).toLocaleDateString()}</td>
                            <td>
                                {item.status === 1 ? (
                                    <i className="fas fa-check-circle" style={{ color: 'green' }}></i>
                                ) : (
                                    <i className="fas fa-ban" style={{ color: 'red' }}></i>
                                )}
                            </td>
                            <td className='whitespace-nowrap'>
                                <Link to={`/admin/semesters/${item.semester_code}/edit`}>
                                    <button className="btn btn-primary btn-sm">
                                        <i className='fas fa-edit'></i>
                                    </button>
                                </Link>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.semester_code)}>
                                    <i className='fas fa-trash'></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <ToastContainer />
        </>
    );
};

export default ListSemester;
