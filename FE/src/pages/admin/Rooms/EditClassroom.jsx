import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getToken } from "../../../utils/getToken";
import api from "../../../config/axios";

const EditClassroom = () => {
    const navigate = useNavigate();
    const { class_code } = useParams();
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const accessToken = getToken();

    useEffect(() => {
        api.get(`/admin/classrooms/${class_code}`)
            .then((response) => {
                const classroomData = response.data.classroom;

                setValue("id", classroomData.id);
                setValue("class_code", classroomData.class_code);
                setValue("class_name", classroomData.class_name);
                setValue("section", classroomData.section);
                setValue(
                    "study_schedule",
                    classroomData.study_schedule.join(", ")
                );
                setValue("description", classroomData.description);
                setValue("is_active", classroomData.is_active.toString());
                setValue("room_code", classroomData.room_code);
                setValue("subject_code", classroomData.subject_code);

                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching classroom data:", error);
                setError("Không thể tải dữ liệu lớp học.");
                setLoading(false);
            });
    }, [class_code, setValue]);

    const onSubmit = (formData) => {
        const updatedData = {
            ...formData,
            study_schedule: formData.study_schedule
                .split(",")
                .map((date) => date.trim()),
        };

        api.put(`/admin/classrooms/${class_code}`, updatedData)
            .then(() => {
                toast.success("Lớp học đã được cập nhật thành công!");
                navigate("/admin/classrooms");
            })
            .catch((error) => {
                console.error("Error updating classroom:", error);
                toast.error("Đã xảy ra lỗi khi cập nhật lớp học.");
            });
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

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
                                    Sửa lớp học {class_code}
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
                                            <label>Trạng thái</label>
                                            <select
                                                className="form-select"
                                                {...register("is_active", {
                                                    required:
                                                        "Vui lòng chọn trạng thái",
                                                })}
                                            >
                                                <option value="" hidden>
                                                    Chọn trạng thái lớp
                                                </option>
                                                <option value="false">
                                                    Không hoạt động
                                                </option>
                                                <option value="true">
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
                                            <label>Kì học</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Nhập kì học"
                                                {...register("section", {
                                                    required:
                                                        "Vui lòng nhập kì học",
                                                })}
                                            />
                                            {errors.section && (
                                                <p className="text-danger">
                                                    {errors.section.message}
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
                                                {...register("room_code", {
                                                    required:
                                                        "Vui lòng nhập mã phòng học",
                                                })}
                                            />
                                            {errors.room_code && (
                                                <p className="text-danger">
                                                    {errors.room_code.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Mã môn học</label>
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
                                                className="form-control"
                                                placeholder="Nhập mô tả lớp học"
                                                {...register("description", {
                                                    required:
                                                        "Nhập mô tả lớp học",
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
                                            <label>Lịch học</label>
                                            <textarea
                                                className="form-control"
                                                placeholder="Nhập lịch học"
                                                {...register("study_schedule", {
                                                    required: "Nhập lịch học",
                                                })}
                                            />
                                            {errors.study_schedule && (
                                                <p className="text-danger">
                                                    {
                                                        errors.study_schedule
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
                                >
                                    Cập nhật lớp học
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() =>
                                        navigate("/admin/classrooms")
                                    }
                                >
                                    Hủy
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
};

export default EditClassroom;
