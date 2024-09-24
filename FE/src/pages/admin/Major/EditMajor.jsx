import { Button, Form, Input, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import { Link } from "react-router-dom";

const EditMajor = () => {
    const onSubmit = (values) => {
        console.log("Call API...", values);
    };

    return (
        <>
            <div className="mb-3 mt-2 flex items-center justify-between">
                <h1 className="text-black text-3xl font-semibold">
                    Update Major
                </h1>

                <Link to="/admin/major">
                    <Button type="primary">DS chuyên ngành</Button>
                </Link>
            </div>

            <Form
                layout="vertical"
                onFinish={onSubmit}
                initialValues={{ status: 1 }}
            >
                <Form.Item
                    name="code"
                    label="Mã chuyên ngành"
                    rules={[
                        {
                            required: true,
                            message: "Vui lòng nhập mã chuyên ngành",
                        },
                    ]}
                >
                    <Input placeholder="Nhập mã chuyên ngành" />
                </Form.Item>

                <Form.Item
                    name="name"
                    label="Tên chuyên ngành"
                    rules={[
                        {
                            required: true,
                            message: "Vui lòng nhập tên chuyên ngành",
                        },
                    ]}
                >
                    <Input placeholder="Nhập tên chuyên ngành" />
                </Form.Item>

                <Form.Item
                    name="status"
                    label="Chế độ hiển thị"
                    rules={[
                        {
                            required: true,
                            message: "Vui lòng chọn chế độ hiển thị",
                        },
                    ]}
                >
                    <Select
                        options={[
                            { label: "Công khai", value: 1 },
                            { label: "Ẩn", value: 0 },
                        ]}
                    />
                </Form.Item>

                <Form.Item
                    name="type"
                    label="Kiểu"
                    rules={[
                        {
                            required: true,
                            message: "Vui lòng chọn kiểu",
                        },
                    ]}
                >
                    <Select
                        options={[
                            { label: "Chọn kiểu", value: "" },
                            { label: "Kiểu 1", value: 1 },
                            { label: "Kiểu 2", value: 2 },
                        ]}
                        defaultValue=""
                    />
                </Form.Item>

                <Form.Item
                    name="parentMajor"
                    label="Danh mục cha"
                    rules={[
                        {
                            required: true,
                            message: "Vui lòng chọn danh mục cha",
                        },
                    ]}
                >
                    <Select
                        options={[
                            { label: "Chọn danh mục cha", value: "" },
                            { label: "CNTT", value: 1 },
                            { label: "Thiết kế đồ hoạ", value: 2 },
                        ]}
                        defaultValue=""
                    />
                </Form.Item>

                <Form.Item name="description" label="Mô tả">
                    <TextArea placeholder="Nhập mô tả" />
                </Form.Item>

                <Button type="primary" htmlType="submit">
                    Cập nhật chuyên ngành
                </Button>
            </Form>
        </>
    );
};

export default EditMajor;
