import React, { useState, useEffect } from 'react';
import 'datatables.net-dt/css/dataTables.dataTables.css';
import $ from 'jquery';
import 'datatables.net';
import api from '../../../config/axios';
import { toast } from 'react-toastify';

const ShowGrades = () => {
    const [userCode, setUserCode] = useState('');
    const [classCode, setClassCode] = useState('');
    const [subjectCode, setSubjectCode] = useState('');
    const [grades, setGrades] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editRowId, setEditRowId] = useState(null);

    const fetchGrades = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/admin/grades?user_code=${userCode}&class_code=${classCode}&subject_code=${subjectCode}`);
            const data = response?.data;
            setGrades(data);
        } catch (error) {
            console.error('Error fetching grades:', error);
        }
        setLoading(false);
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        await fetchGrades();

        setLoading(false);
    };

    const handleEditClick = (grade) => {
        if (editRowId !== null && editRowId !== grade.id) {
            const confirmDiscard = window.confirm('Bạn có chắc muốn hủy thay đổi? Các thay đổi sẽ không được lưu.');
            if (!confirmDiscard) {
                return;
            }
        }

        setEditRowId(grade.id);
    };

    const handleSaveClick = async (id, newScore) => {
        setLoading(true);
        try {
            const response = await api.patch(`/admin/grades/${id}`, {
                score: newScore
            });
            toast.success(`Cập nhật điểm cho sinh viên thành công`);

            await fetchGrades();
            setEditRowId(null);
        } catch (error) {
            console.error('Error updating grade:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        // console.log(grades, userCode, classCode, subjectCode);

        if (grades) {
            $('#gradesTable').DataTable({
                pageLength: 5,
                lengthMenu: [5, 10, 20, 50, 100],
                language: {
                    paginate: {
                        previous: 'Trước',
                        next: 'Tiếp theo'
                    },
                    lengthMenu: 'Hiển thị _MENU_ mục mỗi trang',
                    info: 'Hiển thị từ _START_ đến _END_ trong _TOTAL_ mục',
                    search: 'Tìm kiếm:',
                    searchPlaceholder: 'Tìm kiếm...'
                },
                data: grades,
                columns: [
                    { title: "STT", data: null, render: (data, type, row, meta) => meta.row + 1 },
                    { title: 'Mã sinh viên', data: 'user_code' },
                    { title: 'Mã Lớp', data: 'class_code' },
                    { title: 'Mã môn', data: 'subject_code' },
                    {
                        title: 'Điểm tổng',
                        data: 'score',
                        render: (data, type, row) => {
                            return editRowId === row.id
                                ? `<input type="number" value="${row.score}" min="0" max="10" step="0.01" class="form-control" id="editable-score-${row.id}" style="border: 2px solid red;" oninput="this.value = Math.max(0, Math.min(10, Math.round(this.value * 100) / 100))" />`
                                : data;
                        }
                    },
                    {
                        title: 'Ngày',
                        data: 'date',
                        render: function (data, type, row) {
                            if (!data) return '';
                            const date = new Date(data);
                            return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
                        }
                    },
                    {
                        data: null,
                        render: function (data, type, row) {
                            return editRowId === row.id ? (
                                `<button class="save-click-button btn btn-success" data-id="${row.id}">
                                    <i className='fas fa-check'></i> Lưu
                                </button>`
                            ) : (
                                `<button class="edit-click-button btn btn-warning" id="alert_demo_7" data-id="${row.id}">
                                    <i className='fas fa-cogs'></i> Sửa
                                </button>`
                            );
                        }
                    }
                ],
                destroy: true,
            });
            $('#gradesTable tbody').off('click', '.edit-click-button');
            $('#gradesTable tbody').on('click', '.edit-click-button', function () {
                const id = $(this).data('id');
                const grade = grades.find(g => g.id === id);
                handleEditClick(grade);
            });
            $('#gradesTable tbody').off('click', '.save-click-button');
            $('#gradesTable tbody').on('click', '.save-click-button', function () {
                const id = $(this).data('id');
                const newScore = $(`#editable-score-${id}`).val();
                handleSaveClick(id, newScore);
            });
        }
    }, [grades, editRowId]);

    return (
        <div>
            <div className="card" style={{ minHeight: '800px' }}>
                <div className="card-header">
                    <h4 className="card-title">Grades Management</h4>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <div className="dataTables_wrapper container-fluid dt-bootstrap4">
                            <div className="row">
                                <div>
                                    <form onSubmit={handleSearch} className="form-inline d-flex justify-content-center align-items-center gap-3 mb-4">
                                        <div className="form-group mb-2">
                                            <label htmlFor="">Mã sinh viên:</label>
                                            <div className="position-relative">
                                                <input
                                                    type="text"
                                                    value={userCode}
                                                    onChange={(e) => setUserCode(e.target.value)}
                                                    className="form-control form-control-sm"
                                                    placeholder="Nhập mã sinh viên"
                                                    style={{ width: '200px' }}
                                                />
                                                {userCode && (
                                                    <button
                                                        type="button"
                                                        className="btn btn-link position-absolute top-0 end-0 me-2"
                                                        onClick={() => setUserCode('')}
                                                        aria-label="Clear"
                                                    >
                                                        <i className="fas fa-times"></i>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <div className="form-group mb-2">
                                            <label htmlFor="">Mã lớp</label>
                                            <div className="position-relative">
                                                <input
                                                    type="text"
                                                    value={classCode}
                                                    onChange={(e) => setClassCode(e.target.value)}
                                                    className="form-control form-control-sm"
                                                    placeholder="Nhập mã lớp"
                                                    style={{ width: '200px' }}
                                                />
                                                {classCode && (
                                                    <button
                                                        type="button"
                                                        className="btn btn-link position-absolute top-0 end-0 me-2"
                                                        onClick={() => setClassCode('')}
                                                        aria-label="Clear"
                                                    >
                                                        <i className="fas fa-times"></i>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <div className="form-group mb-2">
                                            <label htmlFor="">Mã môn</label>
                                            <div className="position-relative">
                                                <input
                                                    type="text"
                                                    value={subjectCode}
                                                    onChange={(e) => setSubjectCode(e.target.value)}
                                                    className="form-control form-control-sm"
                                                    placeholder="Nhập mã môn học"
                                                    style={{ width: '200px' }}
                                                />
                                                {subjectCode && (
                                                    <button
                                                        type="button"
                                                        className="btn btn-link position-absolute top-0 end-0 me-2"
                                                        onClick={() => setSubjectCode('')}
                                                        aria-label="Clear"
                                                    >
                                                        <i className="fas fa-times"></i>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <button type="submit" className="btn btn-primary btn-sm mb-2 d-flex align-items-center" disabled={loading}>
                                            {loading ? (
                                                <>
                                                    <i className="fas fa-circle-notch fa-spin me-2"></i> Đang tìm
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fas fa-search me-2"></i> Tìm kiếm
                                                </>
                                            )}
                                        </button>
                                    </form>

                                </div>
                                <div>
                                    {grades ? (
                                        <table id="gradesTable" className="display table table-striped table-hover dataTable" role="grid"></table>
                                    ) : (
                                        !loading && <p className='text-center'>
                                            <i className='fas fa-ban' style={{ color: 'red' }}></i>
                                            Không tìm thấy kết quả.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShowGrades;
