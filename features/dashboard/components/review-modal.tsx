"use client";

import { useState } from "react";
import {
  ExternalLink,
  Sparkles,
  Copy,
  Check,
  FileText,
  Code,
  GitPullRequest,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MarkdownReviewRenderer } from "./markdown-review-renderer";

type ReviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  pr: {
    title: string;
    repoFullName: string;
    prNumber: number;
    reviewedAt: string | null;
    reviewComment: string | null;
  } | null;
};

export function ReviewModal({ isOpen, onClose, pr }: ReviewModalProps) {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<"formatted" | "raw">("formatted");

  if (!pr) return null;

  const githubPrUrl = `https://github.com/${pr.repoFullName}/pull/${pr.prNumber}`;

  const handleCopyAll = () => {
    if (pr.reviewComment) {
      navigator.clipboard.writeText(pr.reviewComment);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl max-h-[88vh] flex flex-col p-0 gap-0 overflow-hidden shadow-2xl border-border">
        {/* Modal Header */}
        <DialogHeader className="p-5 border-b border-border bg-muted/30">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pr-8">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Sparkles className="size-4" />
                </span>
                <DialogTitle className="text-base font-semibold text-foreground">
                  AI Code Review
                </DialogTitle>
                <span className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs font-semibold text-primary border border-border/80">
                  #{pr.prNumber}
                </span>
              </div>
              <DialogDescription className="text-xs text-muted-foreground flex items-center gap-1.5 flex-wrap">
                <span className="font-medium text-foreground">{pr.repoFullName}</span>
                <span>•</span>
                <span className="truncate max-w-[340px] sm:max-w-md">{pr.title}</span>
              </DialogDescription>
            </div>

            {/* Top Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              {pr.reviewComment && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopyAll}
                  className="h-8 gap-1.5 text-xs"
                >
                  {copied ? (
                    <>
                      <Check className="size-3.5 text-emerald-500" />
                      <span className="text-emerald-500 font-medium">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="size-3.5" />
                      <span>Copy Review</span>
                    </>
                  )}
                </Button>
              )}

              <Button size="sm" variant="default" asChild className="h-8 gap-1.5 text-xs shadow-xs">
                <a href={githubPrUrl} target="_blank" rel="noopener noreferrer">
                  <span>Open PR</span>
                  <ExternalLink className="size-3.5" />
                </a>
              </Button>
            </div>
          </div>

          {/* View Mode Switcher */}
          {pr.reviewComment && (
            <div className="flex items-center justify-between pt-3 mt-1 border-t border-border/50 text-xs">
              <div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded-lg border border-border/60">
                <button
                  type="button"
                  onClick={() => setViewMode("formatted")}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    viewMode === "formatted"
                      ? "bg-background text-foreground shadow-2xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <FileText className="size-3" />
                  Formatted View
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("raw")}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    viewMode === "raw"
                      ? "bg-background text-foreground shadow-2xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Code className="size-3" />
                  Raw Markdown
                </button>
              </div>

              {pr.reviewedAt && (
                <span className="text-[11px] text-muted-foreground">
                  Reviewed on {new Date(pr.reviewedAt).toLocaleDateString()} at{" "}
                  {new Date(pr.reviewedAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              )}
            </div>
          )}
        </DialogHeader>

        {/* Modal Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto max-h-[64vh] space-y-4">
          {!pr.reviewComment ? (
            <div className="flex flex-col items-center justify-center py-12 text-center gap-3 text-muted-foreground">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                <GitPullRequest className="size-6" />
              </div>
              <p className="text-sm font-medium text-foreground">No review comment available</p>
              <p className="text-xs text-muted-foreground max-w-sm">
                This pull request is either queued or processing. The review feedback will be
                recorded here once completed.
              </p>
            </div>
          ) : viewMode === "formatted" ? (
            <MarkdownReviewRenderer markdown={pr.reviewComment} />
          ) : (
            <div className="rounded-xl border border-border bg-zinc-950 p-4 font-mono text-xs leading-relaxed text-zinc-100 overflow-x-auto">
              <pre className="whitespace-pre-wrap">{pr.reviewComment}</pre>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
