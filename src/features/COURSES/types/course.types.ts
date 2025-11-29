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
  thumbnail_url: string;
}
