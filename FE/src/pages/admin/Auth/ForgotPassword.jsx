import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import api from "../../../config/axios";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        try {
            const response = await api.post("/forgot-password", data);
            toast.success(response.data.message);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                toast.error("Email không tồn tại.");
            } else {
                toast.error("Đã có lỗi xảy ra, vui lòng thử lại.");
            }
        }
    };

    return (
        <section
            className="min-h-screen"
            style={{
                backgroundImage: `url('https://image.slidesdocs.com/responsive-images/background/dark-blue-shiny-technology-network-connection-pattern-geometric-powerpoint-background_e4634d1ae3__960_540.jpg')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <div className="container py-5 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-xl-10">
                        <div className="card rounded-3 text-black">
                            <div
                                className="row g-0"
                                style={{ minHeight: "510px" }}
                            >
                                <div className="col-lg-6 d-flex align-items-center gradient-custom-2">
                                    <div className="text-white px-3 py-4 p-md-5 mx-md-4">
                                        <img
                                            src="https://admin.feduvn.com/storage/logo/logo3.2-white.png"
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
                                            Trụ sở chính Tòa nhà F - Education,
                                            Phố Trịnh Văn Bô, Nam Từ Liêm, Hà
                                            Nội.
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
                                            <p>Fanpage: facebook.com/fedu</p>
                                            <p>
                                                Email: feduacademyvn@gmail.com
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Form */}
                                <div className="col-lg-6">
                                    <div className="card-body p-md-5 mx-md-4">
                                        <div className="d-flex justify-content-center mb-3">
                                            <div>
                                                <img
                                                    src="https://admin.feduvn.com/storage/logo/logo3.png"
                                                    alt="FPT Logo"
                                                    style={{ width: "185px" }}
                                                />
                                                <h4
                                                    className="mt-3 mb-5 pb-1 text-center"
                                                    style={{
                                                        fontWeight: "600",
                                                    }}
                                                >
                                                    Quên mật khẩu
                                                </h4>
                                            </div>
                                        </div>
                                        <form onSubmit={handleSubmit(onSubmit)}>
                                            <div className="form-group mb-4">
                                                <label>Email</label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    {...register("email", { required: "Vui lòng nhập email" })}
                                                />
                                                {errors.email && <p className="text-danger">{errors.email.message}</p>}
                                            </div>
                                            <button type="submit" className="btn btn-primary w-100">
                                                Đặt lại mật khẩu
                                            </button>
                                            <Link className="btn" to="/signin">
                                                Quay lại
                                            </Link>
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

export default ForgotPassword;
