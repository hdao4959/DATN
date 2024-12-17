import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import api from "../../../../config/axios";

const UpdateInformationForm = () => {
    const [selectedOption, setSelectedOption] = useState(""); // Option đã chọn
    const [infoList, setInfoList] = useState([]); // Danh sách thông tin cần cập nhật

    // Gọi API để lấy thông tin cũ
    const { data: studentInfo, isLoading, isError } = useQuery({
        queryKey: ["studentInfo"],
        queryFn: () => api.get("/student/get-info").then((res) => res.data.data), // Trích xuất data từ response
    });

    // Gọi API để cập nhật thông tin
    const mutation = useMutation({
        mutationFn: (payload) =>
            api.post("/student/services/register/dang-ky-thay-doi-thong-tin", payload),
        onSuccess: () => {
            alert("Đăng ký thay đổi thông tin thành công!");
            setInfoList([]); // Reset danh sách sau khi cập nhật thành công
        },
        onError: (error) => {
            if (error.response?.status === 409) {
                alert("Yêu cầu thay đổi thông tin đã tồn tại. Vui lòng chờ xử lý trước khi gửi yêu cầu mới.");
            } else {
                const errorMessage =
                    error.response?.data?.message || "Đã xảy ra lỗi khi cập nhật thông tin!";
                alert(errorMessage);
            }
        },
    });

    if (isLoading) return <div>Đang tải thông tin...</div>;
    if (isError) return <div>Không thể tải thông tin sinh viên. Vui lòng thử lại sau.</div>;

    // Xử lý khi chọn loại thông tin
    const handleOptionChange = (e) => {
        setSelectedOption(e.target.value);
    };

    // Xử lý khi click "Add"
    const handleAddInfo = () => {
        if (
            selectedOption &&
            !infoList.find((item) => item.option === selectedOption) &&
            studentInfo[selectedOption]
        ) {
            const oldInfoMap = {
                full_name: studentInfo.full_name,
                sex: studentInfo.sex,
                date_of_birth: studentInfo.date_of_birth,
                address: studentInfo.address,
                citizen_card_number: studentInfo.citizen_card_number,
            };

            setInfoList([
                ...infoList,
                { option: selectedOption, oldInfo: oldInfoMap[selectedOption], newInfo: "" },
            ]);
            setSelectedOption(""); // Reset option sau khi thêm
        } else {
            alert("Thông tin đã được thêm hoặc không hợp lệ.");
        }
    };

    // Xử lý khi thay đổi thông tin mới
    const handleNewInfoChange = (index, value) => {
        const updatedList = [...infoList];
        updatedList[index].newInfo = value;
        setInfoList(updatedList);
    };

    // Xử lý khi click "Cancel"
    const handleCancel = (index) => {
        const updatedList = infoList.filter((_, i) => i !== index);
        setInfoList(updatedList);
    };

    // Xử lý khi click "Submit"
    const handleSubmit = () => {
        if (infoList.length === 0) {
            alert("Không có thông tin nào để cập nhật.");
            return;
        }

        // Tạo payload
        const payload = {};
        for (const item of infoList) {
            if (!item.newInfo) {
                alert(`Vui lòng nhập thông tin mới cho "${item.option}".`);
                return;
            }
            payload[item.option] = item.newInfo;
        }

        mutation.mutate(payload); // Gọi API để cập nhật
    };

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title mb-4">Cập nhật thông tin</h5>

                    {/* Chọn loại thông tin */}
                    <div className="mb-3 d-flex align-items-end">
                        <div className="flex-grow-1 me-2">
                            <label htmlFor="infoSelect" className="form-label">Chọn thông tin cần cập nhật</label>
                            <select
                                className="form-select"
                                id="infoSelect"
                                onChange={handleOptionChange}
                                value={selectedOption}
                            >
                                <option value="">Chọn thông tin</option>
                                <option value="full_name">Họ và tên</option>
                                <option value="sex">Giới tính</option>
                                <option value="date_of_birth">Ngày sinh</option>
                                <option value="address">Địa chỉ</option>
                                <option value="citizen_card_number">Số căn cước công dân</option>
                            </select>
                        </div>
                        <button type="button" className="btn btn-warning" onClick={handleAddInfo}>
                            Add
                        </button>
                    </div>

                    {/* Danh sách thông tin cần cập nhật */}
                    {infoList.map((item, index) => (
                        <div key={index} className="row mb-3 align-items-end">
                            {/* Thông tin cũ */}
                            <div className="col-md-5">
                                <label className="form-label">Thông tin cũ</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={item.oldInfo || ""}
                                    readOnly
                                />
                            </div>

                            {/* Thông tin mới */}
                            <div className="col-md-5">
                                <label className="form-label">Thông tin mới</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={item.newInfo}
                                    onChange={(e) => handleNewInfoChange(index, e.target.value)}
                                    placeholder="Nhập thông tin mới"
                                />
                            </div>

                            {/* Nút Cancel */}
                            <div className="col-md-2 d-flex justify-content-end">
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => handleCancel(index)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Nút Submit */}
                    <div className="d-flex justify-content-end">
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleSubmit}
                            disabled={mutation.isLoading}
                        >
                            {mutation.isLoading ? "Đang cập nhật..." : "Submit"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateInformationForm;
