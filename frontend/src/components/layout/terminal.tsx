"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronUp, ChevronDown, Command, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface TerminalProps {
  className?: string;
}

export function Terminal({ className }: TerminalProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState("");
  const [showResponse, setShowResponse] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setShowResponse(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsExpanded(false);
      setShowResponse(false);
    }
  };

  return (
    <div
      className={cn(
        "border-t border-border bg-terminal-bg text-terminal-text transition-all duration-200",
        isExpanded ? "h-60" : "h-12",
        className
      )}
    >
      {/* Collapsed state */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="flex h-full w-full items-center gap-3 px-4 text-sm transition-colors hover:bg-white/5"
        >
          <span className="text-accent">{">"}_</span>
          <span className="text-text-muted">Ask your agent anything...</span>
          <div className="ml-auto flex items-center gap-2 text-xs text-text-muted">
            <kbd className="rounded border border-zinc-700 bg-zinc-800 px-1.5 py-0.5">
              <Command className="inline h-3 w-3" />K
            </kbd>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(true);
              }}
              className="rounded p-1 hover:bg-white/10"
            >
              <ChevronUp className="h-4 w-4" />
            </button>
          </div>
        </button>
      )}

      {/* Expanded state */}
      {isExpanded && (
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Sparkles className="h-4 w-4 text-accent" />
              <span>Forum Agent</span>
              <span className="rounded bg-accent/20 px-1.5 py-0.5 text-xs text-accent">
                Preview
              </span>
            </div>
            <button
              onClick={() => {
                setIsExpanded(false);
                setShowResponse(false);
              }}
              className="rounded p-1 text-text-muted hover:bg-white/10 hover:text-terminal-text"
            >
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>

          {/* Content area */}
          <div className="flex-1 overflow-y-auto p-4 font-mono text-sm">
            {!showResponse ? (
              <div className="text-text-muted">
                <p>Welcome to Forum Agent (Phase 1 Preview)</p>
                <p className="mt-2">
                  This is where you&apos;ll interact with your AI assistant.
                </p>
                <p>Full agent capabilities coming in Phase 2.</p>
                <p className="mt-4">Try typing a command to see what&apos;s possible...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <span className="text-accent">{">"}</span>
                  <span>{input}</span>
                </div>
                <div className="rounded-md border border-zinc-800 bg-zinc-900/50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-accent/20 p-1.5">
                      <Sparkles className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium">Agent functionality coming soon!</p>
                      <p className="mt-2 text-text-muted">In Phase 2, you&apos;ll be able to:</p>
                      <ul className="mt-2 list-inside list-disc space-y-1 text-text-muted">
                        <li>Query your work history</li>
                        <li>Create tasks with natural language</li>
                        <li>Get context-aware suggestions</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input area */}
          <form onSubmit={handleSubmit} className="border-t border-zinc-800 p-4">
            <div className="flex items-center gap-2 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2">
              <span className="text-accent">{">"}_</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="What did I work on this week?"
                className="flex-1 bg-transparent text-sm placeholder:text-text-muted focus:outline-none"
              />
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
