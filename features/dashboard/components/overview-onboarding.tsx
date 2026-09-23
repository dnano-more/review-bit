"use client";

import Link from "next/link";
import { Check, Circle, ChevronRight, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DASHBOARD_ROUTES } from "@/features/dashboard/lib/routes";

type OverviewOnboardingProps = {
  connected: boolean;
  syncedReposCount: number;
  totalReviewedPrs: number;
  isPro: boolean;
};

export function OverviewOnboarding({
  connected,
  syncedReposCount,
  totalReviewedPrs,
  isPro,
}: OverviewOnboardingProps) {
  const steps = [
    {
      id: "connect",
      title: "Connect GitHub App",
      description: "Allow ReviewBit to listen to repository events.",
      completed: connected,
      href: DASHBOARD_ROUTES.github,
    },
    {
      id: "sync",
      title: "Sync Codebase Context",
      description: "Index your repository in Pinecone for semantic analysis.",
      completed: syncedReposCount > 0,
      href: DASHBOARD_ROUTES.repos,
    },
    {
      id: "pr",
      title: "Automate First PR Review",
      description: "Open any pull request on GitHub to trigger AI feedback.",
      completed: totalReviewedPrs > 0,
      href: DASHBOARD_ROUTES.repos,
    },
    {
      id: "pro",
      title: "Upgrade to Pro Tier",
      description: "Unlock unlimited monthly reviews and prioritized models.",
      completed: isPro,
      href: DASHBOARD_ROUTES.settings,
    },
  ];

  const completedCount = steps.filter((s) => s.completed).length;

  return (
    <Card className="border-border/80 shadow-xs">
      <CardHeader className="p-5 pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              Getting Started
            </CardTitle>
            <CardDescription className="text-xs">
              {completedCount} of {steps.length} steps completed
            </CardDescription>
          </div>
          <span className="text-xs font-mono font-medium text-muted-foreground">
            {Math.round((completedCount / steps.length) * 100)}%
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-1">
        <div className="space-y-2">
          {steps.map((step) => (
            <Link
              key={step.id}
              href={step.href}
              className={`flex items-start gap-3 rounded-lg p-2.5 transition-colors ${
                step.completed
                  ? "bg-muted/30 opacity-70 hover:opacity-100"
                  : "bg-muted/60 hover:bg-muted"
              }`}
            >
              <div
                className={`flex size-5 shrink-0 items-center justify-center rounded-full mt-0.5 ${
                  step.completed
                    ? "bg-emerald-500 text-white"
                    : "border border-muted-foreground/40 text-transparent"
                }`}
              >
                {step.completed ? <Check className="size-3" /> : <Circle className="size-2" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p
                    className={`text-xs font-medium leading-none ${
                      step.completed ? "line-through text-muted-foreground" : "text-foreground"
                    }`}
                  >
                    {step.title}
                  </p>
                  <ChevronRight className="size-3 text-muted-foreground shrink-0 ml-1" />
                </div>
                <p className="text-[11px] text-muted-foreground mt-1 leading-normal">
                  {step.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
