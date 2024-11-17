import { Link, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { toast } from "react-toastify";

const AdminLayout = () => {
    const userData = localStorage.getItem("user");
    const user = userData ? JSON.parse(userData) : null;
    const token = JSON.parse(localStorage.getItem("token"));
    if (token) {
        var accessToken = token.access_token;
        console.log("Access Token:", accessToken);
    }

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
            <Sidebar />

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
                        <div className="container-fluid">
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
                                        id="messageDropdown"
                                        role="button"
                                        data-bs-toggle="dropdown"
                                        aria-haspopup="true"
                                        aria-expanded="false"
                                    >
                                        <i className="fa fa-envelope" />
                                    </a>
                                    <ul
                                        className="dropdown-menu messages-notif-box animated fadeIn"
                                        aria-labelledby="messageDropdown"
                                    >
                                        <li>
                                            <div className="dropdown-title d-flex justify-content-between align-items-center">
                                                Messages
                                                <a href="#" className="small">
                                                    Mark all as read
                                                </a>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="message-notif-scroll scrollbar-outer">
                                                <div className="notif-center">
                                                    <a href="#">
                                                        <div className="notif-img">
                                                            <img
                                                                src="../assets/img/jm_denis.jpg"
                                                                alt="Img Profile"
                                                            />
                                                        </div>
                                                        <div className="notif-content">
                                                            <span className="subject">
                                                                Jimmy Denis
                                                            </span>
                                                            <span className="block">
                                                                {" "}
                                                                How are you ?{" "}
                                                            </span>
                                                            <span className="time">
                                                                5 minutes ago
                                                            </span>
                                                        </div>
                                                    </a>
                                                    <a href="#">
                                                        <div className="notif-img">
                                                            <img
                                                                src="../assets/img/chadengle.jpg"
                                                                alt="Img Profile"
                                                            />
                                                        </div>
                                                        <div className="notif-content">
                                                            <span className="subject">
                                                                Chad
                                                            </span>
                                                            <span className="block">
                                                                {" "}
                                                                Ok, Thanks !{" "}
                                                            </span>
                                                            <span className="time">
                                                                12 minutes ago
                                                            </span>
                                                        </div>
                                                    </a>
                                                    <a href="#">
                                                        <div className="notif-img">
                                                            <img
                                                                src="../assets/img/mlane.jpg"
                                                                alt="Img Profile"
                                                            />
                                                        </div>
                                                        <div className="notif-content">
                                                            <span className="subject">
                                                                Jhon Doe
                                                            </span>
                                                            <span className="block">
                                                                Ready for the
                                                                meeting today...
                                                            </span>
                                                            <span className="time">
                                                                12 minutes ago
                                                            </span>
                                                        </div>
                                                    </a>
                                                    <a href="#">
                                                        <div className="notif-img">
                                                            <img
                                                                src="../assets/img/talha.jpg"
                                                                alt="Img Profile"
                                                            />
                                                        </div>
                                                        <div className="notif-content">
                                                            <span className="subject">
                                                                Talha
                                                            </span>
                                                            <span className="block">
                                                                {" "}
                                                                Hi, Apa Kabar ?{" "}
                                                            </span>
                                                            <span className="time">
                                                                17 minutes ago
                                                            </span>
                                                        </div>
                                                    </a>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <a
                                                className="see-all"
                                                href="javascript:void(0);"
                                            >
                                                See all messages
                                                <i className="fa fa-angle-right" />
                                            </a>
                                        </li>
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
                                        <i className="fa fa-bell" />
                                        <span className="notification">4</span>
                                    </a>
                                    <ul
                                        className="dropdown-menu notif-box animated fadeIn"
                                        aria-labelledby="notifDropdown"
                                    >
                                        <li>
                                            <div className="dropdown-title">
                                                You have 4 new notification
                                            </div>
                                        </li>
                                        <li>
                                            <div className="notif-scroll scrollbar-outer">
                                                <div className="notif-center">
                                                    <a href="#">
                                                        <div className="notif-icon notif-primary">
                                                            <i className="fa fa-user-plus" />
                                                        </div>
                                                        <div className="notif-content">
                                                            <span className="block">
                                                                {" "}
                                                                New user
                                                                registered{" "}
                                                            </span>
                                                            <span className="time">
                                                                5 minutes ago
                                                            </span>
                                                        </div>
                                                    </a>
                                                    <a href="#">
                                                        <div className="notif-icon notif-success">
                                                            <i className="fa fa-comment" />
                                                        </div>
                                                        <div className="notif-content">
                                                            <span className="block">
                                                                Rahmad commented
                                                                on Admin
                                                            </span>
                                                            <span className="time">
                                                                12 minutes ago
                                                            </span>
                                                        </div>
                                                    </a>
                                                    <a href="#">
                                                        <div className="notif-img">
                                                            <img
                                                                src="../assets/img/profile2.jpg"
                                                                alt="Img Profile"
                                                            />
                                                        </div>
                                                        <div className="notif-content">
                                                            <span className="block">
                                                                Reza send
                                                                messages to you
                                                            </span>
                                                            <span className="time">
                                                                12 minutes ago
                                                            </span>
                                                        </div>
                                                    </a>
                                                    <a href="#">
                                                        <div className="notif-icon notif-danger">
                                                            <i className="fa fa-heart" />
                                                        </div>
                                                        <div className="notif-content">
                                                            <span className="block">
                                                                {" "}
                                                                Farrah liked
                                                                Admin{" "}
                                                            </span>
                                                            <span className="time">
                                                                17 minutes ago
                                                            </span>
                                                        </div>
                                                    </a>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <a
                                                className="see-all"
                                                href="javascript:void(0);"
                                            >
                                                See all notifications
                                                <i className="fa fa-angle-right" />
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                                <li className="nav-item topbar-icon dropdown hidden-caret">
                                    <a
                                        className="nav-link"
                                        data-bs-toggle="dropdown"
                                        href="#"
                                        aria-expanded="false"
                                    >
                                        <i className="fas fa-layer-group" />
                                    </a>
                                    <div className="dropdown-menu quick-actions animated fadeIn">
                                        <div className="quick-actions-header">
                                            <span className="title mb-1">
                                                Quick Actions
                                            </span>
                                            <span className="subtitle op-7">
                                                Shortcuts
                                            </span>
                                        </div>
                                        <div className="quick-actions-scroll scrollbar-outer">
                                            <div className="quick-actions-items">
                                                <div className="row m-0">
                                                    <a
                                                        className="col-6 col-md-4 p-0"
                                                        href="#"
                                                    >
                                                        <div className="quick-actions-item">
                                                            <div className="avatar-item bg-danger rounded-circle">
                                                                <i className="far fa-calendar-alt" />
                                                            </div>
                                                            <span className="text">
                                                                Calendar
                                                            </span>
                                                        </div>
                                                    </a>
                                                    <a
                                                        className="col-6 col-md-4 p-0"
                                                        href="#"
                                                    >
                                                        <div className="quick-actions-item">
                                                            <div className="avatar-item bg-warning rounded-circle">
                                                                <i className="fas fa-map" />
                                                            </div>
                                                            <span className="text">
                                                                Maps
                                                            </span>
                                                        </div>
                                                    </a>
                                                    <a
                                                        className="col-6 col-md-4 p-0"
                                                        href="#"
                                                    >
                                                        <div className="quick-actions-item">
                                                            <div className="avatar-item bg-info rounded-circle">
                                                                <i className="fas fa-file-excel" />
                                                            </div>
                                                            <span className="text">
                                                                Reports
                                                            </span>
                                                        </div>
                                                    </a>
                                                    <a
                                                        className="col-6 col-md-4 p-0"
                                                        href="#"
                                                    >
                                                        <div className="quick-actions-item">
                                                            <div className="avatar-item bg-success rounded-circle">
                                                                <i className="fas fa-envelope" />
                                                            </div>
                                                            <span className="text">
                                                                Emails
                                                            </span>
                                                        </div>
                                                    </a>
                                                    <a
                                                        className="col-6 col-md-4 p-0"
                                                        href="#"
                                                    >
                                                        <div className="quick-actions-item">
                                                            <div className="avatar-item bg-primary rounded-circle">
                                                                <i className="fas fa-file-invoice-dollar" />
                                                            </div>
                                                            <span className="text">
                                                                Invoice
                                                            </span>
                                                        </div>
                                                    </a>
                                                    <a
                                                        className="col-6 col-md-4 p-0"
                                                        href="#"
                                                    >
                                                        <div className="quick-actions-item">
                                                            <div className="avatar-item bg-secondary rounded-circle">
                                                                <i className="fas fa-credit-card" />
                                                            </div>
                                                            <span className="text">
                                                                Payments
                                                            </span>
                                                        </div>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
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
                                                src={user.avatar}
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
                                                            src={user?.avatar}
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
                                                            to={`account/details/${user.user_code}`}
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
                                                    to={`account/details/${user.user_code}`}
                                                    className="dropdown-item"
                                                    href="#"
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
                {/* <footer className="footer">
                    <div className="container-fluid d-flex justify-content-between">
                        <nav className="pull-left">
                            <ul className="nav">
                                <li className="nav-item">
                                    <a
                                        className="nav-link"
                                        href="http://www.themekita.com"
                                    >
                                        ThemeKita
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#">
                                        {" "}
                                        Help{" "}
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#">
                                        {" "}
                                        Licenses{" "}
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </footer> */}
            </div>
        </div>
    );
};

export default AdminLayout;
