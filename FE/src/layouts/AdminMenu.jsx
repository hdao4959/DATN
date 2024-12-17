import { NavLink } from "react-router-dom";

import styles from "./index.module.css";

const AdminMenu = () => {
    return (
        <ul className="nav nav-secondary">
            <li className="nav-item">
                <NavLink to="/sup-admin" className={`${styles.menuItem} group`}>
                    <i className="fas fa-home text-lg text-[#b9babf] group-hover:text-[#6861ce]" />
                    <p className="text-[#b9babf]">Trang chủ</p>
                </NavLink>
            </li>
            <li className="nav-section">
                <span className="sidebar-mini-icon">
                    <i className="fa fa-ellipsis-h" />
                </span>
                <h4 className="text-section">Học tập và giảng dạy</h4>
            </li>
            <li className="nav-item ">
                <a data-bs-toggle="collapse" href="#classroom">
                    <i className="fas fa-graduation-cap" />
                    <p>Quản lý lớp học</p>
                    <span className="caret" />
                </a>
                <div className="collapse" id="classroom">
                    <ul className="nav nav-collapse">
                        <li>
                            <NavLink
                                to="/sup-admin/classrooms"
                                className={`${styles.menuItem} group`}
                            >
                                <p className="sub-item">Danh sách lớp học</p>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/sup-admin/classrooms/add"
                                className={`${styles.menuItem} group`}
                            >
                                <p className="sub-item">Thêm mới lớp học</p>
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </li>
            <li className="nav-item ">
                <a data-bs-toggle="collapse" href="#teachers">
                    <i className="fas fa-user-tie" />
                    <p>Quản lý giảng viên</p>
                    <span className="caret" />
                </a>
                <div className="collapse" id="teachers">
                    <ul className="nav nav-collapse">
                        <li>
                            <NavLink
                                to="/sup-admin/teachers"
                                className={`${styles.menuItem} group`}
                            >
                                <p className="sub-item">Danh sách giảng viên</p>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/sup-admin/teachers/create"
                                className={`${styles.menuItem} group`}
                            >
                                <p className="sub-item">Thêm mới giảng viên</p>
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </li>
            <li className="nav-item ">
                <a data-bs-toggle="collapse" href="#account">
                    <i className="fas fa-user-graduate" />
                    <p>Quản lý sinh viên</p>
                    <span className="caret" />
                </a>
                <div className="collapse" id="account">
                    <ul className="nav nav-collapse">
                        <li>
                            <NavLink
                                to="/sup-admin/students"
                                className={`${styles.menuItem} group`}
                            >
                                <p className="sub-item">Danh sách sinh viên</p>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/sup-admin/students/create"
                                className={`${styles.menuItem} group`}
                            >
                                <p className="sub-item">Thêm mới sinh viên</p>
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </li>
            <li className="nav-item ">
                <a data-bs-toggle="collapse" href="#subjects">
                    <i className="fas fa-book" />
                    <p>Quản lý môn học</p>
                    <span className="caret" />
                </a>
                <div className="collapse" id="subjects">
                    <ul className="nav nav-collapse">
                        <li>
                            <NavLink
                                to="/sup-admin/subjects"
                                className={`${styles.menuItem} group`}
                            >
                                <p className="sub-item">Danh sách môn học</p>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/sup-admin/subjects/add"
                                className={`${styles.menuItem} group`}
                            >
                                <p className="sub-item">Thêm mới môn học</p>
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </li>
            <li className="nav-item ">
                <a data-bs-toggle="collapse" href="#sessions">
                    <i className="fas fa-hourglass-start" />
                    <p>Quản lý ca học</p>
                    <span className="caret" />
                </a>
                <div className="collapse" id="sessions">
                    <ul className="nav nav-collapse">
                        <li>
                            <NavLink
                                to="/sup-admin/sessions"
                                className={`${styles.menuItem} group`}
                            >
                                <p className="sub-item">Danh sách ca học</p>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/sup-admin/sessions/add"
                                className={`${styles.menuItem} group`}
                            >
                                <p className="sub-item">Thêm mới ca học</p>
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
                                to="/sup-admin/major"
                                className={`${styles.menuItem} group`}
                            >
                                <p className="sub-item">
                                    Danh sách chuyên ngành
                                </p>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/sup-admin/major/add"
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
                <a data-bs-toggle="collapse" href="#degree-program">
                    <i className="fas fa-users" />
                    <p>Quản lý khoá học</p>
                    <span className="caret" />
                </a>
                <div className="collapse" id="degree-program">
                    <ul className="nav nav-collapse">
                        <li>
                            <NavLink
                                to="/sup-admin/degree-program"
                                className={`${styles.menuItem} group`}
                            >
                                <p className="sub-item">Danh sách khoá học</p>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/sup-admin/degree-program/add"
                                className={`${styles.menuItem} group`}
                            >
                                <p className="sub-item">Thêm mới khoá học</p>
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </li>
            <li className="nav-item">
                <a data-bs-toggle="collapse" href="#term-management">
                    <i className="fas fa-users" />
                    <p>Quản lý kỳ học</p>
                    <span className="caret" />
                </a>
                <div className="collapse" id="term-management">
                    <ul className="nav nav-collapse">
                        <li>
                            <NavLink
                                to="/sup-admin/semesters"
                                className={`${styles.menuItem} group`}
                            >
                                <p className="sub-item">Danh sách kỳ học</p>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/sup-admin/semesters/add"
                                className={`${styles.menuItem} group`}
                            >
                                <p className="sub-item">Thêm mới kỳ học</p>
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </li>
            <li className="nav-section">
                <span className="sidebar-mini-icon">
                    <i className="fa fa-ellipsis-h" />
                </span>
                <h4 className="text-section">Tài nguyên và hạ tầng</h4>
            </li>
            <li className="nav-item ">
                <a data-bs-toggle="collapse" href="#schoolroom">
                    <i className="fas fa-school" />
                    <p>Quản lý phòng học</p>
                    <span className="caret" />
                </a>
                <div className="collapse" id="schoolroom">
                    <ul className="nav nav-collapse">
                        <li>
                            <NavLink
                                to="/sup-admin/schoolrooms"
                                className={`${styles.menuItem} group`}
                            >
                                <p className="sub-item">Danh sách phòng học</p>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/sup-admin/schoolrooms/add"
                                className={`${styles.menuItem} group`}
                            >
                                <p className="sub-item">Thêm mới phòng học</p>
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </li>
            <li className="nav-item ">
                <a data-bs-toggle="collapse" href="#schedule">
                    <i className="fas fa-calendar" />
                    <p>Thời gian đổi lịch</p>
                    <span className="caret" />
                </a>
                <div className="collapse" id="schedule">
                    <ul className="nav nav-collapse">
                        <li>
                            <NavLink
                                to="/sup-admin/viewtimeframes"
                                className={`${styles.menuItem} group`}
                            >
                                <p className="sub-item">Xem khung thời gian </p>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/sup-admin/timeframes"
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

            <li className="nav-section">
                <span className="sidebar-mini-icon">
                    <i className="fa fa-ellipsis-h" />
                </span>
                <h4 className="text-section">Quản lý tài chính</h4>
            </li>
            <li className="nav-item ">
                <a data-bs-toggle="collapse" href="#wallet">
                    <i className="fas fa-wallet" />
                    <p>Quản lý học phí</p>
                    <span className="caret" />
                </a>
                <div className="collapse" id="wallet">
                    <ul className="nav nav-collapse">
                        <li>
                            <NavLink
                                to="/sup-admin/student-wallet"
                                className={`${styles.menuItem} group`}
                            >
                                <p className="sub-item">Danh sách học phí</p>
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </li>
            <li className="nav-section">
                <span className="sidebar-mini-icon">
                    <i className="fa fa-ellipsis-h" />
                </span>
                <h4 className="text-section">Quản lý nội dung</h4>
            </li>

            <li className="nav-item ">
                <a data-bs-toggle="collapse" href="#categories">
                    <i className="fas fa-bookmark" />
                    <p>Danh mục bài viết</p>
                    <span className="caret" />
                </a>
                <div className="collapse" id="categories">
                    <ul className="nav nav-collapse">
                        <li>
                            <NavLink
                                to="/sup-admin/post-category"
                                className={`${styles.menuItem} group`}
                            >
                                <p className="sub-item">Danh sách danh mục</p>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/sup-admin/post-category/add"
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
                    <i className="fas fa-book-open" />
                    <p>Quản lý bài viết</p>
                    <span className="caret" />
                </a>
                <div className="collapse" id="post">
                    <ul className="nav nav-collapse">
                        <li>
                            <NavLink
                                to="/sup-admin/post"
                                className={`${styles.menuItem} group`}
                            >
                                <p className="sub-item">Danh sách bài viết</p>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/sup-admin/post/add"
                                className={`${styles.menuItem} group`}
                            >
                                <p className="sub-item">Thêm mới bài viết</p>
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </li>

            <li className="nav-section">
                <span className="sidebar-mini-icon">
                    <i className="fa fa-ellipsis-h" />
                </span>
                <h4 className="text-section">Quản lý dịch vụ</h4>
            </li>
            <li className="nav-item ">
                <a data-bs-toggle="collapse" href="#services-management">
                    <i className="fas fa-headset" />
                    <p>Quản lý dịch vụ</p>
                    <span className="caret" />
                </a>
                <div className="collapse" id="services-management">
                    <ul className="nav nav-collapse">
                        <li>
                            <NavLink
                                to="/sup-admin/services"
                                className={`${styles.menuItem} group`}
                            >
                                <p className="sub-item">Danh sách dịch vụ sinh viên</p>
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </li>
            <li className="nav-section">
                <span className="sidebar-mini-icon">
                    <i className="fa fa-ellipsis-h" />
                </span>
                <h4 className="text-section">Quản lý dữ liệu học tập</h4>
            </li>
            <li className="nav-item ">
                <a data-bs-toggle="collapse" href="#grade">
                    <i className="fas fa-wrench" />
                    <p>Quản lý đầu điểm</p>
                    <span className="caret" />
                </a>
                <div className="collapse" id="grade">
                    <ul className="nav nav-collapse">
                        <li>
                            <NavLink
                                to="/sup-admin/grade-components"
                                className={`${styles.menuItem} group`}
                            >
                                <p className="sub-item">Danh sách đầu điểm</p>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/sup-admin/grade-components/add"
                                className={`${styles.menuItem} group`}
                            >
                                <p className="sub-item">Thêm mới đầu điểm</p>
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
                                to="/sup-admin/attendance"
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
