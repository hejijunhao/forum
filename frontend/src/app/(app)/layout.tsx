"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout";
import { ProductForm } from "@/components/products";
import { useProducts, useCreateProduct } from "@/lib/hooks";
import type { CreateProduct } from "@/lib/types";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showProductForm, setShowProductForm] = useState(false);
  const { data: products = [] } = useProducts();
  const createProduct = useCreateProduct();

  const handleCreateProduct = async (data: CreateProduct) => {
    await createProduct.mutateAsync(data);
    setShowProductForm(false);
  };

  // Mock user for now - will be replaced with actual auth
  const user = {
    name: "Developer",
    avatar: undefined,
  };

  return (
    <>
      <AppShell
        products={products}
        user={user}
        onNewProduct={() => setShowProductForm(true)}
      >
        {children}
      </AppShell>

      <ProductForm
        open={showProductForm}
        onClose={() => setShowProductForm(false)}
        onSubmit={handleCreateProduct}
        isLoading={createProduct.isPending}
      />
    </>
  );
}
