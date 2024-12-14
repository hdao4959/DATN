import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import api from "../../../config/axios";
import { toast } from "react-toastify";
import { formatErrors } from "../../../utils/formatErrors";

const AddDegreeProgram = () => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        getValues,
    } = useForm();
    const nav = useNavigate();

    const { mutate } = useMutation({
        mutationFn: (data) => api.post("/admin/course", data),
        onSuccess: () => {
            toast.success("Thêm khoá học thành công");
            reset();
            nav("/sup-admin/degree-program");
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
                <Link to="/sup-admin/degree-program">
                    <button className="btn btn-primary">DS khoá học</button>
                </Link>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <div className="card-title">Thêm Khoá Học</div>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="form-group">
                                        <label htmlFor="first_year">
                                            Khóa học
                                            <span className="text-red-500 font-semibold ml-1 text-lg">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            {...register("course_number")}
                                            placeholder="Nhập khóa học"
                                        />
                                        {/* {errors.first_year && (
                                            <span className="text-danger">
                                                {errors.first_year.message}
                                            </span>
                                        )} */}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="first_year">
                                            Năm bắt đầu
                                            <span className="text-red-500 font-semibold ml-1 text-lg">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            {...register("first_year", {
                                                required:
                                                    "Năm bắt đầu là bắt buộc",
                                                pattern: {
                                                    value: /^[0-9]+$/,
                                                    message:
                                                        "Năm bắt đầu phải là số",
                                                },
                                            })}
                                            placeholder="Nhập năm bắt đầu"
                                        />
                                        {errors.first_year && (
                                            <span className="text-danger">
                                                {errors.first_year.message}
                                            </span>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="final_year">
                                            Năm kết thúc
                                            <span className="text-red-500 font-semibold ml-1 text-lg">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            {...register("final_year", {
                                                required:
                                                    "Năm kết thúc là bắt buộc",
                                                pattern: {
                                                    value: /^[0-9]+$/,
                                                    message:
                                                        "Năm kết thúc phải là số",
                                                },
                                                validate: (value) => {
                                                    const isValid =
                                                        value >
                                                        getValues("first_year");

                                                    if (!isValid) {
                                                        return "Năm kết thúc phải lớn hơn năm bắt đầu";
                                                    }

                                                    return true;
                                                },
                                            })}
                                            placeholder="Nhập năm kết thúc"
                                        />
                                        {errors.final_year && (
                                            <span className="text-danger">
                                                {errors.final_year.message}
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
                                    onClick={() => nav("/sup-admin/degree-program")}
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

export default AddDegreeProgram;
