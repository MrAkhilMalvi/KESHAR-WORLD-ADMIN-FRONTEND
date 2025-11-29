import axios from "@/providers/axios/axiosInstance";
import { AUTH_ENDPOINTS, } from "@/providers/api/api-config";
import { Product } from "../types/product.type";




export const getAllProducts = async () => {
  try {
    const response = await axios.get(AUTH_ENDPOINTS.products.getProducts);
    return response?.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const addProducts = async (data: Product) => {
  try {
    const response = await axios.post(AUTH_ENDPOINTS.products.addProducts, data);
    return response?.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const updateProducts = async (data: Product) => {
  try {
    const response = await axios.post(AUTH_ENDPOINTS.products.updateProducts, data);
    return response?.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const deleteProducts = async (id: string | number) => {
  try {
    const response = await axios.post(AUTH_ENDPOINTS.products.deleteProducts, { id });
    return response?.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};