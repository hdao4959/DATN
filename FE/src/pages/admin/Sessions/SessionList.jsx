import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import api from "../../../config/axios";
import { toast } from "react-toastify";
import "datatables.net-dt/css/dataTables.dataTables.css";
import $ from "jquery";
import "datatables.net";
import Modal from "../../../components/Modal/Modal";

const SessionList = () => {
    const navigate = useNavigate();
    const { data, refetch, isLoading } = useQuery({
        queryKey: ["SESSION_LIST"],
        queryFn: async () => {
            const res = await api.get("/admin/sessions");
            return res?.data;
        },
    });

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedSession, setSelectedSession] = useState();

    const onModalVisible = () => setModalOpen((prev) => !prev);

    const deleteMutation = useMutation({
        mutationFn: (id) => api.delete(`/admin/sessions/${id}`),
        onSuccess: () => {
            toast.success("Xóa ca học thành công");
            onModalVisible();
            refetch();
        },
        onError: () => {
            toast.error("Có lỗi xảy ra khi xóa ca học");
        },
    });

    const handleDelete = (id) => {
        setSelectedSession(id);
        onModalVisible();
    };

    useEffect(() => {
        if (data) {
            if ($.fn.dataTable.isDataTable("#session-table")) {
                $("#session-table").DataTable().clear().destroy();
            }

            $("#session-table").DataTable({
                pageLength: 10,
                lengthMenu: [10, 20, 50],
                data,
                columns: [
                    { title: "Mã", data: "cate_code" },
                    { title: "Tên", data: "cate_name" },
                    {
                        title: "Thời gian",
                        data: "value",
                        render: (data) => {
                            const dataParse = JSON.parse(data);

                            return `${dataParse.start} - ${dataParse.end}`;
                        },
                    },
                    {
                        title: "Hành động",
                        data: null,
                        render: (data, type, row) => `
                            <div class="d-flex justify-content-center whitespace-nowrap">
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
            $("#session-table tbody").on("click", ".session-link", function () {
                const cate_code = $(this).data("id");
                navigate(`/sup-admin/sessions/${cate_code}/edit`);
            });
        }

        return () => {
            if ($.fn.dataTable.isDataTable("#session-table")) {
                $("#session-table").DataTable().clear().destroy();
            }
        };
    }, [data]);

    return (
        <>
            <div className="mb-3 mt-2 flex items-center justify-between">
                <Link to="/sup-admin/sessions/add">
                    <button className="btn btn-primary">Thêm ca học</button>
                </Link>
            </div>
            <div className="card">
                <div className="card-header">
                    <h4 className="card-title">Quản lý ca học</h4>
                </div>
                <div className="card-body">
                    <table id="session-table" className="table">
                        {isLoading && <p>Đang tải dữ liệu...</p>}
                    </table>
                </div>
            </div>

            <Modal
                title="Xoá ca học"
                description="Bạn có chắc chắn muốn xoá ca học này?"
                visible={modalOpen}
                onVisible={onModalVisible}
                onOk={() => deleteMutation.mutate(selectedSession)}
                closeTxt="Huỷ"
                okTxt="Xác nhận"
            />
        </>
    );
};

export default SessionList;
