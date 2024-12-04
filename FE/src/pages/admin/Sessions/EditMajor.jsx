import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import api from "../../../config/axios";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { formatErrors } from "../../../utils/formatErrors";

const EditSession = () => {
    const { id } = useParams();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();
    const nav = useNavigate();

    const { mutate } = useMutation({
        mutationFn: (data) => api.put(`/admin/sessions/${id}`, data),
        onSuccess: () => {
            toast.success("Cập nhật ca học thành công");
            nav("/admin/sessions");
        },
        onError: (error) => {
            const msg = formatErrors(error);
            toast.error(msg || "Có lỗi xảy ra");
        },
    });

    const { data: sessionDetail } = useQuery({
        queryKey: ["SESSION_DETAIL", id],
        queryFn: async () => {
            const res = await api.get(`/admin/sessions/${id}`);

            return res.data?.[0];
        },
    });

    useEffect(() => {
        if (sessionDetail) {
            console.log("352 ~ useEffect ~ sessionDetail:", sessionDetail);
        }
    }, [sessionDetail, reset]);

    const onSubmit = (data) => {
        mutate(data);
    };

    return (
        <>
            <div className="mb-6 mt-2">
                <Link to="/admin/sessions">
                    <button className="btn btn-primary">DS ca học</button>
                </Link>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <div className="card-title">
                                    Cập Nhật Ca Học
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="form-group">
                                        <label htmlFor="session">
                                            Tên ca
                                            <span className="text-red-500 font-semibold ml-1 text-lg">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            {...register("session", {
                                                required:
                                                    "Tên ca đầu là bắt buộc",
                                                pattern: {
                                                    value: /^[0-9]+$/,
                                                    message:
                                                        "Tên ca đầu phải là số",
                                                },
                                            })}
                                            placeholder="Nhập tên ca, VD: 1"
                                        />
                                        {errors.session && (
                                            <span className="text-danger">
                                                {errors.session.message}
                                            </span>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="final_year">
                                            Thời gian bắt đầu
                                            <span className="text-red-500 font-semibold ml-1 text-lg">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="time"
                                            className="form-control"
                                            {...register("time_start", {
                                                required:
                                                    "Thời gian bắt đầu là bắt buộc",
                                            })}
                                        />
                                        {errors.time_start && (
                                            <span className="text-danger">
                                                {errors.time_start.message}
                                            </span>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="final_year">
                                            Thời gian kết thúc
                                            <span className="text-red-500 font-semibold ml-1 text-lg">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="time"
                                            className="form-control"
                                            {...register("time_end", {
                                                required:
                                                    "Thời gian kết thúc là bắt buộc",
                                            })}
                                        />
                                        {errors.time_end && (
                                            <span className="text-danger">
                                                {errors.time_end.message}
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
                                    onClick={() => nav("/admin/sessions")}
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

export default EditSession;
