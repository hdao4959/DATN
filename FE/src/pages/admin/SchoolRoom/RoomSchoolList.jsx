import { Link } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../../config/axios";
import Modal from "./Modal";
import { useState } from "react";
import { toast } from "react-toastify";
import Spinner from "../../../components/Spinner/Spinner";

const RoomSchoolList = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedSchoolRooms, setSelectedSchoolRooms] = useState();

    const onModalVisible = () => setModalOpen((prev) => !prev);

    const { data, refetch, isFetching } = useQuery({
        queryKey: ["LIST_SCHOOLROOMS"],
        queryFn: async () => {
            const res = await api.get("/admin/schoolrooms");
            return res.data.data;
        },
    });

    const { mutate, isLoading } = useMutation({
        mutationFn: (cateCode) => api.delete(`/admin/schoolrooms/${cateCode}`),
        onSuccess: () => {
            toast.success("Xóa phòng học thành công");
            onModalVisible();
            refetch();
        },
        onError: () => {
            toast.error("Có lỗi xảy ra khi xóa phòng học");
        },
    });

    const { mutate: onUpdateRoomStt } = useMutation({
        mutationFn: (code) => api.post(`/admin/updateActive/${code}`),
        onSuccess: () => {
            toast.success('Cập nhật trạng thái thành công');
            refetch();
        },
        onError: () => {
            toast.error('Có lỗi xảy ra khi cập nhật trạng thái');
        }
    });

    const handleDelete = (cateCode) => {
        setSelectedSchoolRooms(cateCode);
        onModalVisible();
    };

    if (isFetching && !data) return <Spinner />;

    return (
        <>
            <div className="mb-3 mt-2 flex items-center justify-between">
                <Link to="/admin/schoolrooms/add">
                    <button className="btn btn-primary">Thêm phòng học</button>
                </Link>
            </div>

            <div className="card">
                <div className="card-header">
                    <h4 className="card-title">School Room Management</h4>
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
                                    <i className="fa-solid fa-circle-check fs-20 color-green"></i>
                                    <table
                                        id="basic-datatables"
                                        className="display table table-striped table-hover dataTable"
                                        role="grid"
                                        aria-describedby="basic-datatables_info"
                                    >
                                        <thead>
                                            <tr role="row">
                                                <th>ID</th>
                                                <th>Mã phòng học</th>
                                                <th>Tên phòng học</th>
                                                <th>Sinh viên</th>
                                                {/* <th>Mô tả</th> */}
                                                <th>Trạng thái</th>
                                                <th>Hình ảnh</th>
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
                                                    {/* <td>{it.description}</td> */}
                                                    <td>
                                                        <div onClick={() => onUpdateRoomStt(it.cate_code)} className="cursor-pointer inline-block">
                                                            {it.is_active == 1 ? (
                                                                <i
                                                                    className="fas fa-check-circle fs-20 color-green"
                                                                    style={{
                                                                        color: "green",
                                                                        fontSize:
                                                                            "25px",
                                                                    }}
                                                                ></i>
                                                            ) : (
                                                                <i
                                                                    className="fas fa-ban fs-20 color-danger"
                                                                    style={{
                                                                        color: "red",
                                                                        fontSize:
                                                                            "25px",
                                                                    }}
                                                                ></i>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <img
                                                            src={
                                                                it.image
                                                                    ? "http://localhost:8000/storage/" +
                                                                      it.image
                                                                    : "https://thumbs.dreamstime.com/b/no-image-icon-vector-available-picture-symbol-isolated-white-background-suitable-user-interface-element-205805243.jpg"
                                                            }
                                                            alt={it.name}
                                                            width={50}
                                                            height={50}
                                                        />
                                                    </td>
                                                    <td>
                                                        <div className="flex gap-x-2 items-center">
                                                            <Link
                                                                to={`/admin/schoolrooms/${it.cate_code}/edit`}
                                                            >
                                                                <i className="fas fa-edit"></i>
                                                            </Link>

                                                            <i
                                                                className="fas fa-trash ml-6 cursor-pointer"
                                                                onClick={() =>
                                                                    handleDelete(it.cate_code)
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

            <Modal
                title="Xoá phòng học"
                description="Bạn có chắc chắn muốn xoá phòng học này?"
                closeTxt="Huỷ"
                okTxt="Xác nhận"
                visible={modalOpen}
                onVisible={onModalVisible}
                onOk={() => mutate(selectedSchoolRooms)}
            />
        </>
    );
};
export default RoomSchoolList;
