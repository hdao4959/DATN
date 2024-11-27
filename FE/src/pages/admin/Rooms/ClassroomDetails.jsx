import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../../../config/axios";
import { toast } from "react-toastify";
import { getToken } from "../../../utils/getToken";

const ClassRoomDetails = () => {
    const { class_code } = useParams();
    const accessToken = getToken();

    // Lấy thông tin lớp học
    const { data, isLoading, isError } = useQuery({
        queryKey: ["CLASSROOM_DETAIL", class_code],
        queryFn: async () => {
            const res = await api.get(`/admin/classrooms/${class_code}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            });
            return res.data;
        },
    });

    // Lấy thông tin lịch học của lớp học
    const {
        data: scheduleData,
        isLoading: isLoadingSchedule,
        isError: isScheduleError,
    } = useQuery({
        queryKey: ["CLASSROOM_SCHEDULE", class_code],
        queryFn: async () => {
            const res = await api.get(
                `/admin/classrooms/${class_code}/schedules`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            return res.data;
        },
    });

    if (isLoading || isLoadingSchedule)
        return <div className="spinner-border" role="status"></div>;
    if (isError) return toast.error("Lỗi khi tải thông tin lớp học");
    if (isScheduleError) return toast.error("Lỗi khi tải lịch học");

    const classroom = data.classroom;
    const schedules = scheduleData || [];

    return (
        <>
            <div className="card">
                <div className="card-header">
                    <h4>Chi Tiết Lớp Học</h4>
                </div>
                <div className="card-body">
                    {/* Thông tin lớp học */}
                    <div className="mb-3">
                        <strong>ID:</strong> {classroom.class_code}
                    </div>
                    <div className="mb-3">
                        <strong>Mã lớp học:</strong> {classroom.class_code}
                    </div>
                    <div className="mb-3">
                        <strong>Tên lớp học:</strong> {classroom.class_name}
                    </div>
                    <div className="mb-3">
                        <strong>Mô tả:</strong>{" "}
                        {classroom.description ?? "Không có"}
                    </div>
                    <div className="mb-3">
                        <strong>Mã môn học:</strong>{" "}
                        {classroom.subject.subject_code}
                    </div>
                    <div className="mb-3">
                        <strong>Môn học:</strong>{" "}
                        {classroom.subject.subject_name}
                    </div>
                    <div className="mb-3">
                        <strong>Ngày tạo:</strong>{" "}
                        {new Date(classroom.created_at).toLocaleDateString()}
                    </div>
                    <div className="mb-3">
                        <strong>Giảng viên:</strong>{" "}
                        {classroom.teacher
                            ? classroom.teacher.full_name
                            : "Chưa cập nhật"}
                    </div>
                    <div className="mb-3">
                        <strong>Mã giảng viên:</strong>{" "}
                        {classroom.teacher
                            ? classroom.teacher.user_code
                            : "Chưa cập nhật"}
                    </div>
                </div>
            </div>
            <div className="card">
                <div className="card-header">
                    <h4>Lịch học</h4>
                </div>
                {schedules.length > 0 ? (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Ngày</th>
                                <th>Tên lớp</th>
                                <th>Ca học</th>
                                <th>Phòng học</th>
                                <th>Thời gian</th>
                            </tr>
                        </thead>
                        <tbody>
                            {schedules.map((schedule, index) => {
                                const session = JSON.parse(
                                    schedule.session.value
                                );
                                return (
                                    <tr key={index}>
                                        <td>
                                            {new Date(
                                                schedule.date
                                            ).toLocaleDateString()}
                                        </td>
                                        <td>{schedule.classroom.cate_name}</td>
                                        <td>{schedule.session.cate_name}</td>
                                        <td>{schedule.room.cate_name}</td>
                                        <td>
                                            {session.start} - {session.end}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                ) : (
                    <p className="card-footer text-danger">Không có lịch học</p>
                )}
            </div>
        </>
    );
};

export default ClassRoomDetails;
