import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import api from "../../../config/axios";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { formatErrors } from "../../../utils/formatErrors";

const UpdatePostCategory = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();
    const navigate = useNavigate();

    const { id } = useParams();

    const { mutate } = useMutation({
        mutationKey: ["UPDATE_POST_CATEGORY", id],
        mutationFn: (data) => api.put(`/admin/categories/${id}`, data),
        onSuccess: () => {
            toast.success("Cập nhật danh mục bài viết thành công");
            navigate("/sup-admin/post-category");
        },
        onError: (error) => {
            const msg = formatErrors(error);
            toast.error(msg || "Có lỗi xảy ra");
        },
    });

    const { data } = useQuery({
        queryKey: ["POST_CATEGORY", id],
        queryFn: async () => {
            const res = await api.get(`/admin/categories/${id}`);

            return res.data;
        },
    });

    useEffect(() => {
        if (data) {
            reset({
                cate_name: data.cate_name,
                cate_code: data.cate_code,
            });
        }
    }, [data]);

    const onSubmit = (data) => {
        mutate({
            ...data,
            type: "category",
        });
    };

    return (
        <>
            <div className="mb-6 mt-2">
                <Link to="/sup-admin/post-category">
                    <button className="btn btn-primary">
                        DS danh mục bài viết
                    </button>
                </Link>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <div className="card-title">
                                    Cập Nhật Danh Mục Bài Viết
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="form-group">
                                        <label htmlFor="cate_code">
                                            Mã danh mục
                                            <span className="text-red-500 font-semibold ml-1 text-lg">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            {...register("cate_code", {
                                                required:
                                                    "Mã danh mục là bắt buộc",
                                            })}
                                            placeholder="Nhập mã danh mục"
                                        />
                                        {errors.cate_code && (
                                            <span className="text-danger">
                                                {errors.cate_code.message}
                                            </span>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="cate_name">
                                            Tên danh mục
                                            <span className="text-red-500 font-semibold ml-1 text-lg">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            {...register("cate_name", {
                                                required:
                                                    "Tên danh mục là bắt buộc",
                                            })}
                                            placeholder="Nhập tên danh mục"
                                        />
                                        {errors.cate_name && (
                                            <span className="text-danger">
                                                {errors.cate_name.message}
                                            </span>
                                        )}
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

export default UpdatePostCategory;
