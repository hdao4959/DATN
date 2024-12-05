import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "./../../../../config/axios";
import { toast } from "react-toastify";

const ReEnrollmentForm = () => {
    const [selectedCourse, setSelectedCourse] = useState();
    const [amount, setAmount] = useState(0);
    const [note, setNote] = useState("");
    const { data: ListLearnAgain, refetch } = useQuery({
        queryKey: ["LIST_LEARNAGAIN"],
        queryFn: async () => {
            const res = await api.get("student/services/getListLearnAgain");
            return res.data.data;
        },
    });
    console.log(ListLearnAgain);
    // Sử dụng useMutation để gọi API khi người dùng gửi biểu mẫu
    const { mutate, isLoading, error } = useMutation({
        mutationFn: async () => {
            const response = await api.post("student/services/learn-again", {
                subject_code: selectedCourse,  // Gửi mã môn học
            });
            return response.data;
        },
        onSuccess:async  (data) => {
            toast.success('Dịch vụ đăng ký học lại thành công');
            console.log("Dịch vụ đăng ký học lại thành công:", data);
            const redirectUrl = `student/send-email/learn-again/${data.service.id}`;
            try {
                const emailResponse = await api.post(redirectUrl, {
                    subject_code: selectedCourse,  // Truyền subject_code
                });
                console.log("Gửi email thành công:", emailResponse.data);
                toast.success("Gửi email thành công");
            } catch (emailError) {
                console.error("Có lỗi khi gửi email:", emailError);
                toast.error("Có lỗi khi gửi email");
            }

        },
        onError: (error) => {
            console.error("Có lỗi xảy ra:", error);
            toast.error('Có lỗi xảy ra');

        },
    });
    // const courses = [
    //     { subject_code: 'SUB001', subject_name: "Lập trình Web", re_study_fee: 50000 },
    //     { subject_code: 'SUB002', subject_name: "Mạng máy tính", re_study_fee: 60000 },
    //     { subject_code: 'SUB003', subject_name: "Cơ sở dữ liệu", re_study_fee: 70000 },
    // ];

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Đăng ký học lại", { selectedCourse, amount });
        if (selectedCourse) {
            // Gọi API khi gửi biểu mẫu
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
                    {/* Hiển thị thông tin trên */}
                    <div className="row">
                        <div className="col-md-3">
                            <strong>Loại dịch vụ:</strong> Đăng kí học lại
                        </div>
                        <div className="col-md-3">
                            <strong>Số dư ví:</strong> 500.000 VND
                        </div>
                        <div className="col-md-3">
                            <strong>Kỳ học hiện tại:</strong> Kỳ 2, 2024
                        </div>
                        <div className="col-md-3">
                            <strong>Ngành học:</strong> Công nghệ thông tin
                        </div>
                    </div>

                    {/* Form đăng ký học lại */}
                    <form onSubmit={handleSubmit} className="mt-4">
                        <table className="table">
                            <tbody>
                                <tr>
                                    <td><strong>Chọn môn học lại</strong></td>
                                    <td>
                                        <select
                                            id="course"
                                            className="form-control"
                                            value={selectedCourse}
                                            onChange={(e) => {
                                                const selectedSubjectCode = e.target.value;
                                                setSelectedCourse(selectedSubjectCode);

                                                // Tìm môn học trong ListLearnAgain dựa trên subject_code
                                                const selectedSubject = ListLearnAgain.find(
                                                    (LearnAgain) => LearnAgain?.subject?.subject_code === selectedSubjectCode
                                                );

                                                // Cập nhật số tiền học lại (re_study_fee) của môn học đã chọn
                                                if (selectedSubject) {
                                                    setAmount(selectedSubject?.subject?.re_study_fee || 0);
                                                }
                                            }}
                                        >
                                            <option value="">Lựa chọn môn học lại</option>
                                            {ListLearnAgain?.map((LearnAgain) => (
                                                <option key={LearnAgain.subject_code} value={LearnAgain?.subject?.subject_code}>
                                                    {LearnAgain?.subject?.subject_name}
                                                </option>
                                            ))}
                                        </select>

                                    </td>
                                </tr>

                                <tr>
                                    <td><strong>Số tiền</strong></td>
                                    <td>
                                        <input
                                            type="text"
                                            id="amount"
                                            className="form-control"
                                            value={amount}
                                            placeholder="Nhập số tiền"
                                            disabled
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <button type="submit" className="btn btn-primary">Đăng ký</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ReEnrollmentForm;
