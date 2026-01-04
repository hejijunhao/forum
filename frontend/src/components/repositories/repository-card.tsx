import { ExternalLink, Star, GitFork } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Repository } from "@/lib/types";

interface RepositoryCardProps {
  repository: Repository;
}

export function RepositoryCard({ repository }: RepositoryCardProps) {
  return (
    <Card className="transition-all hover:border-text-muted">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h4 className="font-medium text-text-primary">{repository.name}</h4>
            <a
              href={repository.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 flex items-center gap-1 text-sm text-text-secondary hover:text-accent"
            >
              <span className="truncate">{repository.url}</span>
              <ExternalLink className="h-3 w-3 shrink-0" />
            </a>
          </div>
        </div>

        {repository.description && (
          <p className="mt-2 text-sm text-text-secondary line-clamp-2">
            {repository.description}
          </p>
        )}

        <div className="mt-3 flex items-center gap-3">
          {repository.language && (
            <Badge variant="secondary">{repository.language}</Badge>
          )}
          {typeof repository.stars === "number" && (
            <div className="flex items-center gap-1 text-sm text-text-muted">
              <Star className="h-3.5 w-3.5" />
              <span>{repository.stars}</span>
            </div>
          )}
          {typeof repository.forks === "number" && (
            <div className="flex items-center gap-1 text-sm text-text-muted">
              <GitFork className="h-3.5 w-3.5" />
              <span>{repository.forks}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
