"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  Plus,
  MoreHorizontal,
  FolderGit2,
  ListTodo,
  FileText,
  Settings2,
} from "lucide-react";
import {
  Button,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  EmptyState,
  LoadingSpinner,
  Badge,
} from "@/components/ui";
import { RepositoryCard, RepositoryForm } from "@/components/repositories";
import { WorkItemCard, WorkItemForm } from "@/components/work";
import { DocumentCard, DocumentForm } from "@/components/docs";
import { AppInfoCard, AppInfoForm } from "@/components/app-info";
import {
  useProduct,
  useRepositories,
  useWorkItems,
  useDocuments,
  useAppInfo,
  useCreateRepository,
  useCreateWorkItem,
  useCreateDocument,
  useCreateAppInfo,
} from "@/lib/hooks";
import { PRODUCT_COLORS } from "@/lib/utils";
import type {
  CreateRepository,
  CreateWorkItem,
  CreateDocument,
  CreateAppInfo,
} from "@/lib/types";

export default function ProductPage() {
  const params = useParams();
  const productId = params.id as string;

  const { data: product, isLoading: productLoading } = useProduct(productId);
  const { data: repositories = [] } = useRepositories(productId);
  const { data: workItems = [] } = useWorkItems(productId);
  const { data: documents = [] } = useDocuments(productId);
  const { data: appInfoItems = [] } = useAppInfo(productId);

  const createRepository = useCreateRepository();
  const createWorkItem = useCreateWorkItem();
  const createDocument = useCreateDocument();
  const createAppInfo = useCreateAppInfo();

  const [showRepoForm, setShowRepoForm] = useState(false);
  const [showWorkItemForm, setShowWorkItemForm] = useState(false);
  const [showDocForm, setShowDocForm] = useState(false);
  const [showAppInfoForm, setShowAppInfoForm] = useState(false);

  if (productLoading || !product) {
    return (
      <div className="flex h-full items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Group work items by status
  const todoItems = workItems.filter((w) => w.status === "todo");
  const inProgressItems = workItems.filter((w) => w.status === "in_progress");
  const doneItems = workItems.filter((w) => w.status === "done");

  // Group documents
  const pinnedDocs = documents.filter((d) => d.is_pinned);
  const otherDocs = documents.filter((d) => !d.is_pinned);

  // Group app info by category
  const envItems = appInfoItems.filter((a) => a.category === "env");
  const urlItems = appInfoItems.filter((a) => a.category === "url");
  const infraItems = appInfoItems.filter((a) => a.category === "infrastructure");
  const noteItems = appInfoItems.filter((a) => a.category === "note");

  const handleCreateRepo = async (data: CreateRepository) => {
    await createRepository.mutateAsync(data);
    setShowRepoForm(false);
  };

  const handleCreateWorkItem = async (data: CreateWorkItem) => {
    await createWorkItem.mutateAsync(data);
    setShowWorkItemForm(false);
  };

  const handleCreateDocument = async (data: CreateDocument) => {
    await createDocument.mutateAsync(data);
    setShowDocForm(false);
  };

  const handleCreateAppInfo = async (data: CreateAppInfo) => {
    await createAppInfo.mutateAsync(data);
    setShowAppInfoForm(false);
  };

  return (
    <div className="p-8">
      {/* Product header */}
      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-start gap-3">
          <span
            className="mt-2 h-4 w-4 rounded-full"
            style={{ backgroundColor: PRODUCT_COLORS[product.color] }}
          />
          <div>
            <h1 className="text-2xl font-semibold text-text-primary">
              {product.name}
            </h1>
            {product.description && (
              <p className="mt-1 text-text-secondary">{product.description}</p>
            )}
          </div>
        </div>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="work">Work</TabsTrigger>
          <TabsTrigger value="docs">Docs</TabsTrigger>
          <TabsTrigger value="app-info">App Info</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="space-y-8">
            {/* Repositories */}
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-text-primary">
                  Repositories
                </h2>
                <Button size="sm" onClick={() => setShowRepoForm(true)}>
                  <Plus className="h-4 w-4" />
                  Add Repo
                </Button>
              </div>

              {repositories.length === 0 ? (
                <EmptyState
                  icon={<FolderGit2 className="h-10 w-10" />}
                  title="No repositories"
                  description="Link repositories to this product."
                  action={
                    <Button size="sm" onClick={() => setShowRepoForm(true)}>
                      <Plus className="h-4 w-4" />
                      Add Repository
                    </Button>
                  }
                />
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {repositories.map((repo) => (
                    <RepositoryCard key={repo.id} repository={repo} />
                  ))}
                </div>
              )}
            </section>

            {/* Quick stats */}
            <section>
              <h2 className="mb-4 text-lg font-semibold text-text-primary">
                Quick Stats
              </h2>
              <div className="grid gap-4 sm:grid-cols-4">
                <div className="rounded-lg border border-border bg-surface p-4 text-center">
                  <div className="text-2xl font-semibold text-text-primary">
                    {workItems.length}
                  </div>
                  <div className="text-sm text-text-secondary">Work Items</div>
                </div>
                <div className="rounded-lg border border-border bg-surface p-4 text-center">
                  <div className="text-2xl font-semibold text-text-primary">
                    {inProgressItems.length}
                  </div>
                  <div className="text-sm text-text-secondary">In Progress</div>
                </div>
                <div className="rounded-lg border border-border bg-surface p-4 text-center">
                  <div className="text-2xl font-semibold text-text-primary">
                    {documents.length}
                  </div>
                  <div className="text-sm text-text-secondary">Documents</div>
                </div>
                <div className="rounded-lg border border-border bg-surface p-4 text-center">
                  <div className="text-2xl font-semibold text-text-primary">
                    {appInfoItems.length}
                  </div>
                  <div className="text-sm text-text-secondary">App Configs</div>
                </div>
              </div>
            </section>

            {/* Pinned docs */}
            {pinnedDocs.length > 0 && (
              <section>
                <h2 className="mb-4 text-lg font-semibold text-text-primary">
                  Pinned Documents
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {pinnedDocs.map((doc) => (
                    <DocumentCard key={doc.id} document={doc} />
                  ))}
                </div>
              </section>
            )}
          </div>
        </TabsContent>

        {/* Work Tab */}
        <TabsContent value="work">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text-primary">
              Work Items
            </h2>
            <Button size="sm" onClick={() => setShowWorkItemForm(true)}>
              <Plus className="h-4 w-4" />
              New Item
            </Button>
          </div>

          {workItems.length === 0 ? (
            <EmptyState
              icon={<ListTodo className="h-10 w-10" />}
              title="No work items"
              description="Create tasks, features, or bug fixes."
              action={
                <Button size="sm" onClick={() => setShowWorkItemForm(true)}>
                  <Plus className="h-4 w-4" />
                  Create Work Item
                </Button>
              }
            />
          ) : (
            <div className="space-y-6">
              {/* In Progress */}
              {inProgressItems.length > 0 && (
                <section>
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-text-secondary">
                    In Progress
                    <Badge variant="secondary">{inProgressItems.length}</Badge>
                  </h3>
                  <div className="space-y-2">
                    {inProgressItems.map((item) => (
                      <WorkItemCard
                        key={item.id}
                        workItem={item}
                        repositoryName={
                          repositories.find((r) => r.id === item.repository_id)?.name
                        }
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Todo */}
              {todoItems.length > 0 && (
                <section>
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-text-secondary">
                    To Do
                    <Badge variant="secondary">{todoItems.length}</Badge>
                  </h3>
                  <div className="space-y-2">
                    {todoItems.map((item) => (
                      <WorkItemCard
                        key={item.id}
                        workItem={item}
                        repositoryName={
                          repositories.find((r) => r.id === item.repository_id)?.name
                        }
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Done */}
              {doneItems.length > 0 && (
                <section>
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-text-secondary">
                    Done
                    <Badge variant="secondary">{doneItems.length}</Badge>
                  </h3>
                  <div className="space-y-2">
                    {doneItems.map((item) => (
                      <WorkItemCard
                        key={item.id}
                        workItem={item}
                        repositoryName={
                          repositories.find((r) => r.id === item.repository_id)?.name
                        }
                      />
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </TabsContent>

        {/* Docs Tab */}
        <TabsContent value="docs">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text-primary">
              Documentation
            </h2>
            <Button size="sm" onClick={() => setShowDocForm(true)}>
              <Plus className="h-4 w-4" />
              New Doc
            </Button>
          </div>

          {documents.length === 0 ? (
            <EmptyState
              icon={<FileText className="h-10 w-10" />}
              title="No documents"
              description="Create blueprints, architecture notes, or plans."
              action={
                <Button size="sm" onClick={() => setShowDocForm(true)}>
                  <Plus className="h-4 w-4" />
                  Create Document
                </Button>
              }
            />
          ) : (
            <div className="space-y-6">
              {pinnedDocs.length > 0 && (
                <section>
                  <h3 className="mb-3 text-sm font-medium text-text-secondary">
                    Pinned
                  </h3>
                  <div className="space-y-2">
                    {pinnedDocs.map((doc) => (
                      <DocumentCard key={doc.id} document={doc} />
                    ))}
                  </div>
                </section>
              )}

              {otherDocs.length > 0 && (
                <section>
                  <h3 className="mb-3 text-sm font-medium text-text-secondary">
                    All Documents
                  </h3>
                  <div className="space-y-2">
                    {otherDocs.map((doc) => (
                      <DocumentCard key={doc.id} document={doc} />
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </TabsContent>

        {/* App Info Tab */}
        <TabsContent value="app-info">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text-primary">App Info</h2>
            <Button size="sm" onClick={() => setShowAppInfoForm(true)}>
              <Plus className="h-4 w-4" />
              Add Entry
            </Button>
          </div>

          {appInfoItems.length === 0 ? (
            <EmptyState
              icon={<Settings2 className="h-10 w-10" />}
              title="No app info"
              description="Store environment variables, URLs, and infrastructure notes."
              action={
                <Button size="sm" onClick={() => setShowAppInfoForm(true)}>
                  <Plus className="h-4 w-4" />
                  Add Entry
                </Button>
              }
            />
          ) : (
            <div className="space-y-6">
              {envItems.length > 0 && (
                <section>
                  <h3 className="mb-3 text-sm font-medium text-text-secondary">
                    Environment Variables
                  </h3>
                  <div className="space-y-2">
                    {envItems.map((item) => (
                      <AppInfoCard key={item.id} appInfo={item} />
                    ))}
                  </div>
                </section>
              )}

              {urlItems.length > 0 && (
                <section>
                  <h3 className="mb-3 text-sm font-medium text-text-secondary">
                    Service URLs
                  </h3>
                  <div className="space-y-2">
                    {urlItems.map((item) => (
                      <AppInfoCard key={item.id} appInfo={item} />
                    ))}
                  </div>
                </section>
              )}

              {infraItems.length > 0 && (
                <section>
                  <h3 className="mb-3 text-sm font-medium text-text-secondary">
                    Infrastructure
                  </h3>
                  <div className="space-y-2">
                    {infraItems.map((item) => (
                      <AppInfoCard key={item.id} appInfo={item} />
                    ))}
                  </div>
                </section>
              )}

              {noteItems.length > 0 && (
                <section>
                  <h3 className="mb-3 text-sm font-medium text-text-secondary">
                    Notes
                  </h3>
                  <div className="space-y-2">
                    {noteItems.map((item) => (
                      <AppInfoCard key={item.id} appInfo={item} />
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Forms */}
      <RepositoryForm
        open={showRepoForm}
        onClose={() => setShowRepoForm(false)}
        onSubmit={handleCreateRepo}
        productId={productId}
        isLoading={createRepository.isPending}
      />

      <WorkItemForm
        open={showWorkItemForm}
        onClose={() => setShowWorkItemForm(false)}
        onSubmit={handleCreateWorkItem}
        productId={productId}
        repositories={repositories}
        isLoading={createWorkItem.isPending}
      />

      <DocumentForm
        open={showDocForm}
        onClose={() => setShowDocForm(false)}
        onSubmit={handleCreateDocument}
        productId={productId}
        isLoading={createDocument.isPending}
      />

      <AppInfoForm
        open={showAppInfoForm}
        onClose={() => setShowAppInfoForm(false)}
        onSubmit={handleCreateAppInfo}
        productId={productId}
        isLoading={createAppInfo.isPending}
      />
    </div>
  );
}
