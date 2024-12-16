import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import api from "../../../config/axios";

const ChangePassword = () => {
    const [formData, setFormData] = useState({
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const mutation = useMutation({
        mutationFn: async (passwordData) => {
            const response = await api.post("student/change-password", passwordData);
            return response.data;
        },
        onSuccess: () => {
            setSuccess("Mật khẩu đã được thay đổi thành công.");
            setError("");
            setFormData({
                current_password: "",
                new_password: "",
                new_password_confirmation: "",
            });
        },
        onError: (error) => {
            setSuccess("");
            setError(
                error.response?.data?.message || "Đã xảy ra lỗi, vui lòng thử lại."
            );
        },
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate input
        if (formData.new_password !== formData.new_password_confirmation) {
            setError("Mật khẩu mới và xác nhận mật khẩu không khớp.");
            return;
        }

        // Gửi yêu cầu đổi mật khẩu
        mutation.mutate({
            current_password: formData.current_password,
            new_password: formData.new_password,
            new_password_confirmation: formData.new_password_confirmation,
        });
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow">
                        <div className="card-body">
                            <h3 className="card-title text-center">Đổi mật khẩu</h3>
                            {error && error !== "" && <div className="alert alert-danger">{error}</div>}
                            {success && (
                                <div className="alert alert-success">{success}</div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Mật khẩu hiện tại</label>
                                    <input
                                        type="password"
                                        name="current_password"
                                        className="form-control"
                                        value={formData.current_password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group mt-3">
                                    <label>Mật khẩu mới</label>
                                    <input
                                        type="password"
                                        name="new_password"
                                        className="form-control"
                                        value={formData.new_password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group mt-3">
                                    <label>Xác nhận mật khẩu mới</label>
                                    <input
                                        type="password"
                                        name="new_password_confirmation"
                                        className="form-control"
                                        value={formData.new_password_confirmation}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-primary mt-4 w-100"
                                    disabled={mutation.isLoading}
                                >
                                    {mutation.isLoading
                                        ? "Đang xử lý..."
                                        : "Đổi mật khẩu"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;

