<<<<<<< HEAD
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../../config/axios";
import { useEffect } from "react";

const EditMajor = () => {
    const { register, handleSubmit, reset } = useForm();

    const { id } = useParams();

    const { data } = useQuery({
        queryKey: ["PRODUCT", id],
        queryFn: async () => {
            const res = await api.get(`/admin/category/${id}`);
            return res.data.data;
        },
    });

    const { mutate } = useMutation({
        mutationKey: ["UPDATE_MAJOR", id],
        mutationFn: async (data) => {
            const res = await api.put(`/admin/category/${id}`, data);
            return res;
        },
        onSuccess: () => {
            alert("Cập nhật thành công");

            navigate("/admin/major");
        },
        onError: () => {
            alert("Có lỗi xảy ra, vui lòng thử lại");
        },
    });

    const navigate = useNavigate();

    useEffect(() => {
        data && reset(data);
    }, [data]);

    const onSubmit = (values) => {
        mutate(values);
=======
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import api from "../../../config/axios";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { getImageUrl } from "../../../utils/getImageUrl";

const EditMajor = () => {
    const { id } = useParams()

    const { register, handleSubmit, reset } = useForm();
    const nav = useNavigate();

    const { data: listMajor } = useQuery({
        queryKey: ["LIST_MAJOR"],
        queryFn: async () => {
            const res = await api.get("/admin/getListMajor/major");
            return res.data;
        }
    });

    const { mutate } = useMutation({
        mutationFn: (data) => api.post(`/admin/major/${id}`, data),
        onSuccess: () => {
            toast.success("Cập nhật chuyên ngành thành công");
            nav("/admin/major");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra");
        },
    });

    const { data: majorDetail } = useQuery({
        queryKey: ['MAJOR_DETAIL', id],
        queryFn: async () => {
            const res = await api.get(`/admin/major/${id}`)

            return res.data.data
        }
    })

    useEffect(() => {
        if (majorDetail) {
            reset({
                cate_code: majorDetail.cate_code,
                cate_name: majorDetail.cate_name,
                parrent_code: majorDetail.parrent_code,
                is_active: majorDetail.is_active,
                value: majorDetail.value,
                description: majorDetail.description,
            })
        }
    }, [majorDetail, reset]);

    const onSubmit = (data) => {
        const formData = new FormData();
        formData.append('cate_code', data.cate_code);
        formData.append('cate_name', data.cate_name);
        formData.append('parrent_code', data.parrent_code);
        formData.append('is_active', +data.is_active); // Chuyển đổi giá trị is_active
        formData.append('description', data.description);
        formData.append('value', data.value);
        formData.append("_method", "PUT")

        // Thêm file vào FormData
        if (data.image && data.image.length > 0) {
            formData.append('image', data.image[0]);
        }

        mutate(formData);
>>>>>>> main
    };

    return (
        <>
            <div className="mb-6 mt-2">
                <Link to="/admin/major">
                    <button className="btn btn-primary">DS chuyên ngành</button>
                </Link>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
<<<<<<< HEAD
                                <div className="card-title">
                                    Cập Nhật Chuyên Ngành
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="form-group">
                                        <label htmlFor="cate_code">
                                            Mã chuyên ngành
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            {...register("cate_code", {
                                                required: true,
                                            })}
                                            placeholder="Nhập mã chuyên ngành"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="cate_name">
                                            Tên chuyên ngành
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            {...register("cate_name", {
                                                required: true,
                                            })}
                                            placeholder="Nhập tên chuyên ngành"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="parrent_code">
                                            Mã danh mục cha
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            {...register("parrent_code")}
                                            placeholder="Nhập mã danh mục cha"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="value">Giá trị</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            {...register("value")}
                                            placeholder="Nhập giá trị"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="description">
                                            Mô tả
                                        </label>
                                        <textarea
                                            className="form-control"
                                            rows={5}
                                            {...register("description")}
                                            placeholder="Nhập mô tả"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="is_active">
                                            Trạng thái
                                        </label>
                                        <select
                                            className="form-select"
                                            {...register("is_active")}
                                        >
                                            <option value={1}>Công khai</option>
                                            <option value={0}>Ẩn</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="image">Hình ảnh</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            {...register("image")}
                                            placeholder="Nhập URL hình ảnh"
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
                                    onClick={() => navigate(-1)}
                                >
=======
                                <div className="card-title">Cập Nhật Chuyên Ngành</div>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="form-group">
                                        <label htmlFor="cate_code">Mã chuyên ngành</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            {...register("cate_code", { required: true })}
                                            placeholder="Nhập mã chuyên ngành"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="cate_name">Tên chuyên ngành</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            {...register("cate_name", { required: true })}
                                            placeholder="Nhập tên chuyên ngành"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="parrent_code">Chuyên ngành cha</label>
                                        <select
                                            className="form-select"
                                            {...register("parrent_code")}
                                        >
                                            <option value="">-- Lựa chọn --</option>
                                            {listMajor?.map((element, index) => (
                                                <option key={index} value={element.cate_code}>
                                                    {element.cate_name}
                                                </option>
                                            ))}

                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="value">Giá trị</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            {...register("value")}
                                            placeholder="Nhập giá trị"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="is_active">Trạng thái</label>
                                        <select
                                            className="form-select"
                                            {...register("is_active")}
                                        >
                                            <option value={1}>Công khai</option>
                                            <option value={0}>Ẩn</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="image">Hình ảnh</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            {...register("image")}
                                        />
                                    </div>

                                    {majorDetail?.image && (
                                        <div>
                                            <label htmlFor="">Preview</label>

                                            <img src={getImageUrl(majorDetail?.image)} alt="Preview" className="mt-2 w-40 h-40 object-cover border rounded" />
                                        </div>
                                    )}

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
                                <button type="button" className="btn btn-danger" onClick={() => nav("/admin/major")}>
>>>>>>> main
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
