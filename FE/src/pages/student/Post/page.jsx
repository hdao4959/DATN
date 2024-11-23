import React, { useEffect } from "react";
import 'datatables.net-dt/css/dataTables.dataTables.css';
import $ from 'jquery';
import 'datatables.net';
import { useQuery } from "@tanstack/react-query";
import api from "../../../config/axios";
import { Link } from "react-router-dom";

const App = ({ Type }) => {
    const { data, isLoading: isLoadingNews, refetch } = useQuery({
        queryKey: ["LIST_NEWS"],
        queryFn: async () => {
            const res = await api.get(`/student/newsletters`);
            console.log(res?.data);
            return res?.data;
        }
    })

useEffect(() => {
    refetch();
    if (data) {
        const tableData = [];
        const maxArticles = Math.max(...data?.map((item) => item.newsletter.length));
        for (let i = 0; i < maxArticles; i++) {
            const row = {};
            data.forEach((category) => {
                const filteredNewsletter = category.newsletter.filter(
                    (article) => article.type === Type
                );
                const article = filteredNewsletter[i];
                row[category.cate_name] = article
                    ? `
                        <a
                            href="/student/news/${article.code}/detail"
                            class="text-decoration-none hover:text-blue-600"
                        >
                            ${article.title}
                        </a>
                    `
                    : "";
                    console.log(row[category.cate_name]);
                    
            });
            tableData.push(row);
        }
        if ($.fn.dataTable.isDataTable("#newsTable")) {
            $("#newsTable").DataTable().clear().destroy();
        }

        $("#newsTable").DataTable({
            data: tableData,
            columns: data.map((category) => ({
                title: category.cate_name,
                className: "text-primary btn-hover",
                data: category.cate_name,
                render: (data) => data || "",
            })),
            destroy: true,
            paging: false,
            searching: false,
            info: false,
            lengthChange: false,
            ordering: false,
            stripeClasses: [],
        });
    }
}, [data, Type, refetch]);

return (
    <div>
        <div className="card" style={{ minHeight: "auto" }}>
            <div className="card-header">
                <h4 className="card-title"> 
                {Type === 'news' ? (<i className="fas fa-newspaper hover:text-red-500"> Tin tức</i>) : (<i className="fas fa-bell hover:text-blue-500"> Thông báo</i>)}
                </h4>
            </div>
            {isLoadingNews ? (
                <div className="card-body">
                    <div className="spinner-border" role="status"></div>
                    <p>Đang tải dữ liệu</p>
                </div>
            ) : (
                <div className="card-body">
                    <table id="newsTable" className="table table-bordered"></table>
                </div>
            )}
        </div>
    </div>
);
};

export default App;
