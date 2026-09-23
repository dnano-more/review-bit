import { prisma } from "@/lib/db";
import { getUserSubscription } from "@/features/billing/server/subscription";
import { getUsageSummary } from "@/features/billing/server/usage";
import { getInstallationStatus } from "@/features/github/server/installation";

export type DashboardOverviewData = {
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
  installation: {
    connected: boolean;
    accountLogin: string | null;
    installedAt: string | null;
  };
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
  recentPullRequests: {
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
  }[];
  syncedRepositories: {
    id: string;
    repoFullName: string;
    branch: string;
    status: string;
    chunkCount: number;
    syncedAt: string | null;
    updatedAt: string;
  }[];
};

export async function getDashboardOverview(userId: string): Promise<DashboardOverviewData> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const [installationStatus, subscription, usage] = await Promise.all([
    getInstallationStatus(userId),
    getUserSubscription(userId),
    getUsageSummary(userId),
  ]);

  const dbInstallation = await prisma.githubInstallation.findUnique({
    where: { userId },
    select: { installationId: true },
  });

  let totalReviewedPrs = 0;
  let totalPrs = 0;
  let inProgressPrs = 0;
  let syncedReposCount = 0;
  let totalCodeChunks = 0;
  let recentPullRequests: DashboardOverviewData["recentPullRequests"] = [];
  let syncedRepositories: DashboardOverviewData["syncedRepositories"] = [];

  if (dbInstallation?.installationId) {
    const installationId = dbInstallation.installationId;

    const [
      reviewedCount,
      allCount,
      inProgressCount,
      prs,
      syncs,
      syncedCount,
      chunkAgg,
    ] = await Promise.all([
      prisma.pullRequest.count({
        where: { installationId, status: "reviewed" },
      }),
      prisma.pullRequest.count({
        where: { installationId },
      }),
      prisma.pullRequest.count({
        where: {
          installationId,
          status: { in: ["pending", "processing"] },
        },
      }),
      prisma.pullRequest.findMany({
        where: { installationId },
        orderBy: { updatedAt: "desc" },
        take: 8,
      }),
      prisma.repoSync.findMany({
        where: { installationId },
        orderBy: { updatedAt: "desc" },
        take: 5,
      }),
      prisma.repoSync.count({
        where: { installationId, status: "synced" },
      }),
      prisma.repoSync.aggregate({
        where: { installationId },
        _sum: { chunkCount: true },
      }),
    ]);

    totalReviewedPrs = reviewedCount;
    totalPrs = allCount;
    inProgressPrs = inProgressCount;
    syncedReposCount = syncedCount;
    totalCodeChunks = chunkAgg._sum.chunkCount ?? 0;

    recentPullRequests = prs.map((pr) => ({
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

    syncedRepositories = syncs.map((s) => ({
      id: s.id,
      repoFullName: s.repoFullName,
      branch: s.branch,
      status: s.status,
      chunkCount: s.chunkCount,
      syncedAt: s.syncedAt ? s.syncedAt.toISOString() : null,
      updatedAt: s.updatedAt.toISOString(),
    }));
  }

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
    },
    installation: {
      connected: installationStatus.connected,
      accountLogin: installationStatus.accountLogin,
      installedAt: installationStatus.installedAt,
    },
    metrics: {
      totalReviewedPrs,
      totalPrs,
      inProgressPrs,
      syncedReposCount,
      totalCodeChunks,
      monthlyUsed: usage.used,
      monthlyLimit: usage.limit,
      plan: subscription.plan,
      subscriptionStatus: subscription.status,
    },
    recentPullRequests,
    syncedRepositories,
  };
}
