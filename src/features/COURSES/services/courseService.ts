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


export const uploadVideo = async (
  moduleId: string,
  video_title: string,
  file: File
) => {
  if (!moduleId || !video_title || !file) {
    throw new Error("Module ID, video title, and file are required");
  }

  try {
    const formData = new FormData();
    formData.append("module_id", moduleId);
    formData.append("video_title", video_title);
    formData.append("video", file); // 🔥 MUST MATCH multer.single('video')

    const response = await axios.post(
      AUTH_ENDPOINTS.videos.uploadVideo, 
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};


