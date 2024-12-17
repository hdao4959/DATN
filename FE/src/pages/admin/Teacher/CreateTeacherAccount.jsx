import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../../config/axios";
import { toast } from "react-toastify";

const CreateTeacherAccount = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const navigate = useNavigate();
    const [selectedParentMajor, setSelectedParentMajor] = useState("");

    const { data, refetch } = useQuery({
        queryKey: ["LIST_MAJORS"],
        queryFn: async () => {
            const res = await api.get("/listParentMajorsForForm");
            return res.data;
        },
    });

    const { data: childMajors, refetch: fetchChildMajors } = useQuery({
        queryKey: ["LIST_CHILD_MAJORS", selectedParentMajor],
        queryFn: async () => {
            const res = await api.get(
                `/listChildrenMajorsForForm/${selectedParentMajor}`
            );
            return res.data;
        },
        enabled: !!selectedParentMajor,
    });

    const { mutate, isLoading, isError, isSuccess, error } = useMutation({
        mutationFn: (data) => {
            return api.post("/admin/teachers", data);
        },
        onSuccess: () => {
            toast.success("Tạo tài khoản thành công!");
            navigate("/sup-admin/teachers");
        },
        onError: (error) => {
            console.log(error);
            toast.error(error.response?.data?.message || "Có lỗi xảy ra");
        },
    });

    const majors = data || [];
    console.log(majors);
    const handleParentMajorChange = (e) => {
        const parentMajorCode = e.target.value;
        setSelectedParentMajor(parentMajorCode); // Update state for parent major
    };
    const onSubmit = (data) => {
        mutate(data);
    };
    return (
        <>
            <div className="mb-6 mt-2">
                <Link to="/sup-admin/teachers">
                    <button className="btn btn-primary">
                        Danh sách tài khoản
                    </button>
                </Link>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <div className="card-title">Tạo tài khoản</div>
                            </div>
                            <div className="card-body">
                                {/* Dòng 1 */}
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Họ và tên</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Nhập họ và tên"
                                                {...register("full_name", {
                                                    required:
                                                        "Vui lòng nhập họ và tên",
                                                })}
                                            />
                                            {errors.full_name && (
                                                <p className="text-danger">
                                                    {errors.full_name.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Dòng 2 */}
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Ngày tháng năm sinh</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                {...register("birthday", {
                                                    required:
                                                        "Chọn ngày tháng năm sinh",
                                                })}
                                            />
                                            {errors.birthday && (
                                                <p className="text-danger">
                                                    {errors.birthday.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Email</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                placeholder="Nhập email"
                                                {...register("email", {
                                                    required:
                                                        "Vui lòng nhập email",
                                                    pattern: {
                                                        value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                                                        message:
                                                            "Email không đúng định dạng",
                                                    },
                                                })}
                                            />
                                            {errors.email && (
                                                <p className="text-danger">
                                                    {errors.email.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Dòng 3 */}
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Mật khẩu</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                placeholder="Nhập mật khẩu"
                                                defaultValue={123456}
                                                {...register("password")}
                                            />
                                            {errors.password && (
                                                <p className="text-danger">
                                                    {errors.password.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Số điện thoại</label>
                                            <input
                                                type="tel"
                                                className="form-control"
                                                placeholder="Nhập số điện thoại"
                                                {...register("phone_number", {
                                                    required:
                                                        "Vui lòng nhập số điện thoại",
                                                    pattern: {
                                                        value: /^[0-9]+$/,
                                                        message:
                                                            "Số điện thoại không hợp lệ",
                                                    },
                                                })}
                                            />
                                            {errors.phone_number && (
                                                <p className="text-danger">
                                                    {
                                                        errors.phone_number
                                                            .message
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Dòng 4 */}
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Giới tính</label>
                                            <select
                                                className="form-select"
                                                {...register("sex", {
                                                    required:
                                                        "Vui lòng chọn giới tính",
                                                })}
                                            >
                                                <option
                                                    value=""
                                                    selected
                                                    hidden
                                                >
                                                    Chọn giới tính
                                                </option>
                                                <option value="male">
                                                    Nam
                                                </option>
                                                <option value="female">
                                                    Nữ
                                                </option>
                                            </select>
                                            {errors.sex && (
                                                <p className="text-danger">
                                                    {errors.sex.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Địa chỉ</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Nhập địa chỉ"
                                                {...register("address", {
                                                    required:
                                                        "Vui lòng nhập địa chỉ",
                                                })}
                                            />
                                            {errors.address && (
                                                <p className="text-danger">
                                                    {errors.address.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Dòng 5 */}
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Số CCCD</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Nhập số CCCD"
                                                {...register(
                                                    "citizen_card_number",
                                                    {
                                                        required:
                                                            "Vui lòng nhập số CCCD",
                                                    }
                                                )}
                                            />
                                            {errors.citizen_card_number && (
                                                <p className="text-danger">
                                                    {
                                                        errors
                                                            .citizen_card_number
                                                            .message
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="email2">
                                                Ngày cấp
                                            </label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                {...register("issue_date", {
                                                    required: "Ngày cấp",
                                                })}
                                            />
                                            {errors.issue_date && (
                                                <p className="text-danger">
                                                    {errors.issue_date.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Dòng 6 */}
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="email2">
                                                Nơi cấp
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Nơi cấp CCCD"
                                                {...register("place_of_grant", {
                                                    required:
                                                        "Vui lòng nhập nơi cấp CCCD",
                                                })}
                                            />
                                            {errors.place_of_grant && (
                                                <p className="text-danger">
                                                    {
                                                        errors.place_of_grant
                                                            .message
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="email2">
                                                Dân tộc
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Nhập dân tộc theo CCCD"
                                                {...register("nation", {
                                                    required:
                                                        "Vui lòng nhập dân tộc",
                                                })}
                                            />
                                            {errors.nation && (
                                                <p className="text-danger">
                                                    {errors.nation.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Dòng 7 */}
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="email2">
                                                Ảnh đại diện
                                            </label>
                                            <input
                                                type="file"
                                                className="form-control"
                                                {...register("avatar")}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="exampleFormControlSelect1">
                                                Chuyên ngành
                                            </label>
                                            <select
                                                className="form-select"
                                                {...register("major_code", {
                                                    required:
                                                        "Vui lòng chọn ngành học",
                                                })}
                                                onChange={
                                                    handleParentMajorChange
                                                }
                                            >
                                                <option value="">
                                                    Chọn chuyên ngành
                                                </option>
                                                {majors.map((major) => (
                                                    <option
                                                        key={major.cate_code}
                                                        value={major.cate_code}
                                                    >
                                                        {major.cate_name}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.major_code && (
                                                <p className="text-danger">
                                                    {errors.major_code.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Chuyên ngành con</label>
                                            <select
                                                className="form-select"
                                                {...register(
                                                    "narrow_major_code"
                                                )}
                                                disabled={!selectedParentMajor}
                                            >
                                                <option value="">
                                                    Chọn chuyên ngành con
                                                </option>
                                                {childMajors?.map((child) => (
                                                    <option
                                                        key={child.cate_code}
                                                        value={child.cate_code}
                                                    >
                                                        {child.cate_name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <input
                                        type="hidden"
                                        {...register("is_active")}
                                        value={1}
                                    />
                                </div>

                                {/* Dòng 8 */}
                            </div>

                            <div className="card-action gap-x-3 flex">
                                <button
                                    type="submit"
                                    className="btn btn-success"
                                    disabled={isLoading}
                                >
                                    {isLoading
                                        ? "Đang tạo tài khoản..."
                                        : "Thêm mới tài khoản"}
                                </button>
                                {/* <button
                                    type="button"
                                    className="btn btn-danger"
                                >
                                    Quay lại danh sách
                                </button> */}
                                <Link to="/sup-admin/teachers">
                                    <button className="btn btn-primary">
                                        Quay lại danh sách
                                    </button>
                                </Link>
                            </div>

                            {isSuccess && (
                                <p className="text-success">
                                    Tài khoản đã được tạo thành công!
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
};

export default CreateTeacherAccount;
