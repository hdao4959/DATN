import React from "react";
import { useNavigate } from "react-router-dom";
import "/src/css/notFound.css";

const NotFound = () => {
    const navigate = useNavigate();
    const accessToken = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const handleBack = () => {
        if (!accessToken) {
            navigate("/signin");
        } else if (user.role === "0") {
            navigate("/admin");
        } else if (user.role === "2") {
            navigate("/teacher");
        } else if (user.role === "3") {
            navigate("/student");
        } else {
            navigate("/signin");
        }
    };

    return (
        <div id="notfound">
            <link
                href="https://fonts.googleapis.com/css?family=Montserrat:200,400,700"
                rel="stylesheet"
            />
            <div className="notfound">
                <div className="notfound-404">
                    <h1>Oops!</h1>
                    <h2>404 - Không tìm thấy trang</h2>
                </div>
                <button onClick={handleBack}>
                    <a >Trở về</a>
                </button>
            </div>
        </div>
    );
};

export default NotFound;
