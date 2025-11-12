// Esto me causo muchos problemas
export const getToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
};