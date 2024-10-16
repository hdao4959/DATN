import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import api from "../../../config/axios";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { getImageUrl } from "../../../utils/getImageUrl";


const EditSchoolRooms = () => {
    const { id } = useParams()

    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const nav = useNavigate();

    // const { data: listSchoolRooms } = useQuery({
    //     queryKey: ["LIST_SCHOOLROOMS"],
    //     queryFn: async () => {
    //         const res = await api.get("/admin/getListMajor/major");
    //         return res.data;
    //     }
    // });

    const { mutate } = useMutation({
        mutationFn: (data) => api.post(`/admin/schoolrooms/${id}`, data),
        onSuccess: () => {
            toast.success("Cập nhật phòng thành công");
            nav("/admin/schoolrooms");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra");
        },
    });

    const { data: schoolRoomsDetail } = useQuery({
        queryKey: ['SCHOOLROOMS_DETAIL', id],
        queryFn: async () => {
            const res = await api.get(`/admin/schoolrooms/${id}`)

            return res.data.data
        }
    })

    useEffect(() => {
        if (schoolRoomsDetail) {
            reset({
                cate_code: schoolRoomsDetail.cate_code,
                cate_name: schoolRoomsDetail.cate_name,
                // parrent_code: majorDetail.parrent_code,
                is_active: schoolRoomsDetail.is_active,
                value: schoolRoomsDetail.value,
                description: schoolRoomsDetail.description,
            })
        }
    }, [schoolRoomsDetail, reset]);

    const onSubmit = (data) => {
        const formData = new FormData();
        formData.append('cate_code', data.cate_code);
        formData.append('cate_name', data.cate_name);
        // formData.append('parrent_code', data.parrent_code);
        formData.append('is_active', data.is_active);
        formData.append('description', data.description);
        formData.append('value', data.value);
        formData.append("_method", "PUT")

        // Thêm file vào FormData
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
                                <div className="card-title">Cập Nhật Phòng Học</div>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="form-group">
                                        <label htmlFor="cate_code">
                                            Mã phòng học
                                            <span className="text-red-500 font-semibold ml-1 text-lg">
                                                *
                                            </span>
                                        </label>
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
                                        <label htmlFor="cate_name">
                                            Tên phòng học
                                            <span className="text-red-500 font-semibold ml-1 text-lg">
                                                *
                                            </span>
                                        </label>
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
                                        <label htmlFor="value">
                                            Số lượng sinh viên
                                            <span className="text-red-500 font-semibold ml-1 text-lg">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            {...register("value", {
                                                required: "Vui lòng nhập số lượng",
                                                min: {
                                                    value: 1,
                                                    message: "Số lượng không hợp lệ"
                                                }
                                            })}
                                            placeholder="Nhập số lượng sinh viên"
                                        />
                                         {errors.value && (
                                            <span className="text-danger">{errors.value.message}</span>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="is_active">Trạng thái</label>
                                        <select
                                            className="form-select"
                                            {...register("is_active", { required: "Trạng thái là bắt buộc" })}
                                        >
                                            <option value={1}>Hoạt động</option>
                                            <option value={0}>Không hoạt động</option>
                                        </select>
                                        {errors.is_active && (
                                            <span className="text-danger">{errors.is_active.message}</span>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="image">
                                            Hình ảnh
                                        </label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            {...register("image")}
                                        />
                                    </div>

                                    {schoolRoomsDetail?.image && (
                                        <div>
                                            <label htmlFor="">Preview</label>

                                            <img src={getImageUrl(schoolRoomsDetail?.image)} alt="Preview" className="mt-2 w-40 h-40 object-cover border rounded" />
                                        </div>
                                    )}

                                    <div className="form-group">
                                        <label htmlFor="description">
                                            Mô tả
                                            <span className="text-red-500 font-semibold ml-1 text-lg">
                                                *
                                            </span>
                                        </label>
                                        <textarea
                                            className="form-control"
                                            rows={5}
                                            {...register("description", {
                                                required: "Vui lòng nhập mô tả"
                                            })}
                                            placeholder="Nhập mô tả"
                                        />
                                         {errors.description && (
                                            <span className="text-danger">{errors.description.message}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="card-action gap-x-3 flex">
                                <button type="submit" className="btn btn-success">
                                    Submit
                                </button>
                                <button type="button" className="btn btn-danger" onClick={() => nav("/admin/major")}>
                                    Hủy
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}

export default EditSchoolRooms