import React, { useState } from "react";

const CreateClassroomWSchedule = () => {
    const [datesList, setDatesList] = useState([
        "2024-10-16",
        "2024-10-21",
        "2024-10-22",
        "2024-10-23",
        "2024-10-28",
        "2024-10-29",
        "2024-10-30",
        "2024-11-04",
        "2024-11-05",
        "2024-11-06",
        "2024-11-11",
        "2024-11-12",
        "2024-11-13",
        "2024-11-18",
        "2024-11-19",
        "2024-11-20",
        "2024-11-25",
        "2024-11-26",
        "2024-11-27",
        "2024-12-02",
        "2024-12-03",
    ]);

    const handleRemoveDate = async (dateToRemove) => {
        try {
            // Gửi yêu cầu xóa ngày lên server
            const response = await axios.post("/api/remove-date", {
                date: dateToRemove,
            });
            // Cập nhật lại danh sách ngày học từ phản hồi của server
            setDatesList(response.data);
        } catch (error) {
            console.error("Lỗi khi xóa ngày:", error);
        }
    };

    return (
        <div>
            <h2>Môn học: 12</h2>
            <h3>Ca học: 3</h3>
            <p>Số buổi học: {datesList.length}</p>

            {/* Danh sách ngày học */}
            <div className="dates-container">
                {datesList.map((date, index) => (
                    <div className="date-box" key={index}>
                        {new Date(date).toLocaleDateString("en-GB")}{" "}
                        {/* Định dạng ngày DD-MM-YYYY */}
                        <button
                            className="remove-button"
                            onClick={() => handleRemoveDate(date)}
                        >
                            X
                        </button>
                    </div>
                ))}
            </div>

            {/* Chọn phòng học */}
            <div className="room-selection">
                <label>Chọn phòng học: </label>
                {["P304", "P305", "P306"].map((room) => (
                    <button className="room-button" key={room}>
                        {room}
                    </button>
                ))}
            </div>

            {/* Nút Lưu */}
            <button
                className="save-button"
                onClick={() => alert("Lịch học đã lưu!")}
            >
                Lưu lịch học
            </button>
        </div>
    );
};

export default CreateClassroomWSchedule;
