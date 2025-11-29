import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? "https://sungboktime-q9gn.onrender.com",
});

export default api;