import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../../config/axios";
import { toast } from "react-toastify";
import { formatErrors } from "../../../utils/formatErrors";
import { useEffect, useState } from "react";
import { getImageUrl } from "../../../utils/getImageUrl";

const UpdatePost = () => {
    const { id } = useParams();

    const [content, setContent] = useState();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();
    const navigate = useNavigate();

    const { data: categories } = useQuery({
        queryKey: ["POST_CATEGORY"],
        queryFn: async () => {
            const res = await api.get("/admin/categories");
            return res.data.data ?? [];
        },
    });

    const { data: postDetail } = useQuery({
        queryKey: ["POST_DETAIL", id],
        queryFn: async () => {
            const res = await api.get(`/admin/newsletters/${id}`);
            return res.data?.[0];
        },
    });

    const { mutate } = useMutation({
        mutationKey: ["UPDATE_POST"],
        mutationFn: (data) => api.post(`/admin/newsletters/${id}`, data),
        onSuccess: () => {
            toast.success("Cập nhật bài viết thành công");
            navigate("/sup-admin/post");
        },
        onError: (error) => {
            const msg = formatErrors(error);
            toast.error(msg || "Có lỗi xảy ra");
        },
    });

    useEffect(() => {
        if (postDetail) {
            reset({
                code: postDetail.code,
                title: postDetail.title,
                description: postDetail.description,
                type: postDetail.type,
                cate_code: postDetail.cate_code,
            });

            setContent(postDetail.content);
        }
    }, [postDetail]);

    const onSubmit = (values) => {
        if (content === "<p><br></p>") {
            toast.error("Vui lòng nhập nội dung bài viết");
            return;
        }

        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("content", content);
        formData.append("description", values.description);
        formData.append("type", values.type);
        formData.append("cate_code", values.cate_code);
        formData.append("_method", "PUT");

        if (values.image && values.image.length > 0) {
            formData.append("image", values.image[0]);
        }

        mutate(formData);
    };

    return (
        <>
            <div className="mb-6 mt-2">
                <Link to="/sup-admin/post">
                    <button className="btn btn-primary">DS bài viết</button>
                </Link>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <div className="card-title">
                                    Cập nhật bài viết
                                </div>
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
                                        <label htmlFor="title">
                                            Mã bài viết
                                            <span className="text-red-500 font-semibold ml-1 text-lg">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            {...register("code")}
                                            disabled
                                        />

                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="image">
                                            Ảnh bìa
                                            <span className="text-red-500 font-semibold ml-1 text-lg">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="file"
                                            className="form-control"
                                        />
                                    </div>

                                    {postDetail?.image && (
                                        <div>
                                            <label htmlFor="">Preview</label>

                                            <img
                                                src={getImageUrl(
                                                    postDetail?.image
                                                )}
                                                alt="Preview"
                                                className="mt-2 w-40 h-40 object-cover border rounded"
                                            />
                                        </div>
                                    )}

                                    <div className="form-group">
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
                                            <span className="text-red-500 font-semibold ml-1 text-lg">
                                                *
                                            </span>
                                        </label>
                                        <textarea
                                            className="form-control"
                                            rows={5}
                                            {...register("description", {
                                                required:
                                                    "Vui lòng nhập nội dung hiển thị",
                                            })}
                                            placeholder="Nhập nội dung hiển thị"
                                        />
                                        {errors.description && (
                                            <span className="text-danger">
                                                {errors.description.message}
                                            </span>
                                        )}
                                    </div>
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

export default UpdatePost;
