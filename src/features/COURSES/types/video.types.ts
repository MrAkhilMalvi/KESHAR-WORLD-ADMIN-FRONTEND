export interface VideoPayload {
  module_id: string;
  title: string;
  description?: string;
  duration: number;
  video_url: string;
}

export interface PresignedUrlPayload {
  fileName: string;
  fileType: string;
}

export interface PresignedUrlResponse {
  uploadUrl: string;
  fileUrl: string;
}

export interface VideoResponse {
  id: string;
  module_id: string;
  title: string;
  description: string;
  duration: number;
  url: string;
  order: number;
}

export interface Video {
  video_id?: string;
  title: string;
  objectKey: string;
  thumbnail_url?: string; 
  video_duration: string;
  video_description: string;
  video_position: number;
}
