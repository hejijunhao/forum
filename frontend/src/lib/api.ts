import type {
  Product,
  Repository,
  WorkItem,
  Document,
  AppInfo,
  CreateProduct,
  UpdateProduct,
  CreateRepository,
  CreateWorkItem,
  UpdateWorkItem,
  CreateDocument,
  UpdateDocument,
  CreateAppInfo,
  UpdateAppInfo,
} from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${path}`;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const message = await response.text().catch(() => "Request failed");
    throw new ApiError(response.status, message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

// Products API
export const productsApi = {
  list: () => request<Product[]>("/api/v1/products"),

  get: (id: string) => request<Product>(`/api/v1/products/${id}`),

  create: (data: CreateProduct) =>
    request<Product>("/api/v1/products", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: UpdateProduct) =>
    request<Product>(`/api/v1/products/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    request<void>(`/api/v1/products/${id}`, {
      method: "DELETE",
    }),
};

// Repositories API
export const repositoriesApi = {
  list: (productId?: string) => {
    const params = productId ? `?product_id=${productId}` : "";
    return request<Repository[]>(`/api/v1/repositories${params}`);
  },

  get: (id: string) => request<Repository>(`/api/v1/repositories/${id}`),

  create: (data: CreateRepository) =>
    request<Repository>("/api/v1/repositories", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    request<void>(`/api/v1/repositories/${id}`, {
      method: "DELETE",
    }),
};

// Work Items API
export const workItemsApi = {
  list: (productId?: string) => {
    const params = productId ? `?product_id=${productId}` : "";
    return request<WorkItem[]>(`/api/v1/work-items${params}`);
  },

  get: (id: string) => request<WorkItem>(`/api/v1/work-items/${id}`),

  create: (data: CreateWorkItem) =>
    request<WorkItem>("/api/v1/work-items", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: UpdateWorkItem) =>
    request<WorkItem>(`/api/v1/work-items/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    request<void>(`/api/v1/work-items/${id}`, {
      method: "DELETE",
    }),
};

// Documents API
export const documentsApi = {
  list: (productId?: string) => {
    const params = productId ? `?product_id=${productId}` : "";
    return request<Document[]>(`/api/v1/documents${params}`);
  },

  get: (id: string) => request<Document>(`/api/v1/documents/${id}`),

  create: (data: CreateDocument) =>
    request<Document>("/api/v1/documents", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: UpdateDocument) =>
    request<Document>(`/api/v1/documents/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    request<void>(`/api/v1/documents/${id}`, {
      method: "DELETE",
    }),
};

// App Info API
export const appInfoApi = {
  list: (productId?: string) => {
    const params = productId ? `?product_id=${productId}` : "";
    return request<AppInfo[]>(`/api/v1/app-info${params}`);
  },

  get: (id: string) => request<AppInfo>(`/api/v1/app-info/${id}`),

  create: (data: CreateAppInfo) =>
    request<AppInfo>("/api/v1/app-info", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: UpdateAppInfo) =>
    request<AppInfo>(`/api/v1/app-info/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    request<void>(`/api/v1/app-info/${id}`, {
      method: "DELETE",
    }),
};

// Aggregated API
export const api = {
  products: productsApi,
  repositories: repositoriesApi,
  workItems: workItemsApi,
  documents: documentsApi,
  appInfo: appInfoApi,
};

export { ApiError };
