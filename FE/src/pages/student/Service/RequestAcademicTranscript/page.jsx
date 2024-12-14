import { useMutation } from '@tanstack/react-query';
import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import api from '../../../../config/axios';
import { formatErrors } from '../../../../utils/formatErrors';
import { useNavigate } from 'react-router-dom';

const TranscriptRequestForm = () => {
    // Trạng thái lưu hình thức nhận
    const nav = useNavigate();
    const [deliveryMethod, setDeliveryMethod] = useState('');
    const FEE_PER_TRANSCRIPT = 100000; // Giá trị mặc định của phí dịch vụ

    const handleDeliveryMethodChange = (e) => {
        setDeliveryMethod(e.target.value);
    };

    // Sử dụng react-hook-form
    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
        defaultValues: {
            number_board: 1, // Số lượng bảng điểm mặc định
            amount: FEE_PER_TRANSCRIPT, // Phí dịch vụ mặc định
        },
    });

    // Watch để theo dõi giá trị của số lượng bảng điểm
    const numberBoard = watch("number_board");

    // Tự động tính phí dịch vụ khi số lượng bảng điểm thay đổi
    useEffect(() => {
        const newAmount = numberBoard * FEE_PER_TRANSCRIPT;
        setValue("amount", newAmount); // Cập nhật giá trị phí dịch vụ
    }, [numberBoard, setValue]);

    // Mutation API
    const { mutate } = useMutation({
        mutationFn: (data) => api.post("/student/services/register/dang-ky-cap-bang-diem", data),
        onSuccess: () => {
            toast.success("Yêu cầu cấp bảng điểm thành công");
            nav("/student/services/list")
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
        if (deliveryMethod === 'Nhận trực tiếp') {
            setValue("receive_address", "Bạn vui lòng đến phòng Dịch vụ sinh viên để nhận kết quả");
        } else if (deliveryMethod === 'Chuyển phát nhanh') {
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
                        min: {
                            value: 1,
                            message: "Số lượng bảng điểm phải lớn hơn hoặc bằng 1",
                        },
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
            {/* Hình thức nhận */}
            <div className="mb-3">
                <label className="form-label">Hình thức nhận</label>
                <div>
                    <input
                        type="radio"
                        id="express"
                        value="Chuyển phát nhanh"
                        {...register("receive_method")}
                        checked={deliveryMethod === 'Chuyển phát nhanh'}
                        onChange={handleDeliveryMethodChange}
                    />
                    <label htmlFor="express" className="ml-2"> Chuyển phát nhanh</label>
                </div>
                <div className="mt-4">
                    <input
                        type="radio"
                        id="pickup"
                        value="Nhận trực tiếp"
                        {...register("receive_method")}
                        checked={deliveryMethod === 'Nhận trực tiếp'}
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
                    disabled={deliveryMethod === 'Nhận trực tiếp'} // Disable input khi chọn 'pickup'
                />
            </div>

            {/* Phí dịch vụ */}
            <div className="mb-3">
                <label htmlFor="serviceFee" className="form-label">Phí dịch vụ</label>
                <input
                    type="text"
                    className="form-control"
                    id="serviceFee"
                    {...register("amount")}
                    disabled // Chỉ hiển thị, không cho phép người dùng sửa
                />
            </div>

            {/* Nút Submit */}
            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
    );
};

export default TranscriptRequestForm;
