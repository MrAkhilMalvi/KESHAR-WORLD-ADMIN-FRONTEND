import type { AxiosInstance } from 'axios';
import { handleUnauthorizedRedirect } from '../../shared/services/redirectService';

export const unauthorizedInterceptor = (axiosInstance: AxiosInstance) => {
  axiosInstance.interceptors.response.use(
    res => res,
    err => {
      const status = err.status || err.response?.status;
       const currentPath = window.location.pathname;
     if ((status === 401 || status === 403) ||
          (status === 429 && currentPath !== "/forgot-password")) {
        handleUnauthorizedRedirect();
      }
      return Promise.reject(err);
    }
  );
};
