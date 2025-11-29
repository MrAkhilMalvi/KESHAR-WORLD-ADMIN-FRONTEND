import { AUTH_ENDPOINTS } from '@/providers/api/api-config';
import axios from '@/providers/axios/axiosInstance';

export const dashboardStats = async () => {
    try {
        const response = await axios.get(AUTH_ENDPOINTS.dashboard.dashboard);
        return response.data;
    } catch (error:any) {
        throw error.response?.data || error.message;
    }
};