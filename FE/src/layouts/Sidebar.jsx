import { NavLink } from "react-router-dom";
import AdminMenu from "./AdminMenu";
import TeacherMenu from "./Teacher/TeacherMenu";
import StudentMenu from "./Student/StudentMenu";

const user = localStorage.getItem('user');
const fakeRole = '1';

const Sidebar = () => {
    const toggleSidebar = () => {
        document.querySelector('.sidebar').classList.toggle('active');
    };

    return (
        <div className="sidebar" data-background-color="dark">
            <div className="sidebar-logo">
                <div className="logo-header" data-background-color="dark">
                    <NavLink to="/sup-admin" className="logo">
                        <img
                            src="https://admin.feduvn.com/storage/logo/logo3.2-white.png"
                            width={150}
                            alt="navbar brand"
                            className="navbar-brand"
                            height={20}
                        />
                    </NavLink>
                    <button
                        className="navbar-toggler sidenav-toggler ms-auto"
                        type="button"
                        onClick={toggleSidebar}
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
                </div>
            </div>
            <div className="sidebar-wrapper scrollbar scrollbar-inner">
                <div className="sidebar-content">
                    {fakeRole === '1' && <AdminMenu />}
                    {user?.role === '2' && <TeacherMenu />}
                    {user?.role === '3' && <StudentMenu />}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
