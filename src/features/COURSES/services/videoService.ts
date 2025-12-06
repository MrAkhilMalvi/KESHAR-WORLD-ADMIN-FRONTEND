import axios from "@/providers/axios/axiosInstance";
import { VideoPayload, PresignedUrlPayload, Video } from "../types/video.types";
import { AUTH_ENDPOINTS } from "@/providers/api/api-config";



// export const getPresignedUrl = async (payload: PresignedUrlPayload) => {
//   try {
//     const response = await axios.post(AUTH_ENDPOINTS.PRESIGN, payload);
//     return response?.data;
//   } catch (error: any) {
//     throw error.response?.data || error.message;
//   }
// };

export const getVideos = async (moduleId: string) => {
  try {
    const response = await axios.post(AUTH_ENDPOINTS.videos.getVideos, { module_id: moduleId });
    return response?.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const addVideos = async (moduleId: string, video: Video) => {
  try {
    const response = await axios.post(AUTH_ENDPOINTS.videos.addVideos,  {
      module_id: moduleId,
      ...video,
    });
    return response?.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const updateVideos = async (videoId: string, video: Video) => {
  try {
    const response = await axios.post(AUTH_ENDPOINTS.videos.updateVideos, {
      video_id: videoId,
      ...video,
    });
    return response?.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const deleteVideo = async (id: string) => {
  try {
    const response = await axios.delete(AUTH_ENDPOINTS.videos.deleteVideos);
    return response?.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export async function uploadToSignedUrl(file: File, signedUrl: string) {
  const response = await fetch(signedUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,  // IMPORTANT
    },
    body: file,
  });

  if (!response.ok) {
    throw new Error("Upload to signed URL failed");
  }

  return true;
}
