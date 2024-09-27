import React, { useEffect, useState } from 'react';
import { Table, Button, message } from 'antd';

import axios from 'axios';
import { Link } from 'react-router-dom';

const mockData = [
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
  },
  {
    id: 2,
    subjectCode: 'SUB002',
    subjectName: 'PHP',
    creditNumber: 3,
    reStudyFee: 600000,
    examDay: 17,
    isActive: 1,
    description: 'Môn học về lập trình web với PHP.',
    semestersCode: 7,
    majorCode: 'IT',
    tuition: 1500000,
  },
  {
    id: 3,
    subjectCode: 'SUB003',
    subjectName: 'ReactJS',
    creditNumber: 3,
    reStudyFee: 600000,
    examDay: 17,
    isActive: 1,
    description: 'Môn học về phát triển giao diện người dùng với ReactJS.',
    semestersCode: 7,
    majorCode: 'IT',
    tuition: 1500000,
  },
  {
    id: 4,
    subjectCode: 'SUB004',
    subjectName: 'JavaScript',
    creditNumber: 3,
    reStudyFee: 600000,
    examDay: 17,
    isActive: 0,
    description: 'Môn học về ngôn ngữ lập trình JavaScript.',
    semestersCode: 7,
    majorCode: 'IT',
    tuition: 1500000,
  },
  {
    id: 5,
    subjectCode: 'SUB005',
    subjectName: 'C++',
    creditNumber: 3,
    reStudyFee: 600000,
    examDay: 17,
    isActive: 1,
    description: 'Môn học về ngôn ngữ lập trình C++.',
    semestersCode: 7,
    majorCode: 'IT',
    tuition: 1500000,
  },
  {
    id: 6,
    subjectCode: 'SUB006',
    subjectName: 'C#',
    creditNumber: 3,
    reStudyFee: 600000,
    examDay: 17,
    isActive: 1,
    description: 'Môn học về ngôn ngữ lập trình C#.',
    semestersCode: 7,
    majorCode: 'IT',
    tuition: 1500000,
  },
];

const SubjectsList = () => {
  const [subjects, setSubjects] = useState([]);

  const fetchSubjects = async () => {
    setSubjects(mockData);
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleEdit = (subjectId) => {
    console.log('Sửa môn học theo id:', subjectId);
  };

  const handleDelete = async (subjectId) => {
    const updatedSubjects = subjects.filter(subject => subject.id !== subjectId);
    setSubjects(updatedSubjects);
    message.success('Xóa môn học thành công!');
  };

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
            <Link to={`/admin/subjects/edit`}>Edit</Link>
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
      <h2>Danh sách môn học</h2>
      <Table
        dataSource={subjects}
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
