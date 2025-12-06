import axios from "@/providers/axios/axiosInstance";
import { Course, UploadParams, UploadType } from "../types/course.types";
import { AUTH_ENDPOINTS, } from "@/providers/api/api-config";



export const addCourse = async (data: Course) => {
  try {
    const response = await axios.post(AUTH_ENDPOINTS.courses.addCourse, data);
    return response?.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const getAllCourses = async () => {
  try {
    const response = await axios.get(AUTH_ENDPOINTS.courses.getAllCourse);
    return response?.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const updateCourse = async (data: Course) => {
  try {
    const response = await axios.post(AUTH_ENDPOINTS.courses.updateCourse, data);
    console.log(response);
    
    return response?.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const deleteCourse = async (course_id: string) => {
  try {
    const response = await axios.post(AUTH_ENDPOINTS.courses.deleteCourse, { course_id });
    return response?.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};





export const uploadDirect = async (params: UploadParams) => {
  try {
    const { type, file } = params;

    const payload: any = {
      type,
      fileName: file.name,
      contentType: file.type,
    };

    const keyMap: Record<UploadType, string[]> = {
      course_thumbnail: ["course_id"],
      product_thumbnail: ["product_id"],
      video: ["module_id", "video_id"],
      video_thumbnail: ["module_id", "video_id"],
      product_images: ["product_id"],
    };

    keyMap[type].forEach((key) => {
      // @ts-ignore
      payload[key] = params[key];
    });

    // 🚀 Now send data EXACTLY like updateCourse()
    const response = await axios.post(
      AUTH_ENDPOINTS.videos.uploadVideo,
      payload
    );

    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};




