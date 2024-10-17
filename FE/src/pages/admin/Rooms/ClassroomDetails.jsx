import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../../../config/axios";
import { toast } from "react-toastify";

const ClassRoomDetails = () => {
    const { class_code } = useParams();

    const { data, isLoading, isError } = useQuery({
        queryKey: ["CLASSROOM_DETAIL", class_code],
        queryFn: async () => {
            const res = await api.get(`/admin/classrooms/${class_code}`);
            return res.data;
        },
    });

    if (isLoading) return <div>Loading...</div>;
    if (isError) return toast.error(response.message);

    const classroom = data.classroom;

    return (
        <div className="card">
            <div className="card-header">
                <h4>Chi Tiết Lớp Học</h4>
            </div>
            <div className="card-body">
                <div className="mb-3">
                    <strong>ID:</strong> {classroom.id}
                </div>
                <div className="mb-3">
                    <strong>Mã lớp học:</strong> {classroom.class_code}
                </div>
                <div className="mb-3">
                    <strong>Tên lớp học:</strong> {classroom.class_name}
                </div>
                <div className="mb-3">
                    <strong>Ca học:</strong> {classroom.section}
                </div>
                <div className="mb-3">
                    <strong>Điểm thi:</strong>{" "}
                    {classroom.exam_score ?? "Chưa có"}
                </div>
                <div className="mb-3">
                    <strong>Lịch học:</strong>
                    <div className="d-flex flex-wrap gap-2 mt-2">
                        {classroom.study_schedule?.map((date, index) => (
                            <span
                                key={index}
                                className="border rounded p-2 bg-light"
                            >
                                {date}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="mb-3">
                    <strong>Lịch thi:</strong>{" "}
                    {classroom.exam_schedule ?? "Chưa có"}
                </div>
                <div className="mb-3">
                    <strong>Mô tả:</strong>{" "}
                    {classroom.description ?? "Không có"}
                </div>
                <div className="mb-3">
                    <strong>Ngày bắt đầu:</strong>{" "}
                    {classroom.date_from ?? "Chưa có"}
                </div>
                <div className="mb-3">
                    <strong>Ngày kết thúc:</strong>{" "}
                    {classroom.date_to ?? "Chưa có"}
                </div>
                <div className="mb-3">
                    <strong>Mã phòng:</strong> {classroom.room_code}
                </div>
                <div className="mb-3">
                    <strong>Mã môn học:</strong> {classroom.subject_code}
                </div>
                <div className="mb-3">
                    <strong>Trạng thái:</strong>{" "}
                    {classroom.is_active ? "Đang hoạt động" : "Ngừng hoạt động"}
                </div>
                <div className="mb-3">
                    <strong>Ngày tạo:</strong>{" "}
                    {new Date(classroom.created_at).toLocaleDateString()}
                </div>
                <div className="mb-3">
                    <strong>Ngày cập nhật:</strong>{" "}
                    {new Date(classroom.updated_at).toLocaleDateString()}
                </div>
            </div>
        </div>
    );
};

export default ClassRoomDetails;
