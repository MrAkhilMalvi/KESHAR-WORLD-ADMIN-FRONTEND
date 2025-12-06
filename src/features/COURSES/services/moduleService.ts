import axios from "@/providers/axios/axiosInstance";
import { ModulePayload } from "../types/module.types";
import { AUTH_ENDPOINTS } from "@/providers/api/api-config";

export const addModule = async (
  courseId: string,
  title: string,
  position: number
) => {
  try {
    const response = await axios.post(AUTH_ENDPOINTS.modules.addModule, {
      course_id: courseId,
      module_title: title,
      position,
    });
    return response?.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const getModules = async (courseId: string) => {
  try {
    const response = await axios.post(AUTH_ENDPOINTS.modules.getModules, {
      couses_id: courseId,
    });
    return response?.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const updateModule = async (
  moduleId: string,
  title: string,
  position: number
) => {
  try {
    const response = await axios.post(AUTH_ENDPOINTS.modules.updateModule, {
      modules_id: moduleId,
      module_title: title,
      position,
    });
    return response?.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const deleteModule = async (module_id: string) => {
  try {
    const response = await axios.post(AUTH_ENDPOINTS.modules.deleteModules, {
      module_id,
    });
    return response?.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};
