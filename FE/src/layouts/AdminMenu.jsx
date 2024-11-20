import { NavLink } from "react-router-dom";

import styles from "./index.module.css";

const AdminMenu = () => {
    return (
        <ul className="nav nav-secondary">
            {/* <li className="nav-section">
                <span className="sidebar-mini-icon">
                    <i className="fa fa-ellipsis-h" />
                </span>
                <h4 className="text-section">Components</h4>
            </li>
            <li className="nav-item">
                <a data-bs-toggle="collapse" href="#base">
                    <i className="fas fa-layer-group" />
                    <p>Base</p>
                    <span className="caret" />
                </a>
                <div className="collapse" id="base">
                    <ul className="nav nav-collapse">
                        <li>
                            <a href="../components/avatars.html">
                                <span className="sub-item">Avatars</span>
                            </a>
                        </li>
                        <li>
                            <a href="../components/buttons.html">
                                <span className="sub-item">Buttons</span>
                            </a>
                        </li>
                        <li>
                            <a href="../components/gridsystem.html">
                                <span className="sub-item">Grid System</span>
                            </a>
                        </li>
                        <li>
                            <a href="../components/panels.html">
                                <span className="sub-item">Panels</span>
                            </a>
                        </li>
                        <li>
                            <a href="../components/notifications.html">
                                <span className="sub-item">Notifications</span>
                            </a>
                        </li>
                        <li>
                            <a href="../components/sweetalert.html">
                                <span className="sub-item">Sweet Alert</span>
                            </a>
                        </li>
                        <li>
                            <a href="../components/font-awesome-icons.html">
                                <span className="sub-item">
                                    Font Awesome Icons
                                </span>
                            </a>
                        </li>
                        <li>
                            <a href="../components/simple-line-icons.html">
                                <span className="sub-item">
                                    Simple Line Icons
                                </span>
                            </a>
                        </li>
                        <li>
                            <a href="../components/typography.html">
                                <span className="sub-item">Typography</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </li>
            <li className="nav-item">
                <a data-bs-toggle="collapse" href="#sidebarLayouts">
                    <i className="fas fa-th-list" />
                    <p>Sidebar Layouts</p>
                    <span className="caret" />
                </a>
                <div className="collapse" id="sidebarLayouts">
                    <ul className="nav nav-collapse">
                        <li>
                            <a href="../sidebar-style-2.html">
                                <span className="sub-item">
                                    Sidebar Style 2
                                </span>
                            </a>
                        </li>
                        <li>
                            <a href="../icon-menu.html">
                                <span className="sub-item">Icon Menu</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </li>
            <li className="nav-item active submenu">
                <a data-bs-toggle="collapse" href="#forms">
                    <i className="fas fa-pen-square" />
                    <p>Forms</p>
                    <span className="caret" />
                </a>
                <div className="collapse show" id="forms">
                    <ul className="nav nav-collapse">
                        <li className="active">
                            <a href="../forms/forms.html">
                                <span className="sub-item">Basic Form</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </li>
            <li className="nav-item">
                <a data-bs-toggle="collapse" href="#tables">
                    <i className="fas fa-table" />
                    <p>Tables</p>
                    <span className="caret" />
                </a>
                <div className="collapse" id="tables">
                    <ul className="nav nav-collapse">
                        <li>
                            <a href="../tables/tables.html">
                                <span className="sub-item">Basic Table</span>
                            </a>
                        </li>
                        <li>
                            <a href="../tables/datatables.html">
                                <span className="sub-item">Datatables</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </li>
            <li className="nav-item">
                <a data-bs-toggle="collapse" href="#maps">
                    <i className="fas fa-map-marker-alt" />
                    <p>Maps</p>
                    <span className="caret" />
                </a>
                <div className="collapse" id="maps">
                    <ul className="nav nav-collapse">
                        <li>
                            <a href="../maps/googlemaps.html">
                                <span className="sub-item">Google Maps</span>
                            </a>
                        </li>
                        <li>
                            <a href="../maps/jsvectormap.html">
                                <span className="sub-item">Jsvectormap</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </li>
            <li className="nav-item">
                <a data-bs-toggle="collapse" href="#charts">
                    <i className="far fa-chart-bar" />
                    <p>Charts</p>
                    <span className="caret" />
                </a>
                <div className="collapse" id="charts">
                    <ul className="nav nav-collapse">
                        <li>
                            <a href="../charts/charts.html">
                                <span className="sub-item">Chart Js</span>
                            </a>
                        </li>
                        <li>
                            <a href="../charts/sparkline.html">
                                <span className="sub-item">Sparkline</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </li> */}
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
                                to="/admin/classrooms/step"
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
                        <li>
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
                        </li>
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
            </li>

            <li className="menu-item">
                <NavLink
                    to="/admin/gradesStudent"
                    className={`${styles.menuItem} group`}
                >
                    <i className="fas fa-th-list text-lg text-[#b9babf] group-hover:text-[#6861ce]" />
                    <p className="text-[#b9babf]">Quản lý điểm số Student</p>
                </NavLink>
            </li>
            <li className="menu-item">
                <NavLink
                    to="/admin/gradesTeacher"
                    className={`${styles.menuItem} group`}
                >
                    <i className="fas fa-th-list text-lg text-[#b9babf] group-hover:text-[#6861ce]" />
                    <p className="text-[#b9babf]">Quản lý điểm số teacher</p>
                </NavLink>
            </li>
        </ul>
    );
};

export default AdminMenu;
