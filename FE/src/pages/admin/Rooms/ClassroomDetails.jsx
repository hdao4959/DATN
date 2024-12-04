import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../../../config/axios";
import { toast } from "react-toastify";
import { getToken } from "../../../utils/getToken";

const ClassRoomDetails = () => {
    const { class_code } = useParams();
    const { data, isLoading, isError } = useQuery({
        queryKey: ["CLASSROOM_DETAIL", class_code],
        queryFn: async () => {
            const res = await api.get(`/admin/classrooms/${class_code}`);
            return res.data;
        },
    });

    const getWeekDay = (dateString) => {
        const date = new Date(dateString);
        const options = { weekday: "long" };
        return date.toLocaleDateString("vi-VN", options);
    };
    const {
        data: scheduleData,
        isLoading: isLoadingSchedule,
        isError: isScheduleError,
    } = useQuery({
        queryKey: ["CLASSROOM_SCHEDULE", class_code],
        queryFn: async () => {
            const res = await api.get(
                `/admin/classrooms/${class_code}/schedules`
            );
            return res.data;
        },
    });

    if (isLoading || isLoadingSchedule) {
        return <div className="spinner-border" role="status"></div>;
    }

    if (isError) {
        toast.error("Lỗi khi tải thông tin lớp học");
        return <div className="text-danger">Lỗi khi tải thông tin lớp học</div>;
    }

    if (isScheduleError) {
        toast.error("Lỗi khi tải lịch học");
        return <div className="text-danger">Lỗi khi tải lịch học</div>;
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
                    {/* <div className="row mb-3">
                        <div className="col-md-4">
                            <strong>Tên lớp học:</strong>{" "}
                            {classroom.class_name || "Chưa cập nhật"}
                        </div>
                    </div> */}

                    <div className="row mb-3">
                        {/* <div className="col-md-4">
                            <strong>Mô tả:</strong>{" "}
                            {classroom.description || "Không có"}
                        </div> */}
                        <div className="col-md-4">
                            <strong>Tên lớp học:</strong>{" "}
                            {classroom.class_name || "Chưa cập nhật"}
                        </div>
                        <div className="col-md-4">
                            <strong>Mã môn học:</strong>{" "}
                            {classroom.subject_code || "Chưa cập nhật"}
                        </div>
                        <div className="col-md-4">
                            <strong>Môn học:</strong>{" "}
                            {classroom.subject_name || "Chưa cập nhật"}
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-4">
                            <strong>Ngày bắt đầu:</strong>{" "}
                            {classroom.date_start
                                ? new Date(
                                      classroom.date_start
                                  ).toLocaleDateString()
                                : "Chưa cập nhật"}
                        </div>
                        <div className="col-md-4">
                            <strong>Giảng viên:</strong>{" "}
                            {classroom.teacher_name ?? "Chưa cập nhật"}
                        </div>
                        <div className="col-md-4">
                            <strong>Mã giảng viên:</strong>{" "}
                            {classroom.teacher_code ?? "Chưa cập nhật"}
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-4">
                            <strong>Email giảng viên:</strong>{" "}
                            {classroom.teacher_email ?? "Chưa cập nhật"}
                        </div>
                        <div className="col-md-4">
                            <strong>Số điện thoại giảng viên:</strong>{" "}
                            {classroom.teacher_phone_number ?? "Chưa cập nhật"}
                        </div>
                        <div className="col-md-4">
                            <strong>Mô tả:</strong>{" "}
                            {classroom.description || "Không có"}
                        </div>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <h4>Danh Sách Sinh Viên</h4>
                </div>
                {students.length > 0 ? (
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
                                    <td>{student.user_code}</td>
                                    <td>{student.full_name}</td>
                                    <td>{student.email}</td>
                                    <td>{student.phone_number}</td>
                                    <td>
                                        {student.is_active
                                            ? "Hoạt động"
                                            : "Không hoạt động"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="card-footer text-danger">
                        Không có sinh viên trong lớp
                    </p>
                )}
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
                                const session = JSON.parse(
                                    schedule.session_value
                                );
                                const weekDay = getWeekDay(schedule.date);

                                return (
                                    <tr key={index}>
                                        <td>
                                            <div>{weekDay}</div>{" "}
                                            <div>
                                                {new Date(
                                                    schedule.date
                                                ).toLocaleDateString()}
                                            </div>{" "}
                                        </td>
                                        <td>{schedule.session_name}</td>
                                        <td>{schedule.room_name}</td>
                                        <td>
                                            {session.start} - {session.end}
                                        </td>
                                        <td>{schedule.type}</td>
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
