"use client";

import { useState } from "react";
import { Plus, Package } from "lucide-react";
import { Button, EmptyState, LoadingSpinner } from "@/components/ui";
import { ProductCard, ProductForm } from "@/components/products";
import { useProducts, useWorkItems, useRepositories, useDocuments, useCreateProduct } from "@/lib/hooks";
import type { CreateProduct, Product } from "@/lib/types";

export default function DashboardPage() {
  const [showProductForm, setShowProductForm] = useState(false);
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: workItems = [] } = useWorkItems();
  const { data: repositories = [] } = useRepositories();
  const { data: documents = [] } = useDocuments();
  const createProduct = useCreateProduct();

  const handleCreateProduct = async (data: CreateProduct) => {
    await createProduct.mutateAsync(data);
    setShowProductForm(false);
  };

  // Calculate stats for each product
  const getProductStats = (product: Product) => {
    const productRepos = repositories.filter((r) => r.product_id === product.id);
    const productWorkItems = workItems.filter((w) => w.product_id === product.id);
    const productDocs = documents.filter((d) => d.product_id === product.id);
    const inProgress = productWorkItems.filter((w) => w.status === "in_progress");

    return {
      repositoryCount: productRepos.length,
      workItemCount: productWorkItems.length,
      documentCount: productDocs.length,
      inProgressCount: inProgress.length,
    };
  };

  if (productsLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-text-primary">
          Welcome back
        </h1>
        <p className="mt-1 text-text-secondary">
          Here&apos;s an overview of your products and recent activity.
        </p>
      </div>

      {/* Products section */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-primary">Products</h2>
          <Button size="sm" onClick={() => setShowProductForm(true)}>
            <Plus className="h-4 w-4" />
            New Product
          </Button>
        </div>

        {products.length === 0 ? (
          <EmptyState
            icon={<Package className="h-12 w-12" />}
            title="No products yet"
            description="Create your first product to start organizing your repositories and work."
            action={
              <Button onClick={() => setShowProductForm(true)}>
                <Plus className="h-4 w-4" />
                Create Product
              </Button>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => {
              const stats = getProductStats(product);
              return (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  description={product.description}
                  color={product.color}
                  {...stats}
                />
              );
            })}
          </div>
        )}
      </section>

      <ProductForm
        open={showProductForm}
        onClose={() => setShowProductForm(false)}
        onSubmit={handleCreateProduct}
        isLoading={createProduct.isPending}
      />
    </div>
  );
}
