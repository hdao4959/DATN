import { useMutation, useQueryClient } from "@tanstack/react-query"; // Thêm useQueryClient
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import api from "../../../config/axios";

const AddMajor = () => {
    const { register, handleSubmit, reset } = useForm();
    const nav = useNavigate();
    const queryClient = useQueryClient(); // Khởi tạo queryClient

    const { mutate } = useMutation({
        mutationFn: (data) => api.post("/admin/category", data),
        onSuccess: () => {
            queryClient.invalidateQueries(['majors']); // Invalidate query để cập nhật danh sách
            alert("Thêm chuyên ngành thành công");
            reset();
            nav("/admin/major");
        },
        onError: (error) => {
            alert(error?.response?.data?.message || "Có lỗi xảy ra");
        },
    });

    const onSubmit = (data) => {
        const finalData = {
            ...data,
            type: "major",
            is_active: data.is_active === "true" // Chuyển đổi giá trị is_active
        };
        console.log(finalData);
        mutate(finalData); // Gọi hàm mutate để thực hiện mutation
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
                                <div className="card-title">Thêm Chuyên Ngành</div>
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
                                        <label htmlFor="parrent_code">Mã danh mục cha</label>
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
                                        <label htmlFor="description">Mô tả</label>
                                        <textarea
                                            className="form-control"
                                            rows={5}
                                            {...register("description")}
                                            placeholder="Nhập mô tả"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="is_active">Trạng thái</label>
                                        <select
                                            className="form-select"
                                            {...register("is_active")}
                                        >
                                            <option value="true">Công khai</option>
                                            <option value="false">Ẩn</option>
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
};

export default AddMajor;
