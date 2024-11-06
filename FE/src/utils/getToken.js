
export const getToken = () => {
    try {
        const token = JSON.parse(localStorage.getItem("token"));
        return token?.access_token || null;
    } catch (error) {
        console.error("Lỗi khi lấy token:", error);
        return null;
    }
};
