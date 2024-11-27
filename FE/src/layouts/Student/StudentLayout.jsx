import { Link, NavLink, Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import StudentMenu from "./StudentMenu";
import "/src/css/sidebar.css";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../config/axios";
const StudentLayout = () => {
    const userData = localStorage.getItem("user");
    const user = userData ? JSON.parse(userData) : null;
    const token = JSON.parse(localStorage.getItem("token"));
    if (token) {
        var accessToken = token.access_token;
        console.log("Access Token:", accessToken);
    }
    const { data: notifications, refetch } = useQuery({
        queryKey: ["LIST_NOTI"],
        queryFn: async () => {
            const res = await api.get("/notifications");
            return res.data;
        },
    });
    // console.log(notifications);

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
            <StudentMenu />

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
                        {/* End Logo Header */}
                    </div>
                    {/* Navbar Header */}
                    <nav className="navbar navbar-header navbar-header-transparent navbar-expand-lg border-bottom">
                        <div className="container-fluid mr-5">
                            {/* <nav className="navbar navbar-header-left navbar-expand-lg navbar-form nav-search p-0 d-none d-lg-flex">
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <button
                                            type="submit"
                                            className="btn btn-search pe-1"
                                        >
                                            <i className="fa fa-search search-icon" />
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search ..."
                                        className="form-control"
                                    />
                                </div>
                            </nav> */}
                            <ul className="navbar-nav topbar-nav ms-md-auto align-items-center">
                                <li className="nav-item topbar-icon dropdown hidden-caret d-flex d-lg-none">
                                    <a
                                        className="nav-link dropdown-toggle"
                                        data-bs-toggle="dropdown"
                                        href="#"
                                        role="button"
                                        aria-expanded="false"
                                        aria-haspopup="true"
                                    >
                                        <i className="fa fa-search" />
                                    </a>
                                    <ul className="dropdown-menu dropdown-search animated fadeIn">
                                        <form className="navbar-left navbar-form nav-search">
                                            <div className="input-group">
                                                <input
                                                    type="text"
                                                    placeholder="Search ..."
                                                    className="form-control"
                                                />
                                            </div>
                                        </form>
                                    </ul>
                                </li>

                                <li className="nav-item topbar-icon dropdown hidden-caret">
                                    <a
                                        className="nav-link dropdown-toggle"
                                        href="#"
                                        id="notifDropdown"
                                        role="button"
                                        data-bs-toggle="dropdown"
                                        aria-haspopup="true"
                                        aria-expanded="false"
                                    >
                                        <i className="fa fa-bell fs-4" />
                                        <span className="notification">
                                            {notifications?.count || 0}
                                        </span>
                                    </a>
                                    <ul
                                        className="dropdown-menu notif-box animated fadeIn"
                                        aria-labelledby="notifDropdown"
                                    >
                                        <li>
                                            <div className="dropdown-title">
                                                Bạn có{" "}
                                                {notifications?.count || 0}{" "}
                                                thông báo
                                            </div>
                                        </li>
                                        <li>
                                            <div className="notif-scroll scrollbar-outer">
                                                <div className="notif-center">
                                                    {notifications?.data?.map(
                                                        (notification) => (
                                                            <NavLink
                                                                to={`/student/news/${notification.code}/detail`}
                                                                key={
                                                                    notification.code
                                                                }
                                                            >
                                                                <div
                                                                    className="notif-icon notif-primary"
                                                                    style={{
                                                                        minWidth:
                                                                            "40px",
                                                                    }}
                                                                >
                                                                    <i className="fa fa-bell" />
                                                                </div>
                                                                <div className="notif-content">
                                                                    <span className="block">
                                                                        {
                                                                            notification.title
                                                                        }
                                                                    </span>
                                                                    <span className="time">
                                                                        {new Date(
                                                                            notification.created_at
                                                                        ).toLocaleString()}
                                                                    </span>
                                                                </div>
                                                            </NavLink>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <NavLink
                                                className="see-all"
                                                to={`/student/notifications`}
                                            >
                                                Xem tất cả thông báo
                                                <i className="fa fa-angle-right" />
                                            </NavLink>
                                        </li>
                                    </ul>
                                </li>
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
                                                    "https://phongreviews.com/wp-content/uploads/2022/11/avatar-facebook-mac-dinh-8.jpg"
                                                }
                                                alt="..."
                                                className="avatar-img rounded-circle"
                                            />
                                        </div>
                                        <span className="profile-username">
                                            <span className="op-7">Hi, </span>
                                            <span className="fw-bold">
                                                {user.full_name}
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
                                                                "https://phongreviews.com/wp-content/uploads/2022/11/avatar-facebook-mac-dinh-8.jpg"
                                                            }
                                                            alt="image profile"
                                                            className="avatar-img rounded"
                                                        />
                                                    </div>
                                                    <div className="u-text">
                                                        <h4>
                                                            {user.full_name}
                                                        </h4>
                                                        <p className="text-muted">
                                                            {user.email}
                                                        </p>
                                                        {/* <a
                                                            href="/admin/account/details/:user_code"
                                                            className="btn btn-xs btn-secondary btn-sm"
                                                        >
                                                            View Profile
                                                        </a> */}
                                                        <Link
                                                            to={`account`}
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
                                                    to={`account`}
                                                    className="dropdown-item"
                                                    href="#"
                                                >
                                                    My Profile
                                                </Link>
                                                {/* <a
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
                                                </a> */}
                                                <div className="dropdown-divider" />
                                                <div
                                                    onClick={Signout}
                                                    className="dropdown-item cursor-pointer"
                                                >
                                                    {user ? (
                                                        <b>Đăng xuất</b>
                                                    ) : (
                                                        ""
                                                    )}
                                                </div>
                                            </li>
                                        </div>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </nav>
                    {/* End Navbar */}
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

export default StudentLayout;
