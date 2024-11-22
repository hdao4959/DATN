import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import api from "../../../config/axios";

const ViewMyAccount = () => {
    const { user_code } = useParams();
    console.log(user_code);

    const [showModal, setShowModal] = useState(false);

    const {
        data: user,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["user", user_code],
        queryFn: async () => {
            const response = await api.get(`/students/${user_code}`);
            return response.data;
        },
    });
    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading user data</div>;

    const handleSupportClick = () => setShowModal(true);
    const handleModalClose = () => setShowModal(false);

    return (
        <div className="container">
            <form>
                <div className="row">
                    <div className="col-md-15">
                        <div className="row">
                            <div className="col-md-5">
                                <div className="card shadow">
                                    <div className="card-body">
                                        <div className="d-flex gap-4 align-items-center">
                                            <img
                                                src="https://phongreviews.com/wp-content/uploads/2022/11/avatar-facebook-mac-dinh-8.jpg"
                                                width="100"
                                                alt="User Avatar"
                                                className="rounded-circle"
                                            />
                                            <div>
                                                <p className="fw-bold fs-4 mb-1">{user.full_name || ""} 
                                                </p>
                                                <p className="text-muted mb-0">
                                                    {user.role === "3" && "Sinh viên"}
                                                    {user.role === "2" && "Giảng viên"}
                                                    {user.role === "1" && "Admin"}
                                                    {user.role === "0" && "Quản lý cấp cao"}
                                                </p>
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="d-flex gap-4 justify-content-between">
                                            <p className="fw-bold fs-5 mb-0 text-nowrap">Email:</p>
                                            <p className="fs-5 mb-0 text-end">{user.email || ""}</p>
                                        </div>
                                        <div className="d-flex gap-4 justify-content-between mt-3">
                                            <p className="fw-bold fs-5 mb-0 text-nowrap">Số điện thoại:</p>
                                            <p className="fs-5 mb-0 text-end">{user.phone_number || ""}</p>
                                        </div>
                                        {user?.role == 3 && (
                                            <>
                                                <hr />
                                                <div className="d-flex gap-4 justify-content-between mt-3">
                                                    <p className="fw-bold fs-5 mb-0 text-nowrap">Kỳ học:</p>
                                                    <p className="fs-5 mb-0">
                                                        {user?.semester?.cate_name || ""}
                                                    </p>
                                                </div>
                                                <div className="d-flex gap-4 justify-content-between mt-3">
                                                    <p className="fw-bold fs-5 mb-0 text-nowrap">Khóa học:</p>
                                                    <p className="fs-5 mb-0">
                                                        {user?.course?.cate_name || ""}
                                                    </p>
                                                </div>
                                                <div className="d-flex gap-4 justify-content-between mt-3">
                                                    <p className="fw-bold fs-5 mb-0 text-nowrap">Chuyên ngành:</p>
                                                    <p className="fs-5 mb-0">
                                                        {user?.major?.cate_name || ""}
                                                    </p>
                                                </div>
                                                <hr />
                                                <div className="d-flex gap-4 justify-content-between mt-3">
                                                    <p className="fw-bold fs-5 mb-0 text-nowrap">Trạng thái:</p>
                                                    <p className="fs-5 mb-0">
                                                        {user.is_active == 1 ? "Đang học" : "Đang dừng"}
                                                    </p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-7">
                                <div className="form-group">
                                    <label>Mã người dùng</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={user.user_code || ""}
                                        disabled
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Giới tính</label>
                                    <select
                                        className="form-select"
                                        value={user.sex || ""}
                                        disabled
                                    >
                                        <option value="Male">Nam</option>
                                        <option value="Female">Nữ</option>
                                        <option value="Other">Khác</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Ngày sinh</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={user.birthday || ""}
                                        disabled
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label>Địa chỉ</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={user.address || ""}
                                        disabled
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Số CCCD</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={user.citizen_card_number || ""}
                                        disabled
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Ngày cấp</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={user.issue_date || ""}
                                        disabled
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Nơi cấp</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={user.place_of_grant || ""}
                                        disabled
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Dân tộc</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={user.nation || ""}
                                        disabled
                                    />
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </form>
            <div className=" d-flex justify-content-center align-items-center flex-column">
                <div className="card-body text-center">
                    <button
                        className="btn btn-primary mt-3"
                        onClick={handleSupportClick}
                        type="button"
                    >
                        Gửi hỗ trợ đổi thông tin
                    </button>
                </div>
            </div>

            {showModal && (
                <div
                    className="modal pt-5 show d-block"
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    Chỉnh sửa thông tin
                                </h5>
                                <button
                                    type="button"
                                    className="close"
                                    onClick={handleModalClose}
                                >
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Họ và tên</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        defaultValue={user.full_name || ""}
                                        disabled
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        defaultValue={user.email || ""}
                                        disabled
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Số điện thoại</label>
                                    <input
                                        type="tel"
                                        className="form-control"
                                        defaultValue={user.phone_number || ""}
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-success"
                                >
                                    Gửi yêu cầu
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={handleModalClose}
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewMyAccount;
