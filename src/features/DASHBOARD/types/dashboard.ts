export interface MostPurchasedCourse {
  name: string;
  price: number;
  purchase_user_count: number;
}

export interface DashboardData {
  total_students: number;
  total_courses: number;
  total_modules: number;
  total_videos: number;
  most_purchased_course: MostPurchasedCourse;
  average_purchase_price: number;
  total_free_courses: number;
  total_paid_courses: number;
  total_free_course_purchases: number;
  total_paid_course_purchases: number;
}