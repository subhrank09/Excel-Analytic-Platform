import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000", // use proxy for local dev
  withCredentials: true,
});

instance.interceptors.request.use(config => {
  const adminToken = localStorage.getItem('adminToken');
  const userToken = localStorage.getItem('token');
  const token = adminToken || userToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
