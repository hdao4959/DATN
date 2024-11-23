import { Link } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import api from "../../../config/axios";
import { getToken } from "../../../utils/getToken";
import Spinner from "../../../components/Spinner/Spinner";
import { toast } from "react-toastify";
import Modal from "./Modal";
import 'datatables.net-dt/css/dataTables.dataTables.css';
import $ from 'jquery';
import 'datatables.net';

const MajorList = () => {
    const accessToken = getToken();
    const { data, refetch, isFetching } = useQuery({
        queryKey: ["LIST_MAJOR"],
        queryFn: async () => {
            const res = await api.get("/admin/majors", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            });
            return res?.data?.data;
        },
    });

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedMajor, setSelectedMajor] = useState();
    const [expandedMajors, setExpandedMajors] = useState({}); // State quản lý các chuyên ngành con

    const onModalVisible = () => setModalOpen((prev) => !prev);

    const updateStatusMutation = useMutation({
        mutationFn: (code) => api.post(`/admin/updateActive/${code}`),
        onSuccess: () => {
            toast.success("Cập nhật trạng thái thành công");
            refetch();
        },
        onError: () => {
            toast.error("Có lỗi xảy ra khi cập nhật trạng thái");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => api.delete(`/admin/majors/${id}`),
        onSuccess: () => {
            toast.success("Xóa chuyên ngành thành công");
            onModalVisible();
            refetch();
        },
        onError: () => {
            toast.error("Có lỗi xảy ra khi xóa chuyên ngành");
        },
    });

    const handleDelete = (id) => {
        setSelectedMajor(id);
        onModalVisible();
    };

    const updateStatus = (code) => {
        updateStatusMutation.mutate(code);
    };

    const flattenMajorData = (data) => {
        let result = [];
        data.forEach((major) => {
            result.push({
                id: major.id,
                cate_code: major.cate_code,
                cate_name: major.cate_name,
                image: major.image,
                is_active: major.is_active,
                is_parent: true, // Đánh dấu đây là chuyên ngành chính
            });

            // Nếu có chuyên ngành con, lặp qua để thêm vào bảng
            major.childrens.forEach((child) => {
                result.push({
                    id: child.id,
                    cate_code: child.cate_code,
                    cate_name: `-- ${child.cate_name}`, // Thêm dấu "-" để phân biệt chuyên ngành con
                    image: child.image,
                    is_active: child.is_active,
                    is_parent: false, // Đánh dấu đây là chuyên ngành con
                });
            });
        });
        return result;
    };

    useEffect(() => {
        if (data) {
            // Kiểm tra và xóa DataTable cũ nếu tồn tại
            if ($.fn.dataTable.isDataTable("#major-table")) {
                $("#major-table").DataTable().clear().destroy();
            }

            // Khởi tạo lại DataTable
            $("#major-table").DataTable({
                pageLength: 10,
                lengthMenu: [10, 20, 50],
                serverSide: true,
                processing: true,
                ajax: async (data, callback) => {
                    try {
                        const page = data.start / data.length + 1;
                        const response = await api.get(`/admin/majors`, {
                            params: { page, per_page: data.length },
                        });
                        const result = response.data;
                        const flattenedData = flattenMajorData(result.data);

                        callback({
                            draw: data.draw,
                            recordsTotal: result.total,
                            recordsFiltered: result.total,
                            data: flattenedData,
                        });
                    } catch (error) {
                        console.error("Error fetching data:", error);
                    }
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
                data: flattenMajorData(data),
                columns: [
                    { title: "Mã chuyên ngành", data: "cate_code" },
                    { title: "Tên chuyên ngành", data: "cate_name" },
                    {
                        title: "Trạng thái",
                        data: "is_active",
                        render: (data, row) =>
                            `<i class="change-status fas ${data === 1 ? "fa-check-circle text-green-500" : "fa-ban text-red-500"
                            }" style="font-size: 20px;" data-id="${row.cate_code}" ></i>`,
                        className: "text-center",
                    },
                    {
                        title: "Hình ảnh",
                        data: "image",
                        render: (data) =>
                            `<img src="${data
                                ? `http://localhost:8000/storage/${data}`
                                : "https://thumbs.dreamstime.com/b/no-image-icon-vector-available-picture-symbol-isolated-white-background-suitable-user-interface-element-205805243.jpg"
                            }" alt="image" width="50" height="50" />`,
                        className: "text-center d-flex justify-content-center",
                    },
                    {
                        title: "Hành động",
                        data: null,
                        render: (data, type, row) => `
                            <div class="d-flex justify-content-center whitespace-nowrap">
                                <button class="fs-4">
                                    <a href="/admin/major/${row.cate_code}/edit">
                                        <i class='fas fa-edit hover:text-blue-500'></i>
                                    </a>
                                </button>
                                <button class="delete-btn ml-2 fs-4" data-id="${row.cate_code}">
                                    <i class="fas fa-trash hover:text-red-500"></i>
                                </button>
                            </div>`,
                        className: "text-center",
                    },
                ],
                createdRow: (row, rowData, dataIndex) => {
                    // Add event listeners
                    $(row)
                        .find(".change-status")
                        .on("click", () => {
                            updateStatus(rowData.cate_code);
                        });
                    $(row)
                        .find(".delete-btn")
                        .on("click", () => {
                            handleDelete(rowData.cate_code);
                        });
                },
                scrollX: true,
            });
        }

        return () => {
            if ($.fn.dataTable.isDataTable("#major-table")) {
                $("#major-table").DataTable().clear().destroy();
            }
        };
    }, [data]);

    return (
        <>
            <div className="mb-3 mt-2 flex items-center justify-between">
                <Link to="/admin/major/add">
                    <button className="btn btn-primary">Thêm chuyên ngành</button>
                </Link>
            </div>
            <div className="card">
                <div className="card-header">
                    <h4 className="card-title">Quản lý chuyên ngành</h4>
                </div>
                <div className="card-body">
                    <table id='major-table' className="table"></table>
                </div>
            </div>

            <Modal
                title="Xoá chuyên ngành"
                description="Bạn có chắc chắn muốn xoá chuyên ngành này?"
                closeTxt="Huỷ"
                okTxt="Xác nhận"
                visible={modalOpen}
                onVisible={onModalVisible}
                onOk={() => deleteMutation.mutate(selectedMajor)}
            />
        </>
    );
};

export default MajorList;
