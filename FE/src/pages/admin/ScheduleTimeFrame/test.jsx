import React from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../../config/axios";

const ViewTimeFrame = () => {
    const {
        data: timeFrames,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["timeFrames"],
        queryFn: async () => {
            const response = await api.get(
                "/admin/transfer_schedule_timeframe"
            );
            return response.data;
        },
    });

    console.log(timeFrames.start_time);

    if (isLoading) {
        return (
            <div
                className="d-flex justify-content-center align-items-center"
                style={{ height: "100vh" }}
            >
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-danger text-center mt-4">
                Lỗi khi tải dữ liệu!
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <div className="card p-4 shadow">
                <h4 className="card-title text-center mb-4">
                    Khung thời gian hiện tại
                </h4>
                {timeFrames?.length > 0 ? (
                    <ul className="list-group">
                        <li key={index} className="list-group-item">
                            <strong>Thời gian bắt đầu:</strong>{" "}
                            {timeFrames.start_time} <br />
                            <strong>Thời gian kết thúc:</strong>{" "}
                            {timeFrames.end_time}
                        </li>
                    </ul>
                ) : (
                    <div className="text-center text-muted">
                        Không có khung thời gian nào!
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewTimeFrame;
