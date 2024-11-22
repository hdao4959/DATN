import React from "react";

const AttendanceRequestForm = () => {
    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Form Yêu Cầu Điểm Danh</h2>
            <form>
                {/* Môn xin điểm danh */}
                <div className="mb-3">
                    <label htmlFor="subject" className="form-label">
                        Môn xin điểm danh <span className="text-danger">*</span>
                    </label>
                    <select id="subject" className="form-select">
                        <option value="">--- Chọn môn xin điểm danh ---</option>
                        <option value="CS101">Lập trình C</option>
                        <option value="CS102">Cấu trúc dữ liệu</option>
                        <option value="CS103">Hệ điều hành</option>
                    </select>
                </div>

                {/* Lớp xin điểm danh */}
                <div className="mb-3">
                    <label htmlFor="class" className="form-label">
                        Lớp xin điểm danh <span className="text-danger">*</span>
                    </label>
                    <select id="class" className="form-select">
                        <option value="">--- Chọn lớp xin điểm danh ---</option>
                        <option value="A1">Lớp A1</option>
                        <option value="B1">Lớp B1</option>
                        <option value="C1">Lớp C1</option>
                    </select>
                </div>

                {/* Ngày xin điểm danh */}
                <div className="mb-3">
                    <label htmlFor="date" className="form-label">
                        Ngày xin điểm danh <span className="text-danger">*</span>
                    </label>
                    <select id="date" className="form-select">
                        <option value="">--- Chọn ngày xin điểm danh ---</option>
                        <option value="2024-11-22">22/11/2024</option>
                        <option value="2024-11-23">23/11/2024</option>
                        <option value="2024-11-24">24/11/2024</option>
                    </select>
                </div>

                {/* Giảng viên */}
                <div className="mb-3">
                    <label htmlFor="teacher" className="form-label">
                        Giảng viên <span className="text-danger">*</span>
                    </label>
                    <input
                        type="text"
                        id="teacher"
                        className="form-control"
                        placeholder="Nhập tên giảng viên"
                    />
                </div>

                {/* Số điện thoại */}
                <div className="mb-3">
                    <label htmlFor="phone" className="form-label">
                        Số điện thoại <span className="text-danger">*</span>
                    </label>
                    <input
                        type="text"
                        id="phone"
                        className="form-control"
                        placeholder="Nhập số điện thoại"
                    />
                </div>

                {/* Lý do */}
                <div className="mb-3">
                    <label htmlFor="reason" className="form-label">
                        Lý do <span className="text-danger">*</span>
                    </label>
                    <textarea
                        id="reason"
                        className="form-control"
                        rows="3"
                        placeholder="Nhập lý do xin điểm danh"
                    ></textarea>
                </div>

                {/* Phí dịch vụ */}
                <div className="mb-3">
                    <label htmlFor="fee" className="form-label">Phí dịch vụ</label>
                    <input
                        type="text"
                        id="fee"
                        className="form-control"
                        value="0"
                        readOnly
                    />
                </div>

                {/* Tải liệu đính kèm */}
                <div className="mb-3">
                    <label htmlFor="attachment" className="form-label">
                        Tài liệu đính kèm
                    </label>
                    <input type="file" id="attachment" className="form-control" />
                </div>

                {/* Ghi chú */}
                <div className="mb-3">
                    <p className="text-danger">
                        Lưu ý:
                        <ul>
                            <li>Sinh viên chỉ được đăng ký 1 lần/môn/kỳ trong vòng 2 ngày kể từ khi không được điểm danh.</li>
                            <li>Khi đăng ký thành công, vui lòng nhắc giảng viên xác nhận để phòng đào tạo xử lý tiếp.</li>
                        </ul>
                    </p>
                </div>

                {/* Nút gửi */}
                <button type="submit" className="btn btn-primary">Gửi yêu cầu</button>
            </form>
        </div>
    );
};

export default AttendanceRequestForm;
