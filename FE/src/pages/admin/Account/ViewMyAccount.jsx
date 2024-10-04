import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";

const ViewMyAccount = () => {
    const { register } = useForm();
    const { user_code } = useParams();
    const {
        data: user,
        isLoading,
        isError,
        isSuccess,
    } = useQuery({
        queryKey: ["user", user_code],
        queryFn: async () => {
            const response = await axios.get(
                `http://127.0.0.1:8000/api/admin/users/${user_code}`
            );
            return response.data;
        },
    });

    if (isLoading) {
        console.log(user);
    }
    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error loading user data</div>;
    }

    return (
        <>
            <div className="mb-6 mt-2">
                <Link to="/admin/account">
                    <button className="btn btn-primary">
                        Danh sách tài khoản
                    </button>
                </Link>
            </div>

            <form>
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <div className="card-title">
                                    Xem thông tin tài khoản
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Mã người dùng</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Nhập mã người dùng"
                                                value={user.user_code || ""}
                                                disabled
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Họ và tên</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Nhập họ và tên"
                                                value={user.full_name || ""}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Ngày tháng năm sinh</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                value={user.birthday || ""}
                                                disabled
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Email</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                placeholder="Nhập email"
                                                value={user.email || ""}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Mật khẩu</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                placeholder="Nhập mật khẩu"
                                                value={user.password || ""}
                                                disabled
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Số điện thoại</label>
                                            <input
                                                type="tel"
                                                className="form-control"
                                                placeholder="Nhập số điện thoại"
                                                value={user.phone_number || ""}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="gender">
                                                Giới tính
                                            </label>
                                            <select
                                                className="form-select"
                                                value={user.sex || ""}
                                                disabled
                                            >
                                                <option value="Male">
                                                    Nam
                                                </option>
                                                <option value="Female">
                                                    Nữ
                                                </option>
                                                <option value="Other">
                                                    Khác
                                                </option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Địa chỉ</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Nhập địa chỉ"
                                                value={user.address || ""}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Số CCCD</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Nhập số CCCD"
                                                value={
                                                    user.citizen_card_number ||
                                                    ""
                                                }
                                                disabled
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="email2">
                                                Ngày cấp
                                            </label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                value={user.issue_date || ""}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="email2">
                                                Nơi cấp
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Nơi cấp CCCD"
                                                value={
                                                    user.place_of_grant || ""
                                                }
                                                disabled
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="email2">
                                                Dân tộc
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Nhập dân tộc theo CCCD"
                                                value={user.nation || ""}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="email2">
                                                Ảnh đại diện
                                            </label>
                                            <img
                                                width={200}
                                                src={user.avatar || ""}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>IsActive</label>
                                            <select
                                                className="form-select"
                                                value={
                                                    user.is_active ? "1" : "0"
                                                }
                                                disabled
                                            >
                                                <option value="0">
                                                    0 - Inactive
                                                </option>
                                                <option value="1">
                                                    1 - Active
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="role">
                                                Chức vụ
                                            </label>
                                            <select
                                                className="form-select"
                                                value={user.role || ""}
                                                disabled
                                            >
                                                <option value={"admin"}>
                                                    Admin
                                                </option>
                                                <option value={"teacher"}>
                                                    Giảng viên
                                                </option>
                                                <option value={"student"}>
                                                    Sinh viên
                                                </option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="major">
                                                Ngành học
                                            </label>
                                            <select
                                                className="form-select"
                                                {...register("major")}
                                                defaultValue={user.major || ""}
                                                disabled
                                            >
                                                <option value="CNTT">
                                                    CNTT
                                                </option>
                                                <option value="Khách Sạn">
                                                    Khách Sạn
                                                </option>
                                                <option value="QTKD">
                                                    Quản Trị Kinh Doanh
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
};

export default ViewMyAccount;
