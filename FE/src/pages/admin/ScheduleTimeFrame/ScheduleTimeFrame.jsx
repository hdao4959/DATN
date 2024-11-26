import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { toast } from "react-toastify"; // Đảm bảo import toast
import { useNavigate } from "react-router-dom"; // Điều hướng sau khi thành công
import api from "../../../config/axios";

const ScheduleTimeFrame = () => {
    const [formData, setFormData] = useState({
        start_time: "",
        end_time: "",
    });
    const nav = useNavigate(); // Sử dụng điều hướng

    const { mutate, reset } = useMutation({
        mutationFn: (data) =>
            api.post("/admin/create_transfer_schedule_timeframe", data),
        onSuccess: () => {
            toast.success("Giới hạn thời gian thành công!");
            setFormData({ start_time: "", end_time: "" });
            nav("/admin");
        },
        onError: (error) => {
            toast.error(
                error?.response?.data?.message ||
                    "Đã xảy ra lỗi, vui lòng thử lại!"
            );
        },
    });

    const onSubmit = (e) => {
        e.preventDefault();
        if (!formData.start_time || !formData.end_time) {
            toast.error("Vui lòng nhập đầy đủ thông tin!");
            return;
        }
        mutate(formData);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    return (
        <div className="container mt-5">
            <div className="card p-4 shadow">
                <h4 className="card-title text-center mb-4">
                    Tạo khung thời gian
                </h4>
                <form onSubmit={onSubmit}>
                    <div className="mb-3">
                        <label htmlFor="start_time" className="form-label">
                            Thời gian bắt đầu
                        </label>
                        <input
                            type="datetime-local"
                            id="start_time"
                            className="form-control"
                            value={formData.start_time}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="end_time" className="form-label">
                            Thời gian kết thúc
                        </label>
                        <input
                            type="datetime-local"
                            id="end_time"
                            className="form-control"
                            value={formData.end_time}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="text-center">
                        <button type="submit" className="btn btn-primary">
                            Tạo lịch
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ScheduleTimeFrame;
