import React from "react";

const ChangeMajorForm = () => {
    return (
        <div className="container">
            <h1 className="text-center my-4">Đổi Chuyên Ngành</h1>
            <form>
                {/* Chọn chuyên ngành hiện tại */}
                <div className="form-group">
                    <label htmlFor="current_major">
                        Chọn chuyên ngành hiện tại
                        <span className="text-red-500 ml-1">*</span>
                    </label>
                    <select className="form-select" id="current_major">
                        <option value="">-- Chọn chuyên ngành --</option>
                        <option value="CN01">Công nghệ thông tin</option>
                        <option value="CN02">Cơ điện tử</option>
                        <option value="CN03">Digital Marketing</option>
                    </select>
                </div>

                {/* Chọn chuyên ngành muốn chuyển */}
                <div className="form-group">
                    <label htmlFor="desired_major">
                        Chọn chuyên ngành muốn chuyển
                        <span className="text-red-500 ml-1">*</span>
                    </label>
                    <select className="form-select" id="desired_major">
                        <option value="">-- Chọn chuyên ngành --</option>
                        <option value="CN01">Công nghệ thông tin</option>
                        <option value="CN02">Cơ điện tử</option>
                        <option value="CN03">Digital Marketing</option>
                    </select>
                </div>

                {/* Nhập lý do muốn chuyển */}
                <div className="form-group">
                    <label htmlFor="reason">
                        Lý do muốn chuyển
                        <span className="text-red-500 ml-1">*</span>
                    </label>
                    <textarea
                        className="form-control"
                        id="reason"
                        rows="5"
                        placeholder="Nhập lý do tại đây..."
                    ></textarea>
                </div>

                {/* Nút submit */}
                <div className="form-group mt-3">
                    <button type="submit" className="btn btn-primary">
                        Gửi yêu cầu chuyển
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChangeMajorForm;
