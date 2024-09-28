import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, message, InputNumber, Radio, Spin } from 'antd';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const EditSubject = () => {
    const [form] = Form.useForm();
    const { id } = useParams();
    const [subject, setSubject] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubject = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/admin/subjects/${id}`);
                const data = response?.data?.data;
                console.log(data);
                
                if (data) {
                    setSubject(data);
                    form.setFieldsValue(data);
                }
            } catch (error) {
                message.error('Có lỗi xảy ra khi tải dữ liệu môn học!');
            } finally {
                setLoading(false);
            }
        };

        fetchSubject();
    }, [form, id]);

    const handleSubmit = async (values) => {
        try {
            await axios.put(`http://localhost:8000/api/admin/subjects/${subject.id}`, values);
            message.success('Cập nhật môn học thành công!');
        } catch (error) {
            message.error('Có lỗi xảy ra, vui lòng thử lại!');
        }
    };

    if (loading) {
        return <Spin tip="Loading..." />;
    }

    if (!subject) {
        return <div>Không tìm thấy môn học.</div>;
    }

    return (
        <div>
            <h2>Chỉnh sửa Môn học: {subject.subjectName}</h2>
            <Form layout='vertical' form={form} onFinish={handleSubmit}>
                <div className="row">
                    <div className="col-md-6 col-lg-6">
                        <Form.Item
                            label="Tên môn học"
                            name="subjectName"
                            rules={[{ required: true, message: 'Vui lòng nhập tên môn học!' }]}
                        >
                            <Input placeholder="Nhập tên môn học" />
                        </Form.Item>

                        <Form.Item
                            label="Mã môn"
                            name="subjectCode"
                            rules={[{ required: true, message: 'Vui lòng nhập mã môn!' }]}
                        >
                            <Input placeholder="Nhập mã môn học" />
                        </Form.Item>

                        <Form.Item
                            label="Số tín chỉ"
                            name="creditNumber"
                            rules={[{ required: true, message: 'Vui lòng nhập số tín chỉ!' }]}
                        >
                            <InputNumber min={1} placeholder="Nhập số tín chỉ" style={{ width: '100%' }} />
                        </Form.Item>

                        <Form.Item
                            label="Học phí"
                            name="tuition"
                            rules={[{ required: true, message: 'Vui lòng nhập học phí!' }]}
                        >
                            <InputNumber
                                min={0}
                                placeholder="Nhập học phí"
                                style={{ width: '100%' }}
                                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                                parser={value => value.replace(/\./g, '')}
                                addonAfter="VND"
                            />
                        </Form.Item>

                        <Form.Item
                            label="Phí học lại"
                            name="reStudyFee"
                            rules={[{ required: true, message: 'Vui lòng nhập phí học lại!' }]}
                        >
                            <InputNumber
                                min={0}
                                placeholder="Nhập phí học lại"
                                style={{ width: '100%' }}
                                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                                parser={value => value.replace(/\./g, '')}
                                addonAfter="VND"
                            />
                        </Form.Item>

                        <Form.Item
                            label="Giới thiệu môn học"
                            name="description"
                        >
                            <Input.TextArea rows={5} placeholder="Nhập giới thiệu môn học" />
                        </Form.Item>
                    </div>

                    <div className="col-md-6 col-lg-6">
                        <Form.Item
                            label="Số buổi học"
                            name="examDay"
                            rules={[{ required: true, message: 'Vui lòng nhập số buổi học' }]}
                        >
                            <InputNumber min={1} style={{ width: '100%' }} placeholder="Nhập số buổi học" />
                        </Form.Item>
                        <Form.Item
                            label="Học kì"
                            name="semestersCode"
                            rules={[{ required: true, message: 'Vui lòng chọn học kì!' }]}
                        >
                            <Select placeholder="Chọn học kì">
                                {/* Thêm các tùy chọn học kì tại đây */}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Chuyên ngành"
                            name="majorCode"
                            rules={[{ required: true, message: 'Vui lòng chọn chuyên ngành!' }]}
                        >
                            <Select placeholder="Chọn chuyên ngành">
                                {/* Thêm các tùy chọn chuyên ngành tại đây */}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Chuyên ngành hẹp"
                            name="narrowMajorCode"
                        >
                            <Select placeholder="Chọn chuyên ngành hẹp">
                                {/* Thêm các tùy chọn chuyên ngành hẹp tại đây */}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Trạng thái hoạt động"
                            name="isActive"
                            rules={[{ required: true, message: 'Vui lòng chọn trạng thái hoạt động!' }]}
                        >
                            <Radio.Group>
                                <Radio value={1}>Khả dụng</Radio>
                                <Radio value={0}>Tạm ẩn</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </div>
                </div>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Submit <i className='fas fa-plus' style={{ color: 'white' }}></i>
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default EditSubject;
