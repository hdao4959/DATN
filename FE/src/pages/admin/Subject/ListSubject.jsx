import React, { useEffect } from "react";
import "datatables.net-dt/css/dataTables.dataTables.css";
import $ from "jquery";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../../config/axios";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SubjectsList = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: subjects, isLoading } = useQuery({
    queryKey: ["LIST_SUBJECT"],
    queryFn: async () => {
      const res = await api.get("/admin/subjects");
      return res?.data.subjects.data;
    }
  });

  const { mutate } = useMutation({
    mutationFn: (id) => api.delete(`/admin/subjects/${id}`),
    onSuccess: () => {
      toast.success("Xóa môn học thành công");
      queryClient.invalidateQueries("LIST_SUBJECT");
    },
    onError: () => {
      toast.error("Có lỗi xảy ra khi xóa môn học");
    },
  });

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Bạn có chắc chắn muốn xóa môn học này không?"
    );
    if (confirmed) {
      return mutate(id);
    }
    return;
  };

  useEffect(() => {
    if (subjects) {
      $('#subjectList').DataTable({
        data: subjects,
        processing: true,
        serverSide: true,
        ajax: async (data, callback) => {
          try {
            const page = data.start / data.length + 1;
            const response = await api.get(`/admin/subjects`, {
              params: { page, per_page: data.length, search: data.search.value },
            });
            const result = response?.data?.subjects;
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
                  <button class='detail-link' data-link='/sup-admin/subjects/${row.subject_code}/edit'>
                      <i class='fas fa-edit hover:text-blue-500'></i>
                  </button>
                  <button class="delete-button ml-2" data-id="${row.subject_code}">
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
      $('#subjectList').on('click', '.detail-link', function () {
                      const link = $(this).data('link');
                      navigate(link);
                  });
      $('#subjectList tbody').off('click', '.delete-button');
      $('#subjectList tbody').on('click', '.delete-button', function () {
        const id = $(this).data('id');
        handleDelete(id);
      });
    }
  }, [subjects]);

  return (
    <>
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <div className="card-title text-center">Quản lý Môn Học</div>
            </div>
            <div className='card-body'>
              {(isLoading) ? (
                <div className="loading-spinner">
                  <p>Đang tải dữ liệu...</p>
                </div>
              ) : (
                <>
                  <div className="mb-3 mt-2 flex items-center justify-between">
                    <Link to={`/sup-admin/subjects/add`}>
                      <button className="btn btn-success">
                        <i className='fas fa-plus'> Thêm môn học</i>
                      </button>
                    </Link>
                  </div>
                  <table id="subjectList" className="table table-striped"></table>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default SubjectsList;
