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
