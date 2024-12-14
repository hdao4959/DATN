import axios from "axios";
const api = axios.create({
    // baseURL: "https://admin.feduvn.com/api/",
    baseURL: "https://admin.feduvn.com/api",
});
   
api.interceptors.request.use(
    function (config) {
        console.log("Request Config:", config); // Kiểm tra toàn bộ config trước khi gửi
        const token = JSON.parse(localStorage.getItem("token") || "{}");
        const accessToken = token?.access_token;
        const csrfToken = document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute("content");

        if (accessToken) {
            config.headers["Authorization"] = `Bearer ${accessToken}`;
        }

        // if (!config.baseURL || config.baseURL !== "https://admin.feduvn.com/api") {
        //     config.baseURL = "https://admin.feduvn.com/api";
        // }

        if (csrfToken) {
            config.headers["X-CSRF-TOKEN"] = csrfToken;
        }
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

export default api;
