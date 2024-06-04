import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://api.frankfurter.app/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
