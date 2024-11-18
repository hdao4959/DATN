import { Link, Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import TeacherMenu from "./TeacherMenu";
import "/src/css/sidebar.css";

const TeacherLayout = () => {
    const userData = localStorage.getItem("user");
    const user = userData ? JSON.parse(userData) : {};
    const tokenData = localStorage.getItem("token");
    const token = tokenData ? JSON.parse(tokenData) : {};
    const accessToken = token?.access_token || "";

    const Signout = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (response.ok) {
                localStorage.removeItem("user");
                localStorage.removeItem("token");

                toast.success("Đăng xuất thành công");
                window.location.href = "/signin";
            } else {
                const data = await response.json();
                console.error("Lỗi khi đăng xuất:", data);
                toast.error("Có lỗi xảy ra khi đăng xuất");
            }
        } catch (error) {
            console.error("Lỗi khi gọi API:", error);
            toast.error("Có lỗi xảy ra khi gọi API");
        }
    };

    return (
        <div className="wrapper">
            <TeacherMenu />
            <div className="main-panel">
                <div className="main-header">
                    <div className="main-header-logo">
                        <div
                            className="logo-header"
                            data-background-color="dark"
                        >
                            <a href="../index.html" className="logo">
                                <img
                                    src="/assets/img/kaiadmin/logo_light.svg"
                                    alt="navbar brand"
                                    className="navbar-brand"
                                />
                            </a>
                            <div className="nav-toggle">
                                <button className="btn btn-toggle toggle-sidebar">
                                    <i className="gg-menu-right" />
                                </button>
                                <button className="btn btn-toggle sidenav-toggler">
                                    <i className="gg-menu-left" />
                                </button>
                            </div>
                            <button className="topbar-toggler more">
                                <i className="gg-more-vertical-alt" />
                            </button>
                        </div>
                    </div>
                    <nav className="navbar navbar-header navbar-header-transparent navbar-expand-lg border-bottom">
                        <div className="container-fluid">
                            <ul className="navbar-nav topbar-nav ms-md-auto align-items-center">
                                <li className="nav-item topbar-user dropdown hidden-caret">
                                    <a
                                        className="dropdown-toggle profile-pic"
                                        data-bs-toggle="dropdown"
                                        href="#"
                                        aria-expanded="false"
                                    >
                                        <div className="avatar-sm">
                                            <img
                                                src={
                                                    user?.avatar ||
                                                    "/assets/img/default-avatar.png"
                                                }
                                                alt="..."
                                                className="avatar-img rounded-circle"
                                            />
                                        </div>
                                        <span className="profile-username">
                                            <span className="op-7">Hi, </span>
                                            <span className="fw-bold">
                                                {user?.full_name || "Guest"}
                                            </span>
                                        </span>
                                    </a>
                                    <ul className="dropdown-menu dropdown-user animated fadeIn">
                                        <div className="dropdown-user-scroll scrollbar-outer">
                                            <li>
                                                <div className="user-box">
                                                    <div className="avatar-lg">
                                                        <img
                                                            src={
                                                                user?.avatar ||
                                                                "/assets/img/default-avatar.png"
                                                            }
                                                            alt="image profile"
                                                            className="avatar-img rounded"
                                                        />
                                                    </div>
                                                    <div className="u-text">
                                                        <h4>
                                                            {user?.full_name ||
                                                                "Guest"}
                                                        </h4>
                                                        <p className="text-muted">
                                                            {user?.email ||
                                                                "No Email"}
                                                        </p>
                                                        <Link
                                                            to={`account/details/${
                                                                user?.user_code ||
                                                                ""
                                                            }`}
                                                            className="btn btn-xs btn-secondary btn-sm"
                                                        >
                                                            View Profile
                                                        </Link>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="dropdown-divider" />
                                                <Link
                                                    to={`account/details/${
                                                        user?.user_code || ""
                                                    }`}
                                                    className="dropdown-item"
                                                >
                                                    My Profile
                                                </Link>
                                                <a
                                                    className="dropdown-item"
                                                    href="#"
                                                >
                                                    My Balance
                                                </a>
                                                <a
                                                    className="dropdown-item"
                                                    href="#"
                                                >
                                                    Inbox
                                                </a>
                                                <div className="dropdown-divider" />
                                                <a
                                                    className="dropdown-item"
                                                    href="#"
                                                >
                                                    Account Setting
                                                </a>
                                                <div className="dropdown-divider" />
                                                <div
                                                    onClick={Signout}
                                                    className="dropdown-item cursor-pointer"
                                                >
                                                    <b>Đăng xuất</b>
                                                </div>
                                            </li>
                                        </div>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </div>
                <div className="container">
                    <div className="page-inner">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherLayout;
