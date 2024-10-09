import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

const AddClassroom = () => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const { mutate, isLoading, isError, isSuccess, error } = useMutation({
        mutationFn: (data) => {
            return axios.post(
                "http://127.0.0.1:8000/api/admin/classrooms",
                data
            );
        },
        onSuccess: () => {
            toast.success("Tạo lớp học thành công !");
            navigate("/admin/classrooms");
        },
        onError: (error) => {
            console.log(error);
            toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
        },
    });

    const onSubmit = (data) => {
        mutate(data);
    };
    return (
        <>
            <div className="mb-6 mt-2">
                <Link to="/admin/classrooms">
                    <button className="btn btn-primary">
                        Danh sách lớp học
                    </button>
                </Link>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <div className="card-title">
                                    Tạo mới lớp học
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Mã lớp</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Nhập mã lớp"
                                                {...register("class_code", {
                                                    required:
                                                        "Vui lòng nhập mã lớp",
                                                })}
                                            />
                                            {errors.class_code && (
                                                <p className="text-danger">
                                                    {errors.class_code.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Tên lớp</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Nhập tên lớp"
                                                {...register("class_name", {
                                                    required:
                                                        "Vui lòng nhập tên lớp",
                                                })}
                                            />
                                            {errors.class_name && (
                                                <p className="text-danger">
                                                    {errors.class_name.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Ngày bắt đầu</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                {...register("date_from", {
                                                    required:
                                                        "Chọn ngày bắt đầu",
                                                })}
                                            />
                                            {errors.date_from && (
                                                <p className="text-danger">
                                                    {errors.date_from.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Ngày kết thúc</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                {...register("date_to", {
                                                    required:
                                                        "Chọn ngày kết thúc",
                                                })}
                                            />
                                            {errors.date_to && (
                                                <p className="text-danger">
                                                    {errors.date_to.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Trạng thái</label>
                                            <select
                                                className="form-select"
                                                {...register("is_active", {
                                                    required:
                                                        "Vui lòng chọn trạng thái cho lớp học",
                                                })}
                                            >
                                                <option
                                                    value=""
                                                    selected
                                                    hidden
                                                >
                                                    Chọn trạng thái lớp
                                                </option>
                                                <option value="0">
                                                    Không hoạt động
                                                </option>
                                                <option value="1">
                                                    Hoạt động
                                                </option>
                                            </select>
                                            {errors.is_active && (
                                                <p className="text-danger">
                                                    {errors.is_active.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Mã giảng viên</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Nhập mã giảng viên"
                                                {...register("user_code", {
                                                    required:
                                                        "Vui lòng nhập mã giảng viên",
                                                })}
                                            />
                                            {errors.user_code && (
                                                <p className="text-danger">
                                                    {errors.user_code.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Mã phòng học</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Nhập mã phòng học"
                                                {...register(
                                                    "study_room_code",
                                                    {
                                                        required:
                                                            "Vui lòng nhập mã phòng học",
                                                    }
                                                )}
                                            />
                                            {errors.study_room_code && (
                                                <p className="text-danger">
                                                    {
                                                        errors.study_room_code
                                                            .message
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Mã phòng môn học</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Nhập mã môn học"
                                                {...register("subject_code", {
                                                    required:
                                                        "Vui lòng nhập mã môn học",
                                                })}
                                            />
                                            {errors.subject_code && (
                                                <p className="text-danger">
                                                    {
                                                        errors.subject_code
                                                            .message
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Mô tả lớp học</label>
                                            <textarea
                                                type="text"
                                                className="form-control"
                                                placeholder="Nhập mô tả phòng học"
                                                {...register("description", {
                                                    required:
                                                        "Nhập mô tả phòng học",
                                                })}
                                            />
                                            {errors.description && (
                                                <p className="text-danger">
                                                    {errors.description.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Danh sách sinh viên</label>
                                            <input
                                                value={'["Ubaldo Cummerata"]'}
                                                type="text"
                                                className="form-control"
                                                placeholder="Danh sách sinh viên"
                                                {...register("students", {
                                                    required:
                                                        "Nhập danh sách sinh viên",
                                                })}
                                            />
                                            {errors.students && (
                                                <p className="text-danger">
                                                    {errors.students.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Điểm thi</label>
                                            <textarea
                                                value={"[2,1,3,5,0]"}
                                                type="text"
                                                className="form-control"
                                                placeholder="Nhập điểm thi"
                                                {...register("exam_score", {
                                                    required: "Điểm thi",
                                                })}
                                            />
                                            {errors.exam_score && (
                                                <p className="text-danger">
                                                    {errors.exam_score.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Lịch học</label>
                                            <input
                                                value={
                                                    '["Friday","Monday","Wednesday"]'
                                                }
                                                type="text"
                                                className="form-control"
                                                placeholder="Lịch học"
                                                {...register(
                                                    "school_schedule",
                                                    {
                                                        required: "Lịch học",
                                                    }
                                                )}
                                            />
                                            {errors.school_schedule && (
                                                <p className="text-danger">
                                                    {
                                                        errors.school_schedule
                                                            .message
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Lịch thi</label>
                                            <input
                                                value={'["June 15","July 10"]'}
                                                type="text"
                                                className="form-control"
                                                {...register("exam_schedule", {
                                                    required: "Điểm thi",
                                                })}
                                            />
                                            {errors.exam_schedule && (
                                                <p className="text-danger">
                                                    {
                                                        errors.exam_schedule
                                                            .message
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="card-action gap-x-3 flex">
                                <button
                                    type="submit"
                                    className="btn btn-success"
                                    disabled={isLoading}
                                >
                                    {isLoading
                                        ? "Đang tạo lớp học..."
                                        : "Tạo lớp học"}
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                >
                                    Cancel
                                </button>
                            </div>

                            {isError && (
                                <p className="text-danger">
                                    Đã xảy ra lỗi: {error.message}
                                </p>
                            )}
                            {isSuccess && (
                                <p className="text-success">
                                    Lớp học đã được tạo thành công!
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
};

export default AddClassroom;
