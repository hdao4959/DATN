import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../../config/axios";
import { toast, ToastContainer } from "react-toastify";

const EditSemester = () => {
    const queryClient = useQueryClient();
    const { id } = useParams();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const { data: semester, isLoading: loadingSemester } = useQuery({
        queryKey: ["semester", id],
        queryFn: async () => {
            const response = await api.get(`/admin/semester/${id}`);
            return response?.data;
        },
    });

    const mutation = useMutation({
        mutationFn: async (data) => {
            await api.put(`admin/semester/${id}`, data);
        },
        onSuccess: () => {
            toast.success("Cập nhật kỳ học thành công!");
            queryClient.invalidateQueries(["semesters"]);
            navigate("/semesters");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra");
        },
    });

    useEffect(() => {
        if (semester) {
            reset(semester);
        }
    }, [semester, reset]);

    const onSubmitForm = (data) => {
        const formData = new FormData();
        for (const key in data) {
            formData.append(key, data[key]);
        }
        mutation.mutate(formData);
    };

    if (loadingSemester) return <div>Loading...</div>;

    return (
        <div>
            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">
                            <div className="card-title text-center">
                                Quản lý Kỳ Học
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mb-6 mt-2">
                <Link to="/semesters">
                    <button className="btn btn-primary">
                        <i className="fas fa-list"></i> Danh sách kỳ học
                    </button>
                </Link>
            </div>
            <form onSubmit={handleSubmit(onSubmitForm)}>
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <div className="card-title">
                                    Chỉnh Sửa Kỳ Học
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="form-group">
                                        <label>Tên Kỳ Học:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            {...register("name", {
                                                required:
                                                    "Tên kỳ học không được để trống.",
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
                                            type="date"
                                            className="form-control"
                                            {...register("start_date", {
                                                required:
                                                    "Thời gian bắt đầu không được để trống.",
                                            })}
                                        />
                                        {errors.start_date && (
                                            <span className="text-danger">
                                                {errors.start_date.message}
                                            </span>
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label>Thời Gian Kết Thúc:</label>
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
                                </div>
                                <div className="card-action d-flex justify-content-end gap-x-3">
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={() => reset(semester)}
                                    >
                                        <i className="fas fa-undo"></i> Reset
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-success"
                                    >
                                        <i className="fas fa-upload"></i> Cập
                                        nhật
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            <ToastContainer />
        </div>
    );
};

export default EditSemester;
