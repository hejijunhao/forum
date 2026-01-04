"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "./api";
import type {
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

// Query keys
export const queryKeys = {
  products: ["products"] as const,
  product: (id: string) => ["products", id] as const,
  repositories: (productId?: string) => ["repositories", productId] as const,
  repository: (id: string) => ["repositories", "detail", id] as const,
  workItems: (productId?: string) => ["workItems", productId] as const,
  workItem: (id: string) => ["workItems", "detail", id] as const,
  documents: (productId?: string) => ["documents", productId] as const,
  document: (id: string) => ["documents", "detail", id] as const,
  appInfo: (productId?: string) => ["appInfo", productId] as const,
  appInfoItem: (id: string) => ["appInfo", "detail", id] as const,
};

// Products hooks
export function useProducts() {
  return useQuery({
    queryKey: queryKeys.products,
    queryFn: () => api.products.list(),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: queryKeys.product(id),
    queryFn: () => api.products.get(id),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProduct) => api.products.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProduct }) =>
      api.products.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products });
      queryClient.invalidateQueries({ queryKey: queryKeys.product(id) });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.products.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products });
    },
  });
}

// Repositories hooks
export function useRepositories(productId?: string) {
  return useQuery({
    queryKey: queryKeys.repositories(productId),
    queryFn: () => api.repositories.list(productId),
  });
}

export function useCreateRepository() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateRepository) => api.repositories.create(data),
    onSuccess: (_, { product_id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.repositories(product_id) });
    },
  });
}

export function useDeleteRepository() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.repositories.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["repositories"] });
    },
  });
}

// Work Items hooks
export function useWorkItems(productId?: string) {
  return useQuery({
    queryKey: queryKeys.workItems(productId),
    queryFn: () => api.workItems.list(productId),
  });
}

export function useWorkItem(id: string) {
  return useQuery({
    queryKey: queryKeys.workItem(id),
    queryFn: () => api.workItems.get(id),
    enabled: !!id,
  });
}

export function useCreateWorkItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateWorkItem) => api.workItems.create(data),
    onSuccess: (_, { product_id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.workItems(product_id) });
    },
  });
}

export function useUpdateWorkItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateWorkItem }) =>
      api.workItems.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workItems"] });
    },
  });
}

export function useDeleteWorkItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.workItems.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workItems"] });
    },
  });
}

// Documents hooks
export function useDocuments(productId?: string) {
  return useQuery({
    queryKey: queryKeys.documents(productId),
    queryFn: () => api.documents.list(productId),
  });
}

export function useDocument(id: string) {
  return useQuery({
    queryKey: queryKeys.document(id),
    queryFn: () => api.documents.get(id),
    enabled: !!id,
  });
}

export function useCreateDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateDocument) => api.documents.create(data),
    onSuccess: (_, { product_id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.documents(product_id) });
    },
  });
}

export function useUpdateDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDocument }) =>
      api.documents.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.documents.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });
}

// App Info hooks
export function useAppInfo(productId?: string) {
  return useQuery({
    queryKey: queryKeys.appInfo(productId),
    queryFn: () => api.appInfo.list(productId),
  });
}

export function useCreateAppInfo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAppInfo) => api.appInfo.create(data),
    onSuccess: (_, { product_id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.appInfo(product_id) });
    },
  });
}

export function useUpdateAppInfo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAppInfo }) =>
      api.appInfo.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appInfo"] });
    },
  });
}

export function useDeleteAppInfo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.appInfo.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appInfo"] });
    },
  });
}
