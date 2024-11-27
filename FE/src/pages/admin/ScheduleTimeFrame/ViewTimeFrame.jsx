import React from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../../config/axios";

const ViewTimeFrame = () => {
    // Gọi API để lấy timeframe
    const {
        data: timeFrame,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["timeFrame"],
        queryFn: async () => {
            const response = await api.get(
                "/admin/transfer_schedule_timeframe"
            );
            return response.data;
        },
    });

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
                    Chi tiết khung thời gian
                </h4>
                {timeFrame ? (
                    <table className="table table-bordered">
                        <tbody>
                            <tr>
                                <th>Thời gian bắt đầu</th>
                                <td>{timeFrame.start_time}</td>
                            </tr>
                            <tr>
                                <th>Thời gian kết thúc</th>
                                <td>{timeFrame.end_time}</td>
                            </tr>
                        </tbody>
                    </table>
                ) : (
                    <div className="text-center text-muted">
                        Không có dữ liệu khung thời gian!
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewTimeFrame;
