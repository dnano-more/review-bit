"use client";

import Link from "next/link";
import { CheckCircle2, ExternalLink, Sparkles } from "lucide-react";
import { GitHubIcon } from "@/features/auth/components/github-sign-in-form";
import { Button } from "@/components/ui/button";
import { DASHBOARD_ROUTES } from "@/features/dashboard/lib/routes";

type OverviewGithubBannerProps = {
  connected: boolean;
  accountLogin: string | null;
};

export function OverviewGithubBanner({
  connected,
  accountLogin,
}: OverviewGithubBannerProps) {
  if (!connected) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
              <GithubIcon className="size-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">
                  Connect your GitHub Account
                </span>
                <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-400">
                  Required
                </span>
              </div>
              <p className="text-sm text-muted-foreground max-w-xl">
                ReviewBit needs access to your GitHub repositories to automatically review pull requests and provide AI-powered code feedback.
              </p>
            </div>
          </div>
          <div className="shrink-0">
            <Button asChild className="w-full sm:w-auto shadow-sm">
              <Link href={DASHBOARD_ROUTES.github} className="gap-2">
                <GithubIcon className="size-4" />
                Install GitHub App
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-r from-emerald-500/10 via-background to-background p-4 sm:p-5 shadow-xs">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="relative flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="size-5" />
            <span className="absolute -top-0.5 -right-0.5 flex size-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">
                GitHub App Active
              </span>
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                Listening to Webhooks
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Connected to account{" "}
              <span className="font-semibold text-foreground">@{accountLogin}</span>. Any new PR or commit will trigger an automatic review.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild className="text-xs">
            <Link href={DASHBOARD_ROUTES.repos} className="gap-1.5">
              <Sparkles className="size-3.5 text-primary" />
              Manage Repos
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild className="text-xs">
            <Link href={DASHBOARD_ROUTES.github} className="gap-1.5">
              Settings
              <ExternalLink className="size-3" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
