import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const EditClassroom = () => {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();
    const { class_code } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios
            .get(`http://127.0.0.1:8000/api/admin/classrooms/${class_code}`)
            .then((response) => {
                const classroomData = response.data.classroom;

                setValue("is_active", classroomData.is_active ? "1" : "0");

                Object.keys(classroomData).forEach((key) => {
                    setValue(key, classroomData[key]);
                });
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching classroom data:", error);
                setError("Không thể tải dữ liệu lớp học.");
                setLoading(false);
            });
    }, [class_code, setValue]);

    const onSubmit = (formData) => {
        axios
            .patch(
                `http://127.0.0.1:8000/api/admin/classrooms/${class_code}`,
                formData
            )
            .then(() => {
                toast.success("Lớp học đã được cập nhật thành công!");
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
                                                        "Vui lòng chọn trạng thái",
                                                })}
                                            >
                                                <option value="" hidden>
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
                                            <label>Danh sách sinh viên</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Nhập danh sách sinh viên"
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
                                                type="text"
                                                className="form-control"
                                                placeholder="Nhập lịch học"
                                                {...register(
                                                    "school_schedule",
                                                    { required: "Lịch học" }
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
                                                type="text"
                                                className="form-control"
                                                placeholder="Nhập lịch thi"
                                                {...register("exam_schedule", {
                                                    required: "Lịch thi",
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
                                >
                                    Cập nhật lớp học
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
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
