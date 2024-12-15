import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../config/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ServiceShow = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [reason, setReason] = useState("");
    const [isApproved, setIsApproved] = useState(null);
    const [showReasonInput, setShowReasonInput] = useState(false);

    const { data, isLoading, error } = useQuery({
        queryKey: ["service", id],
        queryFn: async () => {
            const response = await api.get(`admin/services/${id}`);
            return response.data;
        }
    });

    const service = data?.data;
    const student = service?.student;

    const handleApprove = () => {
        setIsApproved(true);
    };

    const handleReject = () => {
        setIsApproved(false);
        setShowReasonInput(true);
    };

    const actionMutation = useMutation({
        mutationFn: async () => {
            const payload = {
                status: isApproved ? "approved" : "rejected",
                reason: isApproved ? null : reason.trim()
            };
            const response = await api.put(`admin/services/changeStatus/${id}`, payload);
            return response.data;
        },
        onSuccess: () => {
            toast.success(`Dịch vụ đã được ${isApproved ? "duyệt" : "từ chối"} thành công!`);
            queryClient.invalidateQueries(["services"]);
            navigate("/sup-admin/services");
        },
        onError: () => {
            toast.error("Có lỗi xảy ra khi xử lý dịch vụ!");
        }
    });

    const handleConfirm = () => {
        if (!isApproved && reason.trim() === "") {
            toast.error("Vui lòng nhập lý do từ chối!");
            return;
        }
        actionMutation.mutate();
    };

    const handleTextareaChange = (e) => setReason(e.target.value);

    if (isLoading) {
        return <div>Đang tải dữ liệu...</div>;
    }

    if (error) {
        return <div>Có lỗi xảy ra khi tải dữ liệu</div>;
    }

    return (
        <div className="container mt-4">
            <ToastContainer />
            <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h5>Chi tiết dịch vụ</h5>
                    <button className="btn btn-secondary" onClick={() => navigate("/sup-admin/services")}>
                        Quay lại
                    </button>
                </div>
                <div className="card-body">
                    {/* Thông tin sinh viên */}
                    <h6 className="mb-3">Thông tin sinh viên</h6>
                    <table className="table table-bordered">
                        <tbody>
                            <tr>
                                <th>Mã sinh viên</th>
                                <td>{student?.user_code}</td>
                            </tr>
                            <tr>
                                <th>Họ và tên</th>
                                <td>{student?.full_name}</td>
                            </tr>
                            <tr>
                                <th>Email</th>
                                <td>{student?.email}</td>
                            </tr>
                            <tr>
                                <th>Số điện thoại</th>
                                <td>{student?.phone_number}</td>
                            </tr>
                            <tr>
                                <th>Địa chỉ</th>
                                <td>{student?.address}</td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Nội dung dịch vụ */}
                    <div
                        className="p-3 border border-primary rounded"
                        style={{
                            backgroundColor: "#f9f9f9",
                            fontSize: "1.1rem",
                            lineHeight: "1.5",
                            whiteSpace: "pre-wrap"
                        }}
                    >
                        <strong>Tên dịch vụ:</strong> {service?.service_name}
                        <br />
                        <strong>Nội dung:</strong>
                        <pre>{service?.content}</pre>
                        <strong>Số tiền:</strong> {service?.amount} VND
                        <br />
                        <strong>Trạng thái:</strong> {service?.status === "pending" ? "Đang xử lý" : "Hoàn thành"}
                    </div>

                    {/* Lý do từ chối */}
                    {!isApproved && showReasonInput && (
                        <div className="mt-4">
                            <textarea
                                className="form-control"
                                placeholder="Nhập lý do từ chối..."
                                value={reason}
                                onChange={handleTextareaChange}
                                rows={3}
                            ></textarea>
                        </div>
                    )}

                    <div className="mt-3 d-flex">
                        <button className={`btn ${isApproved === true ? 'btn-success' : 'btn-outline-success'} me-3`} onClick={handleApprove}>
                            Duyệt dịch vụ
                        </button>
                        <button className={`btn ${isApproved === false ? 'btn-danger' : 'btn-outline-danger'}`} onClick={handleReject}>
                            Từ chối dịch vụ
                        </button>
                    </div>

                    {isApproved !== null && (
                        <div className="mt-4">
                            <button className="btn btn-primary" onClick={handleConfirm}>
                                Xác nhận
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ServiceShow;
