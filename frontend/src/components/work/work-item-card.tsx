import { Wrench, Bug, RefreshCw, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/utils";
import type { WorkItem, WorkItemType } from "@/lib/types";

const typeIcons: Record<WorkItemType, typeof Wrench> = {
  feature: Wrench,
  fix: Bug,
  refactor: RefreshCw,
  investigation: Search,
};

const typeLabels: Record<WorkItemType, string> = {
  feature: "Feature",
  fix: "Fix",
  refactor: "Refactor",
  investigation: "Investigation",
};

interface WorkItemCardProps {
  workItem: WorkItem;
  repositoryName?: string;
  onClick?: () => void;
}

export function WorkItemCard({ workItem, repositoryName, onClick }: WorkItemCardProps) {
  const Icon = typeIcons[workItem.type];

  return (
    <Card
      className="cursor-pointer transition-all hover:border-text-muted"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 text-text-secondary">
            <Icon className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-medium text-text-primary">{workItem.title}</h4>
              <Badge variant={workItem.type}>{typeLabels[workItem.type]}</Badge>
            </div>
            {workItem.description && (
              <p className="mt-1 text-sm text-text-secondary line-clamp-2">
                {workItem.description}
              </p>
            )}
            <div className="mt-2 flex items-center gap-2 text-xs text-text-muted">
              {repositoryName && <span>{repositoryName}</span>}
              {repositoryName && <span>•</span>}
              <span>{formatRelativeTime(workItem.created_at)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
