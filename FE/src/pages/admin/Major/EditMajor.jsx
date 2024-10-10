import { Link } from "react-router-dom";

const EditMajor = () => {
    return (
        <>
            <div className="mb-6 mt-2">
                <Link to="/admin/major">
                    <button className="btn btn-primary">DS chuyên ngành</button>
                </Link>
            </div>

            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">
                            <div className="card-title">Edit Major</div>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="form-group">
                                    <label htmlFor="email2">
                                        Mã chuyên ngành
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="Nhập mã chuyên ngành"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email2">
                                        Tên chuyên ngành
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="Nhập tên chuyên ngành"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="exampleFormControlSelect1">
                                        Chế độ hiển thị
                                    </label>
                                    <select className="form-select">
                                        <option>Công khai</option>
                                        <option>Ẩn</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="exampleFormControlSelect1">
                                        Chọn kiểu
                                    </label>
                                    <select className="form-select">
                                        <option>Kiểu 1</option>
                                        <option>Kiểu 2</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="exampleFormControlSelect1">
                                        Danh mục cha
                                    </label>
                                    <select className="form-select">
                                        <option>CNTT</option>
                                        <option>Digital Marketing</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="comment">Mô tả</label>
                                    <textarea
                                        className="form-control"
                                        rows={5}
                                        placeholder="Nhập mô tả"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="card-action gap-x-3 flex">
                            <button className="btn btn-success">Submit</button>
                            <button className="btn btn-danger">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EditMajor;
