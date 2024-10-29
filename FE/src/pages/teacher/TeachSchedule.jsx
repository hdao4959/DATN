import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "/src/css/modalCalender.css";

import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const events = [
    {
        title: "Hank Đỗ Sầu - 12:00 sáng",
        start: new Date(2024, 9, 4, 0, 0),
        end: new Date(2024, 9, 4, 1, 0),
        color: "#88bde6",
    },
    {
        title: "PHP - 1:30 sáng",
        start: new Date(2024, 9, 4, 1, 30),
        end: new Date(2024, 9, 4, 3, 0),
        color: "#ff9f89",
    },
];

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

const MyCalendar = () => {
    const [selectedEvent, setSelectedEvent] = useState(null);

    const handleSelectEvent = (event) => {
        setSelectedEvent(event);
    };

    const handleCloseModal = () => {
        setSelectedEvent(null);
    };

    return (
        <div style={{ height: "80vh" }}>
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

            {selectedEvent && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Chi tiết sự kiện</h2>
                        <p>
                            <strong>Tiêu đề:</strong> {selectedEvent.title}
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
    );
};

export default MyCalendar;
