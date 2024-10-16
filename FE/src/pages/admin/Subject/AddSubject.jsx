
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../../config/axios';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import CSS của toast

const AddSubject = ({ }) => {
  const query_client = useQueryClient();
  const { register, handleSubmit, formState: { errors }, reset, getValues } = useForm();

  const [major, set_major] = useState([]);
  const [narrow_major, set_narrow_major] = useState([]);
  const [selected_major, set_selected_major] = useState();
  const [narrow_major_code, set_narrow_major_code] = useState();
  const [filtered_narrow_major, set_filtered_narrow_major] = useState([]);

  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get('/admin/category');
      return response?.data;
    }
  });

  useEffect(() => {
    if (categories) {
      try {
        const filtered_majors = categories.filter(category => category.type === 'major');
        set_major(filtered_majors);

        const filtered_narrow_majors = categories.filter(category => category.type === 'narrow_major');
        set_narrow_major(filtered_narrow_majors);
      } catch (error) {
        console.error('Error fetching majors:', error);
        toast.error("Lỗi khi tải danh sách chuyên ngành");
      }
    }
  }, [categories]);

  const { mutate } = useMutation({
    mutationFn: async (data) => {
      await api.post("/admin/subjects", data);
    },
    onSuccess: () => {
      query_client.invalidateQueries(['LIST_SUBJECT']);
      toast.success("Thêm môn học thành công!");
      reset();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra");
    },
  });

  const handle_major_change = (event) => {
    const selected_value = event.target.value;
    set_selected_major(selected_value);

    const updated_narrow_major = narrow_major.filter(narrow => narrow.parrent_code === selected_value);
    set_filtered_narrow_major(updated_narrow_major);

    set_narrow_major_code('');

    reset({
      ...getValues(),
      narrow_major_code: "",
    });
  };

  const on_submit_form = (data) => {
    const request_data = {
      subject_code: data.subject_code,
      subject_name: data.subject_name,
      credit_number: data.credit_number,
      description: data.description,
      tuition: data.tuition,
      re_study_fee: data.re_study_fee,
      major_code: data.major_code,
      semester_code: data.semester_code,
      narrow_major_code: data.narrow_major_code,
      number_study: data.number_study,
      exam_day: data.exam_day,
      image: data.image[0].name,
      is_active: data.is_active,
      is_delete: 0,
    };
    mutate(request_data);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
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
      <form onSubmit={handleSubmit(on_submit_form)}>
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header">
                <div className="card-title">Thêm Môn Học</div>
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
                        value={selected_major}
                        onChangeCapture={handle_major_change}
                        {...register('major_code', { required: true })}
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
                        value={narrow_major_code}
                        onChangeCapture={(e) => set_narrow_major_code(e.target.value)}
                        {...register('narrow_major_code')}
                      >
                        <option value="">Chọn chuyên ngành hẹp</option>
                        {filtered_narrow_major?.map(narrow => (
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
                  <button type="button" className="btn btn-danger" onClick={() => reset()}>
                    <i className='fas fa-undo'> Reset</i>
                  </button>
                  <button type="submit" className="btn btn-success">
                    <i className='fas fa-plus'> Thêm</i>
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </form>
      <ToastContainer />
    </>
  );
};

export default AddSubject;

