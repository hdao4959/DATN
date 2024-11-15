import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "/src/css/modalCalender.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useParams } from "react-router-dom";

const localizer = momentLocalizer(moment);

const eventStyleGetter = (event) => {
    const backgroundColor = event.color || "#3174ad";
    return {
        style: {
            backgroundColor,
            color: "white",
            borderRadius: "5px",
            padding: "5px",
        },
    };
};

const ClassSchedules = () => {
    const { class_code } = useParams();
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                const token = JSON.parse(localStorage.getItem("token"));
                const accessToken = token?.access_token;

                if (!accessToken) {
                    setErrorMessage("Vui lòng đăng nhập để xem lịch trình.");
                    setLoading(false);
                    return;
                }

                const response = await fetch(
                    `http://127.0.0.1:8000/api/teacher/classrooms/${class_code}/list_schedules`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    if (data.length === 0) {
                        setErrorMessage("Không có dữ liệu nào.");
                        setLoading(false);
                        return;
                    }

                    const formattedEvents = data.map((item) => {
                        const session = JSON.parse(item.session.value);
                        const startDateTime = new Date(
                            `${item.date}T${session.start}`
                        );
                        const endDateTime = new Date(
                            `${item.date}T${session.end}`
                        );

                        return {
                            title: `${item.classroom.class_name} - ${item.room.cate_name} (${item.session.cate_name})`,
                            start: startDateTime,
                            end: endDateTime,
                            color: "#88bde6",
                        };
                    });

                    setEvents(formattedEvents);
                } else {
                    setErrorMessage(
                        `Không thể lấy dữ liệu: ${response.statusText}`
                    );
                }
            } catch (error) {
                setErrorMessage("Lỗi khi gọi API: " + error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSchedules();
    }, [class_code]);

    const handleSelectEvent = (event) => {
        setSelectedEvent(event);
    };

    const handleCloseModal = () => {
        setSelectedEvent(null);
    };

    const handleOverlayClick = (event) => {
        if (event.target.classList.contains("modal-overlay")) {
            handleCloseModal();
        }
    };

    return (
        <>
            <h1 className="text-center mb-4 fs-5">
                Lịch học của lớp {class_code}
            </h1>
            <div style={{ height: "80vh" }}>
                {loading ? (
                    <div
                        className="d-flex justify-content-center align-items-center"
                        style={{ height: "100%" }}
                    >
                        <div
                            className="spinner-border text-primary"
                            role="status"
                        >
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                ) : errorMessage ? (
                    <p style={{ color: "red", textAlign: "center" }}>
                        {errorMessage}
                    </p>
                ) : (
                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: "100%", margin: "20px" }}
                        eventPropGetter={eventStyleGetter}
                        views={["month", "week", "day"]}
                        defaultView="month"
                        onSelectEvent={handleSelectEvent}
                    />
                )}

                {selectedEvent && (
                    <div className="modal-overlay" onClick={handleOverlayClick}>
                        <div className="m-c">
                            <h2>Chi tiết lịch học</h2>
                            <p>
                                <strong>Thông tin lớp học: </strong>{" "}
                                {selectedEvent.title}
                            </p>
                            <p>
                                <strong>Bắt đầu:</strong>{" "}
                                {selectedEvent.start.toLocaleString()}
                            </p>
                            <p>
                                <strong>Kết thúc:</strong>{" "}
                                {selectedEvent.end.toLocaleString()}
                            </p>
                            <button
                                className="btn btn-danger"
                                onClick={handleCloseModal}
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default ClassSchedules;
