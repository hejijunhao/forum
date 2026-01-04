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
import type { Document, CreateDocument, DocumentType } from "@/lib/types";

interface DocumentFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateDocument) => void;
  productId: string;
  document?: Document;
  isLoading?: boolean;
}

export function DocumentForm({
  open,
  onClose,
  onSubmit,
  productId,
  document,
  isLoading,
}: DocumentFormProps) {
  const [title, setTitle] = useState(document?.title || "");
  const [content, setContent] = useState(document?.content || "");
  const [type, setType] = useState<DocumentType>(document?.type || "note");
  const [isPinned, setIsPinned] = useState(document?.is_pinned || false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      product_id: productId,
      title,
      content: content || undefined,
      type,
      is_pinned: isPinned,
    });
  };

  const isEdit = !!document;

  return (
    <Modal open={open} onClose={onClose} className="max-w-2xl">
      <form onSubmit={handleSubmit}>
        <ModalHeader>
          <ModalTitle>{isEdit ? "Edit Document" : "New Document"}</ModalTitle>
          <ModalDescription>
            {isEdit
              ? "Update the document."
              : "Create a new document for your product."}
          </ModalDescription>
        </ModalHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-text-primary mb-1.5">
                Title
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Document title"
                required
              />
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-text-primary mb-1.5">
                Type
              </label>
              <Select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value as DocumentType)}
              >
                <option value="note">Note</option>
                <option value="blueprint">Blueprint</option>
                <option value="architecture">Architecture</option>
                <option value="plan">Plan</option>
              </Select>
            </div>
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-text-primary mb-1.5">
              Content (Markdown)
            </label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your document content here..."
              rows={10}
              className="font-mono text-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="pinned"
              checked={isPinned}
              onChange={(e) => setIsPinned(e.target.checked)}
              className="h-4 w-4 rounded border-border"
            />
            <label htmlFor="pinned" className="text-sm text-text-primary">
              Pin this document
            </label>
          </div>
        </div>

        <ModalFooter>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={!title.trim() || isLoading}>
            {isLoading ? "Saving..." : isEdit ? "Save Changes" : "Create Document"}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
