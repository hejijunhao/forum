"use client";

import { useState } from "react";
import { Copy, Check, Eye, EyeOff, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AppInfo, AppInfoCategory } from "@/lib/types";

const categoryLabels: Record<AppInfoCategory, string> = {
  env: "Environment",
  url: "URL",
  infrastructure: "Infrastructure",
  note: "Note",
};

interface AppInfoCardProps {
  appInfo: AppInfo;
}

export function AppInfoCard({ appInfo }: AppInfoCardProps) {
  const [copied, setCopied] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(appInfo.value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayValue = appInfo.is_secret && !revealed
    ? "••••••••••••"
    : appInfo.value;

  const isUrl = appInfo.category === "url" || appInfo.value.startsWith("http");

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-mono text-sm font-medium text-text-primary">
                {appInfo.key}
              </h4>
              <Badge variant="secondary">{categoryLabels[appInfo.category]}</Badge>
              {appInfo.is_secret && (
                <Badge variant="warning">Secret</Badge>
              )}
            </div>

            <div className="mt-2 flex items-center gap-2">
              <code className="flex-1 rounded bg-background px-2 py-1 font-mono text-sm text-text-secondary truncate">
                {displayValue}
              </code>

              <div className="flex shrink-0 gap-1">
                {appInfo.is_secret && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setRevealed(!revealed)}
                  >
                    {revealed ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                )}

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-success" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>

                {isUrl && !appInfo.is_secret && (
                  <a
                    href={appInfo.value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-text-secondary hover:bg-surface hover:text-text-primary transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
