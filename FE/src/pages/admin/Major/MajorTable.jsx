import { useMutation } from "@tanstack/react-query";
import api from "../../../config/axios";
import { toast } from "react-toastify";
import Modal from "./Modal";
import { useState } from "react";
import { Link } from "react-router-dom";

const MajorTable = ({ data = [], refetch }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedMajor, setSelectedMajor] = useState();

    const onModalVisible = () => setModalOpen((prev) => !prev);

    const updateStatusMutation = useMutation({
        mutationFn: (code) => api.post(`/admin/updateActive/${code}`),
        onSuccess: () => {
            toast.success("Cập nhật trạng thái thành công");
            refetch(); // Lấy lại dữ liệu sau khi cập nhật
        },
        onError: () => {
            toast.error("Có lỗi xảy ra khi cập nhật trạng thái");
        },
    });

    const updateStatus = (code) => {
        updateStatusMutation.mutate(code);
    };

    const { mutate, isLoading } = useMutation({
        mutationFn: (id) => api.delete(`/admin/majors/${id}`),
        onSuccess: () => {
            toast.success("Xóa chuyên ngành thành công");
            onModalVisible();
            refetch();
        },
        onError: () => {
            toast.error("Có lỗi xảy ra khi xóa chuyên ngành");
        },
    });
    const handleDelete = (id) => {
        setSelectedMajor(id);
        onModalVisible();
    };

    if (!data?.length) {
        return (
            <tr>
                <td colSpan="6">No data available</td>
            </tr>
        );
    }

    return (
        <>
            {data.map((it, index) => (
                <>
                    <tr role="row" key={index} className="odd">
                        <td>{it.id}</td>
                        <td>{it.cate_code}</td>
                        <td>{it.cate_name}</td>
                        <td>
                            {it.is_active == 1 ? (
                                <i
                                    onClick={() => updateStatus(it.cate_code)}
                                    disabled={isLoading}
                                    className="fas fa-check-circle fs-20 color-green"
                                    style={{
                                        color: "green",
                                        fontSize: "25px",
                                    }}
                                ></i>
                            ) : (
                                <i
                                    onClick={() => updateStatus(it.cate_code)}
                                    disabled={isLoading}
                                    className="fas fa-ban fs-20 color-danger"
                                    style={{
                                        color: "red",
                                        fontSize: "25px",
                                    }}
                                ></i>
                            )}
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
                                <Link to={`/admin/major/${it.cate_code}/edit`}>
                                    <i className="fas fa-edit"></i>
                                </Link>

                                <i
                                    className="fas fa-trash ml-6 cursor-pointer"
                                    onClick={() => handleDelete(it.cate_code)}
                                    disabled={isLoading}
                                ></i>
                            </div>
                        </td>
                    </tr>

                    {it.childrens.length > 0 &&
                        it.childrens.map((child) => (
                            <tr role="row" key={index} className="odd">
                                <td>{child.id}</td>
                                <td>{child.cate_code}</td>
                                <td>-- {child.cate_name}</td>
                                <td>
                                    {child.is_active == 1 ? (
                                        <i
                                            onClick={() =>
                                                updateStatus(child.cate_code)
                                            }
                                            disabled={isLoading}
                                            className="fas fa-check-circle fs-20 color-green"
                                            style={{
                                                color: "green",
                                                fontSize: "25px",
                                            }}
                                        ></i>
                                    ) : (
                                        <i
                                            onClick={() =>
                                                updateStatus(child.cate_code)
                                            }
                                            disabled={isLoading}
                                            className="fas fa-ban fs-20 color-danger"
                                            style={{
                                                color: "red",
                                                fontSize: "25px",
                                            }}
                                        ></i>
                                    )}
                                </td>
                                <td>
                                    <img
                                        src={
                                            child.image
                                                ? "http://localhost:8000/storage/" +
                                                  child.image
                                                : "https://thumbs.dreamstime.com/b/no-image-icon-vector-available-picture-symbol-isolated-white-background-suitable-user-interface-element-205805243.jpg"
                                        }
                                        alt={child.name}
                                        width={50}
                                        height={50}
                                    />
                                </td>
                                <td>
                                    <div className="flex gap-x-2 items-center">
                                        <Link
                                            to={`/admin/major/${child.cate_code}/edit`}
                                        >
                                            <i className="fas fa-edit"></i>
                                        </Link>

                                        <i
                                            className="fas fa-trash ml-6 cursor-pointer"
                                            onClick={() =>
                                                handleDelete(child.cate_code)
                                            }
                                            disabled={isLoading}
                                        ></i>
                                    </div>
                                </td>
                            </tr>
                        ))}
                </>
            ))}

            <Modal
                title="Xoá chuyên ngành"
                description="Bạn có chắc chắn muốn xoá chuyên ngành này?"
                closeTxt="Huỷ"
                okTxt="Xác nhận"
                visible={modalOpen}
                onVisible={onModalVisible}
                onOk={() => mutate(selectedMajor)}
            />
        </>
    );
};

export default MajorTable;
