"use client";

import { useState } from "react";
import { Button, Input, Textarea, Select } from "@/components/ui";
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
} from "@/components/ui/modal";
import { PRODUCT_COLORS, type ProductColor } from "@/lib/utils";
import type { Product, CreateProduct } from "@/lib/types";

interface ProductFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateProduct) => void;
  product?: Product;
  isLoading?: boolean;
}

export function ProductForm({
  open,
  onClose,
  onSubmit,
  product,
  isLoading,
}: ProductFormProps) {
  const [name, setName] = useState(product?.name || "");
  const [description, setDescription] = useState(product?.description || "");
  const [color, setColor] = useState<ProductColor>(product?.color || "blue");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      description: description || undefined,
      color,
    });
  };

  const isEdit = !!product;

  return (
    <Modal open={open} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <ModalHeader>
          <ModalTitle>{isEdit ? "Edit Product" : "New Product"}</ModalTitle>
          <ModalDescription>
            {isEdit
              ? "Update your product details."
              : "Create a new product to organize your repositories and work."}
          </ModalDescription>
        </ModalHeader>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-text-primary mb-1.5"
            >
              Name
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Product"
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-text-primary mb-1.5"
            >
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A brief description of your product..."
              rows={3}
            />
          </div>

          <div>
            <label
              htmlFor="color"
              className="block text-sm font-medium text-text-primary mb-1.5"
            >
              Color
            </label>
            <div className="flex gap-2">
              {(Object.keys(PRODUCT_COLORS) as ProductColor[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`h-8 w-8 rounded-full transition-all ${
                    color === c
                      ? "ring-2 ring-offset-2 ring-text-primary"
                      : "hover:scale-110"
                  }`}
                  style={{ backgroundColor: PRODUCT_COLORS[c] }}
                  aria-label={`Select ${c} color`}
                />
              ))}
            </div>
          </div>
        </div>

        <ModalFooter>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={!name.trim() || isLoading}>
            {isLoading ? "Saving..." : isEdit ? "Save Changes" : "Create Product"}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
