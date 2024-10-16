import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const CreateAccount = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const { mutate, isLoading, isError, isSuccess, error } = useMutation({
        mutationFn: (data) => {
            return axios.post("http://127.0.0.1:8000/api/admin/users", data);
        },
        onSuccess: () => {
            alert("Tạo tài khoản thành công!");
        },
        onError: (error) => {
            console.log(error);
            alert("Đã xảy ra lỗi. Vui lòng thử lại.");
        },
    });

    const onSubmit = (data) => {
        mutate(data);
    };
    return (
        <>
            <div className="mb-6 mt-2">
                <Link to="/admin/account">
                    <button className="btn btn-primary">
                        Danh sách tài khoản
                    </button>
                </Link>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <div className="card-title">Create Account</div>
                            </div>
                            <div className="card-body">
                                {/* Dòng 1 */}
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Mã người dùng</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Nhập mã người dùng"
                                                {...register("user_code", {
                                                    required:
                                                        "Vui lòng nhập mã người dùng",
                                                })}
                                            />
                                            {errors.user_code && (
                                                <p className="text-danger">
                                                    {errors.user_code.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Họ và tên</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Nhập họ và tên"
                                                {...register("full_name", {
                                                    required:
                                                        "Vui lòng nhập họ và tên",
                                                })}
                                            />
                                            {errors.full_name && (
                                                <p className="text-danger">
                                                    {errors.full_name.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Dòng 2 */}
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Ngày tháng năm sinh</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                {...register("birthday", {
                                                    required:
                                                        "Chọn ngày tháng năm sinh",
                                                })}
                                            />
                                            {errors.birthday && (
                                                <p className="text-danger">
                                                    {errors.birthday.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Email</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                placeholder="Nhập email"
                                                {...register("email", {
                                                    required:
                                                        "Vui lòng nhập email",
                                                    pattern: {
                                                        value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                                                        message:
                                                            "Email không đúng định dạng",
                                                    },
                                                })}
                                            />
                                            {errors.email && (
                                                <p className="text-danger">
                                                    {errors.email.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Dòng 3 */}
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Mật khẩu</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                placeholder="Nhập mật khẩu"
                                                {...register("password", {
                                                    required:
                                                        "Vui lòng nhập mật khẩu",
                                                    minLength: {
                                                        value: 6,
                                                        message:
                                                            "Mật khẩu ít nhất 6 ký tự",
                                                    },
                                                })}
                                            />
                                            {errors.password && (
                                                <p className="text-danger">
                                                    {errors.password.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Số điện thoại</label>
                                            <input
                                                type="tel"
                                                className="form-control"
                                                placeholder="Nhập số điện thoại"
                                                {...register("phone_number", {
                                                    required:
                                                        "Vui lòng nhập số điện thoại",
                                                    pattern: {
                                                        value: /^[0-9]+$/,
                                                        message:
                                                            "Số điện thoại không hợp lệ",
                                                    },
                                                })}
                                            />
                                            {errors.phone_number && (
                                                <p className="text-danger">
                                                    {
                                                        errors.phone_number
                                                            .message
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Dòng 4 */}
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Giới tính</label>
                                            <select
                                                className="form-select"
                                                {...register("sex", {
                                                    required:
                                                        "Vui lòng chọn giới tính",
                                                })}
                                            >
                                                <option
                                                    value=""
                                                    selected
                                                    hidden
                                                >
                                                    Chọn giới tính
                                                </option>
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
                                            {errors.sex && (
                                                <p className="text-danger">
                                                    {errors.sex.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Địa chỉ</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Nhập địa chỉ"
                                                {...register("address", {
                                                    required:
                                                        "Vui lòng nhập địa chỉ",
                                                })}
                                            />
                                            {errors.address && (
                                                <p className="text-danger">
                                                    {errors.address.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Dòng 5 */}
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Số CCCD</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Nhập số CCCD"
                                                {...register(
                                                    "citizen_card_number",
                                                    {
                                                        required:
                                                            "Vui lòng nhập số CCCD",
                                                    }
                                                )}
                                            />
                                            {errors.citizen_card_number && (
                                                <p className="text-danger">
                                                    {
                                                        errors
                                                            .citizen_card_number
                                                            .message
                                                    }
                                                </p>
                                            )}
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
                                                {...register("issue_date", {
                                                    required: "Ngày cấp",
                                                })}
                                            />
                                            {errors.issue_date && (
                                                <p className="text-danger">
                                                    {errors.issue_date.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Dòng 6 */}
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
                                                {...register("place_of_grant", {
                                                    required:
                                                        "Vui lòng nhập nơi cấp CCCD",
                                                })}
                                            />
                                            {errors.place_of_grant && (
                                                <p className="text-danger">
                                                    {
                                                        errors.place_of_grant
                                                            .message
                                                    }
                                                </p>
                                            )}
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
                                                {...register("nation", {
                                                    required:
                                                        "Vui lòng nhập dân tộc",
                                                })}
                                            />
                                            {errors.nation && (
                                                <p className="text-danger">
                                                    {errors.nation.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Dòng 7 */}
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="email2">
                                                Ảnh đại diện
                                            </label>
                                            <input
                                                type="file"
                                                className="form-control"
                                                {...register("avatar")}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>IsActive</label>
                                            <select
                                                className="form-select"
                                                {...register("is_active")}
                                            >
                                                <option value="0">0</option>
                                                <option value="1">1</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Dòng 8 */}
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="exampleFormControlSelect1">
                                                Chức vụ
                                            </label>
                                            <select
                                                className="form-select"
                                                {...register("role")}
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
                                            <label htmlFor="exampleFormControlSelect1">
                                                Ngành học
                                            </label>
                                            <select className="form-select">
                                                <option>LTWE</option>
                                                <option>BE</option>
                                                <option>MOBILE</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="card-action gap-x-3 flex">
                                <button
                                    type="submit"
                                    className="btn btn-success"
                                    disabled={isLoading}
                                >
                                    {isLoading
                                        ? "Đang tạo tài khoản..."
                                        : "Create Account"}
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                >
                                    Cancel
                                </button>
                            </div>

                            {isError && (
                                <p className="text-danger">
                                    Đã xảy ra lỗi: {error.message}
                                </p>
                            )}
                            {isSuccess && (
                                <p className="text-success">
                                    Tài khoản đã được tạo thành công!
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
};

export default CreateAccount;
