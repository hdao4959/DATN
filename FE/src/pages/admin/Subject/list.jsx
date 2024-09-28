import React, { useEffect, useState } from 'react';
import { Table, Button, message } from 'antd';

import axios from 'axios';
import { Link } from 'react-router-dom';
import Input from 'antd/es/input/Input';

const SubjectsList = () => {

  const [subjects, setSubjects] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/admin/subjects'); 
        setSubjects(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu môn học:', error);
        message.error('Có lỗi xảy ra khi lấy danh sách môn học!');
      }
    };

    fetchSubjects();
  }, []);

  const handleEdit = (subjectId) => {
    console.log('Sửa môn học theo id:', subjectId);
  };

  const handleDelete = async (subjectId) => {
    try {
      await axios.delete(`http://localhost:8000/api/admin/subjects/${subjectId}`);
      
      const updatedSubjects = subjects.filter(subject => subject.id !== subjectId);
      setSubjects(updatedSubjects);
      
      message.success('Xóa môn học thành công!');
    } catch (error) {
      console.error('Lỗi khi xóa môn học:', error);
      message.error('Có lỗi xảy ra khi xóa môn học!');
    }
  };

  const filteredSubjects = subjects.filter(subject =>
    subject.subjectName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
    subject.subjectCode.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Mã Môn',
      dataIndex: 'subjectCode',
    },
    {
      title: 'Tên Môn Học',
      dataIndex: 'subjectName',
    },
    {
      title: 'Số Tín Chỉ',
      dataIndex: 'creditNumber',
    },
    {
      title: 'Mô Tả',
      dataIndex: 'description',
    },
    {
      title: 'Học phí môn',
      dataIndex: 'tuition',
      render: (text) => <span>{text.toLocaleString()} VNĐ</span>,
    },
    {
      title: 'Học phí học lại',
      dataIndex: 'reStudyFee',

      examDay: 17, render: (text) => <span>{text.toLocaleString('Vi-VN')} VNĐ</span>,
    },
    {
      title: 'Số buổi học', 
      dataIndex: 'examDay',
    },
    {
      title: 'Chuyên ngành',
      dataIndex: 'majorCode',
    },
    {
      title: 'Kì học',
      dataIndex: 'semestersCode',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      render: (isActive) => (isActive === 1 ? <i className="fas fa-check-circle" style={{ color: 'green' }}></i> : <i className="fas fa-ban" style={{ color: 'red' }}></i>)
    },
    {
      title: 'Action',
      render: (text, record) => (
        <span style={{ whiteSpace: 'nowrap' }}>
          <Button onClick={() => handleEdit(record.id)} color="primary" variant='solid' style={{ marginRight: 8 }}>
            <Link to={`/admin/subjects/${record.id}/edit`}>Edit</Link>
          </Button>
          <Button onClick={() => handleDelete(record.id)} color="danger" variant='solid'>
            Delete
          </Button>
        </span>
      ),
    },
  ];

  return (
    <div>
      <h1>
        <i className='fas fa-th-list'> Danh sách môn học</i>
      </h1>
      <Input.Search
        placeholder="Nhập tên hoặc mã môn để tìm kiếm"
        enterButton="Tìm kiếm"
        size="large"
        allowClear
        onSearch={(value) => setSearchKeyword(value)}
        style={{ marginBottom: 20, width: '50%', float: 'right' }}
      />
      <Table
        dataSource={filteredSubjects}
        columns={columns}
        rowKey="id"
        pagination={{
          defaultPageSize: 5,
          pageSizeOptions: [5, 10, 20, 50, 100],
          showSizeChanger: true,
        }}
      />
    </div>
  );
};

export default SubjectsList;