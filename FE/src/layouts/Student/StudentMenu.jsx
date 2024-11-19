import { Link, NavLink } from "react-router-dom";

import styles from "../index.module.css";

const StudentMenu = () => {
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
                        <li className="menu-item">
                            <NavLink to="/" className={`${styles.menuItem} group`}>
                                <i className="fas fa-home text-lg text-[#b9babf] group-hover:text-[#6861ce]" />
                                <p className="text-[#b9babf]">Trang Chủ</p>
                            </NavLink>
                        </li>
                        <li className="nav-item ">
                            <a data-bs-toggle="collapse" href="#attendances" >
                                <i className="fas fa-clipboard-list" />
                                <p>Điểm Danh</p>
                                <span className="caret" />
                            </a>
                            <div className="collapse" id="attendances">
                                <ul className="nav nav-collapse">
                                    <li>
                                        <NavLink
                                            to="/student/attendances"
                                            className={`${styles.menuItem} group`}
                                        >
                                            <p className="sub-item">Điểm danh</p>
                                        </NavLink>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li className="nav-item ">
                            <a data-bs-toggle="collapse" href="#grades" >
                                <i className="fas fa-clipboard-list" />
                                <p>Bảng Điểm</p>
                                <span className="caret" />
                            </a>
                            <div className="collapse" id="grades">
                                <ul className="nav nav-collapse">
                                    <li>
                                        <NavLink
                                            to="/student/grades"
                                            className={`${styles.menuItem} group`}
                                        >
                                            <p className="sub-item">Bảng Điểm</p>
                                        </NavLink>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li className="nav-item ">
                            <a data-bs-toggle="collapse" href="#services" >
                                <i className="fab fa-stack-overflow" />
                                <p>Dịch Vụ</p>
                                <span className="caret" />
                            </a>
                            <div className="collapse" id="services">
                                <ul className="nav nav-collapse">
                                    <li>
                                        <NavLink
                                            to="/student/services"
                                            className={`${styles.menuItem} group`}
                                        >
                                            <p className="sub-item">Dịch Vụ</p>
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

export default StudentMenu;
