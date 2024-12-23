import React, { useState, useEffect } from "react";
import api from "../../../config/axios";
import { toast } from "react-toastify";
import "/src/css/multiStep.css";
import { useNavigate } from "react-router-dom";

const AddClassroom = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [resForm1, setResForm1] = useState(null);
    const [formData, setFormData] = useState({
        course_code: "",
        semester_code: "",
        major_code: "",
        major_sub_code: "",
        subject_code: "",
        session_code: "",
        date_from: "",
        day_type: "",
        list_study_dates: [],
        room_code: "",
        teacher_code: "",
        student_codes: [],
    });

    const [courses, setCourses] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [majors, setMajors] = useState([]);
    const [childrenMajors, setChildrenMajors] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [roomsAndTeachers, setRoomsAndTeachers] = useState([]);
    const [students, setStudents] = useState([]);

    useEffect(() => {
        fetchCourses();
        fetchSemesters();
        fetchMajors();
        fetchSessions();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await api.get("/listCoursesForForm");
            setCourses(response.data);
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    "Không thể tải danh sách khóa học."
            );
        }
    };

    const fetchSemesters = async () => {
        try {
            const response = await api.get("/listSemestersForForm");
            setSemesters(response.data);
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    "Không thể tải danh sách kỳ học."
            );
        }
    };

    const fetchMajors = async () => {
        try {
            const response = await api.get("/listParentMajorsForForm");
            setMajors(response.data);
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    "Không thể tải danh sách chuyên ngành."
            );
        }
    };

    const fetchChildrenMajors = async (majorCode) => {
        try {
            const response = await api.get(
                `/listChildrenMajorsForForm/${majorCode}`
            );
            setChildrenMajors(response.data);
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    "Không thể tải danh sách chuyên ngành hẹp."
            );
        }
    };

    const fetchSubjects = async (semesterCode, majorCode) => {
        try {
            const response = await api.get(
                `/subjects/${semesterCode}/${majorCode}`
            );
            setSubjects(response.data);
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    "Không thể tải danh sách môn học."
            );
            setSubjects([]);
        }
    };
    const fetchSessions = async () => {
        try {
            const response = await api.get(`/listSessionsForForm`);
            setSessions(response.data);
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    "Không thể tải danh sách ca học."
            );
        }
    };

    const fetchSchedules = async () => {
        try {
            const response = await api.admin.classrooms.renderSchedules({
                course_code: formData.course_code,
                subject_code: formData.subject_code,
                major_code: formData.major_code,
                session_code: formData.session_code,
                date_from: formData.date_from,
                day_type: formData.day_type,
            });
            setFormData((prev) => ({
                ...prev,
                list_study_dates: response.data,
            }));
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Không thể tạo lịch học."
            );
        }
    };

    const fetchRoomsAndTeachers = async () => {
        try {
            const response = await api.admin.classrooms.renderRoomsAndTeachers({
                session_code: formData.session_code,
                major_code: formData.major_code,
                list_study_dates: formData.list_study_dates,
            });
            setRoomsAndTeachers(response.data);
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    "Không thể tải phòng học và giảng viên."
            );
        }
    };

    const fetchStudents = async () => {
        try {
            const response = await api.admin.classrooms.getStudents({
                course_code: formData.course_code,
                subject_code: formData.subject_code,
                session_code: formData.session_code,
                room_code: formData.room_code,
                teacher_code: formData.teacher_code,
                list_study_dates: formData.list_study_dates,
            });
            setStudents(response.data);
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    "Không thể tải danh sách sinh viên."
            );
        }
    };

    const handleChange = (e, field) => {
        const value = e.target.value;
        setFormData((prev) => ({ ...prev, [field]: value }));

        if (field === "major_code") {
            setFormData((prev) => ({
                ...prev,
                major_sub_code: "",
                subject_code: "",
            }));
            fetchChildrenMajors(value);
        }

        if (field === "major_sub_code") {
            setFormData((prev) => ({ ...prev, subject_code: "" }));
        }

        if (
            field === "semester_code" ||
            field === "major_code" ||
            field === "major_sub_code"
        ) {
            const { semester_code, major_code, major_sub_code } = {
                ...formData,
                [field]: value,
            };

            const effectiveMajorCode = major_sub_code || major_code;
            if (semester_code && effectiveMajorCode) {
                fetchSubjects(semester_code, effectiveMajorCode);
            }
        }
    };
    const handleForm2Change = async (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));

        const updatedFormData = { ...formData, [field]: value };

        if (
            updatedFormData.course_code &&
            updatedFormData.subject_code &&
            updatedFormData.major_code &&
            updatedFormData.session_code &&
            updatedFormData.date_from &&
            updatedFormData.day_type
        ) {
            try {
                const scheduleResponse = await api.post(
                    "/admin/classrooms/renderSchedules",
                    {
                        course_code: updatedFormData.course_code,
                        subject_code: updatedFormData.subject_code,
                        major_code: updatedFormData.major_code,
                        session_code: updatedFormData.session_code,
                        date_from: updatedFormData.date_from,
                        day_type: updatedFormData.day_type,
                    }
                );
                const listStudyDates = scheduleResponse.data;

                setFormData((prev) => ({
                    ...prev,
                    list_study_dates: listStudyDates,
                }));

                const roomsAndTeachersResponse = await api.post(
                    "/admin/classrooms/renderRoomsAndTeachers",
                    {
                        session_code: updatedFormData.session_code,
                        major_code: updatedFormData.major_code,
                        list_study_dates: listStudyDates,
                    }
                );
                setRoomsAndTeachers(roomsAndTeachersResponse.data);
            } catch (error) {
                setFormData((prev) => ({ ...prev, list_study_dates: [] }));
                setRoomsAndTeachers([]);
                toast.error(
                    error.response?.data?.message ||
                        "Lỗi khi tạo lịch học. Lịch cũ đã bị xóa."
                );
            }
        }
    };

    const handleNext = async () => {
        try {
            if (currentStep === 1) {
                const res = await api.post("/admin/classrooms/handleStep1", {
                    course_code: formData.course_code,
                    semester_code: formData.semester_code,
                    major_code: formData.major_code,
                    major_sub_code: formData.major_sub_code,
                    subject_code: formData.subject_code,
                });
                setResForm1(res.data);
            } else if (currentStep === 2) {
                const response = await api.post(
                    "/admin/classrooms/handleStep2",
                    {
                        course_code: formData.course_code,
                        subject_code: formData.subject_code,
                        major_code: formData.major_code,
                        session_code: formData.session_code,
                        date_from: formData.date_from,
                        day_type: formData.day_type,
                        list_study_dates: formData.list_study_dates,
                        room_code: formData.room_code,
                        teacher_code: formData.teacher_code,
                    }
                );

                if (response.data) {
                    setStudents(response.data);
                    setFormData((prev) => ({
                        ...prev,
                        student_codes: response.data.map((s) => s.user_code),
                    }));
                }
            }
            setCurrentStep((prev) => prev + 1);
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    "Đã xảy ra lỗi khi xử lý bước tiếp theo."
            );
        }
    };
    const handlePrev = () => {
        if (currentStep == 1) {
            setCurrentStep(navigate("/sup-admin/classrooms"));
        } else {
            setCurrentStep((prev) => prev - 1);
        }
    };

    const handleSubmit = async () => {
        try {
            await api.post("/admin/classrooms", formData);
            toast.success("Tạo lớp học thành công!");
            navigate("/sup-admin/classrooms");
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Không thể tạo lớp học."
            );
        }
    };

    const renderForm1 = () => (
        <div className="container mt-4">
            <div className="card shadow">
                <div className="card-header bg-primary text-white">
                    <h3>1. Thông tin chung</h3>
                </div>
                <div className="card-body">
                    <div className="mb-3">
                        <label className="form-label">Khóa học</label>
                        <select
                            className="form-select"
                            value={formData.course_code}
                            onChange={(e) => handleChange(e, "course_code")}
                        >
                            <option disabled value="">
                                Chọn khóa học
                            </option>
                            {courses.map((course) => (
                                <option
                                    key={course.cate_code}
                                    value={course.cate_code}
                                >
                                    {course.cate_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Kỳ học</label>
                        <select
                            className="form-select"
                            value={formData.semester_code}
                            onChange={(e) => handleChange(e, "semester_code")}
                        >
                            <option disabled value="">
                                Chọn kì học
                            </option>
                            {semesters.map((semester) => (
                                <option
                                    key={semester.cate_code}
                                    value={semester.cate_code}
                                >
                                    {semester.cate_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Chuyên ngành</label>
                        <select
                            className="form-select"
                            value={formData.major_code}
                            onChange={(e) => handleChange(e, "major_code")}
                        >
                            <option disabled value="">
                                Chọn chuyên ngành
                            </option>
                            {majors.map((major) => (
                                <option
                                    key={major.cate_code}
                                    value={major.cate_code}
                                >
                                    {major.cate_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    {childrenMajors.length > 0 && (
                        <div className="mb-3">
                            <label className="form-label">
                                Chuyên ngành hẹp
                            </label>
                            <select
                                className="form-select"
                                value={formData.major_sub_code}
                                onChange={(e) =>
                                    handleChange(e, "major_sub_code")
                                }
                            >
                                <option disabled value="">
                                    Chọn chuyên ngành hẹp
                                </option>
                                {childrenMajors.map((major) => (
                                    <option
                                        key={major.cate_code}
                                        value={major.cate_code}
                                    >
                                        {major.cate_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="mb-3">
                        <label className="form-label">Môn học</label>
                        <select
                            className="form-select"
                            value={formData.subject_code}
                            onChange={(e) => handleChange(e, "subject_code")}
                            disabled={subjects.length === 0}
                        >
                            <option disabled value="">
                                Chọn môn học
                            </option>
                            {subjects.map((subject) => (
                                <option
                                    key={subject.subject_code}
                                    value={subject.subject_code}
                                >
                                    {subject.subject_name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderForm2 = () => (
        <div className="container mt-4">
            <div className="card shadow">
                <div className="card-header bg-secondary text-white">
                    <h3>2. Thông tin lịch học</h3>
                </div>
                <div className="card-body">
                    <label className="form-label">
                        Có{" "}
                        <span style={{ color: "red", fontWeight: "bold" }}>
                            {resForm1}
                        </span>{" "}
                        sinh viên có thể xếp lớp
                    </label>
                    <div className="mb-3">
                        <label className="form-label">Ngày bắt đầu</label>
                        <input
                            type="date"
                            className="form-control"
                            value={formData.date_from}
                            onChange={(e) =>
                                handleForm2Change("date_from", e.target.value)
                            }
                        />
                    </div>
                    <div className="mb-3 form-group">
                        <label className="mr-3">Ngày học trong tuần</label>
                        <div className="selectgroup selectgroup-pills">
                            {[
                                {
                                    value: "1",
                                    label: "Thứ 2, Thứ 4, Thứ 6",
                                },
                                {
                                    value: "2",
                                    label: "Thứ 3, Thứ 5, Thứ 7",
                                },
                            ].map((day) => (
                                <label
                                    className="selectgroup-item"
                                    key={day.value}
                                >
                                    <input
                                        type="radio"
                                        name="day_type"
                                        value={day.value}
                                        checked={
                                            formData.day_type === day.value
                                        }
                                        onChange={(e) =>
                                            handleForm2Change(
                                                "day_type",
                                                e.target.value
                                            )
                                        }
                                        className="selectgroup-input"
                                    />
                                    <span className="selectgroup-button">
                                        {day.label}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Ca học</label>
                        <select
                            className="form-select"
                            value={formData.session_code}
                            onChange={(e) =>
                                handleForm2Change(
                                    "session_code",
                                    e.target.value
                                )
                            }
                        >
                            <option disabled value="">
                                Chọn ca học
                            </option>
                            {sessions.map((session) => (
                                <option
                                    key={session.cate_code}
                                    value={session.cate_code}
                                >
                                    {session.cate_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="container mb-3">
                        <div className="row">
                            <div className="study-dates-container">
                                <ul>
                                    {formData.list_study_dates.map((date) => (
                                        <li key={date}>{date}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Phòng học</label>
                        <select
                            className="form-select"
                            value={formData.room_code}
                            onChange={(e) => handleChange(e, "room_code")}
                        >
                            <option disabled value="">
                                Chọn phòng học
                            </option>
                            {roomsAndTeachers.rooms?.map((room) => (
                                <option
                                    key={room.cate_code}
                                    value={room.cate_code}
                                >
                                    {room.cate_name} - {`Sức chứa:`}{" "}
                                    {room.value}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Giảng viên</label>
                        <select
                            className="form-select"
                            value={formData.teacher_code}
                            onChange={(e) => handleChange(e, "teacher_code")}
                        >
                            <option disabled value="">
                                Chọn giảng viên
                            </option>
                            {roomsAndTeachers.teachers?.map((teacher) => (
                                <option
                                    key={teacher.user_code}
                                    value={teacher.user_code}
                                >
                                    {teacher.user_code} - {teacher.full_name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderForm3 = () => (
        <div className="container mt-4">
            <div className="card shadow">
                <div className="card-header bg-success text-white">
                    <h3>3. Xác nhận sinh viên</h3>
                </div>
                <div className="card-body">
                    <table className="table table-bordered table-striped">
                        <thead className="table-success">
                            <tr>
                                <th scope="col"></th>
                                <th scope="col">STT</th>
                                <th scope="col">Mã sinh viên</th>
                                <th scope="col">Tên</th>
                                <th scope="col">Email</th>
                                <th scope="col">Giới tính</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student, index) => (
                                <tr key={student.user_code}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            checked={formData.student_codes.includes(
                                                student.user_code
                                            )}
                                            onChange={(e) => {
                                                const value = student.user_code;
                                                setFormData((prev) => {
                                                    const selected = new Set(
                                                        prev.student_codes
                                                    );
                                                    if (e.target.checked) {
                                                        selected.add(value);
                                                    } else {
                                                        selected.delete(value);
                                                    }
                                                    return {
                                                        ...prev,
                                                        student_codes:
                                                            Array.from(
                                                                selected
                                                            ),
                                                    };
                                                });
                                            }}
                                        />
                                    </td>
                                    <td key={index}>{index + 1}</td>

                                    <td>{student.user_code}</td>
                                    <td>{student.full_name}</td>
                                    <td>{student.email}</td>
                                    <td>
                                        {student.sex === "male" ? "Nam" : "Nữ"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    return (
        <div>
            {currentStep === 1 && renderForm1()}
            {currentStep === 2 && renderForm2()}
            {currentStep === 3 && renderForm3()}

            <div className="container mt-4">
                <div className="d-flex justify-content-between">
                    {currentStep >= 1 && (
                        <button
                            className="btn btn-secondary"
                            onClick={handlePrev}
                        >
                            Trở lại
                        </button>
                    )}
                    {currentStep < 3 && (
                        <button
                            className="btn btn-primary"
                            onClick={handleNext}
                        >
                            Tiếp tục
                        </button>
                    )}
                    {currentStep === 3 && (
                        <button
                            className="btn btn-success"
                            onClick={handleSubmit}
                        >
                            Tạo lớp học
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddClassroom;
