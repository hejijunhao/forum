import Link from "next/link";
import { FolderGit2, FileText, Settings2, ListTodo } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PRODUCT_COLORS, type ProductColor } from "@/lib/utils";

interface ProductCardProps {
  id: string;
  name: string;
  description?: string;
  color: ProductColor;
  repositoryCount?: number;
  workItemCount?: number;
  documentCount?: number;
  inProgressCount?: number;
}

export function ProductCard({
  id,
  name,
  description,
  color,
  repositoryCount = 0,
  workItemCount = 0,
  documentCount = 0,
  inProgressCount = 0,
}: ProductCardProps) {
  return (
    <Link href={`/products/${id}`}>
      <Card className="h-full cursor-pointer transition-all hover:border-text-muted">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <span
              className="mt-1 h-3 w-3 shrink-0 rounded-full"
              style={{ backgroundColor: PRODUCT_COLORS[color] }}
            />
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-text-primary truncate">{name}</h3>
              {description && (
                <p className="mt-1 text-sm text-text-secondary line-clamp-2">
                  {description}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-text-secondary">
            <div className="flex items-center gap-1.5">
              <FolderGit2 className="h-3.5 w-3.5" />
              <span>{repositoryCount} repos</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ListTodo className="h-3.5 w-3.5" />
              <span>{workItemCount} items</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5" />
              <span>{documentCount} docs</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Settings2 className="h-3.5 w-3.5" />
              <span>{inProgressCount} active</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
