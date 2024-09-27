import { Button, Popconfirm, Table } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const MAJOR_DATA = [
    {
        id: 1,
        code: "WE",
        name: "Lập trình Website",
        status: 0,
        type: "Kiểu 1",
        parentMajor: "CNTT",
    },
    {
        id: 2,
        code: "MAR",
        name: "Marketing",
        status: 1,
        type: "Kiểu 2",
        parentMajor: "CNTT",
    },
];

const MajorList = () => {
    const columns = [
        {
            title: "ID",
            key: "id",
            dataIndex: "id",
        },
        {
            title: "Mã",
            key: "code",
            dataIndex: "code",
        },
        {
            title: "Tên",
            key: "name",
            dataIndex: "name",
        },
        {
            title: "Chế độ hiển thị",
            key: "status",
            dataIndex: "status",
            render: (status) => {
                return status ? "Công khai" : "Ẩn";
            },
        },
        {
            title: "Kiểu",
            key: "type",
            dataIndex: "type",
        },
        {
            title: "Danh mục cha",
            key: "parentMajor",
            dataIndex: "parentMajor",
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => {
                return (
                    <div className="flex items-center gap-x-4">
                        <Link to={`/admin/major/${record.id}/edit`}>
                            <EditOutlined className="text-xl" />
                        </Link>

                        <Popconfirm
                            title="Xoá chuyên ngành"
                            description="Xác nhận xoá chuyên ngành?"
                        >
                            <DeleteOutlined className="text-xl" />
                        </Popconfirm>
                    </div>
                );
            },
        },
    ];

    return (
        <>
            <div className="mb-3 mt-2 flex items-center justify-between">
                <h1 className="text-black text-3xl font-semibold">
                    Major Management
                </h1>

                <Link to="/admin/major/add">
                    <Button type="primary">Thêm chuyên ngành</Button>
                </Link>
            </div>

            <Table columns={columns} dataSource={MAJOR_DATA} rowKey="id" />
        </>
    );
};

export default MajorList;
