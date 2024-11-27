import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../config/axios";
import "/src/css/signin.css";
import { toast } from "react-toastify";

const Signin = () => {
    const navigate = useNavigate();
    const [isForgotPassword, setIsForgotPassword] = useState(false); // State kiểm tra form

    const { mutate } = useMutation({
        mutationFn: (data) => {
            return api.post("/login", data);
        },
        onSuccess: (data) => {
            const { user, token } = data.data;
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("token", JSON.stringify(token));

            toast.success(`Đăng nhập thành công!`, {
                autoClose: 3000,
                closeOnClick: true,
                draggable: true,
            });

            switch (user.role) {
                case "0":
                    navigate("/admin");
                    break;
                case "2":
                    navigate("/teacher");
                    break;
                case "3":
                    navigate("/student");
                    break;
                default:
                    toast.warning("Vai trò không xác định, vui lòng thử lại.");
                    localStorage.removeItem("user");
                    localStorage.removeItem("token");
                    navigate("/signin");
                    break;
            }
        },
        onError: (error) => {
            if (!error.response) {
                toast.warning("Server chưa hoạt động. Vui lòng kiểm tra lại sau.");
            } else if (error.response.status === 500) {
                toast.warning("Lỗi máy chủ. Vui lòng thử lại sau.");
            } else {
                toast.warning(error.response.data.message);
            }
            console.log(error);
        },
    });

    const {
        register,
        formState: { errors },
        handleSubmit,
        getValues,
    } = useForm();

    const onSubmit = (values) => {
        if (isForgotPassword) {
            console.log(values);

            toast.info("Tính năng quên mật khẩu chưa được triển khai.");
        } else {
            mutate(values);
        }
    };

    return (
        <section
            className="min-h-screen"
            style={{
                backgroundImage: `url('https://iap-poly.s3.ap-southeast-1.amazonaws.com/wallpaper/hero1.JPG')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <div className="container py-5 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-xl-10">
                        <div className="card rounded-3 text-black">
                            <div className="row g-0" style={{ minHeight: '510px' }}>
                                <div
                                    className={
                                        isForgotPassword
                                            ? "col-lg-6 d-flex align-items-center gradient-custom-2"
                                            : "col-lg-6 d-flex align-items-center gradient-custom-2 order-lg-2"

                                    }
                                >
                                    <div className="text-white px-3 py-4 p-md-5 mx-md-4">
                                        <img
                                            src="https://ap.poly.edu.vn/images/whiteLogo.png"
                                            alt="White Logo"
                                            className="mb-4"
                                        />
                                        <p
                                            style={{
                                                fontSize: "18px",
                                                fontWeight: "500",
                                            }}
                                            className="mb-0"
                                        >
                                            Trụ sở chính Tòa nhà FPT Polytechnic,
                                            Phố Trịnh Văn Bô, Nam Từ Liêm, Hà Nội.
                                        </p>
                                        <div
                                            style={{
                                                clear: "both",
                                                fontWeight: "500",
                                                color: "white",
                                                fontSize: "20px",
                                                textTransform: "uppercase",
                                                textDecoration: "underline",
                                                marginTop: "20px",
                                                display: "block",
                                                paddingTop: "15px",
                                            }}
                                        >
                                            THÔNG TIN LIÊN HỆ
                                        </div>
                                        <div className="hiden-xs">
                                            <p>Điện thoại: (024) 7300 1955</p>
                                            <p>Fanpage: facebook.com/fpt.poly</p>
                                            <p>Email: caodang@fpt.edu.vn</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Form */}
                                <div
                                    className={
                                        isForgotPassword
                                            ? "col-lg-6 order-lg-1"
                                            : "col-lg-6"
                                    }
                                >
                                    <div className="card-body p-md-5 mx-md-4">
                                        <div className="d-flex justify-content-center mb-3">
                                            <div>
                                                <img
                                                    src="https://upload.wikimedia.org/wikipedia/commons/2/20/FPT_Polytechnic.png"
                                                    alt="FPT Logo"
                                                    style={{ width: "185px" }}
                                                />
                                                <h4
                                                    className="mt-3 mb-5 pb-1 text-center"
                                                    style={{
                                                        fontWeight: "600",
                                                    }}
                                                >
                                                    {isForgotPassword
                                                        ? "Quên mật khẩu"
                                                        : "Hệ thống quản lý nhà trường"}
                                                </h4>
                                            </div>
                                        </div>

                                        <form onSubmit={handleSubmit(onSubmit)}>
                                            {!isForgotPassword ? (
                                                <>
                                                    {/* Form Đăng nhập */}
                                                    <div className="form-outline mb-4">
                                                        <label className="form-label">
                                                            Tài khoản
                                                        </label>
                                                        <label className="form-label text-danger">
                                                            *
                                                        </label>
                                                        <input
                                                            type="email"
                                                            className="form-control"
                                                            placeholder="Tài khoản được cung cấp bởi nhà trường"
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

                                                    <div className="form-outline mb-4">
                                                        <label className="form-label">
                                                            Mật khẩu
                                                        </label>
                                                        <label className="form-label text-danger">
                                                            *
                                                        </label>
                                                        <input
                                                            type="password"
                                                            className="form-control"
                                                            {...register("password", {
                                                                required:
                                                                    "Vui lòng nhập mật khẩu",
                                                                minLength: {
                                                                    value: 6,
                                                                    message:
                                                                        "Mật khẩu ít nhất 6 kí tự",
                                                                },
                                                            })}
                                                        />
                                                        {errors.password && (
                                                            <p className="text-danger">
                                                                {errors.password.message}
                                                            </p>
                                                        )}
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    {/* Form Quên mật khẩu */}
                                                    <div className="form-outline mb-4">
                                                        <label className="form-label">
                                                            Email đăng ký
                                                        </label>
                                                        <label className="form-label text-danger">
                                                            *
                                                        </label>
                                                        <input
                                                            type="email"
                                                            className="form-control"
                                                            placeholder="Nhập email để lấy lại mật khẩu"
                                                            {...register("email", {
                                                                required: "Vui lòng nhập email",
                                                                pattern: {
                                                                    value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                                                                    message: "Email không đúng định dạng",
                                                                },
                                                            })}
                                                        />
                                                        {errors.email && (
                                                            <p className="text-danger">
                                                                {errors.email.message}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Thêm trường số điện thoại */}
                                                    <div className="form-outline mb-4">
                                                        <label className="form-label">
                                                            Số điện thoại
                                                        </label>
                                                        <label className="form-label text-danger">
                                                            *
                                                        </label>
                                                        <input
                                                            type="tel"
                                                            className="form-control"
                                                            placeholder="Nhập số điện thoại để lấy lại mật khẩu"
                                                            {...register("phone", {
                                                                required: "Vui lòng nhập số điện thoại",
                                                                pattern: {
                                                                    value: /^[0-9]{10,11}$/,
                                                                    message: "Số điện thoại không hợp lệ",
                                                                },
                                                            })}
                                                        />
                                                        {errors.phone && (
                                                            <p className="text-danger">
                                                                {errors.phone.message}
                                                            </p>
                                                        )}
                                                    </div>
                                                    {/* Trường Mật khẩu mới */}
                                                    <div className="form-outline mb-4">
                                                        <label className="form-label">Mật khẩu mới</label>
                                                        <label className="form-label text-danger">*</label>
                                                        <input
                                                            type="password"
                                                            className="form-control"
                                                            placeholder="Nhập mật khẩu mới"
                                                            {...register("newPassword", {
                                                                required: "Vui lòng nhập mật khẩu mới",
                                                                minLength: {
                                                                    value: 6,
                                                                    message: "Mật khẩu phải có ít nhất 6 ký tự",
                                                                },
                                                            })}
                                                        />
                                                        {errors.newPassword && (
                                                            <p className="text-danger">{errors.newPassword.message}</p>
                                                        )}
                                                    </div>

                                                    {/* Trường Nhập lại mật khẩu mới */}
                                                    <div className="form-outline mb-4">
                                                        <label className="form-label">Nhập lại mật khẩu mới</label>
                                                        <label className="form-label text-danger">*</label>
                                                        <input
                                                            type="password"
                                                            className="form-control"
                                                            placeholder="Nhập lại mật khẩu mới"
                                                            {...register("confirmPassword", {
                                                                required: "Vui lòng nhập lại mật khẩu",
                                                                validate: (value) =>
                                                                    value === getValues("newPassword") || "Mật khẩu không khớp",
                                                            })}
                                                        />
                                                        {errors.confirmPassword && (
                                                            <p className="text-danger">{errors.confirmPassword.message}</p>
                                                        )}
                                                    </div>
                                                </>
                                            )}

                                            <div className="text-center pt-1 mb-5 pb-1 d-grid gap-2 col-7 mx-auto">
                                                <button
                                                    type="submit"
                                                    className="btn btn-primary btn-block fa-lg gradient-custom-2 mb-3"
                                                    style={{
                                                        fontWeight: "600",
                                                    }}
                                                >
                                                    {isForgotPassword
                                                        ? "Gửi yêu cầu"
                                                        : "Đăng nhập"}
                                                </button>
                                                <Link
                                                    to="#"
                                                    className="text-muted"
                                                    onClick={() =>
                                                        setIsForgotPassword(
                                                            !isForgotPassword
                                                        )
                                                    }
                                                >
                                                    {isForgotPassword
                                                        ? "Quay lại Đăng nhập"
                                                        : "Quên mật khẩu?"}
                                                </Link>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Signin;
