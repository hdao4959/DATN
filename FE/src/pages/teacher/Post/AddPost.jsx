import { Link, useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../../config/axios";
import { toast } from "react-toastify";
import { formatErrors } from "../../../utils/formatErrors";
import { useState } from "react";
import InputChip from "./InputChip";

const AddPost = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    const [content, setContent] = useState();
    const [classrooms, setClassrooms] = useState([]);
    const [classroomsObject, setClassroomsObject] = useState([]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
    } = useForm();
    const navigate = useNavigate();

    const { data: categories } = useQuery({
        queryKey: ["POST_CATEGORY"],
        queryFn: async () => {
            const res = await api.get("/teacher/categories");
            return res.data.data ?? [];
        },
    });
    const { data } = useQuery({
        queryKey: ["CLASSROOMS"],
        queryFn: async () => {
            const res = await api.get("/teacher/classrooms");
            const classCodes = res?.data?.map((classItem) => classItem.class_code);
            setClassrooms(classCodes);
            return res?.data ?? [];
        },
    });

    const { mutate } = useMutation({
        mutationKey: ["ADD_POST"],
        mutationFn: (data) => api.post("/teacher/newsletters", data),
        onSuccess: () => {
            toast.success("Thêm bài viết thành công");
            navigate("/teacher/post");
        },
        onError: (error) => {
            const msg = formatErrors(error);
            toast.error(msg || "Có lỗi xảy ra");
        },
    });

    const onSubmit = (values) => {
        if (content === "<p><br></p>") {
            toast.error("Vui lòng nhập nội dung bài viết");
            return;
        }

        const formData = new FormData();
        formData.append("code", values.code);
        formData.append("title", values.title);
        // formData.append("tags", JSON.stringify(values.tags.map(tag => ({ tag_name: tag }))) || '');
        formData.append("content", content);
        formData.append("description", values.description);
        formData.append("type", values.type);
        formData.append("notification_object", JSON.stringify(classroomsObject) || '');
        formData.append("user_code", user.user_code);
        formData.append("cate_code", values.cate_code);
        if (values.image && values.image.length > 0) {
            formData.append("image", values.image[0]);
        }
        // for (let [key, value] of formData.entries()) {
        //     console.log(`${key}:`, value);
        // }
        mutate(formData);
    };

    const handleClassroomChange = (event) => {
        const selectedClass = event.target.value;

        // Kiểm tra xem lớp học đã được chọn hay chưa trước khi thêm vào state
        if (selectedClass && !classroomsObject?.some(item => item.class_code === selectedClass)) {
            setClassroomsObject((prevState) => [...(prevState || []), { class_code: selectedClass }]); // Thêm lớp học vào mảng
        }
    };
    const handleRemoveClass = (classToRemove) => {
        setClassroomsObject((prevState) =>
            prevState.filter((classItem) => classItem !== classToRemove)
        );
    };

    return (
        <>
            <div className="mb-6 mt-2">
                <Link to="/teacher/post">
                    <button className="btn btn-primary">DS bài viết</button>
                </Link>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <div className="card-title">Thêm bài viết</div>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="form-group">
                                        <label htmlFor="title">
                                            Tiêu đề
                                            <span className="text-red-500 font-semibold ml-1 text-lg">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            {...register("title", {
                                                required: "Tiêu đề là bắt buộc",
                                            })}
                                            placeholder="Nhập tiêu đề"
                                        />
                                        {errors.title && (
                                            <span className="text-danger">
                                                {errors.title.message}
                                            </span>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="code">
                                            Mã bài viết
                                            <span className="text-red-500 font-semibold ml-1 text-lg">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            {...register("code", {
                                                required:
                                                    "Mã bài viết là bắt buộc",
                                            })}
                                            placeholder="Nhập mã bài viết"
                                        />
                                        {errors.code && (
                                            <span className="text-danger">
                                                {errors.code.message}
                                            </span>
                                        )}
                                    </div>

                                    {/* <div className="form-group">
                                        <label htmlFor="value">
                                            Vị trí sắp xếp
                                            <span className="text-red-500 font-semibold ml-1 text-lg">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            {...register("value", {
                                                required:
                                                    "Vị trí sắp xếp là bắt buộc",
                                                min: {
                                                    value: 0,
                                                    message:
                                                        "Giá trị không hợp lệ",
                                                },
                                            })}
                                            placeholder="Nhập vị trí sắp xếp"
                                        />
                                        {errors.value && (
                                            <span className="text-danger">
                                                {errors.value.message}
                                            </span>
                                        )}
                                    </div> */}

                                    {/* <div className="form-group">
                                        <label htmlFor="tags">
                                            Tags
                                            <span className="text-red-500 font-semibold ml-1 text-lg">
                                                *
                                            </span>
                                        </label>

                                        <Controller
                                            name="tags"
                                            control={control}
                                            render={({ field }) => (
                                                <InputChip
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            )}
                                        // rules={{
                                        //     required: "Vui lòng nhập tags",
                                        // }}
                                        />

                                        {errors.tags && (
                                            <span className="text-danger">
                                                {errors.tags.message}
                                            </span>
                                        )}
                                    </div> */}

                                    <div className="form-group">
                                        <label htmlFor="image">
                                            Ảnh bìa
                                        </label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            {...register("image")}
                                        />
                                        {errors.image && (
                                            <span className="text-danger">
                                                {errors.image.message}
                                            </span>
                                        )}
                                    </div>

                                    <div className="form-group hidden">
                                        <label htmlFor="type">
                                            Loại bài viết
                                        </label>
                                        <select
                                            className="form-select"
                                            id="type"
                                            {...register("type")}
                                        >
                                            <option value="notification">
                                                Thông báo
                                            </option>
                                            <option value="news">
                                                Tin tức
                                            </option>
                                            <option value="article">
                                                Bài viết
                                            </option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="description">
                                            Nội dung hiển thị
                                        </label>
                                        <textarea
                                            className="form-control"
                                            rows={5}
                                            {...register("description")}
                                            placeholder="Nhập nội dung hiển thị"
                                        />
                                        {errors.description && (
                                            <span className="text-danger">
                                                {errors.description.message}
                                            </span>
                                        )}
                                    </div>

                                    {/* <div className="form-group">
                                        <label htmlFor="is_active">
                                            Ngày hết hạn
                                        </label>
                                        <input
                                            type="datetime-local"
                                            name=""
                                            className="form-control"
                                            id=""
                                        />
                                    </div> */}

                                    <div className="form-group">
                                        <label htmlFor="cate_code">
                                            Danh mục
                                            <span className="text-red-500 font-semibold ml-1 text-lg">
                                                *
                                            </span>
                                        </label>
                                        <select
                                            className="form-select"
                                            {...register("cate_code", {
                                                required:
                                                    "Vui lòng chọn danh mục bài viết",
                                            })}
                                        >
                                            <option value="">
                                                Chọn danh mục
                                            </option>

                                            {categories?.map((it) => (
                                                <option
                                                    key={it.id}
                                                    value={it.cate_code}
                                                >
                                                    {it.cate_name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.cate_code && (
                                            <span className="text-danger">
                                                {errors.cate_code.message}
                                            </span>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="notification_object">
                                            Đối tượng
                                            <span className="text-red-500 font-semibold ml-1 text-lg">
                                                *
                                            </span>
                                        </label>
                                        {/* <input
                                            type="text"
                                            placeholder="Nhập đối tượng"
                                            className="form-control"
                                            id="notification_object"
                                            {...register(
                                                "notification_object",
                                                {
                                                    required:
                                                        "Vui lòng nhập đối tượng",
                                                }
                                            )}
                                        /> */}
                                        <div style={{ marginTop: "10px" }} className="form-control">
                                            {classroomsObject?.length > 0 ? (
                                                classroomsObject?.map((classItem, index) => (
                                                    <span
                                                        key={index}
                                                        style={{
                                                            display: "inline-block",
                                                            marginRight: "10px",
                                                            padding: "5px 10px",
                                                            backgroundColor: "#e0e0e0",
                                                            borderRadius: "15px",
                                                            marginBottom: "10px",
                                                        }}
                                                    >
                                                        {classItem.class_code || ''}{" "}
                                                        <span
                                                            style={{
                                                                cursor: "pointer",
                                                                marginLeft: "8px",
                                                                color: "red",
                                                                fontWeight: "bold",
                                                            }}
                                                            onClick={() => handleRemoveClass(classItem)} // Gọi hàm xóa lớp học khi nhấp vào "X"
                                                        >
                                                            X
                                                        </span>
                                                    </span>
                                                ))
                                            ) : (
                                                <p>Chưa chọn đối tượng nào.</p>
                                            )}
                                        </div>
                                        <div className="mt-1">
                                            <select name="classroom" id="classroom-select" onChange={handleClassroomChange} disabled={false}>
                                                <option value="">Chọn đối tượng</option> {/* Option mặc định */}
                                                {classrooms?.map((classItem, index) => (
                                                    <option key={index} value={classItem}>
                                                        {classItem}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        {errors.notification_object && (
                                            <span className="text-danger">
                                                {
                                                    errors.notification_object
                                                        .message
                                                }
                                            </span>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="is_active">
                                            Nội dung
                                            <span className="text-red-500 font-semibold ml-1 text-lg">
                                                *
                                            </span>
                                        </label>

                                        <ReactQuill
                                            theme="snow"
                                            className="h-[300px] mb-10"
                                            placeholder="Nhập nội dung bài viết"
                                            value={content}
                                            onChange={setContent}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="card-action gap-x-3 flex">
                                <button
                                    type="submit"
                                    className="btn btn-success"
                                >
                                    Submit
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => navigate(-1)}
                                >
                                    Hủy
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
};

export default AddPost;
