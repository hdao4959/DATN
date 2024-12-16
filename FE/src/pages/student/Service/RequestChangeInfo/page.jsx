import React, { useState } from "react";

const UpdateInformationForm = () => {
    const [selectedOption, setSelectedOption] = useState(""); // Lưu trạng thái option được chọn
    const [oldInfo, setOldInfo] = useState(""); // Giá trị thông tin cũ
    const [newInfo, setNewInfo] = useState(""); // Giá trị thông tin mới

    // Xử lý khi thay đổi option
    const handleOptionChange = (e) => {
        const value = e.target.value;
        setSelectedOption(value);

        // Giả lập thông tin cũ (tùy vào option được chọn)
        if (value === "name") setOldInfo("Nguyễn Văn A");
        if (value === "gender") setOldInfo("Nam");
        if (value === "dob") setOldInfo("01/01/2000");
        if (value === "address") setOldInfo("123 Đường ABC, TP.HCM");
        if (value === "idCard") setOldInfo("012345678901");
    };

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title mb-4">Cập nhật thông tin</h5>

                    {/* Select để chọn loại thông tin */}
                    <div className="mb-3">
                        <label htmlFor="infoSelect" className="form-label">Chọn thông tin cần cập nhật</label>
                        <select
                            className="form-select"
                            id="infoSelect"
                            onChange={handleOptionChange}
                            value={selectedOption}
                        >
                            <option value="">Chọn thông tin</option>
                            <option value="name">Họ và tên</option>
                            <option value="gender">Giới tính</option>
                            <option value="dob">Ngày sinh</option>
                            <option value="address">Địa chỉ</option>
                            <option value="idCard">Số căn cước công dân</option>
                        </select>
                    </div>

                    {/* Hiển thị input nếu đã chọn option */}
                    {selectedOption && (
                        <div className="row mb-3">
                            {/* Thông tin cũ */}
                            <div className="col-md-6">
                                <label htmlFor="oldInfo" className="form-label">Thông tin cũ</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="oldInfo"
                                    value={oldInfo}
                                    readOnly // Chỉ đọc
                                />
                            </div>

                            {/* Thông tin mới */}
                            <div className="col-md-6">
                                <label htmlFor="newInfo" className="form-label">Thông tin mới</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="newInfo"
                                    value={newInfo}
                                    onChange={(e) => setNewInfo(e.target.value)} // Cập nhật thông tin mới
                                    placeholder="Nhập thông tin mới"
                                />
                            </div>
                        </div>
                    )}

                    {/* Ghi chú */}
                    <div className="mb-3">
                        <label htmlFor="note" className="form-label">Ghi chú</label>
                        <textarea
                            className="form-control"
                            id="note"
                            rows="3"
                            placeholder="Nhập ghi chú"
                        ></textarea>
                        <small className="text-muted d-block text-end">0 / 500 ký tự</small>
                    </div>

                    {/* Phí dịch vụ */}
                    <div className="mb-3">
                        <label htmlFor="serviceFee" className="form-label">Phí dịch vụ</label>
                        <input
                            type="text"
                            className="form-control"
                            id="serviceFee"
                            placeholder="0"
                            disabled
                        />
                    </div>

                    {/* Tài liệu đính kèm */}
                    <div className="mb-3">
                        <label htmlFor="attachedFile" className="form-label">Tài liệu đính kèm</label>
                        <input
                            type="file"
                            className="form-control"
                            id="attachedFile"
                        />
                        <small className="text-muted">Chưa có tệp nào được chọn</small>
                    </div>

                    {/* Nút Submit */}
                    <div className="d-flex justify-content-end">
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateInformationForm;
