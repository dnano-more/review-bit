import type { Metadata } from "next";
import Link from "next/link";
import { FolderGit2, Settings, Sparkles } from "lucide-react";
import { GitHubIcon } from "@/features/auth/components/github-sign-in-form";
import { requiredAuth } from "@/features/auth/actions";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import { DASHBOARD_ROUTES } from "@/features/dashboard/lib/routes";
import { getDashboardOverview } from "@/features/dashboard/server/get-overview";
import { OverviewGithubBanner } from "@/features/dashboard/components/overview-github-banner";
import { OverviewMetrics } from "@/features/dashboard/components/overview-metrics";
import { OverviewPrList } from "@/features/dashboard/components/overview-pr-list";
import { OverviewSyncedRepos } from "@/features/dashboard/components/overview-synced-repos";
import { OverviewOnboarding } from "@/features/dashboard/components/overview-onboarding";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Overview · ReviewBit Dashboard",
};

export default async function DashboardPage() {
  const session = await requiredAuth();
  const overview = await getDashboardOverview(session.user.id);

  const isPro =
    overview.metrics.plan === "pro" &&
    overview.metrics.subscriptionStatus === "active";

  return (
    <>
      <DashboardHeader
        title="Overview"
        description="Monitor automated AI code reviews, synced repositories, and usage."
      >
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild className="hidden sm:inline-flex text-xs h-8">
            <Link href={DASHBOARD_ROUTES.repos} className="gap-1.5">
              <FolderGit2 className="size-3.5" />
              Repositories
            </Link>
          </Button>
          {!overview.installation.connected ? (
            <Button size="sm" asChild className="text-xs h-8 shadow-xs">
              <Link href={DASHBOARD_ROUTES.github} className="gap-1.5">
                <GitHubIcon className="size-3.5" />
                Connect GitHub
              </Link>
            </Button>
          ) : (
            <Button size="sm" variant="default" asChild className="text-xs h-8 shadow-xs">
              <Link href={DASHBOARD_ROUTES.settings} className="gap-1.5">
                <Settings className="size-3.5" />
                Settings
              </Link>
            </Button>
          )}
        </div>
      </DashboardHeader>

      <main className="flex-1 space-y-6 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
        {/* GitHub Connection Status Alert/Banner */}
        <OverviewGithubBanner
          connected={overview.installation.connected}
          accountLogin={overview.installation.accountLogin}
        />

        {/* 4 Metric KPI Cards */}
        <OverviewMetrics metrics={overview.metrics} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Recent Pull Request Reviews (Main) */}
          <div className="lg:col-span-8 space-y-6">
            <OverviewPrList pullRequests={overview.recentPullRequests} />
          </div>

          {/* Sidebar Area: Getting Started & Synced Repos */}
          <div className="lg:col-span-4 space-y-6">
            <OverviewOnboarding
              connected={overview.installation.connected}
              syncedReposCount={overview.metrics.syncedReposCount}
              totalReviewedPrs={overview.metrics.totalReviewedPrs}
              isPro={isPro}
            />

            <OverviewSyncedRepos
              syncedRepositories={overview.syncedRepositories}
              totalSyncedCount={overview.metrics.syncedReposCount}
            />
          </div>
        </div>
      </main>
    </>
  );
}