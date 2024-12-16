import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import api from "../../../config/axios";
import { toast } from "react-toastify";
import { useEffect } from "react";

const EditMajor = () => {
    const { id } = useParams();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();
    const nav = useNavigate();

    // Mutation để cập nhật dữ liệu
    const { mutate } = useMutation({
        mutationFn: async (data) => {
            await api.put(`/admin/fees/${id}`, data);
          },
        onSuccess: () => {
            toast.success("Cập nhật công nợ thành công");
        },
        onError: (error) => {
            const msg = error.response?.data?.message || "Có lỗi xảy ra";
            toast.error(msg);
        },
    });

    // Query để lấy dữ liệu chi tiết
    const { data: detail } = useQuery({
        queryKey: ["WALLETS_DETAIL", id],
        queryFn: async () => {
            const res = await api.get(`/admin/fees/${id}`);
            return res.data.length > 0 ? res.data[0] : null
        },
    });
    console.log(detail);

    // Gán giá trị mặc định khi có dữ liệu
    useEffect(() => {
        if (detail) { // Kiểm tra nếu detail không phải là null hoặc undefined
            reset({
                user_code: detail.user_code || "",
                total_amount:  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(detail.total_amount)  || "",
                amount: detail.amount || "0", // Gán giá trị mặc định
            });
        } else {
            console.error("Detail không hợp lệ:", detail);
        }
    }, [detail, reset]);



    // Hàm xử lý submit
    const onSubmit = (data) => {
        const jsonData = {
            user_code: data.user_code,
            total_amount: data.total_amount,
            amount: data.amount,
            semester_code: data.semester_code,
        };
        mutate(jsonData);
    };
    

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <div className="card-title">
                                    Cập nhật công nợ
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    {/* Mã sinh viên */}
                                    <div className="form-group">
                                        <label htmlFor="user_code">
                                            Mã sinh viên
                                            <span className="text-red-500 font-semibold ml-1 text-lg">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            disabled
                                            className="form-control"
                                            {...register("user_code", {
                                                required:
                                                    "Mã sinh viên là bắt buộc",
                                            })}
                                            placeholder="Nhập mã sinh viên"
                                        />
                                        {errors.user_code && (
                                            <span className="text-danger">
                                                {errors.user_code.message}
                                            </span>
                                        )}
                                    </div>

                                    {/* Số tiền phải đóng */}
                                    <div className="form-group">
                                        <label htmlFor="total_amount">
                                            Số tiền phải đóng
                                            <span className="text-red-500 font-semibold ml-1 text-lg">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            disabled
                                            className="form-control"
                                            {...register("total_amount", {
                                                required:
                                                    "Số tiền phải đóng là bắt buộc",
                                            })}
                                            placeholder="Số tiền phải đóng"
                                        />
                                        {errors.total_amount && (
                                            <span className="text-danger">
                                                {errors.total_amount.message}
                                            </span>
                                        )}
                                    </div>

                                    {/* Số tiền đóng */}
                                    <div className="form-group">
                                        <label htmlFor="amount">
                                            Số tiền đóng
                                            <span className="text-red-500 font-semibold ml-1 text-lg">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            {...register("amount", {
                                                required:
                                                    "Số tiền cần đóng là bắt buộc",
                                            })}
                                            placeholder="Số tiền đã đóng"
                                        />
                                        <input
                                            type="text"
                                            className="form-control hidden"
                                            {...register("semester_code")}
                                            defaultValue={detail?.semester_code || ""}
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
                                    onClick={() => nav("/sup-admin/student-wallet")}
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

export default EditMajor;
