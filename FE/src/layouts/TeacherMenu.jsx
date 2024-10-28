import { NavLink } from "react-router-dom";

import styles from "./index.module.css";

const TeacherMenu = () => {
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
        </ul>
    );
};

export default TeacherMenu;
