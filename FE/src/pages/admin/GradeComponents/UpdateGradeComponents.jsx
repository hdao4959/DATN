import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import api from "../../../config/axios";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { formatErrors } from "../../../utils/formatErrors";

const UpdateGradeComponents = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();
    const navigate = useNavigate();

    const { id } = useParams();

    const { mutate } = useMutation({
        mutationKey: ["UPDATE_GRADE_COMPONENTS", id],
        mutationFn: (data) => api.put(`/admin/pointheads/${id}`, data),
        onSuccess: () => {
            toast.success("Cập nhật điểm thành phần thành công");
            navigate("/grade-components");
        },
        onError: (error) => {
            const msg = formatErrors(error);
            toast.error(msg || "Có lỗi xảy ra");
        },
    });

    const { data } = useQuery({
        queryKey: ["GRADE_COMPONENT", id],
        queryFn: async () => {
            const res = await api.get(`/admin/pointheads/${id}`);

            return res.data;
        },
    });

    useEffect(() => {
        if (data) {
            reset({
                cate_name: data.cate_name,
                cate_code: data.cate_code,
                value: data.value,
            });
        }
    }, [data]);

    const onSubmit = (data) => {
        mutate({
            ...data,
            type: "point_head",
        });
    };

    return (
        <>
            <div className="mb-6 mt-2">
                <Link to="/major">
                    <button className="btn btn-primary">
                        DS điểm thành phần
                    </button>
                </Link>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <div className="card-title">
                                    Cập Nhật Điểm Thành Phần
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="form-group">
                                        <label htmlFor="cate_code">
                                            Mã điểm thành phần
                                            <span className="text-red-500 font-semibold ml-1 text-lg">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            {...register("cate_code", {
                                                required:
                                                    "Mã điểm thành phần là bắt buộc",
                                            })}
                                            placeholder="Nhập mã điểm thành phần"
                                        />
                                        {errors.cate_code && (
                                            <span className="text-danger">
                                                {errors.cate_code.message}
                                            </span>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="cate_name">
                                            Tên điểm thành phần
                                            <span className="text-red-500 font-semibold ml-1 text-lg">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            {...register("cate_name", {
                                                required:
                                                    "Tên điểm thành phần là bắt buộc",
                                            })}
                                            placeholder="Nhập tên điểm thành phần"
                                        />
                                        {errors.cate_name && (
                                            <span className="text-danger">
                                                {errors.cate_name.message}
                                            </span>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="value">
                                            Trọng số (%)
                                            <span className="text-red-500 font-semibold ml-1 text-lg">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            {...register("value", {
                                                required:
                                                    "Trọng số là bắt buộc",
                                                min: {
                                                    value: 0,
                                                    message:
                                                        "Giá trị không hợp lệ",
                                                },
                                                max: {
                                                    value: 100,
                                                    message:
                                                        "Trọng số phải nhỏ hơn 100%",
                                                },
                                            })}
                                            placeholder="Nhập trọng số"
                                        />
                                        {errors.value && (
                                            <span className="text-danger">
                                                {errors.value.message}
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

export default UpdateGradeComponents;
