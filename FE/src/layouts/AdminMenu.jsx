import { NavLink } from "react-router-dom";

import styles from "./index.module.css";

const AdminMenu = () => {
    return (
        <ul className="nav nav-secondary">
            <li className="menu-item">
                <NavLink to="/" className={`${styles.menuItem} group`}>
                    <i className="fas fa-home text-lg text-[#b9babf] group-hover:text-[#6861ce]" />
                    <p className="text-[#b9babf]">Dashboard</p>
                </NavLink>
            </li>

            <li className="menu-item">
                <NavLink
                    to="/admin/classrooms"
                    className={`${styles.menuItem} group`}
                >
                    <i className="fas fa-school text-lg text-[#b9babf] group-hover:text-[#6861ce]" />
                    <p className="text-[#b9babf]">Quản lý lớp học</p>
                </NavLink>
            </li>
            <li className="menu-item">
                <NavLink
                    to="/schoolrooms"
                    className={`${styles.menuItem} group`}
                >
                    <i className="fas fa-th-list text-lg text-[#b9babf] group-hover:text-[#6861ce]" />
                    <p className="text-[#b9babf]">Quản lý phòng học</p>
                </NavLink>
            </li>
            <li className="menu-item">
                <NavLink to="/major" className={`${styles.menuItem} group`}>
                    <i className="fas fa-th-list text-lg text-[#b9babf] group-hover:text-[#6861ce]" />
                    <p className="text-[#b9babf]">Quản lý chuyên ngành</p>
                </NavLink>
            </li>
            <li className="menu-item">
                <NavLink
                    to="/grade-components"
                    className={`${styles.menuItem} group`}
                >
                    <i className="fas fa-th-list text-lg text-[#b9babf] group-hover:text-[#6861ce]" />
                    <p className="text-[#b9babf]">Quản lý đầu điểm</p>
                </NavLink>
            </li>
            <li className="menu-item">
                <NavLink
                    to="/student-wallet"
                    className={`${styles.menuItem} group`}
                >
                    <i className="fas fa-user text-lg text-[#b9babf] group-hover:text-[#6861ce]" />
                    <p className="text-[#b9babf]">Quản lý học phí</p>
                </NavLink>
            </li>
            <li className="menu-item">
                <NavLink
                    to="/post-category"
                    className={`${styles.menuItem} group`}
                >
                    <i className="fas fa-th-list text-lg text-[#b9babf] group-hover:text-[#6861ce]" />
                    <p className="text-[#b9babf]">Danh mục</p>
                </NavLink>
            </li>
            <li className="menu-item">
                <NavLink to="/post" className={`${styles.menuItem} group`}>
                    <i className="fas fa-th-list text-lg text-[#b9babf] group-hover:text-[#6861ce]" />
                    <p className="text-[#b9babf]">Bài viết</p>
                </NavLink>
            </li>
            <li className="menu-item">
                <NavLink to="/account" className={`${styles.menuItem} group`}>
                    <i className="fas fa-user text-lg text-[#b9babf] group-hover:text-[#6861ce]" />
                    <p className="text-[#b9babf]">Quản lý sinh viên</p>
                </NavLink>
            </li>
        </ul>
    );
};

export default AdminMenu;
