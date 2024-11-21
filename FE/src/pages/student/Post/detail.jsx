import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../config/axios";

const NewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["LIST_NEWS", id],
    queryFn: async () => {
      const res = await api.get(`/student/newsletters/${id}`);
      return res?.data[0];
    },
  });
  // useEffect(() => {
  //   refetch();
  //   console.log('data', data);

  // }, [])

  const formatDateTime = (isoDate) => {
    const date = new Date(isoDate);
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    };
    return date.toLocaleString("en-GB", options); 
  };
  return (
    <div className="container mt-4">
      <div className="card">
        {isLoading ? (
          <div>
            <div className="spinner-border" role="status"></div>
            <p>Đang tải dữ liệu</p>
          </div>
        ) : (
          <>
            <div className="card-header">
              <h2 className="text-lg"><strong>{data.title}</strong></h2>
            </div>
            <div className="card-body" style={{ lineHeight: '2' }}>
              {data ? (
                <div>
                  <div>
                    <img
                      src={data.image}
                      alt={data.title}
                      style={{ maxWidth: "100%", height: "auto" }}
                    />
                  </div>
                  <div>
                    <div dangerouslySetInnerHTML={{ __html: data.content }} style={{ minHeight: '300px' }} />
                  </div>
                  <div className="mt-3 text-muted text-sm">
                    <p>Tác giả: {data.full_name}</p>
                    <p>Ngày: {formatDateTime(data.created_at)}</p>
                  </div>
                  <button
                    className="btn btn-danger mt-3"
                    onClick={() => navigate(-1)}
                  >
                    <i className="fas fa-backward"> Quay lại</i> 
                  </button>
                </div>
              ) : (
                <div>Chưa có dữ liệu.</div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NewsDetail;
