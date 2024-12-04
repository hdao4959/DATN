import React, { useEffect } from "react";
import 'datatables.net-dt/css/dataTables.dataTables.css';
import $ from 'jquery';
import 'datatables.net';
import { useQuery } from "@tanstack/react-query";
import api from "../../../config/axios";

const StudentServices = () => {
    const { data: services, isLoading, refetch } = useQuery({
        queryKey: ["LIST_SERVICES"],
        queryFn: async () => {
            const res = await api.get(`student/service`);
            console.log(res?.data?.data);
            
            return res?.data?.data;
            // const servicesData = [
            //     { id: 1, cate_code: "SER_", cate_name: "Đăng ký khôi phục điểm danh", description: "Đăng ký khôi phục điểm danh" },
            //     { id: 2, cate_code: "SER_", cate_name: "Đăng ký thay đổi thông tin", description: "Đăng ký thay đổi thông tin" },
            //     { id: 3, cate_code: "SER_", cate_name: "Đăng ký thi lại", description: "Đăng ký thi lại" },
            //     { id: 4, cate_code: "SER_RE-ENROLLMENT", cate_name: "Đăng ký học lại", description: "Đăng ký học lại cho sinh viên bị trượt môn" },
            // ];
            // return servicesData;
        }
    });

    useEffect(() => {
        refetch();
        if (services) {
            console.log(services);
            if ($.fn.dataTable.isDataTable('#servicesTable')) {
                $('#servicesTable').DataTable().clear().destroy();
            }
            $("#servicesTable").DataTable({
                data: services,
                columns: [
                    {
                        title: "STT",
                        data: null,
                        render: (data, type, row, meta) =>
                            meta.row + meta.settings._iDisplayStart + 1,
                    },
                    { 
                        title: "Dịch vụ", 
                        data: null,
                        render: (data) => {
                            return `<p class='text-primary strong'>${data.cate_name}</p>`;
                        },
                    },
                    { title: "Mô tả", data: "description" },
                    {
                        title: "Đăng ký",
                        data: null,
                        render: (data, row) => {
                            const route = data.cate_code.replace('SER_', '').toLowerCase();
                            return `<a href="/student/services/${route}" class="btn btn-primary btn-sm">Đăng ký dịch vụ</a>`;
                        }
                    },
                ],
                paging: false,
                searching: false,
                ordering: false,
                info: false,
            });
        }
        return () => {
        };
    }, [services, isLoading]);

    return (
        <div>
            <div className="card" style={{ minHeight: '800px' }}>
                <div className="card-header">
                    <h4 className="card-title">Dịch Vụ</h4>
                </div>
                <div className="card-body">
                    {isLoading ? (
                        <div className="loading-spinner text-center">
                            <div className='spinner-border' role='status'></div>
                            <p>Đang tải dữ liệu...</p>
                        </div>)
                        : (
                            <div className="container">
                                <table id="servicesTable" className="display" />
                            </div>
                        )}
                </div>
            </div>
        </div>
    );
};

export default StudentServices;
