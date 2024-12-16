import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import api from "../../../config/axios";
import { toast } from "react-toastify";
import "datatables.net-dt/css/dataTables.dataTables.css";
import $ from "jquery";
import "datatables.net";
import Modal from "../../../components/Modal/Modal";

const DegreeProgramList = () => {
    const navigate = useNavigate();

    const { data, refetch, isLoading } = useQuery({
        queryKey: ["DEGREE_PROGRAM"],
        queryFn: async () => {
            const res = await api.get("/admin/course");
            return res?.data;
        },
    });

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState();

    const onModalVisible = () => setModalOpen((prev) => !prev);

    const deleteMutation = useMutation({
        mutationFn: (id) => api.delete(`/admin/course/${id}`),
        onSuccess: () => {
            toast.success("Xóa khoá học thành công");
            onModalVisible();
            refetch();
        },
        onError: () => {
            toast.error("Có lỗi xảy ra khi xóa khoá học");
        },
    });

    const handleDelete = (id) => {
        setSelectedCourse(id);
        onModalVisible();
    };

    useEffect(() => {
        if (data) {
            if ($.fn.dataTable.isDataTable("#degree-program-table")) {
                $("#degree-program-table").DataTable().clear().destroy();
            }

            $("#degree-program-table").DataTable({
                pageLength: 10,
                lengthMenu: [10, 20, 50],
                data,
                columns: [
                    { title: "Mã khoá học", data: "cate_code", className: 'text-start' },
                    { title: "Tên khoá học", data: "cate_name" },
                    {
                        title: "Thời gian",
                        data: "value",
                        render: (data) => data || "Chưa cập nhật", // Hiển thị "Chưa cập nhật" nếu giá trị null
                        className: 'text-center',
                    },
                    {
                        title: "Hành động",
                        data: null,
                        render: (data, type, row) => `
                            <div class="d-flex justify-content-center whitespace-nowrap">
                                <button class="fs-4 degree-program-link" data-id="${row.cate_code}" >
                                    <i class='fas fa-edit hover:text-blue-500'></i>
                                </button>
                                <button class="delete-btn ml-2 fs-4">
                                    <i class="fas fa-trash hover:text-red-500"></i>
                                </button>
                            </div>`,
                        className: "text-center",
                    },
                ],
                order: [[5, "asc"]],
                createdRow: (row, rowData) => {
                    $(row)
                        .find(".delete-btn")
                        .on("click", () => handleDelete(rowData.cate_code));
                },
                language: {
                    paginate: {
                        previous: "Trước",
                        next: "Tiếp theo",
                    },
                    lengthMenu: "Hiển thị _MENU_ mục mỗi trang",
                    info: "Hiển thị từ _START_ đến _END_ trong _TOTAL_ mục",
                    search: "Tìm kiếm:",
                },
                scrollX: true,
            });

            $("#degree-program-table tbody").on("click", ".degree-program-link", function () {
                const cate_code = $(this).data("id");
                navigate(`/sup-admin/degree-program/${cate_code}/edit`);
            });
        }

        return () => {
            if ($.fn.dataTable.isDataTable("#degree-program-table")) {
                $("#degree-program-table").DataTable().clear().destroy();
            }
        };
    }, [data]);

    return (
        <>
            <div className="mb-3 mt-2 flex items-center justify-between">
                <Link to="/sup-admin/degree-program/add">
                    <button className="btn btn-primary">Thêm khoá học</button>
                </Link>
            </div>
            <div className="card">
                <div className="card-header">
                    <h4 className="card-title">Quản lý khoá học</h4>
                </div>
                <div className="card-body">
                    <table id="degree-program-table" className="table">
                        {isLoading && <p>Đang tải dữ liệu...</p>}
                    </table>
                </div>
            </div>

            <Modal
                title="Xoá khoá học"
                description="Bạn có chắc chắn muốn xoá khoá học này?"
                visible={modalOpen}
                onVisible={onModalVisible}
                onOk={() => deleteMutation.mutate(selectedCourse)}
                closeTxt="Huỷ"
                okTxt="Xác nhận"
            />
        </>
    );
};

export default DegreeProgramList;
