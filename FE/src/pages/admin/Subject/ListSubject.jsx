import React, { useEffect } from 'react';
import 'datatables.net-dt/css/dataTables.dataTables.css';
import $ from 'jquery';
import 'datatables.net';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../../config/axios';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SubjectsList = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["LIST_SUBJECT"],
    queryFn: async () => {
      const res = await api.get("/admin/subjects");
      return res?.data?.data;
    }
  });

  const { mutate } = useMutation({
    mutationFn: (id) => api.delete(`/admin/subjects/${id}`),
    onSuccess: () => {
      toast.success('Xóa môn học thành công');
      queryClient.invalidateQueries("LIST_SUBJECT");
    },
    onError: () => {
      toast.error('Có lỗi xảy ra khi xóa môn học');
    }
  });

  const handleDelete = (id) => {
    const confirmed = window.confirm('Bạn có chắc chắn muốn xóa môn học này không?');
    if (confirmed) {
      mutate(id);
    }
  };

  const table = $('#subjectList').DataTable({
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
    destroy: true,
  });

  useEffect(() => {
    return () => {
      if ($.fn.dataTable.isDataTable('#subjectList')) {
        table.destroy();
      }
    };
  }, [data]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <div className="card-title text-center">Quản lý Môn Học</div>
            </div>
          </div>
        </div>
      </div>
      <div className="mb-3 mt-2 flex items-center justify-between">
        <Link to={`/admin/subjects/add`}>
          <button className="btn btn-success">
            <i className='fas fa-plus'> Thêm môn học</i>
          </button>
        </Link>
      </div>
      <table id="subjectList" className="table table-striped">
        <thead>
          <tr>
            <th>STT</th>
            <th>Mã Môn</th>
            <th>Tên Môn Học</th>
            <th>Hình ảnh</th>
            <th>Chuyên ngành</th>
            <th>Chuyên ngành hẹp</th>
            <th>Trạng thái</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>{item.subject_code}</td>
              <td>{item.subject_name}</td>
              <td>
                <img
                  src={item.image}
                  alt={item.subject_name}
                  width={50}
                  height={50}
                />
              </td>
              <td>{item.major_code}</td>
              <td>{item.narrow_major_code}</td>
              <td>
                {item.is_active === 1 ? (
                  <i className="fas fa-check-circle" style={{ color: 'green' }}></i>
                ) : (
                  <i className="fas fa-ban" style={{ color: 'red' }}></i>
                )}
              </td>
              <td className='whitespace-nowrap'>
                <Link to={`/admin/subjects/${item.id}/edit`}>
                  <button className="btn btn-primary btn-sm">
                    <i className='fas fa-edit'></i>
                  </button>
                </Link>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}>
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

export default SubjectsList;
