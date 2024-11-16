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
                                <p className="text-[#b9babf]">Dashboard</p>
                            </NavLink>
                        </li>

                        <li className="menu-item">
                            <NavLink to="/student/attendances" className={`${styles.menuItem} group`}>
                                <i className="fas fa-th-list text-lg text-[#b9babf] group-hover:text-[#6861ce]" />
                                <p className="text-[#b9babf]">Điểm danh</p>
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default StudentMenu;
