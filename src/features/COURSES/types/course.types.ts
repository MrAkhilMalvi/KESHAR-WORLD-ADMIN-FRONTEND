export interface CoursePayload {
  title: string;
  slug: string;
  description?: string;
  thumbnail?: string;
}

export interface CourseResponse {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  created_at: string;
}



export interface Course {
  id?: string;
  title: string;
  price: number;
  description: string;
  is_free: boolean;
  instructor: string;
  original_price: number;
  badge: string;
  category: string;
  thumbnail_url?: string;
  contentType?: string;
  fileName?: string;
  
}

export type UploadType =
  | "course_thumbnail"
  | "product_thumbnail"
  | "video"
  | "video_thumbnail";

export interface UploadParamsBase {
  type: UploadType;
  file: File;
}

export interface CourseThumbnailParams extends UploadParamsBase {
  type: "course_thumbnail";
  course_id: string;
}

export interface ProductThumbnailParams extends UploadParamsBase {
  type: "product_thumbnail";
  product_id: string;
}

export interface VideoParams extends UploadParamsBase {
  type: "video";
  module_id: string;
  video_id: string;
}

export interface VideoThumbnailParams extends UploadParamsBase {
  type: "video_thumbnail";
  module_id: string;
  video_id: string;
}

export type UploadParams =
  | CourseThumbnailParams
  | ProductThumbnailParams
  | VideoParams
  | VideoThumbnailParams;
