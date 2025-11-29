import axios from "@/providers/axios/axiosInstance";
import { Course } from "../types/course.types";
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
    return response?.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

// export const deleteCourse = async (id: string) => {
//   try {
//     const response = await axios.delete(AUTH_ENDPOINTS.courses.deleteCourse);
//     return response?.data;
//   } catch (error: any) {
//     throw error.response?.data || error.message;
//   }
// };
