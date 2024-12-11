import React, { useEffect, useState } from "react";

const DashboardCards = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("https://admin.feduvn.com/api/count-info");
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                const result = await response.json();
                setData(result.countRoom);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            {/* Header */}
            {/* <div className="d-flex align-items-left align-items-md-center flex-column flex-md-row pt-2 pb-4">
                <div>
                    <h3 className="fw-bold mb-3">Dashboard</h3>
                </div>
                <div className="ms-md-auto py-2 py-md-0">
                    <a href="#" className="btn btn-label-info btn-round me-2">
                        Manage
                    </a>
                    <a href="#" className="btn btn-primary btn-round">
                        Add Customer
                    </a>
                </div>
            </div> */}

            {/* Cards Row */}
            <div className="row row-card-no-pd">
                {/* Card 1 */}
                <div className="col-12 col-sm-6 col-md-6 col-xl-3">
                    <div className="card" style={{minHeight: "110px"}}>
                        <div className="card-body">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <h6>
                                        <b>Chuyên ngành</b>
                                    </h6>
                                    <p className="text-muted">Tổng chuyên ngành</p>
                                </div>
                                <h4 className="text-info fw-bold fs-1">{data.count_major}</h4>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card 2 */}
                <div className="col-12 col-sm-6 col-md-6 col-xl-3">
                    <div className="card"style={{minHeight: "110px"}}>
                        <div className="card-body">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <h6>
                                        <b>Sinh viên</b>
                                    </h6>
                                    <p className="text-muted">Tổng số sinh viên</p>
                                </div>
                                <h4 className="text-success fw-bold fs-1">{data.count_student}</h4>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card 3 */}
                <div className="col-12 col-sm-6 col-md-6 col-xl-3">
                    <div className="card" style={{minHeight: "110px"}}>
                        <div className="card-body">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <h6>
                                        <b>Giảng viên</b>
                                    </h6>
                                    <p className="text-muted">Tổng số giảng viên</p>
                                </div>
                                <h4 className="text-danger fw-bold fs-1">{data.count_teacher}</h4>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card 4 */}
                <div className="col-12 col-sm-6 col-md-6 col-xl-3">
                    <div className="card" style={{minHeight: "110px"}}>
                        <div className="card-body">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <h6>
                                        <b>Lớp học</b>
                                    </h6>
                                    <p className="text-muted">Tổng số lớp học</p>
                                </div>
                                <h4 className="text-secondary fw-bold fs-1">{data.count_classroom}</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardCards;
