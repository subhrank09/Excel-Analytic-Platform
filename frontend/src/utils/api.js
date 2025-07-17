import axios from "axios";

const API = axios.create({

  baseURL: "/api", // use proxy for local dev
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Automatically attach token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`; // use backticks for correct interpolation
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;