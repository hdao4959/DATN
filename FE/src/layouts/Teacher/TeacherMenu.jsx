import { Link, NavLink } from "react-router-dom";

const TeacherMenu = () => {
    return (
        <div className="sidebar" data-background-color="dark">
            <div className="sidebar-logo">
                <div className="logo-header" data-background-color="dark">
                    <Link to={"/admin"} className="logo">
                        <img
                            src="https://ap.poly.edu.vn/images/whiteLogo.png"
                            width={150}
                            alt="navbar brand"
                            className="navbar-brand"
                            height={20}
                        />
                    </Link>
                    <button
                        className="navbar-toggler sidenav-toggler ms-auto"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="collapse"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon">
                            <i className="gg-menu-right" />
                        </span>
                    </button>
                    <button className="topbar-toggler more">
                        <i className="icon-options-vertical" />
                    </button>
                    <div className="nav-toggle">
                        <button className="btn btn-toggle toggle-sidebar">
                            <i className="gg-menu-right" />
                        </button>
                        <button className="btn btn-toggle sidenav-toggler">
                            <i className="gg-menu-left" />
                        </button>
                    </div>
                </div>
            </div>
            <div className="sidebar-wrapper scrollbar scrollbar-inner">
                <div className="sidebar-content">
                    <ul className="nav nav-secondary">
                        <li className="nav-item">
                            <a
                                data-bs-toggle="collapse"
                                href="#dashboard"
                                className="collapsed show"
                                aria-expanded="false"
                            >
                                <i className="fas fa-home" />
                                <p>Lịch dạy</p>
                                <span className="caret" />
                            </a>
                            <div className="collapse" id="dashboard">
                                <ul className="nav nav-collapse">
                                    <li>
                                        <Link to={"/teacher/schedule"}>
                                            <span className="sub-item active">
                                                Lịch dạy của tôi
                                            </span>
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li className="nav-section">
                            <span className="sidebar-mini-icon">
                                <i className="fa fa-ellipsis-h" />
                            </span>
                            <h4 className="text-section">Quản lý chung</h4>
                        </li>
                        <li className="nav-item">
                            <a data-bs-toggle="collapse" href="#base">
                                <i className="fas fa-layer-group" />
                                <p>Lớp học của tôi</p>
                                <span className="caret" />
                            </a>
                            <div className="collapse" id="base">
                                <ul className="nav nav-collapse">
                                    <li>
                                        <Link to={"/teacher/class"}>
                                            <span className="sub-item">
                                                Danh sách lớp học
                                            </span>
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li className="menu-item">
                            <NavLink to="/admin/attendances" >
                                <i className="fas fa-th-list text-lg text-[#b9babf] group-hover:text-[#6861ce]" />
                                <p className="text-[#b9babf]">Quản lý điểm danh</p>
                            </NavLink>
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
                                            <span className="sub-item">
                                                Icon Menu
                                            </span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li className="nav-item  submenu">
                            <a data-bs-toggle="collapse" href="#forms">
                                <i className="fas fa-pen-square" />
                                <p>Forms</p>
                                <span className="caret" />
                            </a>
                            <div className="collapse" id="forms">
                                <ul className="nav nav-collapse">
                                    <li className="active">
                                        <a href="../forms/forms.html">
                                            <span className="sub-item">
                                                Basic Form
                                            </span>
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
                                            <span className="sub-item">
                                                Basic Table
                                            </span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="../tables/datatables.html">
                                            <span className="sub-item">
                                                Datatables
                                            </span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default TeacherMenu;
