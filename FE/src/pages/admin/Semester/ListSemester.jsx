import React, { useEffect } from "react";
import "datatables.net-dt/css/dataTables.dataTables.css";
import $ from "jquery";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../../config/axios";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
window.jQuery = $;

const ListSemester = () => {
    const queryClient = useQueryClient();

    const { data: semesters, isLoading } = useQuery({
        queryKey: ["LIST_SEMESTER"],
        queryFn: async () => {
            const res = await api.get("/admin/semester");
            return res?.data;
        },
    });

    const { mutate } = useMutation({
        mutationFn: (id) => api.delete(`/admin/semester/${id}`),
        onSuccess: () => {
            toast.success("Xóa học kỳ thành công");
            queryClient.invalidateQueries("LIST_SEMESTER");
        },
        onError: () => {
            toast.error("Có lỗi xảy ra khi xóa học kỳ");
        },
    });

    const handleDelete = (id) => {
        const confirmed = window.confirm(
            "Bạn có chắc chắn muốn xóa học kỳ này không?"
        );
        if (confirmed) {
            mutate(id);
        }
    };

    useEffect(() => {
        if (semesters) {
            if ($.fn.dataTable.isDataTable("#semesterList")) {
                $("#semesterList").DataTable().destroy();
            }

            $("#semesterList").DataTable({
                data: semesters,
                columns: [
                    {
                        title: "STT",
                        data: null,
                        render: (data, type, row, meta) => meta.row + 1,
                    },
                    { title: "Tên Học Kỳ", data: "cate_name" },
                    {
                        title: "Giá trị",
                        data: "value"
                    },

                    {
                        title: "Hành động",
                        data: null,
                        render: (data, type, row) => {
                            return `
                            <div className="whitespace-nowrap">
                                <button class="delete-button ml-2"  data-id="${row.cate_code}">
                                  <i class='fas fa-trash hover:text-red-500'></i>
                                </button>
                            </div>`;
                        },
                    },
                ],
                pageLength: 10,
                lengthMenu: [10, 20, 50, 100],
                language: {
                    paginate: {
                        previous: "Trước",
                        next: "Tiếp theo",
                    },
                    lengthMenu: "Hiển thị _MENU_ mục mỗi trang",
                    info: "Hiển thị từ <strong>_START_</strong> đến <strong>_END_</strong> trong <strong>_TOTAL_</strong> mục",
                    search: "Tìm kiếm:",
                },
                destroy: true,
            });

            $("#semesterList tbody").off("click", ".delete-button");
            $("#semesterList tbody").on("click", ".delete-button", function () {
                const id = $(this).data("id");
                handleDelete(id);
            });
        }
    }, [semesters]);

    if (isLoading) return <div>Loading...</div>;

    return (
        <>
            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">
                            <div className="card-title text-center">
                                Quản lý Học Kỳ
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="mb-3 mt-2 flex items-center justify-between">
                                <Link to={`/sup-admin/semesters/add`}>
                                    <button className="btn btn-success">
                                        <i className="fas fa-plus"></i> Thêm học
                                        kỳ
                                    </button>
                                </Link>
                            </div>
                            <table
                                id="semesterList"
                                className="table table-striped"
                            ></table>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    );
};

export default ListSemester;
