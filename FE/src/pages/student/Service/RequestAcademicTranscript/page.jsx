import { useMutation } from '@tanstack/react-query';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import api from '../../../../config/axios';
import { formatErrors } from '../../../../utils/formatErrors';

const TranscriptRequestForm = () => {
    // Trạng thái lưu hình thức nhận
    const [deliveryMethod, setDeliveryMethod] = useState('');

    const handleDeliveryMethodChange = (e) => {
        setDeliveryMethod(e.target.value);
    };

    // Sử dụng react-hook-form
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

    // Mutation API
    const { mutate } = useMutation({
        mutationFn: (data) => api.post("/student/services/register/dang-ky-cap-bang-diem", data),
        onSuccess: () => {
            toast.success("Yêu cầu cấp bảng điểm thành công");
            reset(); // Reset form sau khi thành công
        },
        onError: (error) => {
            const msg = formatErrors(error);
            toast.error(msg || "Có lỗi xảy ra");
        }
    });

    // Xử lý khi form submit
    const onSubmit = (data) => {
        mutate(data); // Truyền trực tiếp dữ liệu từ form
    };

    // Cập nhật giá trị địa chỉ khi thay đổi phương thức nhận
    useEffect(() => {
        if (deliveryMethod === 'pickup') {
            setValue("receive_address", "Bạn vui lòng đến phòng Dịch vụ sinh viên để nhận kết quả");
        } else {
            setValue("receive_address", ""); // Xóa địa chỉ khi chọn chuyển phát nhanh
        }
    }, [deliveryMethod, setValue]);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <strong>Yêu cầu cấp bảng điểm</strong>

            {/* Số lượng bảng điểm */}
            <div className="mb-3">
                <label htmlFor="numTranscript" className="form-label mt-4">Số lượng bảng điểm</label>
                <input
                    type="number"
                    className="form-control"
                    id="numTranscript"
                    {...register("number_board", {
                        required: "Hãy nhập số lượng bảng điểm",
                    })}
                    placeholder='Nhập số lượng bảng điểm'
                />
                {errors.number_board && (<span className='text-danger'>{errors.number_board.message}</span>)}
            </div>

            {/* Số điện thoại */}
            <div className="mb-3">
                <label htmlFor="phone" className="form-label">Số điện thoại</label>
                <input
                    type="number"
                    className="form-control"
                    id="phone"
                    {...register("number_phone", {
                        required: "Hãy nhập số điện thoại",
                    })}
                    placeholder='Nhập số điện thoại'
                />
                {errors.number_phone && (<span className='text-danger'>{errors.number_phone.message}</span>)}

            </div>

            {/* Hình thức nhận */}
            <div className="mb-3">
                <label className="form-label">Hình thức nhận</label>
                <div>
                    <input
                        type="radio"
                        id="express"
                        value="express"
                        {...register("receive_method")}
                        checked={deliveryMethod === 'express'}
                        onChange={handleDeliveryMethodChange}
                    />
                    <label htmlFor="express" className="ml-2"> Chuyển phát nhanh</label>
                </div>
                <div className="mt-4">
                    <input
                        type="radio"
                        id="pickup"
                        value="pickup"
                        {...register("receive_method")}
                        checked={deliveryMethod === 'pickup'}
                        onChange={handleDeliveryMethodChange}
                    />
                    <label htmlFor="pickup" className="ml-2">Nhận trực tiếp</label>
                </div>
            </div>

            {/* Địa chỉ nhận */}
            <div className="mb-3">
                <label htmlFor="address" className="form-label">Địa chỉ nhận</label>
                <input
                    type="text"
                    className="form-control"
                    id="address"
                    {...register("receive_address")}
                    disabled={deliveryMethod === 'pickup'} // Disable input khi chọn 'pickup'
                />
            </div>

            {/* Ghi chú */}
            <div className="mb-3">
                <label htmlFor="notes" className="form-label">Ghi chú</label>
                <textarea className="form-control" id="notes" rows="3" {...register("note")}></textarea>
            </div>

            {/* Phí dịch vụ (disabled hoặc không sử dụng) */}
            <div className="mb-3">
                <label htmlFor="serviceFee" className="form-label">Phí dịch vụ</label>
                <input
                    type="text"
                    className="form-control"
                    id="serviceFee"
                    disabled
                    value="Không có"
                />
            </div>

            {/* Nút Submit */}
            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
    );
};

export default TranscriptRequestForm;
