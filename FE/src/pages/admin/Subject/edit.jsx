import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, message, InputNumber } from 'antd';
import Radio from 'antd/es/radio/radio';
// import { useParams } from 'react-router-dom';

const { Option } = Select;

const EditSubject = ({ match }) => {
    const [form] = Form.useForm();
    //   const { id } = useParams();

    const mockData =
    {
        id: 1,
        subjectCode: 'SUB001',
        subjectName: 'Java',
        creditNumber: 3,
        reStudyFee: 600000,
        examDay: 17,
        isActive: 1,
        description: 'Môn học về ngôn ngữ lập trình Java.',
        semestersCode: 7,
        majorCode: 'IT',
        tuition: 1500000,
    };

    const [subject, setSubject] = useState(null);
    //   useEffect(() => {
    //     const subjectId = match.params.id; 
    //     const foundSubject = mockData.find(item => item.id === subjectId);
    //     if (foundSubject) {
    //       setSubject(foundSubject);
    //       form.setFieldsValue(foundSubject); 
    //     }
    //   }, [form, match.params.id]);
    useEffect(() => {
        const foundSubject = mockData;
        if (foundSubject) {
            setSubject(foundSubject);
            form.setFieldsValue(foundSubject);
        }
    }, [form]);


    const handleSubmit = (values) => {try {
        // const response = await axios.put('/api/subjects', values)
        console.log('Đã cập nhật môn học:', values);
        message.success('Cập nhật môn học thành công!');
      } catch (error) {
        message.error('Có lỗi xảy ra, vui lòng thử lại!')
      }
    };

    if (!subject) {
        return <div>Loading...</div>;
    }
    return (
        <div >
            <h2>Chỉnh sửa Môn học: {subject.subjectName}</h2>
            <Form layout='vertical' form={form} onFinish={handleSubmit}
                initialValues={{}}>
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

                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Chuyên ngành"
                            name="majorCode"
                            rules={[{ required: true, message: 'Vui lòng chọn chuyên ngành!' }]}
                        >
                            <Select placeholder="Chọn chuyên ngành">

                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Chuyên ngành hẹp"
                            name="narrowMajorCode"
                        >
                            <Select placeholder="Chọn chuyên ngành hẹp">

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
