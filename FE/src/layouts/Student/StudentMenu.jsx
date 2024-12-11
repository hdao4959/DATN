import { Link, NavLink } from "react-router-dom";

import styles from "../index.module.css";

const StudentMenu = () => {
    return (
        <div className="sidebar" style={{ backgroundColor: '#FFFFFF', color: '#333333' }}>
            <div className="sidebar-logo">
                <div className="logo-header" style={{ backgroundColor: '#FFFFFF' }}>
                    <Link to={"/student"} className="logo">
                        <img
                            src="https://admin.feduvn.com/storage/logo/logo3.png"
                            width={150}
                            alt="navbar brand"
                            className="navbar-brand"
                            height={15}
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
                        <li className="nav-item ">
                            <a data-bs-toggle="collapse" href="#attendances">
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
                                            <p className="sub-item">
                                                Điểm danh
                                            </p>
                                        </NavLink>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li className="nav-item ">
                            <a data-bs-toggle="collapse" href="#schedules">
                                <i className="fas fa-clipboard-list" />
                                <p>Lịch học</p>
                                <span className="caret" />
                            </a>
                            <div className="collapse" id="schedules">
                                <ul className="nav nav-collapse">
                                    <li>
                                        <NavLink
                                            to="/student/schedules"
                                            className={`${styles.menuItem} group`}
                                        >
                                            <p className="sub-item">Lịch học</p>
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            to="/student/schedules/transfer"
                                            className={`${styles.menuItem} group`}
                                        >
                                            <p className="sub-item">
                                                Thay đổi lịch học
                                            </p>
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            to="/student/schedules/exam-schedule"
                                            className={`${styles.menuItem} group`}
                                        >
                                            <p className="sub-item">Lịch thi</p>
                                        </NavLink>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li className="nav-item ">
                            <a data-bs-toggle="collapse" href="#classrooms">
                                <i className="fas fa-clipboard-list" />
                                <p>Lớp học</p>
                                <span className="caret" />
                            </a>
                            <div className="collapse" id="classrooms">
                                <ul className="nav nav-collapse">
                                    <li>
                                        <NavLink
                                            to="/student/classrooms"
                                            className={`${styles.menuItem} group`}
                                        >
                                            <p className="sub-item">
                                                Lớp của tôi
                                            </p>
                                        </NavLink>
                                    </li>
                                    {/* <li>
                                        <NavLink
                                            to="/student/schedules/transfer"
                                            className={`${styles.menuItem} group`}
                                        >
                                            <p className="sub-item">
                                                Thay đổi lịch học
                                            </p>
                                        </NavLink>
                                    </li> */}
                                </ul>
                            </div>
                        </li>
                        <li className="nav-item ">
                            <a data-bs-toggle="collapse" href="#grades">
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
                                            <p className="sub-item">
                                                Bảng Điểm
                                            </p>
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            to="/student/grades-all"
                                            className={`${styles.menuItem} group`}
                                        >
                                            <p className="sub-item">
                                                Bảng Điểm Tổng
                                            </p>
                                        </NavLink>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li className="nav-item ">
                            <a data-bs-toggle="collapse" href="#services">
                                <i className="fab fa-stack-overflow" />
                                <p>Dịch Vụ</p>
                                <span className="caret" />
                            </a>
                            <div className="collapse" id="services">
                                <ul className="nav nav-collapse">
                                    <li>
                                        <NavLink
                                            to="/student/services/list"
                                            className={`${styles.menuItem} group`}
                                        >
                                            <p className="sub-item">
                                                Dịch vụ đã đăng ký
                                            </p>{" "}
                                            <br />
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            to="/student/change-major"
                                            className={`${styles.menuItem} group`}
                                        >
                                            <p className="sub-item">
                                                Yêu cầu đổi chuyên ngành
                                            </p>{" "}
                                            <br />
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            to="/student/services/re-enrollment"
                                            className={`${styles.menuItem} group`}
                                        >
                                            <p className="sub-item">
                                                Đăng kí học lại
                                            </p>{" "}
                                            <br />
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            to="/student/services/yeu-cau-cap-bang-diem"
                                            className={`${styles.menuItem} group`}
                                        >
                                            <p className="sub-item">
                                                Yêu cầu cấp bảng điểm
                                            </p>{" "}
                                            <br />
                                        </NavLink>
                                    </li>
                                    {/* <li>
                                        <NavLink
                                            to="/student/services"
                                            className={`${styles.menuItem} group`}
                                        >
                                            <p className="sub-item">
                                                Yêu cầu thôi học
                                            </p>{" "}
                                            <br />
                                        </NavLink>
                                    </li>
                                   
                                    <li>
                                        <NavLink
                                            to="/student/services"
                                            className={`${styles.menuItem} group`}
                                        >
                                            <p className="sub-item">
                                                Yêu cầu cấp thẻ sinh viên
                                            </p>{" "}
                                            <br />
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            to="/student/services"
                                            className={`${styles.menuItem} group`}
                                        >
                                            <p className="sub-item">
                                                Yêu cầu thay đổi thông tin
                                            </p>{" "}
                                            <br />
                                        </NavLink>
                                    </li> */}
                                    <li>
                                        <NavLink
                                            to="/student/request-attendance"
                                            className={`${styles.menuItem} group`}
                                        >
                                            <p className="sub-item">
                                                Yêu cầu khổi phục điểm danh
                                            </p>{" "}
                                            <br />
                                        </NavLink>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li className="nav-item ">
                            <a data-bs-toggle="collapse" href="#news">
                                <i className="fas fa-newspaper" />
                                <p>Tin tức</p>
                                <span className="caret" />
                            </a>
                            <div className="collapse" id="news">
                                <ul className="nav nav-collapse">
                                    <li>
                                        <NavLink
                                            to="/student/news"
                                            className={`${styles.menuItem} group`}
                                        >
                                            <p className="sub-item">Tin tức</p>
                                        </NavLink>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li className="nav-item ">
                            <a data-bs-toggle="collapse" href="#FAQS">
                                <i className="fas fa-clipboard-list" />
                                <p>Câu hỏi thường gặp</p>
                                <span className="caret" />
                            </a>
                            <div className="collapse" id="FAQS">
                                <ul className="nav nav-collapse">
                                    <li>
                                        <NavLink
                                            to="FAQS"
                                            className={`${styles.menuItem} group`}
                                        >
                                            <p className="sub-item">FAQS</p>
                                        </NavLink>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li className="nav-item ">
                            <a data-bs-toggle="collapse" href="#wallets">
                                <i className="fas fa-wallet" />
                                <p>Ví sinh viên</p>
                                <span className="caret" />
                            </a>
                            <div className="collapse" id="wallets">
                                <ul className="nav nav-collapse">
                                    <li>
                                        <NavLink
                                            to="wallet-balance"
                                            className={`${styles.menuItem} group`}
                                        >
                                            <p className="sub-item">Số dư ví</p>
                                        </NavLink>
                                    </li>

                                    <li>
                                        <NavLink
                                            to="debt"
                                            className={`${styles.menuItem} group`}
                                        >
                                            <p className="sub-item">Công nợ</p>
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
