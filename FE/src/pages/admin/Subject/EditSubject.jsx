<<<<<<< Updated upstream
import React, { useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
=======


import React, { useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
>>>>>>> Stashed changes

const EditSubject = ({ subject, handleClose }) => {
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        if (subject) {
            reset(subject);
        }
    }, [subject, reset]);

    const mutation = useMutation({
        mutationFn: async (data) => {
            await axios.put(
                `http://localhost:8000/api/admin/subjects/${subject.id}`,
                data
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["subjects"]);
            handleClose();
            alert("Cập nhật môn học thành công!");
        },
        onError: (error) => {
            console.error("Lỗi khi cập nhật môn học:", error);
            alert("Có lỗi xảy ra khi cập nhật môn học!");
        },
    });

    const onSubmit = (data) => {
        mutation.mutate(data);
    };

    return (
        <div>
            <div className="modal-header d-flex justify-content-between align-items-center">
                <h5 className="modal-title flex-grow-1 text-center">
                    Sửa Môn Học
                </h5>
                <button type="button" className="close" onClick={handleClose}>
                    <div
                        className="bg-red-500"
                        style={{ padding: "10px", borderRadius: "20%" }}
                    >
                        <span>&times;</span>
                    </div>
                </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="modal-body">
                    <div className="form-group">
                        <label>Mã Môn:</label>
                        <input
                            type="text"
                            className="form-control"
                            {...register("subjectCode", {
                                required: "Mã môn không được để trống.",
                            })}
                        />
                        {errors.subjectCode && (
                            <span className="text-danger">
                                {errors.subjectCode.message}
                            </span>
                        )}
                    </div>
                    <div className="form-group">
                        <label>Tên Môn Học:</label>
                        <input
                            type="text"
                            className="form-control"
                            {...register("subjectName", {
                                required: "Tên môn không được để trống.",
                            })}
                        />
                        {errors.subjectName && (
                            <span className="text-danger">
                                {errors.subjectName.message}
                            </span>
                        )}
                    </div>
                    <div className="form-group">
                        <label>Số Tín Chỉ:</label>
                        <input
                            type="number"
                            className="form-control"
                            {...register("creditNumber", {
                                required: "Số tín chỉ không được để trống.",
                                min: {
                                    value: 1,
                                    message: "Số tín chỉ phải lớn hơn 0.",
                                },
                            })}
                        />
                        {errors.creditNumber && (
                            <span className="text-danger">
                                {errors.creditNumber.message}
                            </span>
                        )}
                    </div>
                    <div className="form-group">
                        <label>Mô Tả:</label>
                        <textarea
                            className="form-control"
                            {...register("description")}
                        />
                    </div>
                    <div className="form-group">
                        <label>Học Phí Môn:</label>
                        <input
                            type="number"
                            className="form-control"
                            {...register("tuition", {
                                required: "Học phí không được để trống.",
                            })}
                        />
                        {errors.tuition && (
                            <span className="text-danger">
                                {errors.tuition.message}
                            </span>
                        )}
                    </div>
                    <div className="form-group">
                        <label>Học Phí Học Lại:</label>
                        <input
                            type="number"
                            className="form-control"
                            {...register("reStudyFee", {
                                required:
                                    "Học phí học lại không được để trống.",
                            })}
                        />
                        {errors.reStudyFee && (
                            <span className="text-danger">
                                {errors.reStudyFee.message}
                            </span>
                        )}
                    </div>
                    <div className="form-group">
                        <label>Chuyên Ngành:</label>
                        <input
                            type="text"
                            className="form-control"
                            {...register("majorCode", {
                                required: "Chuyên ngành không được để trống.",
                            })}
                        />
                        {errors.majorCode && (
                            <span className="text-danger">
                                {errors.majorCode.message}
                            </span>
                        )}
                    </div>
                    <div className="form-group">
                        <label>Kì Học:</label>
                        <input
                            type="text"
                            className="form-control"
                            {...register("semestersCode", {
                                required: "Kì học không được để trống.",
                            })}
                        />
                        {errors.semestersCode && (
                            <span className="text-danger">
                                {errors.semestersCode.message}
                            </span>
                        )}
                    </div>
                </div>
                <div className="modal-footer">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={handleClose}
                    >
                        Đóng
                    </button>
                    <button type="submit" className="btn btn-primary">
                        Sửa
                    </button>
                </div>
            </form>
        </div>
    );
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
};

export default EditSubject;
