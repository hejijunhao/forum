"use client";

import { useState } from "react";
import { Button, Input, Textarea } from "@/components/ui";
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
} from "@/components/ui/modal";
import type { CreateRepository } from "@/lib/types";

interface RepositoryFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateRepository) => void;
  productId: string;
  isLoading?: boolean;
}

export function RepositoryForm({
  open,
  onClose,
  onSubmit,
  productId,
  isLoading,
}: RepositoryFormProps) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      product_id: productId,
      name,
      url,
      description: description || undefined,
      language: language || undefined,
    });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <ModalHeader>
          <ModalTitle>Add Repository</ModalTitle>
          <ModalDescription>
            Link a repository to this product.
          </ModalDescription>
        </ModalHeader>

        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-1.5">
              Name
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="my-repo"
              required
            />
          </div>

          <div>
            <label htmlFor="url" className="block text-sm font-medium text-text-primary mb-1.5">
              URL
            </label>
            <Input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://github.com/user/repo"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-text-primary mb-1.5">
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the repository..."
              rows={2}
            />
          </div>

          <div>
            <label htmlFor="language" className="block text-sm font-medium text-text-primary mb-1.5">
              Primary Language
            </label>
            <Input
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              placeholder="TypeScript"
            />
          </div>
        </div>

        <ModalFooter>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={!name.trim() || !url.trim() || isLoading}>
            {isLoading ? "Adding..." : "Add Repository"}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
