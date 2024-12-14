import React from "react";
import { useForm } from "react-hook-form";
import api from "../../../config/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddSemester = () => {
    const queryClient = useQueryClient();
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const { mutate } = useMutation({
        mutationFn: async (data) => {
            await api.post("/admin/semesters", data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["LIST_SEMESTER"]);
            toast.success("Thêm kỳ học thành công!");
            reset();
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra");
        },
    });

    const onSubmitForm = (data) => {
        const requestData = {
            semester_code: data.semester_code,
            semester_name: data.semester_name,
            is_active: data.is_active,
        };
        mutate(requestData);
    };

    return (
        <>
            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">
                            <div className="card-title text-center">
                                Thêm Kỳ Học
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mb-6 mt-2">
                <Link to="/sup-admin/semesters">
                    <button className="btn btn-primary">
                        <i className="fas fa-list"> Danh sách kỳ học</i>
                    </button>
                </Link>
            </div>
            <form onSubmit={handleSubmit(onSubmitForm)}>
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <div className="card-title">Thêm Kỳ Học</div>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="form-group">
                                        <label>Mã Kỳ Học:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            {...register("semester_code", {
                                                required:
                                                    "Mã kỳ học không được để trống.",
                                            })}
                                        />
                                        {errors.semester_code && (
                                            <span className="text-danger">
                                                {errors.semester_code.message}
                                            </span>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label>Tên Kỳ Học:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            {...register("semester_name", {
                                                required:
                                                    "Tên kỳ học không được để trống.",
                                            })}
                                        />
                                        {errors.semester_name && (
                                            <span className="text-danger">
                                                {errors.semester_name.message}
                                            </span>
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label>Năm Học:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            {...register("academic_year", {
                                                required:
                                                    "Năm học không được để trống.",
                                            })}
                                        />
                                        {errors.academic_year && (
                                            <span className="text-danger">
                                                {errors.academic_year.message}
                                            </span>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label>Ngày Bắt Đầu:</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            {...register("start_date", {
                                                required:
                                                    "Ngày bắt đầu không được để trống.",
                                            })}
                                        />
                                        {errors.start_date && (
                                            <span className="text-danger">
                                                {errors.start_date.message}
                                            </span>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label>Ngày Kết Thúc:</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            {...register("end_date", {
                                                required:
                                                    "Ngày kết thúc không được để trống.",
                                            })}
                                        />
                                        {errors.end_date && (
                                            <span className="text-danger">
                                                {errors.end_date.message}
                                            </span>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label>Trạng Thái:</label>
                                        <select
                                            className="form-control"
                                            {...register("is_active")}
                                        >
                                            <option value="1">Công Khai</option>
                                            <option value="0">Ẩn</option>
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
                                    <i className="fas fa-undo"> Reset</i>
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-success"
                                >
                                    <i className="fas fa-plus"> Thêm</i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            <ToastContainer />
        </>
    );
};

export default AddSemester;
