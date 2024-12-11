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
            return res.data;
        },
    });

    useEffect(() => {
        if (sessionDetail) {
            const parsedValue = JSON.parse(sessionDetail?.value);
            reset({ ...sessionDetail, value: parsedValue, cate_name: sessionDetail.cate_name.replace(/[^0-9]/g, "") });
        }
    }, [sessionDetail, reset]);

    const onSubmit = (dataI) => {
        const data = {
            session: dataI.cate_name,
            time_start: dataI.value.start,
            time_end: dataI.value.end
        }
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
                                        <div className="input-group">
                                            <span className="input-group-text">Ca</span>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={sessionDetail.value.start}
                                                {...register("cate_name", {
                                                    required: "Tên ca đầu là bắt buộc",
                                                    pattern: {
                                                    value: /^[0-9]+$/,
                                                    message:
                                                        "Tên ca đầu phải là số",
                                                },
                                                })}
                                                placeholder="Nhập số ca, VD: 1"
                                            />
                                        </div>
                                        {errors.session && (
                                            <span className="text-danger">
                                                {errors.session.message}
                                            </span>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="start_time">
                                            Thời gian bắt đầu
                                            <span className="text-red-500 font-semibold ml-1 text-lg">*</span>
                                        </label>
                                        <input
                                            type="time"
                                            className="form-control"
                                            {...register("value.start", {
                                                required: "Thời gian bắt đầu là bắt buộc",
                                            })}
                                        />
                                        {errors.value?.start && (
                                            <span className="text-danger">{errors.value.start.message}</span>
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
                                            {...register("value.end", {
                                                required:
                                                    "Thời gian kết thúc là bắt buộc",
                                            })}
                                        />
                                        {errors.value?.end && (
                                            <span className="text-danger">
                                                {errors.value?.end.message}
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
