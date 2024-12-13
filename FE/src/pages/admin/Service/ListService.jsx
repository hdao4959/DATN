import React, { useEffect } from "react";
import "datatables.net-dt/css/dataTables.dataTables.css"; // Import CSS của DataTables
import $ from "jquery"; // Import jQuery để xử lý DOM
import { useQuery } from "@tanstack/react-query"; // Các hook của React Query
import api from "../../../config/axios"; // API config (axios instance)
import { Link } from "react-router-dom"; // Link để điều hướng trong React
import { ToastContainer, toast } from "react-toastify"; // Toast thông báo cho người dùng
import "react-toastify/dist/ReactToastify.css";

const ServiceList = () => {
    // Gọi API để lấy danh sách dịch vụ
    const { data, isLoading, error } = useQuery({
        queryKey: ["services"], // Chỉ mục của query
        queryFn: async () => {
            const response = await api.get("admin/services"); // Gọi API lấy dịch vụ
            return response.data; // Trả về dữ liệu từ API
        }
    });

    useEffect(() => {
        // Sử dụng jQuery để khởi tạo DataTable sau khi dữ liệu đã được tải
        if (data && data.data && Array.isArray(data.data.data)) {
            $(document).ready(function () {
                $("#serviceTable").DataTable(); // Khởi tạo DataTable trên bảng với id là 'serviceTable'
            });
        }
    }, [data]); // Chạy lại mỗi khi dữ liệu thay đổi

    if (isLoading) {
        return <div>Đang tải dữ liệu...</div>; // Hiển thị khi dữ liệu đang được tải
    }

    if (error) {
        return <div>Có lỗi xảy ra khi tải dữ liệu</div>;
    }

    // Kiểm tra nếu không có dữ liệu
    if (!data || !data.data || !Array.isArray(data.data.data) || data.data.data.length === 0) {
        return <div>Không có dịch vụ nào để hiển thị.</div>;
    }

    return (
        <div className=" mt-4">
                {/* <h1 className="mb-4">Danh sách dịch vụ</h1> */}
                <div className="card">
                <div className="card-header">
                    <div className="d-flex justify-content-between align-items-center">
                        <h5 className="m-0">Quản lý dịch vụ</h5>
                        {/* <Link to="/admin/services/add" className="btn btn-primary">
                            Danh sách dịch vụ
                        </Link> */}
                    </div>
                </div>
                <div className="card-body">
                    <table id="serviceTable" className="table table-bordered table-striped">
                        <thead className="table-primary">
                            <tr>
                                <th>#</th>
                                <th>Tên dịch vụ</th>
                                <th>Mã sinh viên</th> {/* Thêm cột Mã học sinh */}
                                <th>Sinh viên</th>
                                <th>Trạng thái</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.data.data.map((service, index) => (
                                <tr key={service.id}>
                                    <td>{index + 1}</td>
                                    <td>{service.service_name}</td>
                                    <td>{service.student ? service.student.user_code : "Chưa có học sinh"}</td>
                                    <td>{service.student ? service.student.full_name : "Chưa có học sinh"}</td>
                                    <td className="text-center">
                                        <span
                                            className={`badge fs-5  ${
                                                service.status === "pending" ? "bg-info" : "bg-success"
                                            }`}
                                        >
                                            {service.status === "pending" ? "Đang xử lý" : "Hoàn thành"}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="btn btn-sm btn-warning me-2">Xem</button>
                                        <button className="btn btn-sm btn-danger">Xóa</button>
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
