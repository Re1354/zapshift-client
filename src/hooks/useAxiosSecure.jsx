import axios from 'axios';
import { useEffect } from 'react';
import useAuth from './useAuth';
import { useNavigate } from 'react-router';
import { auth } from '../firebase/firebase.init';

const axiosSecure = axios.create({
  baseURL: 'https://zap-shift-server-bay-eight.vercel.app',
});

const useAxiosSecure = () => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const interceptor = axiosSecure.interceptors.request.use(
      async config => {
        try {
          const currentUser = user || auth.currentUser;
          if (currentUser) {
            const token = await currentUser.getIdToken();
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
      async error => {
        const originalRequest = error.config;
        const statusCode = error.response?.status;
        const requestUrl = originalRequest?.url || '';

        // If 401 (e.g. token expired after 60m), attempt silent token refresh and retry once
        if (
          statusCode === 401 &&
          originalRequest &&
          !originalRequest._retry &&
          !requestUrl.includes('/users')
        ) {
          const currentUser = auth.currentUser || user;
          if (currentUser) {
            originalRequest._retry = true;
            try {
              console.log('[AXIOS] 401 received, refreshing token and retrying request...');
              const freshToken = await currentUser.getIdToken(true);
              originalRequest.headers.Authorization = `Bearer ${freshToken}`;
              return axiosSecure(originalRequest);
            } catch (refreshErr) {
              console.error('[AXIOS] Token refresh attempt failed:', refreshErr);
            }
          }
        }

        // Only log out if 403 or persistent 401 after retry, excluding /users sync
        if (
          (statusCode === 401 || statusCode === 403) &&
          !requestUrl.includes('/users')
        ) {
          const currentUser = auth.currentUser || user;
          if (!currentUser || originalRequest?._retry) {
            console.warn('[AXIOS] Session invalidated, logging out to /login...');
            logOut()
              .then(() => {
                navigate('/login');
              })
              .catch(logoutError => {
                console.error('Logout error:', logoutError);
              });
          }
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
