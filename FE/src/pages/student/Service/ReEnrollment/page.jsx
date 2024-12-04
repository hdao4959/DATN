import React, { useState } from "react";

const ReEnrollmentForm = () => {
    const [selectedCourse, setSelectedCourse] = useState("");
    const [amount, setAmount] = useState(0);
    const [note, setNote] = useState("");

    const courses = [
        { subject_code: 'SUB001', subject_name: "Lập trình Web", re_study_fee: 50000 },
        { subject_code: 'SUB002', subject_name: "Mạng máy tính", re_study_fee: 60000 },
        { subject_code: 'SUB003', subject_name: "Cơ sở dữ liệu", re_study_fee: 70000 },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Đăng ký học lại", { selectedCourse, amount, note });
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
                                            onChange={(e) => setSelectedCourse(e.target.value)}
                                        >
                                            <option value="">Lựa chọn môn học lại</option>
                                            {courses.map((course) => (
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
