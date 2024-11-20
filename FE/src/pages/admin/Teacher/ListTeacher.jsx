import React, { useEffect, useState } from 'react'
import api from '../../../config/axios'
import { Link } from 'react-router-dom';

const ListTeacher = () => {
    const [teachers, setTeacher] = useState([]);


    const getData =  async () => {
        
        const response = await api.get('admin/teachers');
        setTeacher(response.data);
       
    }
    useEffect(() =>  {
        getData();
    }, [])
    
    const handleExport = async () => {
        try {
            const response = await api.get('/admin/students/export', { responseType: 'blob' })
            const url = window.URL.createObjectURL(new Blob([response.data]));
            // Tạo một link tải file và kích hoạt download
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'exported_data.xlsx'); // Đặt tên file tải về
            document.body.appendChild(link);
            link.click();

            // Xóa link sau khi tải xong
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error("Error exporting:", error);
        }
    }
    
  
    if (!teachers) return <div>Loading...</div>;

  return (
    <div>
       <div className="mb-3 mt-2 flex justify-between">
                <div>
                    <Link to="/admin/account/create">
                        <button className="btn btn-primary mx-2">Thêm tài khoản</button>
                    </Link>
                </div>
                <div>
                    <button className="btn btn-success mx-2"> <i class="fa fa-file-import"></i> Import</button>
                    <button onClick={handleExport} className="btn btn-secondary mx-2"> <i class="fa fa-download"></i> Export</button>
                </div>
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
                                                <th>Khóa học</th>
                                                <th>Trạng thái</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {teachers.map((it, index) => (
                                                <tr
                                                    role="row"
                                                    key={index}
                                                    className="odd"
                                                >
                                                    <td>{it.id}</td>
                                                    <td>{it.user_code}</td>
                                                    <td>{it.full_name}</td>
                                                    <td>{it.email}</td>
                                                    <td>{it.course?.cate_name}</td>
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
                                                                to={`/admin/students/edit/${it.user_code}`}
                                                            >
                                                                <i className="fas fa-edit"></i>
                                                            </Link>

                                                            <i
                                                                className="fas fa-trash ml-6"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        it.user_code
                                                                    )
                                                                }
                                                                // disabled={
                                                                //     isLoading
                                                                // }
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
                                        Showing 1 to 10 of {teachers.length} entries
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
    </div>
  )
}

export default ListTeacher
