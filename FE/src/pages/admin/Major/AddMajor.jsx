import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import api from "../../../config/axios";
import { toast } from "react-toastify";
import { formatErrors } from "../../../utils/formatErrors";

const AddMajor = () => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm(); // Lấy formState để xử lý lỗi
    const nav = useNavigate();
    const { data: listMajor } = useQuery({
        queryKey: ["LIST_PARENT_MAJOR"],
        queryFn: async () => {
            const res = await api.get("/admin/majors");
            return res.data?.parent;
        },
    });
    const { mutate } = useMutation({
        mutationFn: (data) => api.post("/admin/majors", data),
        onSuccess: () => {
            toast.success("Thêm chuyên ngành thành công");
            reset();
            nav("/admin/major");
        },
        onError: (error) => {
            const msg = formatErrors(error);
            toast.error(msg || "Có lỗi xảy ra");
        },
    });

    const onSubmit = (data) => {
        const formData = new FormData();
        formData.append("cate_code", data.cate_code);
        formData.append("cate_name", data.cate_name);
        formData.append("parent_code", data.parent_code);
        formData.append("is_active", data.is_active);
        formData.append("description", data.description);
        formData.append("value", data.value);
        formData.append("type", "major");

        // Thêm file vào FormData
        formData.append("image", data.image[0]);

        mutate(formData);
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
                                    Thêm Chuyên Ngành
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="form-group">
                                        <label htmlFor="cate_code">
                                            Mã chuyên ngành
                                            <span className="text-red-500 font-semibold ml-1 text-lg">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            {...register("cate_code", {
                                                required:
                                                    "Mã chuyên ngành là bắt buộc",
                                            })}
                                            placeholder="Nhập mã chuyên ngành"
                                        />
                                        {errors.cate_code && (
                                            <span className="text-danger">
                                                {errors.cate_code.message}
                                            </span>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="cate_name">
                                            Tên chuyên ngành
                                            <span className="text-red-500 font-semibold ml-1 text-lg">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            {...register("cate_name", {
                                                required:
                                                    "Tên chuyên ngành là bắt buộc",
                                            })}
                                            placeholder="Nhập tên chuyên ngành"
                                        />
                                        {errors.cate_name && (
                                            <span className="text-danger">
                                                {errors.cate_name.message}
                                            </span>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="parent_code">
                                            Chuyên ngành cha
                                            <span className="text-red-500 font-semibold ml-1 text-lg">
                                                *
                                            </span>
                                        </label>
                                        <select
                                            className="form-select"
                                            {...register("parent_code", {
                                                required:
                                                    "Vui lòng chọn chuyên ngành cha",
                                            })}
                                        >
                                            <option value="">
                                                -- Lựa chọn --
                                            </option>
                                            {listMajor?.map(
                                                (element, index) => (
                                                    <option
                                                        key={index}
                                                        value={
                                                            element.cate_code
                                                        }
                                                    >
                                                        {element.cate_name}
                                                    </option>
                                                )
                                            )}
                                        </select>

                                        {errors.parent_code && (
                                            <span className="text-danger">
                                                {errors.parent_code.message}
                                            </span>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="value">
                                            Giá trị
                                            <span className="text-red-500 font-semibold ml-1 text-lg">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            {...register("value", {
                                                required:
                                                    "Vui lòng nhập giá trị",
                                            })}
                                            placeholder="Nhập giá trị"
                                        />

                                        {errors.value && (
                                            <span className="text-danger">
                                                {errors.value.message}
                                            </span>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="is_active">
                                            Trạng thái
                                        </label>
                                        <select
                                            className="form-select"
                                            {...register("is_active", {
                                                required:
                                                    "Trạng thái là bắt buộc",
                                            })}
                                        >
                                            <option value={1}>Công khai</option>
                                            <option value={0}>Ẩn</option>
                                        </select>
                                        {errors.is_active && (
                                            <span>
                                                {errors.is_active.message}
                                            </span>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="image">
                                            Hình ảnh
                                            <span className="text-red-500 font-semibold ml-1 text-lg">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            {...register("image", {
                                                required:
                                                    "Vui lòng chọn hình ảnh",
                                            })}
                                        />
                                        {errors.image && (
                                            <span className="text-danger">
                                                {errors.image.message}
                                            </span>
                                        )}
                                    </div>

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
                                                required: "Vui lòng nhập mô tả",
                                            })}
                                            placeholder="Nhập mô tả"
                                        />

                                        {errors.description && (
                                            <span className="text-danger">
                                                {errors.description.message}
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
                                    onClick={() => nav("/admin/major")}
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

export default AddMajor;
