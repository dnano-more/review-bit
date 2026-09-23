"use client";

import Link from "next/link";
import { CheckCircle2, Database, ExternalLink, FolderGit2, Loader2, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DASHBOARD_ROUTES } from "@/features/dashboard/lib/routes";
import { statusBadge } from "@/features/dashboard/lib/status-style";

type SyncedRepoItem = {
  id: string;
  repoFullName: string;
  branch: string;
  status: string;
  chunkCount: number;
  syncedAt: string | null;
  updatedAt: string;
};

type OverviewSyncedReposProps = {
  syncedRepositories: SyncedRepoItem[];
  totalSyncedCount: number;
};

export function OverviewSyncedRepos({
  syncedRepositories,
  totalSyncedCount,
}: OverviewSyncedReposProps) {
  return (
    <Card className="border-border/80 shadow-xs">
      <CardHeader className="p-5 pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Database className="size-4 text-primary" />
              Indexed Codebases
            </CardTitle>
            <CardDescription className="text-xs">
              Context indexed in Pinecone for semantic reviews.
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild className="h-7 text-xs">
            <Link href={DASHBOARD_ROUTES.repos} className="gap-1">
              View All
              <ExternalLink className="size-3" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-5 pt-1">
        {syncedRepositories.length === 0 ? (
          <div className="py-6 text-center text-xs text-muted-foreground space-y-2">
            <FolderGit2 className="size-8 mx-auto opacity-40 text-muted-foreground" />
            <p>No repository codebases indexed yet.</p>
            <Button size="sm" variant="outline" asChild className="h-7 text-xs">
              <Link href={DASHBOARD_ROUTES.repos} className="gap-1.5">
                <Sparkles className="size-3 text-primary" />
                Sync First Repo
              </Link>
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {syncedRepositories.map((repo) => {
              const isSynced = repo.status === "synced";
              const isSyncing = repo.status === "syncing";

              return (
                <div
                  key={repo.id}
                  className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <p className="text-xs font-medium text-foreground truncate">
                      {repo.repoFullName}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Branch: <span className="font-mono">{repo.branch}</span> • {repo.chunkCount} chunks
                    </p>
                  </div>
                  <div>
                    {isSynced ? (
                      <span className={statusBadge("success", "text-[10px] py-0 px-2 gap-1")}>
                        <CheckCircle2 className="size-2.5" />
                        Synced
                      </span>
                    ) : isSyncing ? (
                      <span className={statusBadge("warning", "text-[10px] py-0 px-2 gap-1")}>
                        <Loader2 className="size-2.5 animate-spin" />
                        Syncing
                      </span>
                    ) : (
                      <span className={statusBadge("neutral", "text-[10px] py-0 px-2")}>
                        {repo.status}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
