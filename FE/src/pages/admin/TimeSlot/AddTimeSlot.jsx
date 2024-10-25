import React from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../config/axios";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";

const AddTimeslot = () => {
    const queryClient = useQueryClient();
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const mutation = useMutation({
        mutationFn: async (data) => {
            await api.post("/admin/timeslot", data);
        },
        onSuccess: () => {
            toast.success("Thêm ca học thành công!");
            queryClient.invalidateQueries(["timeslot"]);
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra");
        },
    });

    const onSubmitForm = (data) => {
        mutation.mutate(data);
    };

    return (
        <div>
            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">
                            <div className="card-title text-center">
                                Quản lý Ca Học
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mb-6 mt-2">
                <Link to="/timeslot">
                    <button className="btn btn-primary">
                        <i className="fas fa-list"></i> Danh sách ca học
                    </button>
                </Link>
            </div>
            <form onSubmit={handleSubmit(onSubmitForm)}>
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <div className="card-title">
                                    Tạo thêm Ca Học
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="form-group">
                                        <label>Tên Ca Học:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            {...register("name", {
                                                required:
                                                    "Tên ca học không được để trống.",
                                            })}
                                        />
                                        {errors.name && (
                                            <span className="text-danger">
                                                {errors.name.message}
                                            </span>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label>Thời Gian Bắt Đầu:</label>
                                        <input
                                            type="time"
                                            className="form-control"
                                            {...register("start_time", {
                                                required:
                                                    "Thời gian bắt đầu không được để trống.",
                                            })}
                                        />
                                        {errors.start_time && (
                                            <span className="text-danger">
                                                {errors.start_time.message}
                                            </span>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label>Thời Gian Kết Thúc:</label>
                                        <input
                                            type="time"
                                            className="form-control"
                                            {...register("end_time", {
                                                required:
                                                    "Thời gian kết thúc không được để trống.",
                                            })}
                                        />
                                        {errors.end_time && (
                                            <span className="text-danger">
                                                {errors.end_time.message}
                                            </span>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label>Trạng Thái:</label>
                                        <select
                                            className="form-control"
                                            {...register("is_active")}
                                        >
                                            <option value="1">Hoạt Động</option>
                                            <option value="0">
                                                Không Hoạt Động
                                            </option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="card-action d-flex justify-content-end gap-x-3">
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => reset()}
                                >
                                    <i className="fas fa-undo"></i> Reset
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-success"
                                >
                                    <i className="fas fa-upload"></i> Cập nhật
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            <ToastContainer />
        </div>
    );
};

export default AddTimeslot;
