import React from "react";
import "../css/header.css";
const Header = () => {
    return (
        <div>
            <div>
                <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
                    <div className="container">
                        <a className="navbar-brand" href="#">
                            Start Bootstrap
                        </a>
                        <button
                            className="navbar-toggler"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#navbarResponsive"
                            aria-controls="navbarResponsive"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                        >
                            <span className="navbar-toggler-icon" />
                        </button>
                        <div
                            className="collapse navbar-collapse"
                            id="navbarResponsive"
                        >
                            <ul className="navbar-nav ms-auto">
                                <li className="nav-item active">
                                    <a className="nav-link" href="#">
                                        Home
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#">
                                        About
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#">
                                        Services
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#">
                                        Contact
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
                <header>
                    <div
                        id="carouselExampleCaptions"
                        className="carousel slide"
                        data-bs-ride="carousel"
                    >
                        <div className="carousel-indicators">
                            <button
                                type="button"
                                data-bs-target="#carouselExampleCaptions"
                                data-bs-slide-to={0}
                                className="active"
                                aria-current="true"
                                aria-label="Slide 1"
                            />
                            <button
                                type="button"
                                data-bs-target="#carouselExampleCaptions"
                                data-bs-slide-to={1}
                                aria-label="Slide 2"
                            />
                            <button
                                type="button"
                                data-bs-target="#carouselExampleCaptions"
                                data-bs-slide-to={2}
                                aria-label="Slide 3"
                            />
                        </div>
                        <div className="carousel-inner">
                            <div
                                className="carousel-item active"
                                style={{
                                    backgroundImage:
                                        'url("https://source.unsplash.com/LAaSoL0LrYs/1920x1080")',
                                }}
                            >
                                <div className="carousel-caption">
                                    <h5>First slide label</h5>
                                    <p>
                                        Some representative placeholder content
                                        for the first slide.
                                    </p>
                                </div>
                            </div>
                            <div
                                className="carousel-item"
                                style={{
                                    backgroundImage:
                                        'url("https://source.unsplash.com/bF2vsubyHcQ/1920x1080")',
                                }}
                            >
                                <div className="carousel-caption">
                                    <h5>Second slide label</h5>
                                    <p>
                                        Some representative placeholder content
                                        for the second slide.
                                    </p>
                                </div>
                            </div>
                            <div
                                className="carousel-item"
                                style={{
                                    backgroundImage:
                                        'url("https://source.unsplash.com/szFUQoyvrxM/1920x1080")',
                                }}
                            >
                                <div className="carousel-caption">
                                    <h5>Third slide label</h5>
                                    <p>
                                        Some representative placeholder content
                                        for the third slide.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <button
                            className="carousel-control-prev"
                            type="button"
                            data-bs-target="#carouselExampleCaptions"
                            data-bs-slide="prev"
                        >
                            <span
                                className="carousel-control-prev-icon"
                                aria-hidden="true"
                            />
                            <span className="visually-hidden">Previous</span>
                        </button>
                        <button
                            className="carousel-control-next"
                            type="button"
                            data-bs-target="#carouselExampleCaptions"
                            data-bs-slide="next"
                        >
                            <span
                                className="carousel-control-next-icon"
                                aria-hidden="true"
                            />
                            <span className="visually-hidden">Next</span>
                        </button>
                    </div>
                </header>
                <section className="py-5">
                    <div className="container">
                        <h1 className="fw-light">Full Page Image Slider</h1>
                        <p className="lead">
                            The background images for the slider are set
                            directly in the HTML using inline CSS. The images in
                            this snippet are from{" "}
                            <a href="https://unsplash.com">Unsplash</a>, taken
                            by{"{"}" "{"}"}
                            <a href="https://unsplash.com/@joannakosinska">
                                Joanna Kosinska
                            </a>
                            !
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Header;
