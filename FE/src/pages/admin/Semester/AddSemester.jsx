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
            value: data.value,
            cate_name: data.cate_name,
          
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
                                        <label>Tên Kỳ Học:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            {...register("cate_name", {
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
                                        <label>Số kỳ học:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            {...register("value", {
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

                                </div>
                            </div>
                            <div className="card-action d-flex justify-content-end gap-x-3">
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => reset()}
                                >
                                    <i className="fas fa-undo"> Quay lại</i>
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
