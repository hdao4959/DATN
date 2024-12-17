import React, { useState, useEffect } from "react";
import "datatables.net-dt/css/dataTables.dataTables.css"; // Import CSS của DataTables
import $ from "jquery"; // Import jQuery để xử lý DOM
import { useQuery } from "@tanstack/react-query"; // Các hook của React Query
import api from "../../../config/axios"; // API config (axios instance)
import { Link } from "react-router-dom"; // Link để điều hướng trong React
import { ToastContainer, toast } from "react-toastify"; // Toast thông báo cho người dùng
import "react-toastify/dist/ReactToastify.css";

const ServiceList = () => {
    const [filterStatus, setFilterStatus] = useState(""); // Trạng thái để lọc
    const { data, isLoading, error } = useQuery({
        queryKey: ["services"], // Chỉ mục của query
        queryFn: async () => {
            const response = await api.get("admin/services"); // Gọi API lấy dịch vụ
            return response.data; // Trả về dữ liệu từ API
        }
    });

    useEffect(() => {
        if (data && data.data && Array.isArray(data.data.data)) {
            $(document).ready(function () {
                $("#serviceTable").DataTable();
            });
        }
    }, [data]);

    if (isLoading) {
        return <div>Đang tải dữ liệu...</div>;
    }

    if (error) {
        return <div>Có lỗi xảy ra khi tải dữ liệu</div>;
    }

    if (!data || !data.data || !Array.isArray(data.data.data) || data.data.data.length === 0) {
        return <div>Không có dịch vụ nào để hiển thị.</div>;
    }

    // Lọc danh sách theo trạng thái
    const filteredServices = filterStatus
        ? data.data.data.filter((service) => service.status === filterStatus)
        : data.data.data;

    return (
        <div className="mt-4">
            <div className="card">
                <div className="card-header">
                    <div className="d-flex justify-content-between align-items-center">
                        <h5 className="m-0">Quản lý dịch vụ</h5>
                        <div>
                            <select
                                className="form-select"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="">Tất cả trạng thái</option>
                                <option value="pending">Đang xử lý</option>
                                <option value="paid">Đã thanh toán</option>
                                <option value="approved">Đã duyệt</option>
                                <option value="rejected">Đã từ chối</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="card-body">
                    <table id="serviceTable" className="table table-bordered table-striped">
                        <thead className="table-primary">
                            <tr>
                                <th>#</th>
                                <th>Tên dịch vụ</th>
                                <th>Mã sinh viên</th>
                                <th>Sinh viên</th>
                                <th>Trạng thái</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredServices.map((service, index) => (
                                <tr key={service.id}>
                                    <td>{index + 1}</td>
                                    <td>{service.service_name}</td>
                                    <td>{service.student ? service.student.user_code : "Chưa có học sinh"}</td>
                                    <td>{service.student ? service.student.full_name : "Chưa có học sinh"}</td>
                                    <td className="text-center">
                                        <span
                                            className={`badge fs-5 ${service.status === "pending" ? "bg-info" :
                                                service.status === "paid" ? "bg-warning" :
                                                service.status === "approved" ? "bg-success" :
                                                service.status === "rejected" ? "bg-danger" : ""
                                            }`}
                                        >
                                            {service.status === "pending" ? "Đang xử lý" :
                                                service.status === "paid" ? "Đã thanh toán" :
                                                service.status === "approved" ? "Đã duyệt" :
                                                service.status === "rejected" ? "Đã từ chối" : ""}
                                        </span>
                                    </td>
                                    <td>
                                        {!(service.status === "approved" || service.status === "rejected") && (
                                            <Link to={`/sup-admin/services/${service.id}`} className="btn btn-primary">
                                                Xem
                                            </Link>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ServiceList;
