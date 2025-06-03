import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  // baseURL: "/api", // Sesuaikan dengan base URL API Next.js Anda (jika menggunakan API Routes)
  baseURL: "http://localhost:5000/api", // jika langsung ke backend Express
  withCredentials: true, // Penting untuk mengirim/menerima cookie
});

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("authToken"); // Ambil token dari cookie
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`; // Tambahkan ke header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export { api };
