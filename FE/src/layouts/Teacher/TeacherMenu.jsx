import { Link, NavLink } from "react-router-dom";
import styles from "../index.module.css";

const TeacherMenu = () => {
    return (
        <div
            className="sidebar"
            style={{ backgroundColor: "#F5FFFA", color: "#333333" }}
        >
            <div className="sidebar-logo">
                <div
                    className="logo-header"
                    style={{ backgroundColor: "#F5FFFA" }}
                >
                    <Link to={"/teacher"} className="logo">
                        <img
                            src="https://admin.feduvn.com/storage/logo/snapedit_1733630664663.png"
                            width={150}
                            alt="navbar brand"
                            className="navbar-brand mt-4"
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
                    <li className="nav-section">
                            <span className="sidebar-mini-icon">
                                <i className="fa fa-ellipsis-h" />
                            </span>
                            <h4 className="text-section">Quản lý chung</h4>
                        </li>
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
                        
                        <li className="nav-item">
                            <a data-bs-toggle="collapse" href="#base">
                                <i className="fas fa-layer-group" />
                                <p>Quản lý lớp dạy</p>
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
                        <li className="nav-item">
                            <a data-bs-toggle="collapse" href="#post">
                                <i className="fas fa-th-list" />
                                <p>Thông Báo</p>
                                <span className="caret" />
                            </a>
                            <div className="collapse" id="post">
                                <ul className="nav nav-collapse">
                                    <li>
                                        <NavLink
                                            to="/teacher/post"
                                            className={`${styles.menuItem} group`}
                                        >
                                            <p className="sub-item">
                                                Thông Báo
                                            </p>
                                        </NavLink>
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
