import React, { useState } from 'react';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import AddSubject from './AddSubject';
import EditSubject from './EditSubject';

const ListSubject = () => {
  const queryClient = useQueryClient();

  const { data: subjects = [], error, isLoading } = useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      // const response = await axios.get('http://localhost:8000/api/admin/subjects');
      // return response.data;
      return [
        {
          id: 1,
          subjectCode: 'CS101',
          subjectName: 'Giới thiệu lập trình máy tính',
          creditNumber: 3,
          description: 'Môn học này cung cấp kiến thức cơ bản về lập trình máy tính và ngôn ngữ lập trình.',
          tuition: 5000000,
          reStudyFee: 2500000,
          examDay: '2024-12-15',
          majorCode: 'CS',
          semestersCode: '2024-1',
          isActive: 1
        },
        {
          id: 2,
          subjectCode: 'CS102',
          subjectName: 'Cấu trúc dữ liệu và giải thuật',
          creditNumber: 3,
          description: 'Môn học này nghiên cứu về cấu trúc dữ liệu và các giải thuật cơ bản.',
          tuition: 5000000,
          reStudyFee: 2500000,
          examDay: '2024-12-20',
          majorCode: 'CS',
          semestersCode: '2024-1',
          isActive: 1
        },
        {
          id: 3,
          subjectCode: 'CS103',
          subjectName: 'Lập trình web',
          creditNumber: 3,
          description: 'Môn học này cung cấp kiến thức về lập trình web với HTML, CSS và JavaScript.',
          tuition: 5000000,
          reStudyFee: 2500000,
          examDay: '2024-12-25',
          majorCode: 'CS',
          semestersCode: '2024-1',
          isActive: 1
        },
        {
          id: 4,
          subjectCode: 'CS104',
          subjectName: 'Cơ sở dữ liệu',
          creditNumber: 3,
          description: 'Môn học này giới thiệu về cơ sở dữ liệu và SQL.',
          tuition: 5000000,
          reStudyFee: 2500000,
          examDay: '2024-12-30',
          majorCode: 'CS',
          semestersCode: '2024-1',
          isActive: 2
        },
        {
          id: 5,
          subjectCode: 'CS105',
          subjectName: 'Hệ điều hành',
          creditNumber: 3,
          description: 'Môn học này nghiên cứu về các hệ điều hành và cách chúng hoạt động.',
          tuition: 5000000,
          reStudyFee: 2500000,
          examDay: '2025-01-05',
          majorCode: 'CS',
          semestersCode: '2024-1',
          isActive: 1
        },
        {
          id: 6,
          subjectCode: 'CS106',
          subjectName: 'Mạng máy tính',
          creditNumber: 3,
          description: 'Môn học này cung cấp kiến thức cơ bản về mạng máy tính.',
          tuition: 5000000,
          reStudyFee: 2500000,
          examDay: '2025-01-10',
          majorCode: 'CS',
          semestersCode: '2024-1',
          isActive: 2
        }
      ];
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (subjectId) => {
      await axios.delete(`http://localhost:8000/api/admin/subjects/${subjectId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['subjects']);
      alert('Xóa môn học thành công!');
    },
    onError: (error) => {
      console.error('Lỗi khi xóa môn học:', error);
      alert('Có lỗi xảy ra khi xóa môn học!');
    }
  });

  const handleDelete = (subjectId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa môn học này?')) {
      deleteMutation.mutate(subjectId);
    }
  };

  // if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Có lỗi xảy ra khi lấy danh sách môn học!</div>;

  const [searchKeyword, setSearchKeyword] = useState('');
  const filteredSubjects = subjects.filter(subject =>
    subject.subjectName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
    subject.subjectCode.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const [currentPage, setCurrentPage] = useState(1);
  const subjectsPerPage = 5;
  const totalPages = Math.ceil(filteredSubjects.length / subjectsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  // Lấy các môn học cho trang hiện tại
  const currentSubjects = filteredSubjects.slice(
    (currentPage - 1) * subjectsPerPage,
    currentPage * subjectsPerPage
  );

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [currentSubject, setCurrentSubject] = useState(null);

  const handleShow = (subject) => {
    setCurrentSubject(subject);
    setShowModal(true);
  };

  const handleClose = () => {
    setCurrentSubject(null);
    setShowModal(false);
    reset();
  };

  return (
    <div style={{ width: '100%' }}>
      <div>
        <h1 style={{ fontSize: '2rem' }}>
          <i className='fas fa-th-list'></i> Danh sách môn học
        </h1>
      </div>
      <button className="btn btn-primary" onClick={() => handleShow(null)}>Thêm Môn Học</button>
      <div className="input-group mb-3" style={{ width: '50%', float: 'right' }}>
        <input
          type="text"
          className="form-control"
          placeholder="Nhập tên hoặc mã môn để tìm kiếm"
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
      </div>

      <table className="table table-striped table-bordered table-hover" style={{ maxWidth: '100%' }}>
        <thead>
          <tr>
            <th>STT</th>
            <th>Mã Môn</th>
            <th>Tên Môn Học</th>
            <th>Số Tín Chỉ</th>
            <th>Mô Tả</th>
            <th>Học phí môn</th>
            <th>Học phí học lại</th>
            <th>Số buổi học</th>
            <th>Chuyên ngành</th>
            <th>Kì học</th>
            <th>Trạng thái</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentSubjects.map((subject, index) => (
            <tr key={subject.id}>
              <td>{(currentPage - 1) * subjectsPerPage + index + 1}</td>
              <td>{subject.subjectCode}</td>
              <td>{subject.subjectName}</td>
              <td>{subject.creditNumber}</td>
              <td>{subject.description}</td>
              <td>{subject.tuition.toLocaleString()} VNĐ</td>
              <td>{subject.reStudyFee.toLocaleString('vi-VN')} VNĐ</td>
              <td>{subject.examDay}</td>
              <td>{subject.majorCode}</td>
              <td>{subject.semestersCode}</td>
              <td>
                {subject.isActive === 1 ? (
                  <i className="fas fa-check-circle" style={{ color: 'green' }}></i>
                ) : (
                  <i className="fas fa-ban" style={{ color: 'red' }}></i>
                )}
              </td>
              <td className='text-nowrap'>
                <button onClick={() => handleShow(subject)} className="btn btn-primary btn-sm mr-2">Edit</button>
                <button onClick={() => handleDelete(subject.id)} className="btn btn-danger btn-sm">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Phân trang */}
      <nav>
        <ul className="pagination d-flex justify-content-end">
          <li className="page-item">
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &lt;
            </button>
          </li>
          {Array.from({ length: totalPages }, (_, index) => (
            <li key={index + 1} className={`page-item ${index + 1 === currentPage ? 'active' : ''}`}>
              <button className="page-link" onClick={() => handlePageChange(index + 1)}>
                {index + 1}
              </button>
            </li>
          ))}
          <li className="page-item">
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              &gt;
            </button>
          </li>
        </ul>
      </nav>

      {/* Modal */}
      {showModal && (
        <>
          <div className="modal-backdrop fade show" style={{ zIndex: 1040 }} />
          <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                {/* Modal thêm môn học */}
                {!currentSubject ?
                  <AddSubject handleClose={handleClose} />
                  :
                  <EditSubject subject={currentSubject} handleClose={handleClose} />
                }
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ListSubject;
