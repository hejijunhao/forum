import { FileText, Pin, BookOpen, Layout, FileCode, ScrollText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/utils";
import type { Document, DocumentType } from "@/lib/types";

const typeIcons: Record<DocumentType, typeof FileText> = {
  blueprint: Layout,
  architecture: BookOpen,
  note: ScrollText,
  plan: FileCode,
};

const typeLabels: Record<DocumentType, string> = {
  blueprint: "Blueprint",
  architecture: "Architecture",
  note: "Note",
  plan: "Plan",
};

interface DocumentCardProps {
  document: Document;
  onClick?: () => void;
}

export function DocumentCard({ document, onClick }: DocumentCardProps) {
  const Icon = typeIcons[document.type];

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
              <div className="flex items-center gap-2">
                {document.is_pinned && (
                  <Pin className="h-3 w-3 text-accent" />
                )}
                <h4 className="font-medium text-text-primary">{document.title}</h4>
              </div>
              <Badge variant="secondary">{typeLabels[document.type]}</Badge>
            </div>
            {document.content && (
              <p className="mt-1 text-sm text-text-secondary line-clamp-2">
                {document.content.slice(0, 150)}...
              </p>
            )}
            <div className="mt-2 text-xs text-text-muted">
              Updated {formatRelativeTime(document.updated_at)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
