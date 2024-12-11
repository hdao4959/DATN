import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../../../config/axios";
import { toast } from "react-toastify";

const ClassRoomDetails = () => {
    const { class_code } = useParams();

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["CLASSROOM_DETAIL", class_code],
        queryFn: async () => {
            const res = await api.get(`/admin/classrooms/${class_code}`);
            if (res.data?.status === false) {
                throw new Error(res.data.message);
            }
            return res.data;
        },
    });

    const {
        data: scheduleData,
        isLoading: isLoadingSchedule,
        isError: isScheduleError,
        error: scheduleError,
    } = useQuery({
        queryKey: ["CLASSROOM_SCHEDULE", class_code],
        queryFn: async () => {
            const res = await api.get(
                `/admin/classrooms/${class_code}/schedules`
            );
            if (res.data?.status === false) {
                throw new Error(res.data.message);
            }
            return res.data;
        },
    });

    const getWeekDay = (dateString) => {
        const date = new Date(dateString);
        const options = { weekday: "long" };
        return date.toLocaleDateString("vi-VN", options);
    };

    if (isLoading || isLoadingSchedule) {
        return <div className="spinner-border" role="status"></div>;
    }

    if (isError) {
        const errorMessage =
            error.response?.data?.message || "Lỗi khi tải thông tin lớp học";
        toast.error(errorMessage);
        return <div className="text-danger">{errorMessage}</div>;
    }

    if (isScheduleError) {
        const errorMessage =
            scheduleError.response?.data?.message || "Lỗi khi tải lịch học";
        toast.error(errorMessage);
        return <div className="text-danger">{errorMessage}</div>;
    }

    const classroom = data?.classroom || {};
    const schedules = scheduleData || [];
    const students = classroom?.students || [];

    if (!classroom || Object.keys(classroom).length === 0) {
        return <div className="text-danger">Không có thông tin lớp học</div>;
    }

    if (students.length === 0) {
        return <div className="text-danger">Không có sinh viên trong lớp</div>;
    }

    return (
        <>
            <div className="card">
                <div className="card-header">
                    <h4>Chi Tiết Lớp Học</h4>
                </div>
                <div className="card-body">
                    <div className="row mb-3">
                        <div className="col-md-4">
                            <strong>Tên lớp học:</strong>{" "}
                            {classroom?.class_name || "Chưa cập nhật"}
                        </div>
                        <div className="col-md-4">
                            <strong>Mã môn học:</strong>{" "}
                            {classroom?.subject_code || "Chưa cập nhật"}
                        </div>
                        <div className="col-md-4">
                            <strong>Môn học:</strong>{" "}
                            {classroom?.subject_name || "Chưa cập nhật"}
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-4">
                            <strong>Ngày bắt đầu:</strong>{" "}
                            {classroom?.date_start
                                ? new Date(
                                      classroom?.date_start
                                  ).toLocaleDateString()
                                : "Chưa cập nhật"}
                        </div>
                        <div className="col-md-4">
                            <strong>Giảng viên:</strong>{" "}
                            {classroom?.teacher_name || "Chưa cập nhật"}
                        </div>
                        <div className="col-md-4">
                            <strong>Mã giảng viên:</strong>{" "}
                            {classroom?.teacher_code || "Chưa cập nhật"}
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-4">
                            <strong>Email giảng viên:</strong>{" "}
                            {classroom?.teacher_email || "Chưa cập nhật"}
                        </div>
                        <div className="col-md-4">
                            <strong>Số điện thoại giảng viên:</strong>{" "}
                            {classroom?.teacher_phone_number || "Chưa cập nhật"}
                        </div>
                        <div className="col-md-4">
                            <strong>Mô tả:</strong>{" "}
                            {classroom?.description || "Không có"}
                        </div>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <h4>Danh Sách Sinh Viên</h4>
                </div>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Mã sinh viên</th>
                            <th>Tên sinh viên</th>
                            <th>Email</th>
                            <th>Số điện thoại</th>
                            <th>Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student, index) => (
                            <tr key={index}>
                                <td>{student?.user_code || "N/A"}</td>
                                <td>{student?.full_name || "N/A"}</td>
                                <td>{student?.email || "N/A"}</td>
                                <td>{student?.phone_number || "N/A"}</td>
                                <td>
                                    {student?.is_active
                                        ? "Hoạt động"
                                        : "Không hoạt động"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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
                                <th>Ca học</th>
                                <th>Phòng học</th>
                                <th>Thời gian</th>
                                <th>Hoạt động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {schedules.map((schedule, index) => {
                                const session = schedule?.session_value
                                    ? JSON.parse(schedule.session_value)
                                    : { start: "N/A", end: "N/A" };
                                const weekDay = schedule?.date
                                    ? getWeekDay(schedule.date)
                                    : "Không xác định";

                                return (
                                    <tr key={index}>
                                        <td>
                                            <div>{weekDay}</div>
                                            <div>
                                                {schedule?.date
                                                    ? new Date(
                                                          schedule.date
                                                      ).toLocaleDateString()
                                                    : "Không có ngày"}
                                            </div>
                                        </td>
                                        <td>
                                            {schedule?.session_name || "N/A"}
                                        </td>
                                        <td>{schedule?.room_name || "N/A"}</td>
                                        <td>
                                            {session.start} - {session.end}
                                        </td>
                                        <td>
                                            {schedule?.type || "Không xác định"}
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
