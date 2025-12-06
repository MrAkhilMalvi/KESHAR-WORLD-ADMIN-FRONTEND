import { AUTH_ENDPOINTS } from '@/providers/api/api-config';
import axios from '@/providers/axios/axiosInstance';
import {IMobileNo, IOtp, IPassword  } from '@/features/AUTH/types/forgotPassword';
import toast from 'react-hot-toast';


export const forgotPassword = async (credentials:IMobileNo) => {
    try {
        const response = await axios.post(AUTH_ENDPOINTS.forgotPassword.forgotPassword, credentials);
        return response.data;
    } catch (error:any) {
        throw error.response?.data || error.message;
    }
};

export const verifyOTP = async (credentials:IOtp)=> {
    try {
        const response = await axios.post(AUTH_ENDPOINTS.forgotPassword.verifyOTP, credentials);
        return response.data;
    } catch (error:any) {
        throw error.response?.data || error.message;
    }
}

export const resendOTP = async (mobile_no: string) => {
  try {
    const payload = { mobile_no }; 
    const response = await axios.post(
      AUTH_ENDPOINTS.forgotPassword.resendOTP,
      payload
    );
    return response.data;
  } catch (error: any) {
    toast.error("Resend OTP error");
     throw error.response?.data || error.message;
  }
};

export const setPassword = async (credentials:IPassword)=> {
    try {
        const response = await axios.post(AUTH_ENDPOINTS.forgotPassword.setPassword, credentials);
        return response.data;
    } catch (error:any) {
        throw error.response?.data || error.message;
    }
}