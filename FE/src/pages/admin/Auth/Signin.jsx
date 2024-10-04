import React from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../config/axios";
import "/Users/hanhd/DATN/FE/src/css/signin.css";

const Signin = () => {
    const navigate = useNavigate();
    const { mutate } = useMutation({
        mutationFn: (data) => {
            return api.post("/login", data);
        },
        onSuccess: (data) => {
            const { user, token } = data.data;
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("token", JSON.stringify(token));

            alert("Đăng nhập thành công!");
            navigate("/admin");
        },
        onError: (error) => {
            if (!error.response) {
                alert("Server chưa hoạt động. Vui lòng kiểm tra lại sau.");
            } else if (error.response.status === 500) {
                alert("Lỗi máy chủ. Vui lòng thử lại sau.");
            } else {
                alert(error.response.data.message);
            }
            console.log(error);
        },
    });

    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm();

    const onSubmit = (values) => {
        mutate(values);
    };

    return (
        <section
            className="min-h-screen"
            style={{
                backgroundImage: `url('https://iap-poly.s3.ap-southeast-1.amazonaws.com/wallpaper/hero1.JPG?fbclid=IwAR1rRUAoaHnTfDL2aff4wzf9OurJA2dSWhlmIRnYwarFZNOHCGGvvb3bJqo')`, // Example background image, update the path accordingly
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <div className="container py-5 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-xl-10">
                        <div className="card rounded-3 text-black">
                            <div className="row g-0">
                                <div className="col-lg-6">
                                    <div className="card-body p-md-5 mx-md-4">
                                        <div className="d-flex justify-content-center mb-3">
                                            <div>
                                                <img
                                                    src="https://upload.wikimedia.org/wikipedia/commons/2/20/FPT_Polytechnic.png"
                                                    alt="FPT Logo"
                                                    style={{ width: "185px" }}
                                                />
                                                <h4
                                                    className="mt-3 mb-5 pb-1"
                                                    style={{
                                                        fontWeight: "600",
                                                    }}
                                                >
                                                    Hệ thống quản lý nhà trường
                                                </h4>
                                            </div>
                                        </div>

                                        <form onSubmit={handleSubmit(onSubmit)}>
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
                                                        {
                                                            errors.password
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                            </div>

                                            <div className="text-center pt-1 mb-5 pb-1 d-grid gap-2 col-7 mx-auto">
                                                <button
                                                    type="submit"
                                                    className="btn btn-primary btn-block fa-lg gradient-custom-2 mb-3"
                                                    style={{
                                                        fontWeight: "600",
                                                    }}
                                                >
                                                    Đăng nhập
                                                </button>
                                                <Link
                                                    to="/forgot-password"
                                                    className="text-muted"
                                                >
                                                    Quên mật khẩu?
                                                </Link>
                                            </div>
                                        </form>
                                    </div>
                                </div>

                                <div className="col-lg-6 d-flex align-items-center gradient-custom-2">
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
                                            Trụ sở chính Tòa nhà FPT
                                            Polytechnic, Phố Trịnh Văn Bô, Nam
                                            Từ Liêm, Hà Nội.
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
                                            <p>
                                                Fanpage: facebook.com/fpt.poly
                                            </p>
                                            <p>Email: caodang@fpt.edu.vn</p>
                                        </div>
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
