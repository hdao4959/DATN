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
                    to="/classrooms"
                    className={`${styles.menuItem} group`}
                >
                    <i className="fas fa-school text-lg text-[#b9babf] group-hover:text-[#6861ce]" />
                    <p className="text-[#b9babf]">Classrooms</p>
                </NavLink>
            </li>
            <li className="menu-item">
                <NavLink
                    to="/schoolrooms"
                    className={`${styles.menuItem} group`}
                >
                    <i className="fas fa-th-list text-lg text-[#b9babf] group-hover:text-[#6861ce]" />
                    <p className="text-[#b9babf]">Room</p>
                </NavLink>
            </li>
            <li className="menu-item">
                <NavLink to="/major" className={`${styles.menuItem} group`}>
                    <i className="fas fa-th-list text-lg text-[#b9babf] group-hover:text-[#6861ce]" />
                    <p className="text-[#b9babf]">Major</p>
                </NavLink>
            </li>
            <li className="menu-item">
                <NavLink
                    to="/grade-components"
                    className={`${styles.menuItem} group`}
                >
                    <i className="fas fa-th-list text-lg text-[#b9babf] group-hover:text-[#6861ce]" />
                    <p className="text-[#b9babf]">Grade Components</p>
                </NavLink>
            </li>
            <li className="menu-item">
                <NavLink
                    to="/student-wallet"
                    className={`${styles.menuItem} group`}
                >
                    <i className="fas fa-user text-lg text-[#b9babf] group-hover:text-[#6861ce]" />
                    <p className="text-[#b9babf]">Student Wallet</p>
                </NavLink>
            </li>
            <li className="menu-item">
                <NavLink
                    to="/post-category"
                    className={`${styles.menuItem} group`}
                >
                    <i className="fas fa-th-list text-lg text-[#b9babf] group-hover:text-[#6861ce]" />
                    <p className="text-[#b9babf]">Post Category</p>
                </NavLink>
            </li>
            <li className="menu-item">
                <NavLink to="/post" className={`${styles.menuItem} group`}>
                    <i className="fas fa-th-list text-lg text-[#b9babf] group-hover:text-[#6861ce]" />
                    <p className="text-[#b9babf]">Post</p>
                </NavLink>
            </li>
            <li className="menu-item">
                <NavLink to="/account" className={`${styles.menuItem} group`}>
                    <i className="fas fa-user text-lg text-[#b9babf] group-hover:text-[#6861ce]" />
                    <p className="text-[#b9babf]">Account Manager</p>
                </NavLink>
            </li>
        </ul>
    );
};

export default AdminMenu;
