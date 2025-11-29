import { Video } from "./video.types";

export interface ModulePayload {
  course_id: string;
  title: string;
  description?: string;
}

export interface ModuleResponse {
  id: string;
  course_id: string;
  title: string;
  description: string;
  order: number;
}


export interface Module {
  module_id?: string; // ID from DB
  title: string;
  position: number;
  videos?: Video[]; // For UI state
}