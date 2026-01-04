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
import type { AppInfo, CreateAppInfo, AppInfoCategory } from "@/lib/types";

interface AppInfoFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAppInfo) => void;
  productId: string;
  appInfo?: AppInfo;
  isLoading?: boolean;
}

export function AppInfoForm({
  open,
  onClose,
  onSubmit,
  productId,
  appInfo,
  isLoading,
}: AppInfoFormProps) {
  const [key, setKey] = useState(appInfo?.key || "");
  const [value, setValue] = useState(appInfo?.value || "");
  const [category, setCategory] = useState<AppInfoCategory>(appInfo?.category || "env");
  const [isSecret, setIsSecret] = useState(appInfo?.is_secret || false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      product_id: productId,
      key,
      value,
      category,
      is_secret: isSecret,
    });
  };

  const isEdit = !!appInfo;

  return (
    <Modal open={open} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <ModalHeader>
          <ModalTitle>{isEdit ? "Edit Entry" : "New Entry"}</ModalTitle>
          <ModalDescription>
            {isEdit
              ? "Update the app info entry."
              : "Add environment variables, URLs, or other project context."}
          </ModalDescription>
        </ModalHeader>

        <div className="space-y-4">
          <div>
            <label htmlFor="key" className="block text-sm font-medium text-text-primary mb-1.5">
              Key
            </label>
            <Input
              id="key"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="DATABASE_URL"
              className="font-mono"
              required
            />
          </div>

          <div>
            <label htmlFor="value" className="block text-sm font-medium text-text-primary mb-1.5">
              Value
            </label>
            <Textarea
              id="value"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter value..."
              rows={3}
              className="font-mono"
              required
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-text-primary mb-1.5">
              Category
            </label>
            <Select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as AppInfoCategory)}
            >
              <option value="env">Environment Variable</option>
              <option value="url">URL</option>
              <option value="infrastructure">Infrastructure</option>
              <option value="note">Note</option>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="secret"
              checked={isSecret}
              onChange={(e) => setIsSecret(e.target.checked)}
              className="h-4 w-4 rounded border-border"
            />
            <label htmlFor="secret" className="text-sm text-text-primary">
              This is a secret value (will be masked)
            </label>
          </div>
        </div>

        <ModalFooter>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={!key.trim() || !value.trim() || isLoading}>
            {isLoading ? "Saving..." : isEdit ? "Save Changes" : "Add Entry"}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
