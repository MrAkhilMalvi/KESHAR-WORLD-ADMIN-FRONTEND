export interface Product {
  id?: string; // Optional because new products don't have IDs yet
  title: string;
  slug: string;
  description: string;
  category: string;
  sub_category: string;
  price: number;
  discount_price: number;
  is_free: boolean;
  qty?: number;
  contentType?: string;
  fileName?: string;
  thumbnail_url?: string;
  language: string;
  images?: string[];
}

export interface ProductImagesPayload {
  product_id: string;
  images: string[];
}

export interface GalleryItem {
  objectKey: string;
  product_id: string;
  position: number;
  id?: string;
}
