import axios from 'axios';
import { useEffect } from 'react';
import useAuth from './useAuth';
import { useNavigate } from 'react-router';

const axiosSecure = axios.create({
  baseURL: 'http://localhost:3000',
});

const useAxiosSecure = () => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const interceptor = axiosSecure.interceptors.request.use(
      async config => {
        try {
          if (user) {
            const token = await user.getIdToken();

            config.headers.Authorization = `Bearer ${token}`;
          }

          return config;
        } catch (error) {
          console.error('Failed to get Firebase token:', error);
          return Promise.reject(error);
        }
      },
      error => {
        return Promise.reject(error);
      },
    );

    const resInterceptor = axiosSecure.interceptors.response.use(
      response => response,
      error => {
        console.log('Axios Secure Error:', error);

        const statusCode = error.response?.status;

        if (statusCode === 401 || statusCode === 403) {
          logOut()
            .then(() => {
              navigate('/login');
            })
            .catch(logoutError => {
              console.error('Logout error:', logoutError);
            });
        }

        return Promise.reject(error);
      },
    );

    return () => {
      axiosSecure.interceptors.request.eject(interceptor);
      axiosSecure.interceptors.response.eject(resInterceptor);
    };
  }, [user, logOut, navigate]);

  return axiosSecure;
};

export default useAxiosSecure;
