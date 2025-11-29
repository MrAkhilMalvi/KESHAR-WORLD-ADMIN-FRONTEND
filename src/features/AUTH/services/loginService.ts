import { ILogin, IOtp, IResendOTP } from '@/features/AUTH/types/login';
import { AUTH_ENDPOINTS } from '@/providers/api/api-config';
import axios from '@/providers/axios/axiosInstance';


export const login = async (credentials:ILogin) => {
    try {
        const response = await axios.post(AUTH_ENDPOINTS.login.login, credentials);
        return response.data;
    } catch (error:any) {
        throw error.response?.data || error.message;
    }
};

export const verifyOTP = async (credentials: IOtp) => {
  try {
    const response = await axios.post(AUTH_ENDPOINTS.login.verifyOTP, credentials);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const resendOTP = async (mobile_no:string) => {
  try {
    const response = await axios.post(AUTH_ENDPOINTS.login.resendOTP, {mobile_no});
    return response.data;
  } catch (error: any) {
     throw error.response?.data || error.message;
  }
};



