import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardCards from "./DashboardCards";
import api from "../../../config/axios";

const Dashboard = () => {
    const [statusFeeData, setStatusFeeData] = useState(null);
    const [attendanceData, setAttendanceData] = useState(null);
    const [studentCountData, setStudentCountData] = useState({
        labels: [],
        data: [],
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const feeResponse = await api.get("/status-fee-all");
                const { pending, paid, unpaid } =
                    feeResponse.data["status-fee"];
                setStatusFeeData([pending, paid, unpaid]);

                // Khởi tạo biểu đồ 1
                const ctx1 = document.getElementById("chart1").getContext("2d");
                new Chart(ctx1, {
                    type: "pie",
                    data: {
                        labels: ["Đang chờ", "Đã thanh toán", "Chưa thanh toán"],
                        datasets: [
                            {
                                label: "Status Fee",
                                data: [pending, paid, unpaid],
                                backgroundColor: [
                                    "rgba(255, 255, 0, 0.6)", // Yellow
                                    "rgba(26, 165, 8, 0.6)",   // Green
                                    "rgba(255, 0, 0, 0.6)"    // Red

                                ],
                                borderColor: [
                                    "rgba(255, 206, 86, 1)",
                                    "rgba(75, 192, 192, 1)",
                                    "rgba(255, 99, 132, 1)",
                                ],
                                borderWidth: 1,
                            },
                        ],
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: { position: "top" },
                        },
                    },
                });

                const attendanceResponse = await api.get("/status-attendances");
                const { absent, present } =
                    attendanceResponse.data["status-attendances"];
                setAttendanceData([absent, present]);

                // Khởi tạo biểu đồ 2
                const ctx2 = document.getElementById("chart2").getContext("2d");
                new Chart(ctx2, {
                    type: "pie",
                    data: {
                        labels: ["Vắng mặt", "Có mặt"],
                        datasets: [
                            {
                                label: "Status Attendance",
                                data: [absent, present],
                                backgroundColor: [
                                    "rgba(255, 99, 132, 0.6)",
                                    "rgba(75, 192, 192, 0.6)",
                                ],
                                borderColor: [
                                    "rgba(255, 99, 132, 1)",
                                    "rgba(75, 192, 192, 1)",
                                ],
                                borderWidth: 1,
                            },
                        ],
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: { position: "top" },
                        },
                    },
                });

                // Gọi API số lượng sinh viên theo ngành
                const studentCountResponse = await api.get("/count-student");
                const studentData = studentCountResponse.data;
                const labels = studentData.map((item) => item.major_name);
                const data = studentData.map((item) => item.total);
                setStudentCountData({ labels, data });

                // Khởi tạo biểu đồ cột
                const ctx3 = document.getElementById("chart3").getContext("2d");
                new Chart(ctx3, {
                    type: "bar",
                    data: {
                        labels,
                        datasets: [
                            {
                                label: "Số lượng sinh viên trong chuyên ngành",
                                data,
                                backgroundColor: [
                                    "rgba(255, 206, 86, 0.6)",
                                    "rgba(75, 192, 192, 0.6)",
                                    "rgba(255, 99, 132, 0.6)",
                                    "rgba(153, 102, 255, 0.6)",
                                    "rgba(54, 162, 235, 0.6)",
                                ],
                                borderColor: [
                                    "rgba(255, 206, 86, 1)",
                                    "rgba(75, 192, 192, 1)",
                                    "rgba(255, 99, 132, 1)",
                                    "rgba(153, 102, 255, 1)",
                                    "rgba(54, 162, 235, 1)",
                                ],
                                borderWidth: 1,
                            },
                        ],
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: { position: "top" },
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                            },
                        },
                    },
                });
                const ctx4 = document.getElementById("statisticsChart").getContext("2d");
                new Chart(ctx4, {
                    type: 'line',
                    data: {
                        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                        datasets: [{
                            label: "Subscribers",
                            borderColor: '#f3545d',
                            pointBackgroundColor: 'rgba(243, 84, 93, 0.6)',
                            pointRadius: 0,
                            backgroundColor: 'rgba(243, 84, 93, 0.4)',
                            legendColor: '#f3545d',
                            fill: true,
                            borderWidth: 2,
                            data: [154, 184, 175, 203, 210, 231, 240, 278, 252, 312, 320, 374]
                        }, {
                            label: "New Visitors",
                            borderColor: '#fdaf4b',
                            pointBackgroundColor: 'rgba(253, 175, 75, 0.6)',
                            pointRadius: 0,
                            backgroundColor: 'rgba(253, 175, 75, 0.4)',
                            legendColor: '#fdaf4b',
                            fill: true,
                            borderWidth: 2,
                            data: [256, 230, 245, 287, 240, 250, 230, 295, 331, 431, 456, 521]
                        }, {
                            label: "Active Users",
                            borderColor: '#177dff',
                            pointBackgroundColor: 'rgba(23, 125, 255, 0.6)',
                            pointRadius: 0,
                            backgroundColor: 'rgba(23, 125, 255, 0.4)',
                            legendColor: '#177dff',
                            fill: true,
                            borderWidth: 2,
                            data: [542, 480, 430, 550, 530, 453, 380, 434, 568, 610, 700, 900]
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        legend: {
                            display: false
                        },
                        tooltips: {
                            bodySpacing: 4,
                            mode: "nearest",
                            intersect: 0,
                            position: "nearest",
                            xPadding: 10,
                            yPadding: 10,
                            caretPadding: 10
                        },
                        layout: {
                            padding: { left: 5, right: 5, top: 15, bottom: 15 }
                        },
                        scales: {
                            yAxes: [{
                                ticks: {
                                    fontStyle: "500",
                                    beginAtZero: false,
                                    maxTicksLimit: 5,
                                    padding: 10
                                },
                                gridLines: {
                                    drawTicks: false,
                                    display: false
                                }
                            }],
                            xAxes: [{
                                gridLines: {
                                    zeroLineColor: "transparent"
                                },
                                ticks: {
                                    padding: 10,
                                    fontStyle: "500"
                                }
                            }]
                        },
                        legendCallback: function (chart) {
                            var text = [];
                            text.push('<ul class="' + chart.id + '-legend html-legend">');
                            for (var i = 0; i < chart.data.datasets.length; i++) {
                                text.push('<li><span style="background-color:' + chart.data.datasets[i].legendColor + '"></span>');
                                if (chart.data.datasets[i].label) {
                                    text.push(chart.data.datasets[i].label);
                                }
                                text.push('</li>');
                            }
                            text.push('</ul>');
                            return text.join('');
                        }
                    }
                });
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);
    return (
        <>
            <DashboardCards />
            <div className="container mt-5">
                {/* <h3 className="fw-bold mb-3">Dashboard Charts</h3> */}
                <div className="row">
                    {/* <div className="col-md-8">
                        <div className="card card-round">
                            <div className="card-header">
                                <div className="card-head-row">
                                    <div className="card-title">User Statistics</div>
                                    <div className="card-tools">
                                        <a href="#" className="btn btn-label-success btn-round btn-sm me-2">
                                            <span className="btn-label">
                                                <i className="fa fa-pencil"></i>
                                            </span>
                                            Export
                                        </a>
                                        <a href="#" className="btn btn-label-info btn-round btn-sm">
                                            <span className="btn-label">
                                                <i className="fa fa-print"></i>
                                            </span>
                                            Print
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="chart-container" style={{ minHeight: '375px' }}>
                                    <canvas id="statisticsChart"></canvas>
                                </div>
                                <div id="myChartLegend"></div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card card-primary card-round">
                            <div className="card-header">
                                <div className="card-head-row">
                                    <div className="card-title">Daily Sales</div>
                                    <div className="card-tools">
                                        <div className="dropdown">
                                            <button
                                                className="btn btn-sm btn-label-light dropdown-toggle"
                                                type="button"
                                                id="dropdownMenuButton"
                                                data-bs-toggle="dropdown"
                                                aria-haspopup="true"
                                                aria-expanded="false"
                                            >
                                                Export
                                            </button>
                                            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                <a className="dropdown-item" href="#">Action</a>
                                                <a className="dropdown-item" href="#">Another action</a>
                                                <a className="dropdown-item" href="#">Something else here</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-category">March 25 - April 02</div>
                            </div>
                            <div className="card-body pb-0">
                                <div className="mb-4 mt-2">
                                    <h1>$4,578.58</h1>
                                </div>
                                <div className="pull-in">
                                    <canvas id="dailySalesChart"></canvas>
                                </div>
                            </div>
                        </div>
                        <div className="card card-round">
                            <div className="card-body pb-0">
                                <div className="h1 fw-bold float-end text-primary">+5%</div>
                                <h2 className="mb-2">17</h2>
                                <p className="text-muted">Users online</p>
                                <div className="pull-in sparkline-fix">
                                    <div id="lineChart"></div>
                                </div>
                            </div>
                        </div>
                    </div> */}
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-header">
                                <div className="card-title">Số lượng học sinh theo chuyên ngành</div>
                            </div>
                            <div className="card-body">
                                <div className="chart-container">
                                    <canvas
                                        id="chart3"
                                        style={{ height: "50%", width: "50%" }}
                                    ></canvas>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-header">
                                <div className="card-title">Sinh viên đóng học phí</div>
                            </div>
                            <div className="card-body">
                                <div className="chart-container">
                                    <canvas
                                        id="chart1"
                                        style={{ height: "50%", width: "50%" }}
                                    ></canvas>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-header">
                                <div className="card-title">Điểm danh sinh viên</div>
                            </div>
                            <div className="card-body">
                                <div className="chart-container">
                                    <canvas
                                        id="chart2"
                                        style={{ height: "50%", width: "50%" }}
                                    ></canvas>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <div className="row mt-5">
                    
                </div> */}
            </div>
            {/* <div className="page-header">
                <h3 className="fw-bold mb-3">Forms</h3>
                <ul className="breadcrumbs mb-3">
                    <li className="nav-home">
                        <a href="#">
                            <i className="icon-home" />
                        </a>
                    </li>
                    <li className="separator">
                        <i className="icon-arrow-right" />
                    </li>
                    <li className="nav-item">
                        <a href="#">Forms</a>
                    </li>
                    <li className="separator">
                        <i className="icon-arrow-right" />
                    </li>
                    <li className="nav-item">
                        <a href="#">Basic Form</a>
                    </li>
                </ul>
            </div>
            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">
                            <div className="card-title">Form Elements</div>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-6 col-lg-4">
                                    <div className="form-group">
                                        <label htmlFor="email2">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="email2"
                                            placeholder="Enter Email"
                                        />
                                        <small
                                            id="emailHelp2"
                                            className="form-text text-muted"
                                        >
                                            We'll never share your email with
                                            anyone else.
                                        </small>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="password">
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="password"
                                            placeholder="Password"
                                        />
                                    </div>
                                    <div className="form-group form-inline">
                                        <label
                                            htmlFor="inlineinput"
                                            className="col-md-3 col-form-label"
                                        >
                                            Inline Input
                                        </label>
                                        <div className="col-md-9 p-0">
                                            <input
                                                type="text"
                                                className="form-control input-full"
                                                id="inlineinput"
                                                placeholder="Enter Input"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group has-success">
                                        <label htmlFor="successInput">
                                            Success Input
                                        </label>
                                        <input
                                            type="text"
                                            id="successInput"
                                            defaultValue="Success"
                                            className="form-control"
                                        />
                                    </div>
                                    <div className="form-group has-error has-feedback">
                                        <label htmlFor="errorInput">
                                            Error Input
                                        </label>
                                        <input
                                            type="text"
                                            id="errorInput"
                                            defaultValue="Error"
                                            className="form-control"
                                        />
                                        <small
                                            id="emailHelp"
                                            className="form-text text-muted"
                                        >
                                            Please provide a valid informations.
                                        </small>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="disableinput">
                                            Disable Input
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="disableinput"
                                            placeholder="Enter Input"
                                            disabled=""
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Gender</label>
                                        <br />
                                        <div className="d-flex">
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="flexRadioDefault"
                                                    id="flexRadioDefault1"
                                                />
                                                <label
                                                    className="form-check-label"
                                                    htmlFor="flexRadioDefault1"
                                                >
                                                    Male
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="flexRadioDefault"
                                                    id="flexRadioDefault2"
                                                    defaultChecked=""
                                                />
                                                <label
                                                    className="form-check-label"
                                                    htmlFor="flexRadioDefault2"
                                                >
                                                    Female
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="control-label">
                                            {" "}
                                            Static{" "}
                                        </label>
                                        <p className="form-control-static">
                                            hello@example.com
                                        </p>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="exampleFormControlSelect1">
                                            Example select
                                        </label>
                                        <select
                                            className="form-select"
                                            id="exampleFormControlSelect1"
                                        >
                                            <option>1</option>
                                            <option>2</option>
                                            <option>3</option>
                                            <option>4</option>
                                            <option>5</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="exampleFormControlSelect2">
                                            Example multiple select
                                        </label>
                                        <select
                                            multiple=""
                                            className="form-control"
                                            id="exampleFormControlSelect2"
                                        >
                                            <option>1</option>
                                            <option>2</option>
                                            <option>3</option>
                                            <option>4</option>
                                            <option>5</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="exampleFormControlFile1">
                                            Example file input
                                        </label>
                                        <input
                                            type="file"
                                            className="form-control-file"
                                            id="exampleFormControlFile1"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="comment">Comment</label>
                                        <textarea
                                            className="form-control"
                                            id="comment"
                                            rows={5}
                                            defaultValue={
                                                "                          "
                                            }
                                        />
                                    </div>
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            defaultValue=""
                                            id="flexCheckDefault"
                                        />
                                        <label
                                            className="form-check-label"
                                            htmlFor="flexCheckDefault"
                                        >
                                            Agree with terms and conditions
                                        </label>
                                    </div>
                                </div>
                                <div className="col-md-6 col-lg-4">
                                    <div className="form-group">
                                        <div className="input-group mb-3">
                                            <span
                                                className="input-group-text"
                                                id="basic-addon1"
                                            >
                                                @
                                            </span>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Username"
                                                aria-label="Username"
                                                aria-describedby="basic-addon1"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="input-group mb-3">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Recipient's username"
                                                aria-label="Recipient's username"
                                                aria-describedby="basic-addon2"
                                            />
                                            <span
                                                className="input-group-text"
                                                id="basic-addon2"
                                            >
                                                @example.com
                                            </span>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="basic-url">
                                            Your vanity URL
                                        </label>
                                        <div className="input-group mb-3">
                                            <span
                                                className="input-group-text"
                                                id="basic-addon3"
                                            >
                                                https://example.com/users/
                                            </span>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="basic-url"
                                                aria-describedby="basic-addon3"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="input-group mb-3">
                                            <span className="input-group-text">
                                                $
                                            </span>
                                            <input
                                                type="text"
                                                className="form-control"
                                                aria-label="Amount (to the nearest dollar)"
                                            />
                                            <span className="input-group-text">
                                                .00
                                            </span>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="input-group">
                                            <span className="input-group-text">
                                                With textarea
                                            </span>
                                            <textarea
                                                className="form-control"
                                                aria-label="With textarea"
                                                defaultValue={""}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="input-group">
                                            <button
                                                className="btn btn-black btn-border"
                                                type="button"
                                            >
                                                Button
                                            </button>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder=""
                                                aria-label=""
                                                aria-describedby="basic-addon1"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="input-group">
                                            <input
                                                type="text"
                                                className="form-control"
                                                aria-label="Text input with dropdown button"
                                            />
                                            <div className="input-group-append">
                                                <button
                                                    className="btn btn-primary btn-border dropdown-toggle"
                                                    type="button"
                                                    data-bs-toggle="dropdown"
                                                    aria-haspopup="true"
                                                    aria-expanded="false"
                                                >
                                                    Dropdown
                                                </button>
                                                <div className="dropdown-menu">
                                                    <a
                                                        className="dropdown-item"
                                                        href="#"
                                                    >
                                                        Action
                                                    </a>
                                                    <a
                                                        className="dropdown-item"
                                                        href="#"
                                                    >
                                                        Another action
                                                    </a>
                                                    <a
                                                        className="dropdown-item"
                                                        href="#"
                                                    >
                                                        Something else here
                                                    </a>
                                                    <div
                                                        role="separator"
                                                        className="dropdown-divider"
                                                    />
                                                    <a
                                                        className="dropdown-item"
                                                        href="#"
                                                    >
                                                        Separated link
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="input-icon">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Search for..."
                                            />
                                            <span className="input-icon-addon">
                                                <i className="fa fa-search" />
                                            </span>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="input-icon">
                                            <span className="input-icon-addon">
                                                <i className="fa fa-user" />
                                            </span>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Username"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">
                                            Image Check
                                        </label>
                                        <div className="row">
                                            <div className="col-6 col-sm-4">
                                                <label className="imagecheck mb-4">
                                                    <input
                                                        name="imagecheck"
                                                        type="checkbox"
                                                        defaultValue={1}
                                                        className="imagecheck-input"
                                                    />
                                                    <figure className="imagecheck-figure">
                                                        <img
                                                            src="../assets/img/examples/product1.jpg"
                                                            alt="title"
                                                            className="imagecheck-image"
                                                        />
                                                    </figure>
                                                </label>
                                            </div>
                                            <div className="col-6 col-sm-4">
                                                <label className="imagecheck mb-4">
                                                    <input
                                                        name="imagecheck"
                                                        type="checkbox"
                                                        defaultValue={2}
                                                        className="imagecheck-input"
                                                        defaultChecked=""
                                                    />
                                                    <figure className="imagecheck-figure">
                                                        <img
                                                            src="../assets/img/examples/product4.jpg"
                                                            alt="title"
                                                            className="imagecheck-image"
                                                        />
                                                    </figure>
                                                </label>
                                            </div>
                                            <div className="col-6 col-sm-4">
                                                <label className="imagecheck mb-4">
                                                    <input
                                                        name="imagecheck"
                                                        type="checkbox"
                                                        defaultValue={3}
                                                        className="imagecheck-input"
                                                    />
                                                    <figure className="imagecheck-figure">
                                                        <img
                                                            src="../assets/img/examples/product3.jpg"
                                                            alt="title"
                                                            className="imagecheck-image"
                                                        />
                                                    </figure>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">
                                            Color Input
                                        </label>
                                        <div className="row gutters-xs">
                                            <div className="col-auto">
                                                <label className="colorinput">
                                                    <input
                                                        name="color"
                                                        type="checkbox"
                                                        defaultValue="dark"
                                                        className="colorinput-input"
                                                    />
                                                    <span className="colorinput-color bg-black" />
                                                </label>
                                            </div>
                                            <div className="col-auto">
                                                <label className="colorinput">
                                                    <input
                                                        name="color"
                                                        type="checkbox"
                                                        defaultValue="primary"
                                                        className="colorinput-input"
                                                    />
                                                    <span className="colorinput-color bg-primary" />
                                                </label>
                                            </div>
                                            <div className="col-auto">
                                                <label className="colorinput">
                                                    <input
                                                        name="color"
                                                        type="checkbox"
                                                        defaultValue="secondary"
                                                        className="colorinput-input"
                                                    />
                                                    <span className="colorinput-color bg-secondary" />
                                                </label>
                                            </div>
                                            <div className="col-auto">
                                                <label className="colorinput">
                                                    <input
                                                        name="color"
                                                        type="checkbox"
                                                        defaultValue="info"
                                                        className="colorinput-input"
                                                    />
                                                    <span className="colorinput-color bg-info" />
                                                </label>
                                            </div>
                                            <div className="col-auto">
                                                <label className="colorinput">
                                                    <input
                                                        name="color"
                                                        type="checkbox"
                                                        defaultValue="success"
                                                        className="colorinput-input"
                                                    />
                                                    <span className="colorinput-color bg-success" />
                                                </label>
                                            </div>
                                            <div className="col-auto">
                                                <label className="colorinput">
                                                    <input
                                                        name="color"
                                                        type="checkbox"
                                                        defaultValue="danger"
                                                        className="colorinput-input"
                                                    />
                                                    <span className="colorinput-color bg-danger" />
                                                </label>
                                            </div>
                                            <div className="col-auto">
                                                <label className="colorinput">
                                                    <input
                                                        name="color"
                                                        type="checkbox"
                                                        defaultValue="warning"
                                                        className="colorinput-input"
                                                    />
                                                    <span className="colorinput-color bg-warning" />
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">
                                            Size
                                        </label>
                                        <div className="selectgroup w-100">
                                            <label className="selectgroup-item">
                                                <input
                                                    type="radio"
                                                    name="value"
                                                    defaultValue={50}
                                                    className="selectgroup-input"
                                                    defaultChecked=""
                                                />
                                                <span className="selectgroup-button">
                                                    S
                                                </span>
                                            </label>
                                            <label className="selectgroup-item">
                                                <input
                                                    type="radio"
                                                    name="value"
                                                    defaultValue={100}
                                                    className="selectgroup-input"
                                                />
                                                <span className="selectgroup-button">
                                                    M
                                                </span>
                                            </label>
                                            <label className="selectgroup-item">
                                                <input
                                                    type="radio"
                                                    name="value"
                                                    defaultValue={150}
                                                    className="selectgroup-input"
                                                />
                                                <span className="selectgroup-button">
                                                    L
                                                </span>
                                            </label>
                                            <label className="selectgroup-item">
                                                <input
                                                    type="radio"
                                                    name="value"
                                                    defaultValue={200}
                                                    className="selectgroup-input"
                                                />
                                                <span className="selectgroup-button">
                                                    XL
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">
                                            Icons input
                                        </label>
                                        <div className="selectgroup w-100">
                                            <label className="selectgroup-item">
                                                <input
                                                    type="radio"
                                                    name="transportation"
                                                    defaultValue={2}
                                                    className="selectgroup-input"
                                                />
                                                <span className="selectgroup-button selectgroup-button-icon">
                                                    <i className="icon-screen-smartphone" />
                                                </span>
                                            </label>
                                            <label className="selectgroup-item">
                                                <input
                                                    type="radio"
                                                    name="transportation"
                                                    defaultValue={1}
                                                    className="selectgroup-input"
                                                    defaultChecked=""
                                                />
                                                <span className="selectgroup-button selectgroup-button-icon">
                                                    <i className="icon-screen-tablet" />
                                                </span>
                                            </label>
                                            <label className="selectgroup-item">
                                                <input
                                                    type="radio"
                                                    name="transportation"
                                                    defaultValue={6}
                                                    className="selectgroup-input"
                                                />
                                                <span className="selectgroup-button selectgroup-button-icon">
                                                    <i className="icon-screen-desktop" />
                                                </span>
                                            </label>
                                            <label className="selectgroup-item">
                                                <input
                                                    type="radio"
                                                    name="transportation"
                                                    defaultValue={6}
                                                    className="selectgroup-input"
                                                />
                                                <span className="selectgroup-button selectgroup-button-icon">
                                                    <i className="fa fa-times" />
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label d-block">
                                            Icon input
                                        </label>
                                        <div className="selectgroup selectgroup-secondary selectgroup-pills">
                                            <label className="selectgroup-item">
                                                <input
                                                    type="radio"
                                                    name="icon-input"
                                                    defaultValue={1}
                                                    className="selectgroup-input"
                                                    defaultChecked=""
                                                />
                                                <span className="selectgroup-button selectgroup-button-icon">
                                                    <i className="fa fa-sun" />
                                                </span>
                                            </label>
                                            <label className="selectgroup-item">
                                                <input
                                                    type="radio"
                                                    name="icon-input"
                                                    defaultValue={2}
                                                    className="selectgroup-input"
                                                />
                                                <span className="selectgroup-button selectgroup-button-icon">
                                                    <i className="fa fa-moon" />
                                                </span>
                                            </label>
                                            <label className="selectgroup-item">
                                                <input
                                                    type="radio"
                                                    name="icon-input"
                                                    defaultValue={3}
                                                    className="selectgroup-input"
                                                />
                                                <span className="selectgroup-button selectgroup-button-icon">
                                                    <i className="fa fa-tint" />
                                                </span>
                                            </label>
                                            <label className="selectgroup-item">
                                                <input
                                                    type="radio"
                                                    name="icon-input"
                                                    defaultValue={4}
                                                    className="selectgroup-input"
                                                />
                                                <span className="selectgroup-button selectgroup-button-icon">
                                                    <i className="fa fa-cloud" />
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">
                                            Your skills
                                        </label>
                                        <div className="selectgroup selectgroup-pills">
                                            <label className="selectgroup-item">
                                                <input
                                                    type="checkbox"
                                                    name="value"
                                                    defaultValue="HTML"
                                                    className="selectgroup-input"
                                                    defaultChecked=""
                                                />
                                                <span className="selectgroup-button">
                                                    HTML
                                                </span>
                                            </label>
                                            <label className="selectgroup-item">
                                                <input
                                                    type="checkbox"
                                                    name="value"
                                                    defaultValue="CSS"
                                                    className="selectgroup-input"
                                                />
                                                <span className="selectgroup-button">
                                                    CSS
                                                </span>
                                            </label>
                                            <label className="selectgroup-item">
                                                <input
                                                    type="checkbox"
                                                    name="value"
                                                    defaultValue="PHP"
                                                    className="selectgroup-input"
                                                />
                                                <span className="selectgroup-button">
                                                    PHP
                                                </span>
                                            </label>
                                            <label className="selectgroup-item">
                                                <input
                                                    type="checkbox"
                                                    name="value"
                                                    defaultValue="JavaScript"
                                                    className="selectgroup-input"
                                                />
                                                <span className="selectgroup-button">
                                                    JavaScript
                                                </span>
                                            </label>
                                            <label className="selectgroup-item">
                                                <input
                                                    type="checkbox"
                                                    name="value"
                                                    defaultValue="Ruby"
                                                    className="selectgroup-input"
                                                />
                                                <span className="selectgroup-button">
                                                    Ruby
                                                </span>
                                            </label>
                                            <label className="selectgroup-item">
                                                <input
                                                    type="checkbox"
                                                    name="value"
                                                    defaultValue="Ruby"
                                                    className="selectgroup-input"
                                                />
                                                <span className="selectgroup-button">
                                                    Ruby
                                                </span>
                                            </label>
                                            <label className="selectgroup-item">
                                                <input
                                                    type="checkbox"
                                                    name="value"
                                                    defaultValue="C++"
                                                    className="selectgroup-input"
                                                />
                                                <span className="selectgroup-button">
                                                    C++
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 col-lg-4">
                                    <label className="mb-3">
                                        <b>Form Group Default</b>
                                    </label>
                                    <div className="form-group form-group-default">
                                        <label>Input</label>
                                        <input
                                            id="Name"
                                            type="text"
                                            className="form-control"
                                            placeholder="Fill Name"
                                        />
                                    </div>
                                    <div className="form-group form-group-default">
                                        <label>Select</label>
                                        <select
                                            className="form-select"
                                            id="formGroupDefaultSelect"
                                        >
                                            <option>1</option>
                                            <option>2</option>
                                            <option>3</option>
                                            <option>4</option>
                                            <option>5</option>
                                        </select>
                                    </div>
                                    <label className="mt-3 mb-3">
                                        <b>Form Floating Label</b>
                                    </label>
                                    <div className="form-floating form-floating-custom mb-3">
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="floatingInput"
                                            placeholder="name@example.com"
                                        />
                                        <label htmlFor="floatingInput">
                                            Email address
                                        </label>
                                    </div>
                                    <div className="form-floating form-floating-custom mb-3">
                                        <select
                                            className="form-select"
                                            id="selectFloatingLabel"
                                            required=""
                                        >
                                            <option selected="">1</option>
                                            <option>2</option>
                                            <option>3</option>
                                            <option>4</option>
                                            <option>5</option>
                                        </select>
                                        <label htmlFor="selectFloatingLabel">
                                            Select
                                        </label>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="largeInput">
                                            Large Input
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control form-control-lg"
                                            id="largeInput"
                                            placeholder="Large Input"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="largeInput">
                                            Default Input
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control form-control"
                                            id="defaultInput"
                                            placeholder="Default Input"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="smallInput">
                                            Small Input
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            id="smallInput"
                                            placeholder="Small Input"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="largeSelect">
                                            Large Select
                                        </label>
                                        <select
                                            className="form-select form-control-lg"
                                            id="largeSelect"
                                        >
                                            <option>1</option>
                                            <option>2</option>
                                            <option>3</option>
                                            <option>4</option>
                                            <option>5</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="defaultSelect">
                                            Default Select
                                        </label>
                                        <select
                                            className="form-select form-control"
                                            id="defaultSelect"
                                        >
                                            <option>1</option>
                                            <option>2</option>
                                            <option>3</option>
                                            <option>4</option>
                                            <option>5</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="smallSelect">
                                            Small Select
                                        </label>
                                        <select
                                            className="form-select form-control-sm"
                                            id="smallSelect"
                                        >
                                            <option>1</option>
                                            <option>2</option>
                                            <option>3</option>
                                            <option>4</option>
                                            <option>5</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-action">
                            <button className="btn btn-success">Submit</button>
                            <button className="btn btn-danger">Cancel</button>
                        </div>
                    </div>
                </div>
            </div> */}
        </>
    );
};

export default Dashboard;
