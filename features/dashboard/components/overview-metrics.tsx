"use client";

import Link from "next/link";
import {
  CheckCircle2,
  Database,
  GitPullRequest,
  Hourglass,
  Sparkles,
  Zap,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DASHBOARD_ROUTES } from "@/features/dashboard/lib/routes";

type OverviewMetricsProps = {
  metrics: {
    totalReviewedPrs: number;
    totalPrs: number;
    inProgressPrs: number;
    syncedReposCount: number;
    totalCodeChunks: number;
    monthlyUsed: number;
    monthlyLimit: number | null;
    plan: "free" | "pro";
    subscriptionStatus: "active" | "canceled" | "trialing";
  };
};

export function OverviewMetrics({ metrics }: OverviewMetricsProps) {
  const isPro = metrics.plan === "pro" && metrics.subscriptionStatus === "active";
  const usagePercentage = metrics.monthlyLimit
    ? Math.min(100, Math.round((metrics.monthlyUsed / metrics.monthlyLimit) * 100))
    : 0;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* 1. Total Reviews Done */}
      <Card className="relative overflow-hidden border-border/80 shadow-xs transition-all hover:border-border hover:shadow-md">
        <div className="absolute top-0 right-0 h-16 w-16 translate-x-4 -translate-y-4 rounded-full bg-emerald-500/10 blur-xl pointer-events-none" />
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              PRs Reviewed
            </span>
            <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold tracking-tight text-foreground">
              {metrics.totalReviewedPrs}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">{metrics.totalPrs}</span>{" "}
              total events recorded
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Monthly Quota / Plan Usage */}
      <Card className="relative overflow-hidden border-border/80 shadow-xs transition-all hover:border-border hover:shadow-md">
        <div className="absolute top-0 right-0 h-16 w-16 translate-x-4 -translate-y-4 rounded-full bg-primary/10 blur-xl pointer-events-none" />
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Monthly Usage
            </span>
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Zap className="size-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-bold tracking-tight text-foreground">
                {metrics.monthlyUsed}
              </div>
              <span className="text-xs text-muted-foreground">
                {isPro ? "/ Unlimited" : `/ ${metrics.monthlyLimit ?? 5} free reviews`}
              </span>
            </div>

            {!isPro ? (
              <div className="mt-2.5 space-y-1">
                <Progress value={usagePercentage} className="h-1.5" />
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{usagePercentage}% used</span>
                  <Link
                    href={DASHBOARD_ROUTES.settings}
                    className="font-medium text-primary hover:underline"
                  >
                    Upgrade
                  </Link>
                </div>
              </div>
            ) : (
              <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                <Sparkles className="size-3.5" />
                Pro tier active
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 3. Synced Repositories & Knowledge Base */}
      <Card className="relative overflow-hidden border-border/80 shadow-xs transition-all hover:border-border hover:shadow-md">
        <div className="absolute top-0 right-0 h-16 w-16 translate-x-4 -translate-y-4 rounded-full bg-blue-500/10 blur-xl pointer-events-none" />
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Codebase Index
            </span>
            <div className="flex size-9 items-center justify-center rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400">
              <Database className="size-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold tracking-tight text-foreground">
              {metrics.syncedReposCount}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">
                {metrics.totalCodeChunks.toLocaleString()}
              </span>{" "}
              vector chunks indexed
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. Active / In-Flight Reviews */}
      <Card className="relative overflow-hidden border-border/80 shadow-xs transition-all hover:border-border hover:shadow-md">
        <div className="absolute top-0 right-0 h-16 w-16 translate-x-4 -translate-y-4 rounded-full bg-amber-500/10 blur-xl pointer-events-none" />
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              In-Flight Reviews
            </span>
            <div className="flex size-9 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <Hourglass className="size-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold tracking-tight text-foreground">
              {metrics.inProgressPrs}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              {metrics.inProgressPrs > 0 ? (
                <span className="text-amber-600 dark:text-amber-400 font-medium">
                  Processing through Inngest
                </span>
              ) : (
                "Queue idle, ready for PRs"
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
