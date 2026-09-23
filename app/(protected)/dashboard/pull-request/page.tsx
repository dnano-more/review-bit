import type { Metadata } from "next";
import Link from "next/link";
import { GitHubIcon } from "@/features/auth/components/github-sign-in-form";
import { requiredAuth } from "@/features/auth/actions";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import { DASHBOARD_ROUTES } from "@/features/dashboard/lib/routes";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { PullRequestsPageContent } from "@/features/dashboard/components/pull-requests-page-content";

export const metadata: Metadata = {
  title: "Pull Requests · ReviewBit Dashboard",
};

export default async function DashboardPullRequestsPage() {
  const session = await requiredAuth();

  const installation = await prisma.githubInstallation.findUnique({
    where: { userId: session.user.id },
  });

  const header = (
    <DashboardHeader
      title="Pull Requests"
      description="Track and inspect all AI code reviews across your repositories."
    />
  );

  if (!installation) {
    return (
      <>
        {header}
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <GithubIcon className="size-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-foreground">
              GitHub App Not Connected
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm">
              Connect your GitHub account to see pull requests and automated reviews.
            </p>
          </div>
          <Button asChild>
            <Link href={DASHBOARD_ROUTES.github}>Go to GitHub Settings</Link>
          </Button>
        </div>
      </>
    );
  }

  const rawPrs = await prisma.pullRequest.findMany({
    where: { installationId: installation.installationId },
    orderBy: { updatedAt: "desc" },
  });

  const pullRequests = rawPrs.map((pr) => ({
    id: pr.id,
    repoFullName: pr.repoFullName,
    prNumber: pr.prNumber,
    title: pr.title,
    authorLogin: pr.authorLogin,
    baseBranch: pr.baseBranch,
    status: pr.status,
    reviewComment: pr.reviewComment,
    reviewedAt: pr.reviewedAt ? pr.reviewedAt.toISOString() : null,
    createdAt: pr.createdAt.toISOString(),
  }));

  return (
    <>
      {header}
      <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
        <PullRequestsPageContent pullRequests={pullRequests} />
      </main>
    </>
  );
}
