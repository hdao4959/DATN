import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import api from "../../../config/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddSubject = () => {
    const query_client = useQueryClient();
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        getValues,
    } = useForm();

    const { data: score_categories, isLoading: isLoadingScore } = useQuery({
        queryKey: ["score"],
        queryFn: async () => {
            const response = await api.get("/admin/assessment");
            return response?.data;
        },
    });

    const { data: categories, isLoading: isLoadingMajor } = useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const response = await api.get("/listMajorsForForm");
            return response?.data;
        },
    });
    const { data: semesters, isLoading: isLoadingSemesters } = useQuery({
        queryKey: ["semesters"],
        queryFn: async () => {
            const response = await api.get("/listSemestersForForm");
            return response?.data;
        },
    });

    const { mutate } = useMutation({
        mutationFn: async (data) => {
            await api.post(`admin/subjects`, data);
        },
        onSuccess: () => {
            query_client.invalidateQueries(["LIST_SUBJECT"]);
            toast.success("Thêm môn học thành công!");
            reset();
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra");
        },
    });

    const on_submit_form = (data) => {
        const request_data = {
            subject_code: data.subject_code || "",
            subject_name: data.subject_name,
            credit_number: data.credit_number,
            description: data.description,
            tuition: data.tuition,
            re_study_fee: data.re_study_fee,
            major_code: data.major_code,
            semester_code: data.semester_code,
            total_sessions: 40,
            image: data.image[0],
            is_active: data.is_active,
            assessment_items: data.assessment_items,
        };

        mutate(request_data);
    };

    return (
        <>
            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">
                            <div className="card-title text-center">
                                Quản lý Môn Học
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mb-6 mt-2">
                <Link to="/sup-admin/subjects">
                    <button className="btn btn-primary">
                        <i className="fas fa-list"> Danh sách môn học</i>
                    </button>
                </Link>
            </div>
            <form onSubmit={handleSubmit(on_submit_form)}>
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <div className="card-title">Thêm Môn Học</div>
                            </div>
                            <div className="card-body">
                                {isLoadingMajor || isLoadingScore ? (
                                    <div className="loading-spinner">
                                        {/* Hiển thị biểu tượng loading hoặc bất kỳ nội dung tải */}
                                        <p>Đang tải dữ liệu...</p>
                                    </div>
                                ) : (
                                    <div className="row">
                                        <div className="col-md-6">
                                            {/* Mã môn */}
                                            {/* <div className="form-group">
                        <label>Mã Môn:</label>
                        <input
                          type="text"
                          className="form-control"
                          {...register('subject_code', { required: 'Mã môn không được để trống.' })}
                        />
                        {errors.subject_code && <span className="text-danger">{errors.subject_code.message}</span>}
                      </div> */}

                                            {/* Tên môn học */}
                                            <div className="form-group">
                                                <label>Tên Môn Học:</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    {...register(
                                                        "subject_name",
                                                        {
                                                            required:
                                                                "Tên môn không được để trống.",
                                                        }
                                                    )}
                                                />
                                                {errors.subject_name && (
                                                    <span className="text-danger">
                                                        {
                                                            errors.subject_name
                                                                .message
                                                        }
                                                    </span>
                                                )}
                                            </div>

                                            {/* Số tín chỉ */}
                                            <div className="form-group">
                                                <label>Số Tín Chỉ:</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    {...register(
                                                        "credit_number",
                                                        {
                                                            required:
                                                                "Số tín chỉ không được để trống.",
                                                            min: {
                                                                value: 1,
                                                                message:
                                                                    "Số tín chỉ phải lớn hơn 0.",
                                                            },
                                                        }
                                                    )}
                                                />
                                                {errors.credit_number && (
                                                    <span className="text-danger">
                                                        {
                                                            errors.credit_number
                                                                .message
                                                        }
                                                    </span>
                                                )}
                                            </div>

                                            {/* Học phí */}
                                            <div className="form-group">
                                                <label>Học Phí Môn:</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    {...register("tuition", {
                                                        required:
                                                            "Học phí không được để trống.",
                                                    })}
                                                />
                                                {errors.tuition && (
                                                    <span className="text-danger">
                                                        {errors.tuition.message}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Học phí học lại */}
                                            <div className="form-group">
                                                <label>Học Phí Học Lại:</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    {...register(
                                                        "re_study_fee",
                                                        {
                                                            required:
                                                                "Học phí học lại không được để trống.",
                                                        }
                                                    )}
                                                />
                                                {errors.re_study_fee && (
                                                    <span className="text-danger">
                                                        {
                                                            errors.re_study_fee
                                                                .message
                                                        }
                                                    </span>
                                                )}
                                            </div>
                                            <div className="form-group">
                                                <label>Các Đầu Điểm:</label>
                                                {score_categories?.map(
                                                    (headpoint) => (
                                                        <div
                                                            className="form-check"
                                                            key={
                                                                headpoint.assessment_code
                                                            }
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                value={
                                                                    headpoint.assessment_code
                                                                }
                                                                {...register(
                                                                    "assessment_items"
                                                                )}
                                                                className="form-check-input w-5 h-5"
                                                                id={`headpoint-${headpoint.assessment_code}`}
                                                                defaultChecked
                                                            />
                                                            <label
                                                                className="form-check-label"
                                                                htmlFor={`headpoint-${headpoint.assessment_code}`}
                                                            >
                                                                {`${headpoint.name} (Trọng số: ${headpoint.weight})`}
                                                            </label>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            {/* Chuyên ngành */}
                                            <div className="form-group">
                                                <label>Chuyên Ngành:</label>
                                                <select
                                                    className="form-control"
                                                    {...register("major_code", {
                                                        required: true,
                                                    })}
                                                >
                                                    <option value="">
                                                        Chọn chuyên ngành
                                                    </option>
                                                    {categories?.map(
                                                        (major) => (
                                                            <>
                                                                <option
                                                                    key={
                                                                        major.cate_code
                                                                    }
                                                                    value={
                                                                        major.cate_code
                                                                    }
                                                                >
                                                                    {
                                                                        major.cate_name
                                                                    }
                                                                </option>
                                                                {major.childrens?.map(
                                                                    (child) => (
                                                                        <option
                                                                            key={
                                                                                child.cate_code
                                                                            }
                                                                            value={
                                                                                child.cate_code
                                                                            }
                                                                            className="ml-3"
                                                                        >
                                                                            {`-- ${child.cate_name}`}
                                                                        </option>
                                                                    )
                                                                )}
                                                            </>
                                                        )
                                                    )}
                                                </select>
                                                {errors.major_code && (
                                                    <span className="text-danger">
                                                        {
                                                            errors.major_code
                                                                .message
                                                        }
                                                    </span>
                                                )}
                                            </div>

                                            {/* Kỳ học */}
                                            <div className="form-group">
                                                <label>Học kỳ:</label>

                                                <select
                                                    className="form-control"
                                                    {...register(
                                                        "semester_code",
                                                        {
                                                            required:
                                                                "Học kỳ không được để trống.",
                                                        }
                                                    )}
                                                >
                                                    <option value="">
                                                        Chọn kỳ học
                                                    </option>
                                                    {semesters?.map(
                                                        (semester) => (
                                                            <option
                                                                key={
                                                                    semester.cate_code
                                                                }
                                                                value={
                                                                    semester.cate_code
                                                                }
                                                            >
                                                                {
                                                                    semester.cate_name
                                                                }
                                                            </option>
                                                        )
                                                    )}
                                                </select>

                                                {errors.semester_code && (
                                                    <span className="text-danger">
                                                        {
                                                            errors.semester_code
                                                                .message
                                                        }
                                                    </span>
                                                )}
                                            </div>

                                            {/* Số sinh viên */}
                                            <div className="form-group">
                                                <label>Số Buổi học:</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    defaultValue={40}
                                                    {...register(
                                                        "total_sessions"
                                                    )}
                                                    disabled
                                                />
                                            </div>

                                            {/* Ảnh */}
                                            <div className="form-group">
                                                <label>Hình Ảnh:</label>
                                                <input
                                                    type="file"
                                                    className="form-control"
                                                    {...register("image")}
                                                />
                                            </div>

                                            {/* Hoạt động */}
                                            <div className="form-group">
                                                <label>Trạng thái:</label>
                                                <select
                                                    className="form-control"
                                                    {...register("is_active")}
                                                >
                                                    <option value="1">
                                                        Kích hoạt
                                                    </option>
                                                    <option value="0">
                                                        Vô hiệu
                                                    </option>
                                                </select>
                                            </div>
                                            {/* Mô tả */}
                                            <div className="form-group">
                                                <label>Mô Tả:</label>
                                                <textarea
                                                    className="form-control"
                                                    {...register("description")}
                                                />
                                            </div>
                                        </div>
                                        <div className="card-action d-flex justify-content-end gap-x-3">
                                            <button
                                                type="button"
                                                className="btn btn-danger"
                                                onClick={() => reset()}
                                            >
                                                <i className="fas fa-undo">
                                                    {" "}
                                                    Đặt lại
                                                </i>
                                            </button>
                                            <button
                                                type="submit"
                                                className="btn btn-success"
                                            >
                                                <i className="fas fa-plus">
                                                    {" "}
                                                    Thêm
                                                </i>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            <ToastContainer />
        </>
    );
};

export default AddSubject;
