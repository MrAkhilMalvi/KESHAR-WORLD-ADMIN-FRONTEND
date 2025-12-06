export interface Product {
  id?: string | number; // Optional because new products don't have IDs yet
  title: string;
  slug: string;
  description: string;
  category: string;
  sub_category: string;
  price: number;
  discount_price: number;
  is_free: boolean;
  qty: number;
  contentType: string;
  fileName: string;
  thumbnail_url?: string;
  language: string;
}