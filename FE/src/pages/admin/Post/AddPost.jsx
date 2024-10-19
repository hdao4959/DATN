import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";

const AddPost = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const navigate = useNavigate();

    // const { mutate } = useMutation({
    //     mutationKey: ["ADD_GRADE_COMPONENTS"],
    //     mutationFn: (data) => api.post("/admin/pointheads", data),
    //     onSuccess: () => {
    //         toast.success("Thêm điểm thành phần thành công");
    //         navigate("/admin/grade-components");
    //     },
    //     onError: (error) => {
    //         toast.error(error?.response?.data?.message || "Có lỗi xảy ra");
    //     },
    // });

    const onSubmit = () => {};

    return (
        <>
            <div className="mb-6 mt-2">
                <Link to="/admin/major">
                    <button className="btn btn-primary">DS bài viết</button>
                </Link>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <div className="card-title">Thêm bài viết</div>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="form-group">
                                        <label htmlFor="cate_code">
                                            Tiêu đề
                                            <span className="text-red-500 font-semibold ml-1 text-lg">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            {...register("cate_code", {
                                                required: "Tiêu đề là bắt buộc",
                                            })}
                                            placeholder="Nhập tiêu đề"
                                        />
                                        {errors.cate_code && (
                                            <span className="text-danger">
                                                {errors.cate_code.message}
                                            </span>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="cate_name">
                                            Mã bài viết
                                            <span className="text-red-500 font-semibold ml-1 text-lg">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            {...register("cate_name", {
                                                required:
                                                    "Mã bài viết là bắt buộc",
                                            })}
                                            placeholder="Nhập mã bài viết"
                                        />
                                        {errors.cate_name && (
                                            <span className="text-danger">
                                                {errors.cate_name.message}
                                            </span>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="value">
                                            Vị trí sắp xếp
                                            <span className="text-red-500 font-semibold ml-1 text-lg">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            {...register("value", {
                                                required:
                                                    "Vị trí sắp xếp là bắt buộc",
                                                min: {
                                                    value: 0,
                                                    message:
                                                        "Giá trị không hợp lệ",
                                                },
                                            })}
                                            placeholder="Nhập vị trí sắp xếp"
                                        />
                                        {errors.value && (
                                            <span className="text-danger">
                                                {errors.value.message}
                                            </span>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="cate_name">
                                            Tags
                                            <span className="text-red-500 font-semibold ml-1 text-lg">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Nhập tags bài viết"
                                        />
                                        {errors.cate_name && (
                                            <span className="text-danger">
                                                {errors.cate_name.message}
                                            </span>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="image">
                                            Ảnh đại diện
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
                                        <label htmlFor="is_active">
                                            Hiển thị
                                        </label>
                                        <select className="form-select">
                                            <option value={1}>Hiển thị</option>
                                            <option value={0}>Ẩn</option>
                                        </select>
                                        {errors.is_active && (
                                            <span className="text-danger">
                                                {errors.is_active.message}
                                            </span>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="description">
                                            Nội dung hiển thị
                                            <span className="text-red-500 font-semibold ml-1 text-lg">
                                                *
                                            </span>
                                        </label>
                                        <textarea
                                            className="form-control"
                                            rows={5}
                                            {...register("description", {
                                                required:
                                                    "Vui lòng nhập nội dung hiển thị",
                                            })}
                                            placeholder="Nhập nội dung hiển thị"
                                        />
                                        {errors.description && (
                                            <span className="text-danger">
                                                {errors.description.message}
                                            </span>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="is_active">
                                            Ngày hết hạn
                                        </label>
                                        <input
                                            type="datetime-local"
                                            name=""
                                            className="form-control"
                                            id=""
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="is_active">
                                            Danh mục
                                        </label>
                                        <select className="form-select">
                                            <option value={1}>
                                                Chọn danh mục
                                            </option>
                                            <option value={0}>
                                                Danh mục 1
                                            </option>
                                            <option value={0}>
                                                Danh mục 2
                                            </option>
                                        </select>
                                        {errors.is_active && (
                                            <span className="text-danger">
                                                {errors.is_active.message}
                                            </span>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="is_active">
                                            Nội dung
                                        </label>

                                        <ReactQuill
                                            theme="snow"
                                            className="h-[300px] mb-10"
                                            placeholder="Nhập nội dung bài viết"
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

export default AddPost;
