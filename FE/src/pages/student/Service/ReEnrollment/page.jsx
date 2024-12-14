import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "./../../../../config/axios";
import { toast } from "react-toastify";

const ReEnrollmentForm = () => {
    const [selectedCourse, setSelectedCourse] = useState();
    const [amount, setAmount] = useState(0);
    const { data: ListLearnAgain } = useQuery({
        queryKey: ["LIST_LEARNAGAIN"],
        queryFn: async () => {
            const res = await api.get("student/services/getListLearnAgain");
            return res.data.data;
        },
    });

    const { mutate, isLoading } = useMutation({
        mutationFn: async () => {
            const response = await api.post("student/services/learn-again", {
                subject_code: selectedCourse, // Gửi mã môn học
            });
            return response.data;
        },
        onSuccess: async (data) => {
            toast.success("Dịch vụ đăng ký học lại thành công");
            const redirectUrl = `student/send-email/learn-again/${data.service.id}`;
            try {
                const emailResponse = await api.post(redirectUrl, {
                    subject_code: selectedCourse,
                });
                setAmount(0);
                toast.success("Gửi email thành công");
            } catch (emailError) {
                console.error("Có lỗi khi gửi email:", emailError);
                toast.error("Có lỗi khi gửi email");
            }
        },
        onError: (error) => {
            console.error("Có lỗi xảy ra:", error);
            toast.error("Có lỗi xảy ra");
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedCourse) {
            mutate();
        }
    };

    return (
        <div className="container">
            <div className="card">
                <div className="card-header">
                    <h4>Thông tin đăng ký học lại</h4>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit} className="mt-4">
                        <table className="table">
                            <tbody>
                                <tr>
                                    <td>
                                        <strong>Chọn môn học lại</strong>
                                    </td>
                                    <td>
                                        <select
                                            id="course"
                                            className="form-control"
                                            value={selectedCourse}
                                            onChange={(e) => {
                                                const selectedSubjectCode =
                                                    e.target.value;
                                                setSelectedCourse(
                                                    selectedSubjectCode
                                                );

                                                const selectedSubject =
                                                    ListLearnAgain.find(
                                                        (LearnAgain) =>
                                                            LearnAgain?.subject
                                                                ?.subject_code ===
                                                            selectedSubjectCode
                                                    );

                                                if (selectedSubject) {
                                                    setAmount(
                                                        selectedSubject?.subject
                                                            ?.re_study_fee || 0
                                                    );
                                                }
                                            }}
                                        >
                                            <option value="">
                                                Lựa chọn môn học lại
                                            </option>
                                            {ListLearnAgain?.map(
                                                (LearnAgain) => (
                                                    <option
                                                        key={
                                                            LearnAgain.subject_code
                                                        }
                                                        value={
                                                            LearnAgain?.subject
                                                                ?.subject_code
                                                        }
                                                    >
                                                        {
                                                            LearnAgain?.subject
                                                                ?.subject_name
                                                        }
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </td>
                                </tr>

                                <tr>
                                    <td>
                                        <strong>Số tiền</strong>
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            id="amount"
                                            className="form-control"
                                            value={`${new Intl.NumberFormat(
                                                "vi-VN"
                                            ).format(amount)} đ`}
                                            placeholder="Nhập số tiền"
                                            disabled
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <button type="submit" className="btn btn-primary">
                            Đăng ký
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ReEnrollmentForm;
