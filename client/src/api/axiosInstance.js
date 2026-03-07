import axios from 'axios';

const rawBaseURL = import.meta.env.VITE_API_BASE_URL;
const normalizedBaseURL = rawBaseURL
  ? rawBaseURL.endsWith('/api')
    ? rawBaseURL
    : `${rawBaseURL.replace(/\/+$/, '')}/api`
  : '';

const axiosInstance = axios.create({
  baseURL: normalizedBaseURL,
  withCredentials: true,
});

export default axiosInstance;