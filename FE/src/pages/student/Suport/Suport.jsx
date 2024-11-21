import React, { useState } from "react";

const FAQs = () => {
    const [selectedQuestion, setSelectedQuestion] = useState(null);

    const categories = [
        "DVSV",
        "Khảo thí",
        "Đào tạo",
        "Hành chính",
        "CTSV",
        "QHDN",
        "IT",
        "SV mới nhập học",
    ];

    const faqs = [
        {
            question: "Có thể nào tự hủy đơn để hoàn thành một dịch vụ khác được không?",
            answer: [
                "- Nếu đơn chưa Close thì SV có thể tự hủy đơn.",
                "- Nếu đơn đã Closed SV cần báo cán bộ DVSV để xử lý hủy đơn.",
            ],
        },
        {
            question: "Sinh viên muốn xin chuyển ngành?",
            answer: [
                "- Sinh viên cần nộp đơn xin chuyển ngành tại phòng đào tạo.",
                "- Thời hạn xử lý trong vòng 1 tuần kể từ ngày nộp.",
            ],
        },
        {
            question: "Sinh viên có nguyện vọng thôi học cần làm gì?",
            answer: ["- Sinh viên cần viết đơn xin thôi học và gửi phòng đào tạo."],
        },
        {
            question: "Thủ tục bảo lưu",
            answer: [
                "- Sinh viên cần điền vào mẫu đơn bảo lưu tại phòng hành chính.",
                "- Cần bổ sung giấy xác nhận lý do bảo lưu.",
            ],
        },
    ];

    const handleQuestionClick = (index) => {
        setSelectedQuestion(index === selectedQuestion ? null : index);
    };

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-md-3">
                    <h5 className="fw-bold">Danh Mục</h5>
                    <ul className="list-group">
                        {categories.map((category, index) => (
                            <li
                                key={index}
                                className="list-group-item list-group-item-action"
                                style={{
                                    cursor: "pointer",
                                    backgroundColor: index === 0 ? "#007bff" : "",
                                    color: index === 0 ? "#fff" : "",
                                }}
                            >
                                {category}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="col-md-9">
                    <h5 className="fw-bold">Câu hỏi thường gặp</h5>
                    <div className="list-group">
                        {faqs.map((faq, index) => (
                            <div key={index} className="mb-2">
                                <button
                                    className="list-group-item list-group-item-action"
                                    onClick={() => handleQuestionClick(index)}
                                >
                                    {faq.question}
                                </button>
                                {selectedQuestion === index && (
                                    <div className="mt-2 ms-3">
                                        {faq.answer.map((line, i) => (
                                            <p key={i} className="mb-1">
                                                {line}
                                            </p>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FAQs;
