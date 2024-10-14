import { useMutation } from '@tanstack/react-query';
import React from 'react'
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../../config/axios';
import { toast } from 'react-toastify';

const AddSchoolRoom = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const nav = useNavigate();

    const { mutate } = useMutation({
        mutationFn: (data) => api.post("admin/schoolrooms", data),
        onSuccess: () => {
            toast.success("Thêm phòng học thành công");
            reset();
            nav("/admin/schoolrooms");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra");
        }
    });

    const onSubmit = (data) => {
        const formData = new FormData();
        formData.append('cate_code', data.cate_code);
        formData.append('cate_name', data.cate_name);
        formData.append('is_active', data.is_active === "true" ? 1 : 0); // Chuyển đổi giá trị is_active
        formData.append('description', data.description);
        formData.append('value', data.value);
        formData.append('type', 'school_room');

        if (data.image && data.image.length > 0) {
            formData.append('image', data.image[0]);
        }

        mutate(formData);
    };

    return (
        <>
            <div className="mb-6 mt-2">
                <Link to="/admin/schoolrooms">
                    <button className="btn btn-primary">DS phòng học</button>
                </Link>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <div className="card-title">Thêm Phòng Học</div>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="form-group">
                                        <label htmlFor="cate_code" className="text-danger">Mã phòng học*</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            {...register("cate_code", { required: "Mã phòng học là bắt buộc" })}
                                            placeholder="Nhập mã phòng học"
                                        />
                                        {errors.cate_code && (
                                            <span className="text-danger">{errors.cate_code.message}</span>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="cate_name" className="text-danger">Tên phòng học*</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            {...register("cate_name", { required: "Tên phòng học là bắt buộc" })}
                                            placeholder="Nhập tên phòng học"
                                        />
                                        {errors.cate_name && (
                                            <span className="text-danger">{errors.cate_name.message}</span>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="value">Số lượng sinh viên</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            {...register("value")}
                                            placeholder="Nhập số lượng sinh viên"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="is_active" className="text-danger">Trạng thái*</label>
                                        <select
                                            className="form-select"
                                            {...register("is_active", { required: "Trạng thái là bắt buộc" })}
                                        >
                                            <option value="true">Hoạt động</option>
                                            <option value="false">Không hoạt động</option>
                                        </select>
                                        {errors.is_active && (
                                            <span className="text-danger">{errors.is_active.message}</span>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="image">Hình ảnh</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            {...register("image")}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="description">Mô tả</label>
                                        <textarea
                                            className="form-control"
                                            rows={5}
                                            {...register("description")}
                                            placeholder="Nhập mô tả"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="card-action gap-x-3 flex">
                                <button type="submit" className="btn btn-success">
                                    Submit
                                </button>
                                <button type="button" className="btn btn-danger" onClick={() => nav("/admin/schoolrooms")}>
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

export default AddSchoolRoom;
