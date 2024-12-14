import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import api from "../../../config/axios";
import { toast } from "react-toastify";
import { formatErrors } from "../../../utils/formatErrors";

const AddSession = () => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();
    const nav = useNavigate();

    const { mutate } = useMutation({
        mutationFn: (data) => api.post("/admin/sessions", data),
        onSuccess: () => {
            toast.success("Thêm ca học thành công");
            reset();
            nav("/sup-admin/sessions");
        },
        onError: (error) => {
            const msg = formatErrors(error);
            toast.error(msg || "Có lỗi xảy ra");
        },
    });

    const onSubmit = (data) => {
        mutate(data);
    };

    return (
        <>
            <div className="mb-6 mt-2">
                <Link to="/sup-admin/sessions">
                    <button className="btn btn-primary">DS ca học</button>
                </Link>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <div className="card-title">Thêm Ca Học</div>
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
                                    onClick={() => nav("/sup-admin/sessions")}
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

export default AddSession;
