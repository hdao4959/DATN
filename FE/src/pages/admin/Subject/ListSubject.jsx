import React, { useEffect } from 'react';
import 'datatables.net-dt/css/dataTables.dataTables.css';
import $ from 'jquery';
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
      return mutate(id);
    }
    return;
  };

  useEffect(() => {
    if (data) {
      $('#subjectList').DataTable({
        data: data,
        columns: [
          { title: "STT", data: null, render: (data, type, row, meta) => meta.row + 1 },
          { title: "Mã Môn", data: "subject_code" },
          { title: "Tên Môn Học", data: "subject_name" },
          {
            title: "Hình ảnh",
            data: "image",
            render: (data, type, row) => (
              `<img src="${data}" alt="${row.subject_name}" width="50" height="50"/>`
            )
          },
          { title: "Chuyên ngành", data: "major_code" },
          { title: "Chuyên ngành hẹp", data: "narrow_major_code" },
          {
            title: "Trạng thái",
            data: "is_active",
            render: (data) => (
              data === 1
                ? '<i class="fas fa-check-circle" style="color:green"></i>'
                : '<i class="fas fa-ban" style="color:red"></i>'
            )
          },
          {
            title: "Action",
            data: null,
            render: (data, type, row) => {
              return `
              <div className="whitespace-nowrap">
                  <button>
                    <a href="/admin/subjects/${row.id}/edit">
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
      $('#subjectList tbody').off('click', '.delete-button');
      $('#subjectList tbody').on('click', '.delete-button', function () {
        const id = $(this).data('id');
        handleDelete(id);
      });
    }
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
            <div className='card-body'>
              <div className="mb-3 mt-2 flex items-center justify-between">
                <Link to={`/admin/subjects/add`}>
                  <button className="btn btn-success">
                    <i className='fas fa-plus'> Thêm môn học</i>
                  </button>
                </Link>
              </div>
              <table id="subjectList" className="table table-striped"></table>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default SubjectsList;
