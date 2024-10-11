import { Link } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../../config/axios";

const ListAccount = () => {
    const { data, refetch } = useQuery({
        queryKey: ["LIST_ACCOUNT"],
        queryFn: async () => {
            const res = await api.get("/admin/users");
            return res.data;
        },
    });
    const users = data?.data || [];
    console.log(users);

    const { mutate, isLoading } = useMutation({
        mutationFn: (user_code) => api.delete(`/admin/users/${user_code}`),
        onSuccess: () => {
            alert("Xóa tài khoản thành công");
            refetch();
        },
        onError: () => {
            alert("Có lỗi xảy ra khi xóa tài khoản");
        },
    });
    const handleDelete = (user_code) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa tài khoản này không?")) {
            mutate(user_code);
        }
    };

    if (!data) return <div>Loading...</div>;

    return (
        <>
            <div className="mb-3 mt-2 flex items-center justify-between">
                <Link to="/admin/account/create">
                    <button className="btn btn-primary">Thêm tài khoản</button>
                </Link>
            </div>

            <div className="card">
                <div className="card-header">
                    <h4 className="card-title">Account Management</h4>
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
                                                <th>Mã người dùng</th>
                                                <th>Họ và tên</th>
                                                <th>Email</th>
                                                <th>Ngày sinh</th>
                                                <th>Quyền</th>
                                                <th>Trạng thái</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map((it, index) => (
                                                <tr
                                                    role="row"
                                                    key={index}
                                                    className="odd"
                                                >
                                                    <td>{it.id}</td>
                                                    <td>{it.user_code}</td>
                                                    <td>{it.full_name}</td>
                                                    <td>{it.email}</td>
                                                    <td>{it.birthday}</td>
                                                    <td>{it.role}</td>
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
                                                                className="fa-solid fa-ban"
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

export default ListAccount;
