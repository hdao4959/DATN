import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../../../config/axios';
import { toast, ToastContainer } from 'react-toastify';

const EditSubject = () => {
    const queryClient = useQueryClient();
    const { id } = useParams();
    const navigate = useNavigate();
    const [major, setMajor] = useState([]);
    const [filteredNarrowMajor, setFilteredNarrowMajor] = useState([]);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const { data: subject, isLoading: loadingSubject } = useQuery({
        queryKey: ['subject', id],
        queryFn: async () => {
            const response = await api.get(`/admin/subjects/${id}`);
            return response?.data?.data;
        }
    });

    const { data: categories, isLoading: loadingCategories } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const response = await api.get('/admin/category');
            return response?.data;
        }
    });

    const mutation = useMutation({
        mutationFn: async (data) => {
            await api.put(`admin/subjects/${id}`, data);
        },
        onSuccess: () => {
            toast.success("Cập nhật môn học thành công!");
            queryClient.invalidateQueries(['subjects']);
            navigate("/admin/subjects");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra");
        },
    });

    useEffect(() => {
        if (subject && categories) {
            console.log(subject);

            reset(subject);

            const filteredMajors = categories?.filter(category => category.type === 'major');
            setMajor(filteredMajors);
            const selectedNarrowMajor = categories?.filter(category => category.cate_code === subject.narrow_major_code);
            setFilteredNarrowMajor(categories?.filter(category => category.parent_code === subject.major_code));
        }
    }, [subject, reset, categories]);

    const onSubmitForm = (data) => {
        const formData = new FormData();
        for (const key in data) {
            formData.append(key, data[key]);
        }
        mutation.mutate(formData);
    };

    const handleMajorChange = (event) => {
        const selectedValue = event?.target.value;
        console.log(selectedValue);

        const updatedNarrowMajor = categories?.filter(narrow => narrow.parrent_code === selectedValue);
        console.log(updatedNarrowMajor);

        setFilteredNarrowMajor(updatedNarrowMajor);
    };

    if (loadingSubject || loadingCategories) return <div>Loading...</div>;

    return (
        <div>
            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">
                            <div className="card-title text-center">Quản lý Môn Học</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mb-6 mt-2">
                <Link to="/admin/subjects">
                    <button className="btn btn-primary">
                        <i className='fas fa-list'> Danh sách môn học</i>
                    </button>
                </Link>
            </div>
            <form onSubmit={handleSubmit(onSubmitForm)}>
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <div className="card-title">Chỉnh Sửa Môn Học</div>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Mã Môn:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                {...register('subject_code', { required: 'Mã môn không được để trống.' })}
                                            />
                                            {errors.subject_code && <span className="text-danger">{errors.subject_code.message}</span>}
                                        </div>

                                        <div className="form-group">
                                            <label>Tên Môn Học:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                {...register('subject_name', { required: 'Tên môn không được để trống.' })}
                                            />
                                            {errors.subject_name && <span className="text-danger">{errors.subject_name.message}</span>}
                                        </div>

                                        <div className="form-group">
                                            <label>Số Tín Chỉ:</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                {...register('credit_number', { required: 'Số tín chỉ không được để trống.', min: { value: 1, message: 'Số tín chỉ phải lớn hơn 0.' } })}
                                            />
                                            {errors.credit_number && <span className="text-danger">{errors.credit_number.message}</span>}
                                        </div>

                                        <div className="form-group">
                                            <label>Mô Tả:</label>
                                            <textarea
                                                className="form-control"
                                                {...register('description')}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Học Phí Môn:</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                {...register('tuition', { required: 'Học phí không được để trống.' })}
                                            />
                                            {errors.tuition && <span className="text-danger">{errors.tuition.message}</span>}
                                        </div>

                                        <div className="form-group">
                                            <label>Học Phí Học Lại:</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                {...register('re_study_fee', { required: 'Học phí học lại không được để trống.' })}
                                            />
                                            {errors.re_study_fee && <span className="text-danger">{errors.re_study_fee.message}</span>}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Chuyên Ngành:</label>
                                            <select
                                                className="form-control"
                                                {...register('major_code', { required: true })}
                                                onChangeCapture={handleMajorChange}
                                            >
                                                <option value="">Chọn chuyên ngành</option>
                                                {major?.map(major => (
                                                    <option key={major.cate_code} value={major.cate_code}>
                                                        {major.cate_name}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.major_code && <span className="text-danger">{errors.major_code.message}</span>}
                                        </div>

                                        <div className="form-group">
                                            <label>Chuyên Ngành Hẹp:</label>
                                            <select
                                                className="form-control"
                                                {...register('narrow_major_code')}
                                            >
                                                <option value="">Chọn chuyên ngành hẹp</option>
                                                {filteredNarrowMajor?.map(narrow => (
                                                    <option key={narrow.cate_code} value={narrow.cate_code}>
                                                        {narrow.cate_name}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.narrow_major_code && <span className="text-danger">{errors.narrow_major_code.message}</span>}
                                        </div>

                                        <div className="form-group">
                                            <label>Kì Học:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                {...register('semester_code', { required: 'Kì học không được để trống.' })}
                                            />
                                            {errors.semester_code && <span className="text-danger">{errors.semester_code.message}</span>}
                                        </div>

                                        <div className="form-group">
                                            <label>Số Sinh Viên:</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                {...register('number_study', { required: 'Số sinh viên không được để trống.', min: { value: 0, message: 'Số sinh viên phải lớn hơn hoặc bằng 0.' } })}
                                            />
                                            {errors.number_study && <span className="text-danger">{errors.number_study.message}</span>}
                                        </div>

                                        <div className="form-group">
                                            <label>Ngày Thi:</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                {...register('exam_day', { required: 'Ngày thi không được để trống.' })}
                                            />
                                            {errors.exam_day && <span className="text-danger">{errors.exam_day.message}</span>}
                                        </div>

                                        <div className="form-group">
                                            <label>Hình Ảnh:</label>
                                            <input
                                                type="file"
                                                className="form-control"
                                                {...register('image', { required: 'Ảnh không được để trống.' })}
                                            />
                                            {errors.image && <span className="text-danger">{errors.image.message}</span>}
                                        </div>

                                        <div className="form-group">
                                            <label>Trạng Thái:</label>
                                            <select className="form-control" {...register('is_active')}>
                                                <option value="1">Công Khai</option>
                                                <option value="0">Ẩn</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-action d-flex justify-content-end gap-x-3">
                                    <button type="button" className="btn btn-danger" onClick={() => reset(subject)}>
                                        <i className='fas fa-undo'> Reset</i>
                                    </button>
                                    <button type="submit" className="btn btn-success">
                                        <i className='fas fa-upload'> Cập nhật</i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            <ToastContainer />
        </div>
    );
};

export default EditSubject;
