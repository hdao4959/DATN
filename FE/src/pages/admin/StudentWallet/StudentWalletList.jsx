const StudentWalletList = () => {
    return (
        <>
            <div className="card">
                <div className="card-header">
                    <h4 className="card-title">Student Wallet</h4>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <div className="dataTables_wrapper container-fluid dt-bootstrap4">
                            <div className="row justify-between items-center">
                                <div className="col-sm-12 col-md-6 text-left">
                                    <label className="flex items-center gap-2">
                                        Search:
                                        <input
                                            type="search"
                                            className="form-control form-control-sm w-auto !h-9"
                                            placeholder="Enter student name"
                                            aria-controls="basic-datatables"
                                        />
                                    </label>
                                </div>

                                <div className="col-sm-12 col-md-6 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <label htmlFor="smallSelect m-0">
                                            Filter
                                        </label>
                                        <select
                                            className="form-select form-control-sm w-44 h-9"
                                            id="smallSelect"
                                        >
                                            <option>Select status</option>
                                            <option>Hoàn thành</option>
                                            <option>Đang kiểm tra</option>
                                            <option>Đã xong</option>
                                            <option>Huỷ</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12">
                                    <i className="fa-solid fa-circle-check fs-20 color-green"></i>
                                    <table
                                        id="basic-datatables"
                                        className="display table table-striped table-hover dataTable"
                                        role="grid"
                                        aria-describedby="basic-datatables_info"
                                    >
                                        <thead>
                                            <tr role="row">
                                                <th></th>
                                                <th>ID</th>
                                                <th>Tên sinh viên</th>
                                                <th>Số tiền nợ</th>
                                                <th>Kỳ học</th>
                                                <th>Trạng thái</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr role="row" className="odd">
                                                <td>
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        defaultValue=""
                                                        id="flexCheckDefault"
                                                    />
                                                </td>
                                                <td>1</td>
                                                <td>Nguyễn Hữu An</td>
                                                <td>90.000đ</td>
                                                <td>Kỳ 1</td>
                                                <td>
                                                    <p className="text-success">
                                                        Hoàn thành
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr role="row" className="odd">
                                                <td>
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        defaultValue=""
                                                        id="flexCheckDefault"
                                                    />
                                                </td>
                                                <td>2</td>
                                                <td>Lê Hữu An</td>
                                                <td>100.000đ</td>
                                                <td>Kỳ 1</td>
                                                <td>
                                                    <p className="text-warning">
                                                        Đang kiểm tra
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr role="row" className="odd">
                                                <td>
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        defaultValue=""
                                                        id="flexCheckDefault"
                                                    />
                                                </td>
                                                <td>3</td>
                                                <td>Hoàng Hữu An</td>
                                                <td>900.000.000đ</td>
                                                <td>Kỳ 10</td>
                                                <td>
                                                    <p className="text-danger">
                                                        Đã xong
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr role="row" className="odd">
                                                <td>
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        defaultValue=""
                                                        id="flexCheckDefault"
                                                    />
                                                </td>
                                                <td>4</td>
                                                <td>Đặng Hữu An</td>
                                                <td>1.000đ</td>
                                                <td>Kỳ 11</td>
                                                <td>
                                                    <p className="text-danger">
                                                        Huỷ
                                                    </p>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="row">
                                {/* <div className="col-sm-12 col-md-5">
                                    <div className="dataTables_info">
                                        Showing 1 to 10 of {data.length} entries
                                    </div>
                                </div> */}
                                <div className="col-sm-12 col-md-7 ml-auto">
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

export default StudentWalletList;
