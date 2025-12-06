import axios from "@/providers/axios/axiosInstance";
import { AUTH_ENDPOINTS, } from "@/providers/api/api-config";
import { GalleryItem, Product,  ProductImagesPayload } from "../types/product.type";




export const getAllProducts = async (limit: number, offset: number) => {
  try {
    const response = await axios.post(AUTH_ENDPOINTS.products.getProducts, {
      limit,
      offset,
    });
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

export const getProductImages = async (product_id: string) => {
  try {
    const response = await axios.post(AUTH_ENDPOINTS.products.getProductsImages, { product_id });
    return response?.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const productImagesUpload = async (payload:GalleryItem) => {
  try {
    const response = await axios.post(AUTH_ENDPOINTS.products.productImages, payload);
    return response?.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const productImagesDelete = async (id: string) => {
  try {
    const response = await axios.post(AUTH_ENDPOINTS.products.prodcutImagesDelete, {id});
    return response?.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

