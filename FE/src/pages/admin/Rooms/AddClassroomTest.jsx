import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import "/src/css/popup.css";

const AddClassroomTest = () => {
    const navigate = useNavigate();
    const [responseData, setResponseData] = useState(null);
    const [studyDates, setStudyDates] = useState([]);
    const [showPopup, setShowPopup] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const {
        data: roomsData = [],
        isLoading: roomsLoading,
        isError: roomsError,
    } = useQuery({
        queryKey: ["schoolrooms"],
        queryFn: async () => {
            const response = await axios.get(
                "http://127.0.0.1:8000/api/admin/schoolrooms"
            );
            return response.data.data;
        },
        onError: () => {
            toast.error("Failed to load schoolrooms data.");
        },
    });

    const {
        data: subjectsData,
        isLoading: subjectsLoading,
        isError: subjectsError,
    } = useQuery({
        queryKey: ["subjects"],
        queryFn: async () => {
            const response = await axios.get(
                "http://127.0.0.1:8000/api/admin/subjects"
            );
            return response.data.data;
        },
        onError: () => {
            toast.error("Failed to load subjects data.");
        },
    });

    const { mutate: submitClassroom, isLoading } = useMutation({
        mutationFn: (data) =>
            axios.post(
                "http://127.0.0.1:8000/api/admin/classrooms/render_schedule",
                data
            ),
        onSuccess: (response) => {
            reset();
            setResponseData(response.data.info);
            setStudyDates(response.data.list_study_dates);
            setShowPopup(true);
            toast.success("Lưu lịch học thành công !");
        },
        onError: (error) => {
            const errorMessage =
                error.response?.data?.message ||
                "Đã xảy ra lỗi. Vui lòng thử lại.";
            toast.error(errorMessage);
        },
    });

    const onSubmit = (data) => {
        submitClassroom(data);
    };

    const handleSaveClassroom = () => {
        axios
            .post("http://127.0.0.1:8000/api/admin/classrooms", {
                ...responseData,
                list_study_dates: studyDates,
            })
            .then(() => {
                toast.success("Lớp học đã được lưu thành công!");
                setShowPopup(false);
                navigate("/classrooms");
            })
            .catch(() => {
                toast.error("Đã xảy ra lỗi khi lưu lớp học.");
            });
    };

    return (
        <>
            <Link to="/classrooms">
                <button className="btn btn-primary">Danh sách lớp học</button>
            </Link>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <div className="card-title">
                                    Tạo lịch học mới
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="mb-3">
                                    <label className="form-label">
                                        Chọn ca học
                                    </label>
                                    <div>
                                        {[1, 2, 3, 4, 5, 6].map((shift) => (
                                            <div
                                                className="form-check form-check-inline"
                                                key={shift}
                                            >
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    id={`shift${shift}`}
                                                    name="section"
                                                    value={shift}
                                                    {...register("section", {
                                                        required:
                                                            "Vui lòng chọn ca học",
                                                    })}
                                                />
                                                <label
                                                    className="form-check-label"
                                                    htmlFor={`shift${shift}`}
                                                >
                                                    Ca {shift}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                    {errors.section && (
                                        <p className="text-danger">
                                            {errors.section.message}
                                        </p>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Chọn các ngày trong tuần
                                    </label>
                                    <div className="selectgroup selectgroup-pills">
                                        {[
                                            { value: "Mon", label: "Thứ Hai" },
                                            { value: "Tue", label: "Thứ Ba" },
                                            { value: "Wed", label: "Thứ Tư" },
                                            { value: "Thu", label: "Thứ Năm" },
                                            { value: "Fri", label: "Thứ Sáu" },
                                            { value: "Sat", label: "Thứ Bảy" },
                                            { value: "Sun", label: "Chủ Nhật" },
                                        ].map((day, index) => (
                                            <label
                                                className="selectgroup-item"
                                                key={index}
                                            >
                                                <input
                                                    type="checkbox"
                                                    value={day.value}
                                                    {...register("study_days", {
                                                        required:
                                                            "Vui lòng chọn các ngày học",
                                                    })}
                                                    className="selectgroup-input"
                                                />
                                                <span className="selectgroup-button">
                                                    {day.label}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                    {errors.study_days && (
                                        <p className="text-danger">
                                            {errors.study_days.message}
                                        </p>
                                    )}
                                </div>

                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label">
                                            Tên lớp
                                        </label>
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
                                    <div className="col-md-6">
                                        <label className="form-label">
                                            Mã lớp
                                        </label>
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

                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label">
                                            Số buổi học
                                        </label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="Nhập số buổi học"
                                            {...register("total_sessions", {
                                                required:
                                                    "Vui lòng nhập số buổi học",
                                            })}
                                        />
                                        {errors.total_sessions && (
                                            <p className="text-danger">
                                                {errors.total_sessions.message}
                                            </p>
                                        )}
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">
                                            Môn học
                                        </label>
                                        <select
                                            className="form-control"
                                            {...register("subject_code", {
                                                required:
                                                    "Vui lòng chọn môn học",
                                            })}
                                            disabled={subjectsLoading}
                                        >
                                            <option value="">
                                                Chọn môn học
                                            </option>
                                            {subjectsData &&
                                                subjectsData.map((subject) => (
                                                    <option
                                                        key={
                                                            subject.subject_code
                                                        }
                                                        value={
                                                            subject.subject_code
                                                        }
                                                    >
                                                        {subject.subject_name}
                                                    </option>
                                                ))}
                                        </select>
                                        {errors.subject_code && (
                                            <p className="text-danger">
                                                {errors.subject_code.message}
                                            </p>
                                        )}
                                        {subjectsError && (
                                            <p className="text-danger">
                                                Error loading subjects data.
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label">
                                            Ngày bắt đầu
                                        </label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            {...register("date_from", {
                                                required: "Chọn ngày bắt đầu",
                                            })}
                                        />
                                        {errors.date_from && (
                                            <p className="text-danger">
                                                {errors.date_from.message}
                                            </p>
                                        )}
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">
                                            Phòng học
                                        </label>
                                        <select
                                            className="form-control"
                                            {...register("room_code", {
                                                required:
                                                    "Vui lòng chọn phòng học",
                                            })}
                                            disabled={roomsLoading}
                                        >
                                            <option value="">
                                                Chọn phòng học
                                            </option>
                                            {roomsData &&
                                                roomsData.map((room) => (
                                                    <option
                                                        key={room.cate_code}
                                                        value={room.cate_code}
                                                    >
                                                        {room.cate_name}
                                                    </option>
                                                ))}
                                        </select>
                                        {errors.room_code && (
                                            <p className="text-danger">
                                                {errors.room_code.message}
                                            </p>
                                        )}
                                        {roomsError && (
                                            <p className="text-danger">
                                                Error loading rooms data.
                                            </p>
                                        )}
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
                                        ? "Đang tạo lịch học..."
                                        : "Tạo lịch học này"}
                                </button>
                                <button type="reset" className="btn btn-danger">
                                    Hủy
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>

            {showPopup && responseData && (
                <div
                    className="popup-overlay"
                    onClick={() => setShowPopup(false)}
                >
                    <div className="popup" onClick={(e) => e.stopPropagation()}>
                        <h2>Thông tin lớp học đã lưu</h2>
                        <p>
                            <strong>Tên lớp:</strong> {responseData.class_name}
                        </p>
                        <p>
                            <strong>Mã lớp:</strong> {responseData.class_code}
                        </p>
                        <p>
                            <strong>Số buổi học:</strong>{" "}
                            {responseData.total_sessions}
                        </p>
                        <p>
                            <strong>Môn học:</strong>{" "}
                            {responseData.subject_code}
                        </p>
                        <p>
                            <strong>Phòng học:</strong> {responseData.room_code}
                        </p>
                        <h3>Danh sách ngày học:</h3>
                        <div className="study-dates-container">
                            <ul>
                                {studyDates.map((date) => (
                                    <li key={date}>{date}</li>
                                ))}
                            </ul>
                        </div>
                        <button
                            onClick={handleSaveClassroom}
                            className="btn btn-success mr-5"
                        >
                            Tạo lớp học
                        </button>
                        <button
                            onClick={() => setShowPopup(false)}
                            className="btn btn-danger"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default AddClassroomTest;
