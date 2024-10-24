export const formatErrors = (error) => {
    const errorObj = error?.response?.data?.errors;

    if (!errorObj) return "";

    const msg = Object.keys(errorObj).reduce((res, curr) => {
        res.push(errorObj[curr]);

        return res;
    }, []);

    return msg.join(", ");
};
