import axios from 'axios';

// Support both VITE_API_BASE_URL and API_BASE_URL (exposed via vite.config.js define)
const rawBaseURL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.API_BASE_URL ||
  '';

// Use the configured URL exactly as provided — strip trailing slash only
const baseURL = rawBaseURL.replace(/\/+$/, '');

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

export default axiosInstance;