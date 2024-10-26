import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../config/axios";
import { toast } from "react-toastify";
import { queryClient } from "../../../main";
import Modal from "../../../components/Modal/Modal";

const PostCategoryTable = ({ data }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedPostCategory, setSelectedPostCategory] = useState();

    const onModalVisible = () => setModalOpen((prev) => !prev);

    const { mutate } = useMutation({
        mutationFn: (id) => api.delete(`/admin/category/${id}`),
        onSuccess: () => {
            toast.success("Xóa điểm thành phần thành công");
            onModalVisible();
            queryClient.invalidateQueries(["POST_CATEGORY"]);
        },
        onError: () => {
            toast.error("Có lỗi xảy ra khi xóa điểm thành phần");
        },
    });

    const handleDelete = (id) => {
        setSelectedPostCategory(id);
        onModalVisible();
    };

    return (
        <>
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
                                <th>Mã danh mục</th>
                                <th>Tên danh mục</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((it, index) => (
                                <tr role="row" key={index} className="odd">
                                    <td>{it.id}</td>
                                    <td>{it.cate_code}</td>
                                    <td>{it.cate_name}</td>
                                    <td>
                                        <div className="flex gap-x-2 items-center">
                                            <Link
                                                to={`/post-category/${it.cate_code}/edit`}
                                            >
                                                <i className="fas fa-edit"></i>
                                            </Link>

                                            <div
                                                onClick={() =>
                                                    handleDelete(it.cate_code)
                                                }
                                                className="cursor-pointer"
                                            >
                                                <i className="fas fa-trash ml-6"></i>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal
                title="Xoá danh mục bài viết"
                description="Bạn có chắc chắn muốn xoá danh mục bài viết này?"
                closeTxt="Huỷ"
                okTxt="Xác nhận"
                visible={modalOpen}
                onVisible={onModalVisible}
                onOk={() => mutate(selectedPostCategory)}
            />
        </>
    );
};

PostCategoryTable.propTypes = {
    data: Object,
};

export default PostCategoryTable;
