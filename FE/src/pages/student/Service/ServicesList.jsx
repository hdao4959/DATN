import React, { useEffect } from "react";
import "datatables.net-dt/css/dataTables.dataTables.css";
import $ from "jquery";
import "datatables.net";

const ServicesList = () => {
    useEffect(() => {
        const fakeData = [
            {
                serviceType: "Chuyển phát nhanh",
                registrationTime: "2024-12-08 08:00",
                completionTime: "2024-12-09 15:00",
                status: "Đang xử lý",
                notification: "Đã gửi yêu cầu",
            },
            {
                serviceType: "Nhận trực tiếp",
                registrationTime: "2024-12-07 10:00",
                completionTime: "2024-12-07 17:00",
                status: "Hoàn thành",
                notification: "Đã nhận kết quả",
            },
            {
                serviceType: "Chuyển phát nhanh",
                registrationTime: "2024-12-06 09:30",
                completionTime: "2024-12-07 14:00",
                status: "Đang xử lý",
                notification: "Đang chờ xác nhận",
            },
            {
                serviceType: "Nhận trực tiếp",
                registrationTime: "2024-12-05 11:00",
                completionTime: "2024-12-05 16:00",
                status: "Hoàn thành",
                notification: "Đã nhận kết quả",
            },
        ];

        if ($.fn.dataTable.isDataTable("#service-table")) {
            $("#service-table").DataTable().clear().destroy();
        }

        // Khởi tạo DataTable
        $("#service-table").DataTable({
            data: fakeData,
            columns: [
                { title: "Loại dịch vụ", data: "serviceType" },
                { title: "Thời gian đăng ký", data: "registrationTime" },
                { title: "Thời gian hoàn thành", data: "completionTime" },
                { title: "Trạng thái và thông tin", data: "status" },
                { title: "Thông báo", data: "notification" },
                {
                    title: "Hành động",
                    data: null,
                    render: (data) => {
                        // Nếu dịch vụ đang xử lý, thêm nút "Hủy"
                        return data.status === "Đang xử lý"
                            ? `<button class="btn btn-danger cancel-btn">Hủy</button>`
                            : "";
                    },
                    className: "text-center",
                },
            ],
            order: [[1, "asc"]], // Sắp xếp theo thời gian đăng ký
            language: {
                paginate: {
                    previous: "Trước",
                    next: "Tiếp theo",
                },
                lengthMenu: "Hiển thị _MENU_ mục mỗi trang",
                info: "Hiển thị từ _START_ đến _END_ trong _TOTAL_ mục",
                search: "Tìm kiếm:",
            },
            scrollX: true, // Cho phép cuộn ngang khi có nhiều cột
        });

        // Đặt sự kiện cho nút "Hủy"
        $(document).on("click", ".cancel-btn", function () {
            const rowData = $("#service-table").DataTable().row($(this).closest("tr")).data();
            alert(`Dịch vụ "${rowData.serviceType}" sẽ bị hủy!`);
            // Ở đây bạn có thể gọi API để hủy dịch vụ
        });

        return () => {
            if ($.fn.dataTable.isDataTable("#service-table")) {
                $("#service-table").DataTable().clear().destroy();
            }
        };
    }, []);

    return (
        <div>
            <div className="card">
                <div className="card-header">
                    <h4 className="card-title">Danh sách dịch vụ đã đăng ký</h4>
                </div>
                <div className="card-body">
                    <table id="service-table" className="table table-bordered">
                        {/* Bảng này sẽ tự động được điền dữ liệu */}
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ServicesList;
