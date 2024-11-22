import React from "react";

const DashboardCards = () => {
    return (
        <div>
            {/* Header */}
            <div className="d-flex align-items-left align-items-md-center flex-column flex-md-row pt-2 pb-4">
                <div>
                    <h3 className="fw-bold mb-3">Dashboard</h3>
                    <h6 className="op-7 mb-2">Free Bootstrap 5 Admin Dashboard</h6>
                </div>
                <div className="ms-md-auto py-2 py-md-0">
                    <a href="#" className="btn btn-label-info btn-round me-2">
                        Manage
                    </a>
                    <a href="#" className="btn btn-primary btn-round">
                        Add Customer
                    </a>
                </div>
            </div>

            {/* Cards Row */}
            <div className="row row-card-no-pd">
                {/* Card 1 */}
                <div className="col-12 col-sm-6 col-md-6 col-xl-3">
                    <div className="card">
                        <div className="card-body">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <h6>
                                        <b>Todays Income</b>
                                    </h6>
                                    <p className="text-muted">All Customs Value</p>
                                </div>
                                <h4 className="text-info fw-bold">$170</h4>
                            </div>
                            <div className="progress progress-sm">
                                <div
                                    className="progress-bar bg-info"
                                    style={{ width: "75%" }}
                                    role="progressbar"
                                    aria-valuenow="75"
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                ></div>
                            </div>
                            <div className="d-flex justify-content-between mt-2">
                                <p className="text-muted mb-0">Change</p>
                                <p className="text-muted mb-0">75%</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card 2 */}
                <div className="col-12 col-sm-6 col-md-6 col-xl-3">
                    <div className="card">
                        <div className="card-body">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <h6>
                                        <b>Total Revenue</b>
                                    </h6>
                                    <p className="text-muted">All Customs Value</p>
                                </div>
                                <h4 className="text-success fw-bold">$120</h4>
                            </div>
                            <div className="progress progress-sm">
                                <div
                                    className="progress-bar bg-success"
                                    style={{ width: "25%" }}
                                    role="progressbar"
                                    aria-valuenow="25"
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                ></div>
                            </div>
                            <div className="d-flex justify-content-between mt-2">
                                <p className="text-muted mb-0">Change</p>
                                <p className="text-muted mb-0">25%</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card 3 */}
                <div className="col-12 col-sm-6 col-md-6 col-xl-3">
                    <div className="card">
                        <div className="card-body">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <h6>
                                        <b>New Orders</b>
                                    </h6>
                                    <p className="text-muted">Fresh Order Amount</p>
                                </div>
                                <h4 className="text-danger fw-bold">15</h4>
                            </div>
                            <div className="progress progress-sm">
                                <div
                                    className="progress-bar bg-danger"
                                    style={{ width: "50%" }}
                                    role="progressbar"
                                    aria-valuenow="50"
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                ></div>
                            </div>
                            <div className="d-flex justify-content-between mt-2">
                                <p className="text-muted mb-0">Change</p>
                                <p className="text-muted mb-0">50%</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card 4 */}
                <div className="col-12 col-sm-6 col-md-6 col-xl-3">
                    <div className="card">
                        <div className="card-body">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <h6>
                                        <b>New Users</b>
                                    </h6>
                                    <p className="text-muted">Joined New User</p>
                                </div>
                                <h4 className="text-secondary fw-bold">12</h4>
                            </div>
                            <div className="progress progress-sm">
                                <div
                                    className="progress-bar bg-secondary"
                                    style={{ width: "25%" }}
                                    role="progressbar"
                                    aria-valuenow="25"
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                ></div>
                            </div>
                            <div className="d-flex justify-content-between mt-2">
                                <p className="text-muted mb-0">Change</p>
                                <p className="text-muted mb-0">25%</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardCards;
