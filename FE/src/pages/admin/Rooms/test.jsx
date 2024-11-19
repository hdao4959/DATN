import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import api from "../../../config/axios";
import "/src/css/multiStep.css";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";

function MultiStepForm() {
    const [formData, setFormData] = useState({
        class_name: "",
        course_code: "",
        semester_code: "",
        major_code: "",
        major_sub_code: "",
        subject_code: "",
        study_days: [],
        date_from: "",
    });

    const [sessionCode, setSessionCode] = useState("");
    const [listStudyDates, setListStudyDates] = useState([]);
    const [selectedParent, setSelectedParent] = useState("");
    const [selectedChild, setSelectedChild] = useState("");
    const [isForm2Visible, setIsForm2Visible] = useState(false);
    const [isForm3Visible, setIsForm3Visible] = useState(false);
    const [isForm4Visible, setIsForm4Visible] = useState(false);
    const [students, setStudents] = useState([]);
    const [studentCodes, setStudentCodes] = useState([]);
    const [roomCode, setRoomCode] = useState("");
    const [userCode, setUserCode] = useState("");
    const [roomOptions, setRoomOptions] = useState([]);
    const [teacherOptions, setTeacherOptions] = useState([]);

    const [courses, setCourses] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [majors, setMajors] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [sessions, setSessions] = useState([]);

    const [allFormData, setAllFormData] = useState({
        form1: {},
        form2: {},
        form3: {},
    });

    const {
        data: initialData,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["formData"], // Unique identifier for this query
        queryFn: async () => {
            const [
                coursesRes,
                semestersRes,
                majorsRes,
                subjectsRes,
                sessionsRes,
            ] = await Promise.all([
                api.get("/listCoursesForFrom"),
                api.get("/listSemestersForForm"),
                api.get("/listMajorsForForm"),
                api.get("/listSubjectsForForm"),
                api.get("/listSessionsForForm"),
            ]);
            return {
                courses: coursesRes.data,
                semesters: semestersRes.data,
                majors: majorsRes.data,
                subjects: subjectsRes.data,
                sessions: sessionsRes.data,
            };
        },
        staleTime: 5000, // Cache data for 5 seconds
    });

    // Update state when data is fetched
    useEffect(() => {
        if (initialData) {
            setCourses(initialData.courses);
            setSemesters(initialData.semesters);
            setMajors(initialData.majors);
            setSubjects(initialData.subjects);
            setSessions(initialData.sessions);
        }
    }, [initialData]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCheckboxChange = (e) => {
        const value = e.target.value;
        setFormData((prevData) => ({
            ...prevData,
            study_days: prevData.study_days.includes(value)
                ? prevData.study_days.filter((day) => day !== value)
                : [...prevData.study_days, value],
        }));
    };
    const handleParentChange = (e) => {
        const parentCode = e.target.value;
        setSelectedParent(parentCode);
        setSelectedChild("");
        const selectedMajor = majors.find(
            (category) => category.cate_code === parentCode
        );

        if (selectedMajor?.childrens?.length > 0) {
            setFormData({
                ...formData,
                major_code: "",
                major_sub_code: "",
            });
        } else {
            setFormData({
                ...formData,
                major_code: parentCode,
                major_sub_code: "",
            });
        }
    };
    const handleChildChange = (e) => {
        const childCode = e.target.value;
        setFormData({
            ...formData,
            major_sub_code: childCode,
        });
        setSelectedChild(childCode);
    };
    const handleSubmitForm1 = async () => {
        const finalMajorCode = formData.major_sub_code || formData.major_code;

        const updatedFormData = {
            ...formData,
            major_code: finalMajorCode,
            major_sub_code: "",
        };

        try {
            const response = await api.post(
                "/admin/classrooms/handle_step1",
                updatedFormData
            );

            setListStudyDates(response.data);

            setAllFormData((prev) => ({
                ...prev,
                form1: updatedFormData,
            }));

            toast.success("Lưu thông tin lớp thành công !");
            setIsForm2Visible(true);
        } catch (error) {
            console.error("Có lỗi xảy ra:", error);
            toast.error("Có lỗi xảy ra, vui lòng thử lại");
        }
    };

    const handleSubmitForm2 = async () => {
        try {
            const form2Data = {
                list_study_dates: listStudyDates,
                session_code: sessionCode,
                subject_code: allFormData.form1.subject_code,
            };

            setAllFormData((prev) => ({
                ...prev,
                form2: form2Data,
            }));

            const response = await api.post(
                "/admin/classrooms/handle_step2",
                form2Data
            );

            setRoomOptions(response.data.rooms || []);
            setTeacherOptions(response.data.teachers || []);
            toast.success("Lưu thông tin thành công !");
            setIsForm3Visible(true);
        } catch (error) {
            console.error("Error submitting Form 2:", error);
            toast.error("Có lỗi xảy ra, vui lòng thử lại sau !");
        }
    };

    const handleSubmitForm3 = async () => {
        const form3Data = {
            room_code: roomCode,
            user_code: userCode,
            subject_code: allFormData.form1.subject_code,
            course_code: allFormData.form1.course_code,
        };

        try {
            const response = await api.post(
                "/admin/classrooms/handle_step3",
                form3Data
            );

            setAllFormData((prev) => ({
                ...prev,
                form3: form3Data,
            }));

            if (response.data) {
                setStudents(response.data);

                const codes = response.data.map((student) => student.user_code);
                setStudentCodes(codes);
            }

            toast.success("Lưu thông tin thành công !");
            setIsForm4Visible(true);
        } catch (error) {
            console.error("Error submitting Form 3:", error);
            toast.error("Có lỗi xảy ra, vui lòng thử lại sau !");
        }
    };
    const handleSubmitForm4 = async () => {
        const finalPayload = {
            course_code: allFormData.form1.course_code,
            class_name: allFormData.form1.class_name,
            subject_code: allFormData.form1.subject_code,
            session_code: allFormData.form2.session_code,
            room_code: allFormData.form3.room_code,
            user_code: allFormData.form3.user_code,
            list_study_dates: allFormData.form2.list_study_dates,
            date_from: allFormData.form1.date_from,
            student_codes: studentCodes,
        };

        try {
            const response = await api.post("/admin/classrooms", finalPayload);
            toast.success("Classroom successfully created!");
        } catch (error) {
            console.error("Error creating classroom:", error);
            toast.error(error.response.data.message);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-11 p-4 border rounded shadow">
                    {!isForm2Visible && !isForm3Visible && !isForm4Visible && (
                        <>
                            <h3 className="text-center mb-4">
                                Form 1: Thông Tin Lớp Học
                            </h3>

                            {/* Tên lớp học */}
                            <div className="form-group mb-3">
                                <label>Tên Lớp Học</label>
                                <input
                                    type="text"
                                    name="class_name"
                                    value={formData.class_name}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Nhập tên lớp học"
                                />
                            </div>

                            {/* Khóa học */}
                            <div className="form-group mb-3">
                                <label>Khóa Học</label>
                                <select
                                    name="course_code"
                                    value={formData.course_code}
                                    onChange={handleChange}
                                    className="form-control"
                                >
                                    <option value="">Chọn khóa học</option>
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

                            {/* Học kỳ */}
                            <div className="form-group mb-3">
                                <label>Học Kỳ</label>
                                <select
                                    name="semester_code"
                                    value={formData.semester_code}
                                    onChange={handleChange}
                                    className="form-control"
                                >
                                    <option value="">Chọn học kỳ</option>
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

                            <div className="form-group mb-3">
                                <label>Chọn chuyên ngành cha</label>
                                <select
                                    className="form-control"
                                    value={selectedParent}
                                    onChange={handleParentChange}
                                >
                                    <option value="">Chọn chuyên ngành</option>
                                    {majors.map((category) => (
                                        <option
                                            key={category.cate_code}
                                            value={category.cate_code}
                                        >
                                            {category.cate_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Chuyên ngành con */}
                            {selectedParent &&
                                majors.length > 0 &&
                                (() => {
                                    const selectedMajor = majors.find(
                                        (category) =>
                                            category.cate_code ===
                                            selectedParent
                                    );
                                    const children =
                                        selectedMajor?.childrens || []; // Đảm bảo có giá trị mặc định là mảng rỗng

                                    return (
                                        children.length > 0 && (
                                            <div className="form-group mb-3">
                                                <label>
                                                    Chọn chuyên ngành con
                                                </label>
                                                <select
                                                    className="form-control"
                                                    value={selectedChild}
                                                    onChange={handleChildChange}
                                                >
                                                    <option value="">
                                                        Chọn chuyên ngành con
                                                    </option>
                                                    {children.map((child) => (
                                                        <option
                                                            key={
                                                                child.cate_code
                                                            }
                                                            value={
                                                                child.cate_code
                                                            }
                                                        >
                                                            {child.cate_name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        )
                                    );
                                })()}

                            {/* Môn học */}
                            <div className="form-group mb-3">
                                <label>Môn Học</label>
                                <select
                                    name="subject_code"
                                    value={formData.subject_code}
                                    onChange={handleChange}
                                    className="form-control"
                                >
                                    <option value="">Chọn môn học</option>
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

                            {/* Các ngày học */}
                            <div className="mb-3 form-group">
                                <label>Chọn các ngày trong tuần</label>
                                <div className="selectgroup selectgroup-pills">
                                    {[
                                        { value: "1", label: "Thứ Hai" },
                                        { value: "2", label: "Thứ Ba" },
                                        { value: "3", label: "Thứ Tư" },
                                        { value: "4", label: "Thứ Năm" },
                                        { value: "5", label: "Thứ Sáu" },
                                        { value: "6", label: "Thứ Bảy" },
                                        { value: "7", label: "Chủ Nhật" },
                                    ].map((day) => (
                                        <label
                                            className="selectgroup-item"
                                            key={day.value}
                                        >
                                            <input
                                                type="checkbox"
                                                value={day.value}
                                                checked={formData.study_days.includes(
                                                    day.value
                                                )}
                                                onChange={handleCheckboxChange}
                                                className="selectgroup-input"
                                            />
                                            <span className="selectgroup-button">
                                                {day.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Ngày bắt đầu */}
                            <div className="form-group mb-4">
                                <label>Ngày Bắt Đầu</label>
                                <input
                                    type="date"
                                    name="date_from"
                                    value={formData.date_from}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>

                            <div className="text-center">
                                <button
                                    className="btn btn-primary"
                                    onClick={handleSubmitForm1}
                                >
                                    Tiếp tục
                                </button>
                            </div>
                        </>
                    )}
                    {isForm2Visible && !isForm3Visible && !isForm4Visible && (
                        <>
                            <h3 className="text-center mb-4">
                                Form 2: Xác Nhận Lịch Học
                            </h3>
                            <div className="form-group mb-3">
                                <h3>Danh sách ngày học:</h3>
                                <div className="study-dates-container">
                                    <ul>
                                        {listStudyDates.map((date) => (
                                            <li key={date}>{date}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Chọn ca học */}
                            <div className="form-group mb-3">
                                <label>Chọn Ca Học</label>
                                <select
                                    value={sessionCode}
                                    onChange={(e) =>
                                        setSessionCode(e.target.value)
                                    }
                                    className="form-control"
                                >
                                    <option value="">Chọn ca học</option>
                                    {sessions.map((session) => (
                                        <option
                                            key={session.cate_code}
                                            value={session.cate_code}
                                        >
                                            {`${session.cate_name}`}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="text-center">
                                <button
                                    className="btn btn-primary"
                                    onClick={handleSubmitForm2}
                                >
                                    Tiếp tục
                                </button>
                            </div>
                        </>
                    )}
                    {isForm3Visible && !isForm4Visible && (
                        <>
                            <h3 className="text-center mb-4">
                                Form 3: Chọn Phòng và Giảng Viên
                            </h3>

                            <div className="form-group mb-3">
                                <label>Chọn Phòng Học</label>
                                <select
                                    className="form-control"
                                    value={roomCode}
                                    onChange={(e) =>
                                        setRoomCode(e.target.value)
                                    }
                                >
                                    <option value="">
                                        -- Chọn phòng học --
                                    </option>
                                    {roomOptions.map((room) => (
                                        <option
                                            key={room.cate_code}
                                            value={room.cate_code}
                                        >
                                            {`${room.cate_name} (Sức chứa: ${room.value})`}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group mb-3">
                                <label>Chọn Giảng Viên</label>
                                <select
                                    className="form-control"
                                    value={userCode}
                                    onChange={(e) =>
                                        setUserCode(e.target.value)
                                    }
                                >
                                    <option value="">
                                        -- Chọn giảng viên --
                                    </option>
                                    {teacherOptions.map((teacher) => (
                                        <option
                                            key={teacher.user_code}
                                            value={teacher.user_code}
                                        >
                                            {teacher.full_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="text-center">
                                <button
                                    className="btn btn-primary"
                                    onClick={handleSubmitForm3}
                                >
                                    Tiếp tục
                                </button>
                            </div>
                        </>
                    )}
                    {isForm4Visible && (
                        <>
                            <div className="container-fluid student-confirmation">
                                <div className="row justify-content-center">
                                    <div className="col-lg-10">
                                        <h3 className="text-center mb-4 text-primary">
                                            Xác nhận thông tin sinh viên
                                        </h3>
                                        <div className="table-responsive">
                                            <table className="table table-striped table-hover">
                                                <thead className="table-primary">
                                                    <tr>
                                                        <th scope="col">#</th>
                                                        <th scope="col">
                                                            Mã Sinh Viên
                                                        </th>
                                                        <th scope="col">
                                                            Họ Tên
                                                        </th>
                                                        <th scope="col">
                                                            Email
                                                        </th>
                                                        <th scope="col">
                                                            Số Điện Thoại
                                                        </th>
                                                        <th scope="col">
                                                            Địa Chỉ
                                                        </th>
                                                        <th scope="col">
                                                            Giới Tính
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {students.map(
                                                        (student, index) => (
                                                            <tr
                                                                key={
                                                                    student.user_code
                                                                }
                                                            >
                                                                <th scope="row">
                                                                    {index + 1}
                                                                </th>
                                                                <td>
                                                                    {
                                                                        student.user_code
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        student.full_name
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        student.email
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        student.phone_number
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        student.address
                                                                    }
                                                                </td>
                                                                <td>
                                                                    <span
                                                                        className={`badge ${
                                                                            student.sex ===
                                                                            "male"
                                                                                ? "bg-info text-dark"
                                                                                : "bg-warning text-dark"
                                                                        }`}
                                                                    >
                                                                        {student.sex ===
                                                                        "male"
                                                                            ? "Nam"
                                                                            : "Nữ"}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        )
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="text-center mt-4">
                                            <button
                                                className="btn btn-success btn-lg"
                                                onClick={handleSubmitForm4}
                                            >
                                                <i className="bi bi-check-circle me-2"></i>
                                                Tạo lớp học
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MultiStepForm;
