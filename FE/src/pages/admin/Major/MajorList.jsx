import { Link } from "react-router-dom";

const MAJOR_DATA = [
    {
        id: 1,
        code: "WE",
        name: "Lập trình Website",
        status: 0,
        type: "Kiểu 1",
        parentMajor: "CNTT",
    },
    {
        id: 2,
        code: "MAR",
        name: "Marketing",
        status: 1,
        type: "Kiểu 2",
        parentMajor: "CNTT",
    },
];

const MajorList = () => {
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
                                                <th
                                                    className="sorting_asc"
                                                    aria-controls="basic-datatables"
                                                    aria-sort="ascending"
                                                    aria-label="Name: activate to sort column descending"
                                                >
                                                    ID
                                                </th>
                                                <th
                                                    className="sorting"
                                                    aria-controls="basic-datatables"
                                                >
                                                    Mã
                                                </th>
                                                <th
                                                    className="sorting"
                                                    aria-controls="basic-datatables"
                                                >
                                                    Tên
                                                </th>
                                                <th
                                                    className="sorting"
                                                    aria-controls="basic-datatables"
                                                >
                                                    Chế độ hiển thị
                                                </th>
                                                <th
                                                    className="sorting"
                                                    aria-controls="basic-datatables"
                                                >
                                                    Kiểu
                                                </th>
                                                <th
                                                    className="sorting"
                                                    aria-controls="basic-datatables"
                                                >
                                                    Danh mục cha
                                                </th>
                                                <th
                                                    className="sorting"
                                                    aria-controls="basic-datatables"
                                                >
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {MAJOR_DATA.map((it, index) => (
                                                <tr
                                                    role="row"
                                                    key={index}
                                                    className="odd"
                                                >
                                                    <td>{it.id}</td>
                                                    <td>{it.code}</td>
                                                    <td>{it.name}</td>
                                                    <td>
                                                        {it.status
                                                            ? "Hiển thị"
                                                            : "Ẩn"}
                                                    </td>
                                                    <td>{it.type}</td>
                                                    <td>{it.parentMajor}</td>
                                                    <td>
                                                        <div className="flex gap-x-2">
                                                            <Link to="/admin/major/888/edit">
                                                                <button className="btn btn-primary">
                                                                    Edit
                                                                </button>
                                                            </Link>

                                                            <button className="btn btn-danger">
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
                                        Showing 1 to 10 of 57 entries
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
