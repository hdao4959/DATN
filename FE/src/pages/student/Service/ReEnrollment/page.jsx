import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";

const ReEnrollmentForm = () => {
    const [selectedCourse, setSelectedCourse] = useState("");
    const [amount, setAmount] = useState(0);
    const [note, setNote] = useState("");

    const { data: courses, isLoading, refetch } = useQuery({
        queryKey: ["LIST_COURSES"],
        queryFn: async () => {
            // const res = await api.get(`/student/re-enrollment`);
            // return res?.data?.subject;

            const coursesData = [
                { subject_code: 'SUB001', subject_name: "Lập trình Web", re_study_fee: 50000 },
                { subject_code: 'SUB002', subject_name: "Mạng máy tính", re_study_fee: 60000 },
                { subject_code: 'SUB003', subject_name: "Cơ sở dữ liệu", re_study_fee: 70000 },
            ];
            return coursesData;
        }
    });

    const { mutate } = useMutation({
        mutationFn: async () => {
            await api.put(`/student/re-enrollment/${selectedCourse}`);
        },
        onSuccess: () => {
            toast.success("Chỉnh sửa thành công!");
        },
        onError: (error) => {
            toast.error("Có lỗi xảy ra");
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        mutate();
        console.log("Đăng ký học lại", { selectedCourse, amount, note });
    };

    useEffect(() => {
        if(selectedCourse) {
            const reStudyFee = courses.find((course) => course.subject_code === selectedCourse).re_study_fee;
            setAmount(reStudyFee);
        }
    }, [selectedCourse])
    return (
        <div className="container">
            <div className="card">
                <div className="card-header">
                    <h4>Đăng ký học lại</h4>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <table className="table">
                            <tbody>
                                <tr>
                                    <td><strong>Chọn môn học lại</strong></td>
                                    <td>
                                        <select
                                            id="course"
                                            className="form-control"
                                            value={selectedCourse}
                                            onChange={(e) => setSelectedCourse(e.target.value)}
                                        >
                                            <option value="">Lựa chọn môn học lại</option>
                                            {courses?.map((course) => (
                                                <option key={course.subject_code} value={course.subject_code}>
                                                    {course.subject_name}
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
                                            // onChange={(e) => setAmount(e.target.value)}
                                            placeholder="Nhập số tiền"
                                        />
                                    </td>
                                </tr>

                                <tr>
                                    <td><strong>Trường hợp không xếp được lớp</strong></td>
                                    <td>
                                        <div>
                                            <input
                                                type="radio"
                                                id="refund"
                                                name="action"
                                                value="refund"
                                                onChange={() => setNote("Hủy đăng ký và hoàn lại 100% học phí")}
                                            />
                                            <label htmlFor="refund">Hủy đăng ký và hoàn lại 100% học phí</label>
                                        </div>
                                        <div>
                                            <input
                                                type="radio"
                                                id="defer"
                                                name="action"
                                                value="defer"
                                                onChange={() => setNote("Bảo lưu đăng ký, đợi xếp lớp trong các kỳ tiếp theo")}
                                            />
                                            <label htmlFor="defer">Bảo lưu đăng ký, đợi xếp lớp trong các kỳ tiếp theo</label>
                                        </div>
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
