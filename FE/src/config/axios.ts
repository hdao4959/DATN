import axios from "axios";
const api = axios.create({
    baseURL: "https://admin.feduvn.com/api",
});

api.interceptors.request.use(
    function (config) {
        const token = JSON.parse(localStorage.getItem("token") || "{}");
        const accessToken = token?.access_token;

        if (accessToken) {
            config.headers["Authorization"] = `Bearer ${accessToken}`;
        }

        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

export default api;
