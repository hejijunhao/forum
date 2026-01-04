import { type ProductColor } from "./utils";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  color: ProductColor;
  created_at: string;
  updated_at: string;
}

export interface Repository {
  id: string;
  product_id: string;
  user_id: string;
  name: string;
  url: string;
  description?: string;
  language?: string;
  stars?: number;
  forks?: number;
  created_at: string;
  updated_at: string;
}

export type WorkItemType = "feature" | "fix" | "refactor" | "investigation";
export type WorkItemStatus = "todo" | "in_progress" | "done";

export interface WorkItem {
  id: string;
  product_id: string;
  repository_id?: string;
  user_id: string;
  title: string;
  description?: string;
  type: WorkItemType;
  status: WorkItemStatus;
  created_at: string;
  updated_at: string;
}

export type DocumentType = "blueprint" | "architecture" | "note" | "plan";

export interface Document {
  id: string;
  product_id: string;
  repository_id?: string;
  user_id: string;
  title: string;
  content?: string;
  type: DocumentType;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
}

export type AppInfoCategory = "env" | "url" | "infrastructure" | "note";

export interface AppInfo {
  id: string;
  product_id: string;
  user_id: string;
  key: string;
  value: string;
  category: AppInfoCategory;
  is_secret: boolean;
  repository_id?: string;
  created_at: string;
  updated_at: string;
}

// Create/Update DTOs
export interface CreateProduct {
  name: string;
  description?: string;
  color: ProductColor;
}

export interface UpdateProduct {
  name?: string;
  description?: string;
  color?: ProductColor;
}

export interface CreateRepository {
  product_id: string;
  name: string;
  url: string;
  description?: string;
  language?: string;
  stars?: number;
  forks?: number;
}

export interface CreateWorkItem {
  product_id: string;
  repository_id?: string;
  title: string;
  description?: string;
  type: WorkItemType;
  status?: WorkItemStatus;
}

export interface UpdateWorkItem {
  title?: string;
  description?: string;
  type?: WorkItemType;
  status?: WorkItemStatus;
  repository_id?: string;
}

export interface CreateDocument {
  product_id: string;
  repository_id?: string;
  title: string;
  content?: string;
  type: DocumentType;
  is_pinned?: boolean;
}

export interface UpdateDocument {
  title?: string;
  content?: string;
  type?: DocumentType;
  is_pinned?: boolean;
  repository_id?: string;
}

export interface CreateAppInfo {
  product_id: string;
  key: string;
  value: string;
  category: AppInfoCategory;
  is_secret?: boolean;
  repository_id?: string;
}

export interface UpdateAppInfo {
  key?: string;
  value?: string;
  category?: AppInfoCategory;
  is_secret?: boolean;
  repository_id?: string;
}

// Aggregated types for dashboard
export interface ProductWithStats extends Product {
  repository_count: number;
  work_item_count: number;
  document_count: number;
  app_info_count: number;
  in_progress_count: number;
}
