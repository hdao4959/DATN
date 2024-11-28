import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../config/axios";
import { toast } from "react-toastify";

const EditTeacherAccount = () => {
    const { user_code } = useParams();
    const navigate = useNavigate();

    const {
        data: user,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["user", user_code],
        queryFn: async () => {
            const response = await api.get(`/admin/teachers/${user_code}`);
            return response.data;
        },
    });

    const { data: majors } = useQuery({
        queryKey: ["LIST_MAJORS"],
        queryFn: async () => {
            const res = await api.get("/listParentMajorsForForm");
            return res.data;
        },
    });

    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        phone_number: "",
        sex: "",
        birthday: "",
        address: "",
        citizen_card_number: "",
        issue_date: "",
        place_of_grant: "",
        nation: "",
        major_code: "",
    });

    useEffect(() => {
        if (user) {
            setFormData({
                full_name: user.full_name || "",
                email: user.email || "",
                phone_number: user.phone_number || "",
                sex: user.sex || "",
                birthday: user.birthday || "",
                address: user.address || "",
                citizen_card_number: user.citizen_card_number || "",
                issue_date: user.issue_date || "",
                place_of_grant: user.place_of_grant || "",
                nation: user.nation || "",
                major_code: user.major?.cate_code || "",
            });
        }
    }, [user]);

    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: async (updatedData) => {
            const response = await api.patch(
                `/admin/teachers/${user_code}`,
                updatedData
            );
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["user", user_code]);
            toast.success("Cập nhật thông tin giảng viên thành công!");
        },
        onError: (error) => {
            toast.error(error.response.data.message);
        },
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        mutate(formData);
    };

    if (isLoading || !majors) {
        return (
            <div
                className="d-flex justify-content-center align-items-center"
                style={{ height: "100vh" }}
            >
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (isError) return <div>Error loading user data</div>;

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-6 form-group">
                        <label>Họ và tên</label>
                        <input
                            type="text"
                            className="form-control"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col-md-6 form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            className="form-control"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6 form-group">
                        <label>Số điện thoại</label>
                        <input
                            type="tel"
                            className="form-control"
                            name="phone_number"
                            value={formData.phone_number}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col-md-6 form-group">
                        <label>Giới tính</label>
                        <select
                            className="form-select"
                            name="sex"
                            value={formData.sex}
                            onChange={handleChange}
                        >
                            <option value="male">Nam</option>
                            <option value="female">Nữ</option>
                            <option value="other">Khác</option>
                        </select>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6 form-group">
                        <label>Ngày sinh</label>
                        <input
                            type="date"
                            className="form-control"
                            name="birthday"
                            value={formData.birthday}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col-md-6 form-group">
                        <label>Địa chỉ</label>
                        <input
                            type="text"
                            className="form-control"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6 form-group">
                        <label>Số CCCD</label>
                        <input
                            type="text"
                            className="form-control"
                            name="citizen_card_number"
                            value={formData.citizen_card_number}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col-md-6 form-group">
                        <label>Ngày cấp</label>
                        <input
                            type="date"
                            className="form-control"
                            name="issue_date"
                            value={formData.issue_date}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6 form-group">
                        <label>Nơi cấp</label>
                        <input
                            type="text"
                            className="form-control"
                            name="place_of_grant"
                            value={formData.place_of_grant}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col-md-6 form-group">
                        <label>Dân tộc</label>
                        <input
                            type="text"
                            className="form-control"
                            name="nation"
                            value={formData.nation}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6 form-group">
                        <label>Chuyên ngành</label>
                        <select
                            className="form-select"
                            name="major_code"
                            value={formData.major_code}
                            onChange={handleChange}
                        >
                            {majors?.map((major) => (
                                <option
                                    key={major.cate_code}
                                    value={major.cate_code}
                                >
                                    {major.cate_name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <button type="submit" className="btn btn-primary">
                    Sửa thông tin giảng viên
                </button>
            </form>
        </div>
    );
};

export default EditTeacherAccount;
