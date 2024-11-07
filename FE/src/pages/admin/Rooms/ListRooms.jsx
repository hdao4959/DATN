import { Link } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../../config/axios";
import { getToken } from "../../../utils/getToken";

const ClassRoomsList = () => {
    const accessToken = getToken();

    const { data, refetch } = useQuery({
        queryKey: ["LIST_ROOMS"],
        queryFn: async () => {
            const res = await api.get("/admin/classrooms", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            });
            return res.data;
        },
    });
    const classrooms = data?.classrooms?.data || [];

    const { mutate, isLoading } = useMutation({
        mutationFn: (class_code) =>
            api.delete(`/admin/classrooms/${class_code}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            }),
        onSuccess: () => {
            alert("Xóa phòng học thành công");
            refetch();
        },
        onError: () => {
            alert("Có lỗi xảy ra khi xóa phòng học");
        },
    });

    const handleDelete = (class_code) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa phòng học này không?")) {
            mutate(class_code);
        }
    };

    if (!data) return <div>Loading...</div>;

    return (
        <>
            <div className="mb-3 mt-2 flex items-center justify-between">
                <Link to="/admin/classrooms/add">
                    <button className="btn btn-primary">
                        Tạo lịch học mới
                    </button>
                </Link>
            </div>

            <div className="card">
                <div className="card-header">
                    <h4 className="card-title">Classrooms Management</h4>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="display table table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Mã lớp học</th>
                                    <th>Tên lớp</th>
                                    <th>Số lượng sinh viên</th>
                                    <th>Môn học</th>
                                    <th>Trạng thái</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {classrooms.map((it, index) => (
                                    <tr key={index} className="odd text-center">
                                        <Link
                                            to={`/admin/classrooms/view/${it.class_code}`}
                                            style={{ display: "contents" }}
                                        >
                                            <td>{it.id}</td>
                                            <td>{it.class_code}</td>
                                            <td>{it.class_name}</td>
                                            <td>30</td>
                                            <td>LTWE</td>
                                            <td>
                                                {it.is_active == true ? (
                                                    <i
                                                        className="fas fa-check-circle"
                                                        style={{
                                                            color: "green",
                                                        }}
                                                    ></i>
                                                ) : (
                                                    <i
                                                        className="fas fa-times-circle"
                                                        style={{
                                                            color: "red",
                                                        }}
                                                    ></i>
                                                )}
                                            </td>
                                        </Link>
                                        <td>
                                            <div>
                                                <Link
                                                    to={`/admin/classrooms/edit/${it.class_code}`}
                                                >
                                                    <i className="fas fa-edit"></i>
                                                </Link>
                                                <i
                                                    className="fas fa-trash ml-6"
                                                    onClick={() =>
                                                        handleDelete(
                                                            it.class_code
                                                        )
                                                    }
                                                    disabled={isLoading}
                                                ></i>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ClassRoomsList;
