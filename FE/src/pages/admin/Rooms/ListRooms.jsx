import { Link } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../../config/axios";

const ClassRoomsList = () => {
    const { data, refetch } = useQuery({
        queryKey: ["LIST_ROOMS"],
        queryFn: async () => {
            const res = await api.get("/admin/classrooms");
            return res.data;
        },
    });
    const classrooms = data?.classrooms?.data || [];

    const { mutate, isLoading } = useMutation({
        mutationFn: (class_code) =>
            api.delete(`/admin/classrooms/${class_code}`),
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
                    <button className="btn btn-primary">Thêm phòng học</button>
                </Link>
            </div>

            <div className="card">
                <div className="card-header">
                    <h4 className="card-title">Classrooms Management</h4>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <div className="dataTables_wrapper container-fluid dt-bootstrap4">
                            <div className="row">
                                <div className="col-sm-12 col-md-6">
                                    <div
                                        id="basic-datatables_filter"
                                        className="dataTables_filter"
                                    >
                                        <label>
                                            Search:
                                            <input
                                                type="search"
                                                className="form-control form-control-sm"
                                                placeholder=""
                                                aria-controls="basic-datatables"
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12">
                                    <table
                                        id="basic-datatables"
                                        className="display table table-striped table-hover dataTable"
                                        role="grid"
                                        aria-describedby="basic-datatables_info"
                                    >
                                        <thead>
                                            <tr role="row">
                                                <th>ID</th>
                                                <th>Mã lớp học</th>
                                                <th>Tên lớp</th>
                                                <th>Mô tả</th>
                                                <th>Số lượng sinh viên</th>
                                                <th>Môn học</th>
                                                <th>Trạng thái</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {classrooms.map((it, index) => (
                                                <tr
                                                    role="row"
                                                    key={index}
                                                    className="odd"
                                                >
                                                    <td>{it.id}</td>
                                                    <td>{it.class_code}</td>
                                                    <td>{it.class_name}</td>
                                                    <td>{it.description}</td>
                                                    <td>30</td>
                                                    <td>LTWE</td>
                                                    <td>
                                                        {it.is_active == 1 ? (
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
                                                                disabled={
                                                                    isLoading
                                                                }
                                                            ></i>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12 col-md-5">
                                    <div className="dataTables_info">
                                        Showing 1 to 10 of {data.length} entries
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-7">
                                    <div className="dataTables_paginate paging_simple_numbers">
                                        <ul className="pagination">
                                            <li className="paginate_button page-item previous disabled">
                                                <a
                                                    href="#"
                                                    className="page-link"
                                                >
                                                    Previous
                                                </a>
                                            </li>
                                            <li className="paginate_button page-item active">
                                                <a
                                                    href="#"
                                                    className="page-link"
                                                >
                                                    1
                                                </a>
                                            </li>
                                            <li className="paginate_button page-item ">
                                                <a
                                                    href="#"
                                                    className="page-link"
                                                >
                                                    2
                                                </a>
                                            </li>
                                            <li className="paginate_button page-item ">
                                                <a
                                                    href="#"
                                                    className="page-link"
                                                >
                                                    3
                                                </a>
                                            </li>

                                            <li className="paginate_button page-item next">
                                                <a
                                                    href="#"
                                                    className="page-link"
                                                >
                                                    Next
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ClassRoomsList;
