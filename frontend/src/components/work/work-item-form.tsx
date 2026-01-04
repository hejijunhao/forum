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
import type { WorkItem, CreateWorkItem, WorkItemType, WorkItemStatus, Repository } from "@/lib/types";

interface WorkItemFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateWorkItem) => void;
  productId: string;
  repositories?: Repository[];
  workItem?: WorkItem;
  isLoading?: boolean;
}

export function WorkItemForm({
  open,
  onClose,
  onSubmit,
  productId,
  repositories = [],
  workItem,
  isLoading,
}: WorkItemFormProps) {
  const [title, setTitle] = useState(workItem?.title || "");
  const [description, setDescription] = useState(workItem?.description || "");
  const [type, setType] = useState<WorkItemType>(workItem?.type || "feature");
  const [status, setStatus] = useState<WorkItemStatus>(workItem?.status || "todo");
  const [repositoryId, setRepositoryId] = useState(workItem?.repository_id || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      product_id: productId,
      title,
      description: description || undefined,
      type,
      status,
      repository_id: repositoryId || undefined,
    });
  };

  const isEdit = !!workItem;

  return (
    <Modal open={open} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <ModalHeader>
          <ModalTitle>{isEdit ? "Edit Work Item" : "New Work Item"}</ModalTitle>
          <ModalDescription>
            {isEdit
              ? "Update the work item details."
              : "Create a new task, feature, or bug fix."}
          </ModalDescription>
        </ModalHeader>

        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-text-primary mb-1.5">
              Title
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
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
              placeholder="Additional details..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-text-primary mb-1.5">
                Type
              </label>
              <Select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value as WorkItemType)}
              >
                <option value="feature">Feature</option>
                <option value="fix">Fix</option>
                <option value="refactor">Refactor</option>
                <option value="investigation">Investigation</option>
              </Select>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-text-primary mb-1.5">
                Status
              </label>
              <Select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as WorkItemStatus)}
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </Select>
            </div>
          </div>

          {repositories.length > 0 && (
            <div>
              <label htmlFor="repository" className="block text-sm font-medium text-text-primary mb-1.5">
                Repository (optional)
              </label>
              <Select
                id="repository"
                value={repositoryId}
                onChange={(e) => setRepositoryId(e.target.value)}
              >
                <option value="">No repository</option>
                {repositories.map((repo) => (
                  <option key={repo.id} value={repo.id}>
                    {repo.name}
                  </option>
                ))}
              </Select>
            </div>
          )}
        </div>

        <ModalFooter>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={!title.trim() || isLoading}>
            {isLoading ? "Saving..." : isEdit ? "Save Changes" : "Create Item"}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
