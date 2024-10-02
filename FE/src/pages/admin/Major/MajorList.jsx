import { Link } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../../config/axios";

const MajorList = () => {
    const { data, refetch } = useQuery({
        queryKey: ["LIST_MAJOR"],
        queryFn: async () => {
            const res = await api.get("/admin/category");
            return res.data;
        }
    });

    const { mutate, isLoading } = useMutation({

        mutationFn: (id) => api.delete(`/admin/category/${id}`),
        onSuccess: () => {
            alert('Xóa chuyên ngành thành công');
            refetch();
        },
        onError: () => {
            alert('Có lỗi xảy ra khi xóa chuyên ngành');
        }
    });
    const handleDelete = (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa chuyên ngành này không?')) {
            mutate(id);
        }
    };
    if (!data) return <div>Loading...</div>;

    return (
        <>
            <div className="mb-3 mt-2 flex items-center justify-between">
                <Link to="/admin/major/add">
                    <button className="btn btn-primary">
                        Thêm chuyên ngành
                    </button>
                </Link>
            </div>

            <div className="card">
                <div className="card-header">
                    <h4 className="card-title">Major Management</h4>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <div className="dataTables_wrapper container-fluid dt-bootstrap4">
                            <div className="row">
                                <div className="col-sm-12 col-md-6">
                                    <div
                                        className="dataTables_length"
                                        id="basic-datatables_length"
                                    >
                                        <label>
                                            Show{" "}
                                            <select
                                                name="basic-datatables_length"
                                                aria-controls="basic-datatables"
                                                className="form-control form-control-sm"
                                            >
                                                <option value={10}>10</option>
                                                <option value={25}>25</option>
                                                <option value={50}>50</option>
                                                <option value={100}>100</option>
                                            </select>{" "}
                                            entries
                                        </label>
                                    </div>
                                </div>
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
                                                <th>Mã chuyên ngành</th>
                                                <th>Tên chuyên ngành</th>
                                                <th>Value</th>
                                                <th>Mô tả</th>
                                                <th>Trạng thái</th>
                                                <th>Hình ảnh</th>
                                                <th>Kiểu</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.map((it, index) => (
                                                <tr
                                                    role="row"
                                                    key={index}
                                                    className="odd"
                                                >
                                                    <td>{it.id}</td>
                                                    <td>{it.cate_code}</td>
                                                    <td>{it.cate_name}</td>
                                                    <td>{it.value}</td>
                                                    <td>{it.description}</td>
                                                    <td>
                                                        {it.status
                                                            ? "Hiển thị"
                                                            : "Ẩn"}
                                                    </td>
                                                    <td>
                                                        <img
                                                            src={it.image}
                                                            alt={it.name}
                                                            width={50}
                                                            height={50}
                                                        />
                                                    </td>
                                                    <td>{it.type}</td>
                                                    <td>
                                                        <div className="flex gap-x-2">
                                                            <Link to={`/admin/major/${it.id}/edit`}>
                                                                <button className="btn btn-primary">
                                                                    Edit
                                                                </button>
                                                            </Link>

                                                            <button
                                                                className="btn btn-danger"
                                                                onClick={() => handleDelete(it.id)}
                                                                disabled={isLoading}
                                                            >
                                                                Delete
                                                            </button>

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

export default MajorList;
