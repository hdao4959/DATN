import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom'; // để lấy token và email từ URL
import { toast } from 'react-toastify';
import api from '../../../config/axios';

const ResetPassword = () => {
    const { token, email } = useParams(); // Lấy token và email từ URL
 const navigate = useNavigate();
    
    const { register, handleSubmit, formState: { errors }, getValues } = useForm();

    const onSubmit = async (data) => {
        try {
            await api.post('/reset-password', data);
            toast.success('Đặt lại mật khẩu thành công!');
            navigate('/signin')
        } catch (error) {
            toast.error('Đặt lại mật khẩu thất bại, vui lòng thử lại.');
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
                                                    Đặt lại mật khẩu
                                                </h4>
                                            </div>
                                        </div>
                                        <form onSubmit={handleSubmit(onSubmit)}>
                                            <input
                                                type="hidden"
                                                {...register("token")}
                                                value={token}
                                            />
                                            <input
                                                type="hidden"
                                                {...register("email")}
                                                value={email}
                                            />
                                            <div className="form-group mb-4">
                                                <label>Mật khẩu</label>
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    {...register("password", { required: "Vui lòng nhập mật khẩu" })}
                                                />
                                                {errors.password && <p className="text-danger">{errors.password.message}</p>}
                                            </div>
                                            <div className="form-group mb-4">
                                                <label>Xác nhận mật khẩu</label>
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    {...register("password_confirmation", { 
                                                        required: "Vui lòng xác nhận mật khẩu",
                                                        validate: value => value === getValues("password") || "Mật khẩu không khớp" 
                                                    })}
                                                />
                                                {errors.password_confirmation && <p className="text-danger">{errors.password_confirmation.message}</p>}
                                            </div>
                                            <button type="submit" className="btn btn-primary w-100">
                                                Đặt lại mật khẩu
                                            </button>
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

export default ResetPassword;
