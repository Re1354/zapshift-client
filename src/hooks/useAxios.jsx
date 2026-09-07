import React from 'react';
import axios from 'axios';
const axiosInstance = axios.create({
  baseURL: 'https://zap-shift-server-bay-eight.vercel.app',
});

const useAxios = () => {
  return axiosInstance;
};

export default useAxios;
