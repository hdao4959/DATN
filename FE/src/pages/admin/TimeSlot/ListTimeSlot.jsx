import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../../../config/axios';
import { toast, ToastContainer } from 'react-toastify';

const ListTimeslot = () => {
    const queryClient = useQueryClient();

    const { data: time_slots, isLoading, isError } = useQuery({
        queryKey: ['time_slots'],
        queryFn: async () => {
            const response = await api.get('/admin/time_slots');
            return response.data.data;
        }
    });

    const mutation = useMutation({
        mutationFn: async (id) => {
            await api.delete(`/admin/time_slots/${id}`);
        },
        onSuccess: () => {
            toast.success("Xóa ca học thành công!");
            queryClient.invalidateQueries(['time_slots']);
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra");
        },
    });

    const handleDelete = (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa ca học này?")) {
            mutation.mutate(id);
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Có lỗi xảy ra trong quá trình tải dữ liệu.</div>;

    return (
        <div>
            <h2>Danh Sách Ca Học</h2>
            <Link to="/admin/time_slots/add">
                <button className="btn btn-primary">Thêm Ca Học</button>
            </Link>
            <table className="table">
                <thead>
                    <tr>
                        <th>Tên Ca Học</th>
                        <th>Thời Gian Bắt Đầu</th>
                        <th>Thời Gian Kết Thúc</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {time_slots?.map((item) => (
                        <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>{item.start_time}</td>
                            <td>{item.end_time}</td>
                            <td>
                                <Link to={`/admin/time_slots/${item.id}/edit`} className="btn btn-warning">Sửa</Link>
                                <button onClick={() => handleDelete(item.id)} className="btn btn-danger">Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <ToastContainer />
        </div>
    );
};

export default ListTimeslot;
