import { Link } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import api from "../../../config/axios";
import { getToken } from "../../../utils/getToken";
import Spinner from "../../../components/Spinner/Spinner";
import { toast } from "react-toastify";
import Modal from "./Modal";
import "datatables.net-dt/css/dataTables.dataTables.css";
import $ from "jquery";
import "datatables.net";

const MajorList = () => {
    const accessToken = getToken();
    const { data, refetch } = useQuery({
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

    const [modalOpen, setModalOpen] = useState(false); // Modal xóa chuyên ngành
    const [confirmationModalOpen, setConfirmationModalOpen] = useState(false); // Modal xác nhận trạng thái
    const [selectedMajor, setSelectedMajor] = useState(); // ID chuyên ngành được chọn
    const [currentCateCode, setCurrentCateCode] = useState(null); // Cate code để cập nhật trạng thái

    const onModalVisible = () => setModalOpen((prev) => !prev);
    const toggleConfirmationModal = () => setConfirmationModalOpen((prev) => !prev);

    // Mutation cập nhật trạng thái
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

    // Mutation xóa chuyên ngành
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

    // Khi nhấn icon trạng thái
    const handleUpdateStatus = (code) => {
        setCurrentCateCode(code);
        toggleConfirmationModal();
    };

    // Xác nhận cập nhật trạng thái
    const confirmUpdateStatus = () => {
        if (currentCateCode) {
            updateStatusMutation.mutate(currentCateCode);
        }
        toggleConfirmationModal();
    };

    // Khi nhấn nút xóa
    const handleDelete = (id) => {
        setSelectedMajor(id);
        onModalVisible();
    };

    // Chuyển đổi dữ liệu từ API thành format DataTable
    const flattenMajorData = (data) => {
        let result = [];
        let sortOrder = 0; // Đếm thứ tự hiển thị
        
        data.forEach((major) => {
            // Thêm chuyên ngành cha
            result.push({
                id: major.id,
                cate_code: major.cate_code,
                cate_name: major.cate_name,
                image: major.image,
                is_active: major.is_active,
                is_parent: true,
                sortOrder: sortOrder++, // Tăng thứ tự
            });
    
            // Nếu có chuyên ngành con, thêm vào danh sách
            major.childrens.forEach((child) => {
                result.push({
                    id: child.id,
                    cate_code: child.cate_code,
                    cate_name: `|_______ ${child.cate_name}`, // Thụt lề
                    image: child.image,
                    is_active: child.is_active,
                    is_parent: false,
                    sortOrder: sortOrder++, // Tăng thứ tự
                });
            });
        });
        return result;
    };
    

    useEffect(() => {
        if (data) {
            if ($.fn.dataTable.isDataTable("#major-table")) {
                $("#major-table").DataTable().clear().destroy();
            }
    
            $("#major-table").DataTable({
                pageLength: 10,
                lengthMenu: [10, 20, 50],
                data: flattenMajorData(data),
                columns: [
                    { title: "Mã chuyên ngành", data: "cate_code" },
                    { title: "Tên chuyên ngành", data: "cate_name" },
                    {
                        title: "Trạng thái",
                        data: "is_active",
                        render: (data) =>
                            `<i class="change-status fas ${data === 1
                                ? "fa-check-circle text-green-500"
                                : "fa-ban text-red-500"
                            }" style="font-size: 20px;"></i>`,
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
                                <button class="delete-btn ml-2 fs-4">
                                    <i class="fas fa-trash hover:text-red-500"></i>
                                </button>
                            </div>`,
                        className: "text-center",
                    },
                    { title: "Thứ tự sắp xếp", data: "sortOrder", visible: false }, // Ẩn cột sortOrder
                ],
                order: [[5, "asc"]], // Sắp xếp theo cột thứ 5 (sortOrder)
                createdRow: (row, rowData) => {
                    $(row)
                        .find(".change-status")
                        .on("click", () => handleUpdateStatus(rowData.cate_code));
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
                    <table id="major-table" className="table"></table>
                </div>
            </div>

            {/* Modal xác nhận cập nhật trạng thái */}
            <Modal
                title="Cập nhật trạng thái"
                description="Bạn có chắc chắn muốn cập nhật trạng thái chuyên ngành này?"
                visible={confirmationModalOpen}
                onVisible={toggleConfirmationModal}
                onOk={confirmUpdateStatus}
                closeTxt="Huỷ"
                okTxt="Xác nhận"
            />

            {/* Modal xóa chuyên ngành */}
            <Modal
                title="Xoá chuyên ngành"
                description="Bạn có chắc chắn muốn xoá chuyên ngành này?"
                visible={modalOpen}
                onVisible={onModalVisible}
                onOk={() => deleteMutation.mutate(selectedMajor)}
                closeTxt="Huỷ"
                okTxt="Xác nhận"
            />
        </>
    );
};

export default MajorList;
