"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  ExternalLink,
  GitBranch,
  GitPullRequest,
  Loader2,
  Search,
  Sparkles,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { statusBadge } from "@/features/dashboard/lib/status-style";
import { ReviewModal } from "./review-modal";
import { DASHBOARD_ROUTES } from "@/features/dashboard/lib/routes";

type PullRequestItem = {
  id: string;
  repoFullName: string;
  prNumber: number;
  title: string;
  authorLogin: string | null;
  baseBranch: string;
  status: string;
  reviewComment: string | null;
  reviewedAt: string | null;
  createdAt: string;
};

type PullRequestsPageContentProps = {
  pullRequests: PullRequestItem[];
};

type StatusFilter = "all" | "reviewed" | "processing" | "pending" | "rate_limited";

export function PullRequestsPageContent({ pullRequests }: PullRequestsPageContentProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [selectedPr, setSelectedPr] = useState<PullRequestItem | null>(null);

  const filtered = useMemo(() => {
    return pullRequests.filter((pr) => {
      if (filter !== "all" && pr.status !== filter) {
        return false;
      }

      if (search.trim()) {
        const query = search.toLowerCase();
        const matchesTitle = pr.title.toLowerCase().includes(query);
        const matchesRepo = pr.repoFullName.toLowerCase().includes(query);
        const matchesAuthor = pr.authorLogin?.toLowerCase().includes(query) ?? false;
        const matchesNumber = pr.prNumber.toString().includes(query);
        return matchesTitle || matchesRepo || matchesAuthor || matchesNumber;
      }

      return true;
    });
  }, [pullRequests, filter, search]);

  const counts = {
    all: pullRequests.length,
    reviewed: pullRequests.filter((p) => p.status === "reviewed").length,
    processing: pullRequests.filter((p) => p.status === "processing").length,
    pending: pullRequests.filter((p) => p.status === "pending").length,
    rate_limited: pullRequests.filter((p) => p.status === "rate_limited").length,
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search by repo, title, author or #number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <Button
            size="sm"
            variant={filter === "all" ? "secondary" : "ghost"}
            onClick={() => setFilter("all")}
            className="h-8 text-xs px-2.5"
          >
            All ({counts.all})
          </Button>
          <Button
            size="sm"
            variant={filter === "reviewed" ? "secondary" : "ghost"}
            onClick={() => setFilter("reviewed")}
            className="h-8 text-xs px-2.5"
          >
            Reviewed ({counts.reviewed})
          </Button>
          <Button
            size="sm"
            variant={filter === "processing" ? "secondary" : "ghost"}
            onClick={() => setFilter("processing")}
            className="h-8 text-xs px-2.5"
          >
            Processing ({counts.processing})
          </Button>
          <Button
            size="sm"
            variant={filter === "pending" ? "secondary" : "ghost"}
            onClick={() => setFilter("pending")}
            className="h-8 text-xs px-2.5"
          >
            Queued ({counts.pending})
          </Button>
          {counts.rate_limited > 0 && (
            <Button
              size="sm"
              variant={filter === "rate_limited" ? "secondary" : "ghost"}
              onClick={() => setFilter("rate_limited")}
              className="h-8 text-xs px-2.5 text-red-600 dark:text-red-400"
            >
              Limit ({counts.rate_limited})
            </Button>
          )}
        </div>
      </div>

      {/* Main Table / List */}
      <Card className="border-border/80 shadow-xs">
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <GitPullRequest className="size-10 text-muted-foreground opacity-30 mb-3" />
              <p className="text-sm font-medium text-foreground">No pull requests found</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                {search || filter !== "all"
                  ? "Try adjusting your search query or status filter."
                  : "Open a pull request on any connected repository to start receiving AI reviews."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {filtered.map((pr) => {
                const isReviewed = pr.status === "reviewed";
                const isProcessing = pr.status === "processing";
                const isPending = pr.status === "pending";
                const isRateLimited = pr.status === "rate_limited";
                const githubPrUrl = `https://github.com/${pr.repoFullName}/pull/${pr.prNumber}`;

                return (
                  <div
                    key={pr.id}
                    className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between transition-colors hover:bg-muted/30"
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-semibold text-primary">
                          #{pr.prNumber}
                        </span>
                        <a
                          href={githubPrUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-sm text-foreground hover:underline truncate max-w-lg"
                        >
                          {pr.title}
                        </a>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                        <span className="font-semibold text-foreground/80">{pr.repoFullName}</span>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1">
                          <GitBranch className="size-3" />
                          {pr.baseBranch}
                        </span>
                        {pr.authorLogin && (
                          <>
                            <span>•</span>
                            <span>@{pr.authorLogin}</span>
                          </>
                        )}
                        <span>•</span>
                        <span>
                          {formatDistanceToNow(new Date(pr.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-start sm:self-center">
                      {isReviewed && (
                        <span className={statusBadge("success", "gap-1 text-xs")}>
                          <CheckCircle2 className="size-3" />
                          Reviewed
                        </span>
                      )}
                      {isProcessing && (
                        <span className={statusBadge("warning", "gap-1 text-xs")}>
                          <Loader2 className="size-3 animate-spin" />
                          Processing
                        </span>
                      )}
                      {isPending && (
                        <span className={statusBadge("neutral", "gap-1 text-xs")}>
                          <Clock className="size-3" />
                          Queued
                        </span>
                      )}
                      {isRateLimited && (
                        <span className={statusBadge("danger", "gap-1 text-xs")}>
                          <AlertCircle className="size-3" />
                          Rate Limited
                        </span>
                      )}

                      {pr.reviewComment ? (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setSelectedPr(pr)}
                          className="h-8 text-xs gap-1.5 shadow-xs"
                        >
                          <Sparkles className="size-3.5 text-primary" />
                          View AI Review
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" asChild className="h-8 text-xs">
                          <a href={githubPrUrl} target="_blank" rel="noopener noreferrer">
                            <span>Open PR</span>
                            <ExternalLink className="size-3 ml-1" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <ReviewModal
        isOpen={Boolean(selectedPr)}
        onClose={() => setSelectedPr(null)}
        pr={selectedPr}
      />
    </div>
  );
}
