import { NavLink } from "react-router-dom";

import styles from "./index.module.css";

const AdminMenu = () => {
    return (
        <ul className="nav nav-secondary">
            <li className="nav-item">
                <NavLink to="/admin" className={`${styles.menuItem} group`}>
                    <i className="fas fa-home text-lg text-[#b9babf] group-hover:text-[#6861ce]" />
                    <p className="text-[#b9babf]">Dashboard</p>
                </NavLink>
            </li>
            <li className="nav-item ">
                <a data-bs-toggle="collapse" href="#classroom">
                    <i className="fas fa-layer-group" />
                    <p>Quản lý lớp học</p>
                    <span className="caret" />
                </a>
                <div className="collapse" id="classroom">
                    <ul className="nav nav-collapse">
                        <li>
                            <NavLink
                                to="/admin/classrooms"
                                className={`${styles.menuItem} group`}
                            >
                                <p className="sub-item">Danh sách lớp học</p>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/admin/classrooms/add"
                                className={`${styles.menuItem} group`}
                            >
                                <p className="sub-item">Thêm mới lớp học</p>
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </li>
            <li className="nav-item ">
                <a data-bs-toggle="collapse" href="#schoolroom">
                    <i className="fas fa-layer-group" />
                    <p>Quản lý phòng học</p>
                    <span className="caret" />
                </a>
                <div className="collapse" id="schoolroom">
                    <ul className="nav nav-collapse">
                        <li>
                            <NavLink
                                to="/admin/schoolrooms"
                                className={`${styles.menuItem} group`}
                            >
                                <p className="sub-item">Danh sách phòng học</p>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/admin/schoolrooms/add"
                                className={`${styles.menuItem} group`}
                            >
                                <p className="sub-item">Thêm mới phòng học</p>
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </li>

            <li className="nav-item ">
                <a data-bs-toggle="collapse" href="#major">
                    <i className="fas fa-layer-group" />
                    <p>Quản lý chuyên ngành</p>
                    <span className="caret" />
                </a>
                <div className="collapse" id="major">
                    <ul className="nav nav-collapse">
                        <li>
                            <NavLink
                                to="/admin/major"
                                className={`${styles.menuItem} group`}
                            >
                                <p className="sub-item">
                                    Danh sách chuyên ngành
                                </p>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/admin/major/add"
                                className={`${styles.menuItem} group`}
                            >
                                <p className="sub-item">
                                    Thêm mới chuyên ngành
                                </p>
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </li>
            <li className="nav-item ">
                <a data-bs-toggle="collapse" href="#grade">
                    <i className="fas fa-layer-group" />
                    <p>Quản lý điểm</p>
                    <span className="caret" />
                </a>
                <div className="collapse" id="grade">
                    <ul className="nav nav-collapse">
                        {/* <li>
                            <NavLink
                                to="/admin/grades"
                                className={`${styles.menuItem} group`}
                            >
                                <p className="sub-item">Danh sách điểm</p>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/admin/grades/add"
                                className={`${styles.menuItem} group`}
                            >
                                <p className="sub-item">Thêm mới điểm</p>
                            </NavLink>
                        </li> */}
                        <li>
                            <NavLink
                                to="/admin/grade-components"
                                className={`${styles.menuItem} group`}
                            >
                                <p className="sub-item">Danh sách đầu điểm</p>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/admin/grade-components/add"
                                className={`${styles.menuItem} group`}
                            >
                                <p className="sub-item">Thêm mới đầu điểm</p>
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </li>
            <li className="nav-item ">
                <a data-bs-toggle="collapse" href="#wallet">
                    <i className="fas fa-layer-group" />
                    <p>Quản lý học phí</p>
                    <span className="caret" />
                </a>
                <div className="collapse" id="wallet">
                    <ul className="nav nav-collapse">
                        <li>
                            <NavLink
                                to="/admin/student-wallet"
                                className={`${styles.menuItem} group`}
                            >
                                <p className="sub-item">Danh sách học phí</p>
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </li>

            <li className="nav-item ">
                <a data-bs-toggle="collapse" href="#categories">
                    <i className="fas fa-layer-group" />
                    <p>Quản lý danh mục</p>
                    <span className="caret" />
                </a>
                <div className="collapse" id="categories">
                    <ul className="nav nav-collapse">
                        <li>
                            <NavLink
                                to="/admin/post-category"
                                className={`${styles.menuItem} group`}
                            >
                                <p className="sub-item">Danh sách danh mục</p>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/admin/post-category/add"
                                className={`${styles.menuItem} group`}
                            >
                                <p className="sub-item">Thêm mới danh mục</p>
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </li>

            <li className="nav-item ">
                <a data-bs-toggle="collapse" href="#post">
                    <i className="fas fa-layer-group" />
                    <p>Quản lý bài viết</p>
                    <span className="caret" />
                </a>
                <div className="collapse" id="post">
                    <ul className="nav nav-collapse">
                        <li>
                            <NavLink
                                to="/admin/post"
                                className={`${styles.menuItem} group`}
                            >
                                <p className="sub-item">Danh sách bài viết</p>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/admin/post/add"
                                className={`${styles.menuItem} group`}
                            >
                                <p className="sub-item">Thêm mới bài viết</p>
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </li>

            <li className="nav-item ">
                <a data-bs-toggle="collapse" href="#account">
                    <i className="fas fa-layer-group" />
                    <p>Quản lý sinh viên</p>
                    <span className="caret" />
                </a>
                <div className="collapse" id="account">
                    <ul className="nav nav-collapse">
                        <li>
                            <NavLink
                                to="/admin/students"
                                className={`${styles.menuItem} group`}
                            >
                                <p className="sub-item">Danh sách sinh viên</p>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/admin/students/create"
                                className={`${styles.menuItem} group`}
                            >
                                <p className="sub-item">Thêm mới sinh viên</p>
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </li>

            <li className="nav-item ">
                <a data-bs-toggle="collapse" href="#teachers">
                    <i className="fas fa-layer-group" />
                    <p>Quản lý giảng viên</p>
                    <span className="caret" />
                </a>
                <div className="collapse" id="teachers">
                    <ul className="nav nav-collapse">
                        <li>
                            <NavLink
                                to="/admin/teachers"
                                className={`${styles.menuItem} group`}
                            >
                                <p className="sub-item">Danh sách giảng viên</p>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/admin/teachers/create"
                                className={`${styles.menuItem} group`}
                            >
                                <p className="sub-item">Thêm mới giảng viên</p>
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </li>

            <li className="nav-item ">
                <a data-bs-toggle="collapse" href="#subjects">
                    <i className="fas fa-layer-group" />
                    <p>Quản lý môn học</p>
                    <span className="caret" />
                </a>
                <div className="collapse" id="subjects">
                    <ul className="nav nav-collapse">
                        <li>
                            <NavLink
                                to="/admin/subjects"
                                className={`${styles.menuItem} group`}
                            >
                                <p className="sub-item">Danh sách môn học</p>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/admin/subjects/add"
                                className={`${styles.menuItem} group`}
                            >
                                <p className="sub-item">Thêm mới môn học</p>
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </li>
            <li className="nav-item ">
                <a data-bs-toggle="collapse" href="#schedule">
                    <i className="fas fa-layer-group" />
                    <p>Thời gian đổi lịch</p>
                    <span className="caret" />
                </a>
                <div className="collapse" id="schedule">
                    <ul className="nav nav-collapse">
                        <li>
                            <NavLink
                                to="/admin/viewtimeframes"
                                className={`${styles.menuItem} group`}
                            >
                                <p className="sub-item">Xem khung thời gian </p>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/admin/timeframes"
                                className={`${styles.menuItem} group`}
                            >
                                <p className="sub-item">
                                    Thêm khung thời gian{" "}
                                </p>
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </li>
            {/* <li className="nav-item ">
                <a data-bs-toggle="collapse" href="#attendance">
                    <i className="fas fa-layer-group" />
                    <p>Quản lý điểm danh</p>
                    <span className="caret" />
                </a>
                <div className="collapse" id="attendance">
                    <ul className="nav nav-collapse">
                        <li>
                            <NavLink
                                to="/admin/attendance"
                                className={`${styles.menuItem} group`}
                            >
                                <p className="sub-item">Danh sách điểm danh</p>
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </li> */}
        </ul>
    );
};

export default AdminMenu;
