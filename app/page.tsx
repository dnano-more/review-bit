import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Bot,
  Check,
  CheckCircle2,
  Database,
  GitBranch,
  Lock,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { getServerSession } from "@/features/auth/actions";
import { GitHubIcon } from "@/features/auth/components/github-sign-in-form";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DASHBOARD_ROUTES } from "@/features/dashboard/lib/routes";

export default async function HomePage() {
  const session = await getServerSession();
  const isAuthenticated = Boolean(session?.user);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
      {/* 1. Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
              <Image
                src="/review-bit-eye-logo.svg"
                alt="ReviewBit Logo"
                width={22}
                height={22}
                className="object-contain"
                priority
              />
            </span>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-foreground">
                Review<span className="text-primary">Bit</span>
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#how-it-works" className="transition-colors hover:text-foreground">
              How It Works
            </a>
            <a href="#features" className="transition-colors hover:text-foreground">
              Features
            </a>
            <a href="#pricing" className="transition-colors hover:text-foreground">
              Pricing
            </a>
          </nav>

          <div className="flex items-center gap-2.5">
            <ModeToggle />
            {isAuthenticated ? (
              <Button asChild size="sm" className="gap-1.5 shadow-xs font-medium">
                <Link href={DASHBOARD_ROUTES.overview}>
                  <span>Dashboard</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm" className="text-xs hidden sm:inline-flex">
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                <Button asChild size="sm" className="gap-2 shadow-xs text-xs font-medium">
                  <Link href="/sign-in">
                    <GitHubIcon className="size-3.5" />
                    <span>Get Started</span>
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* 2. Hero Section */}
        <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-32">
          {/* Subtle background grid pattern */}
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:32px_32px] opacity-40 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
          <div className="absolute top-12 left-1/2 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />

          <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary mb-6 shadow-2xs backdrop-blur-sm">
              <Sparkles className="size-3.5 animate-pulse" />
              <span>Automated GitHub Code Reviews</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-foreground text-balance">
              Instant, Intelligent Code Reviews for Every Pull Request
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg md:text-xl leading-relaxed text-balance">
              ReviewBit listens to your GitHub PR events, evaluates diffs for bugs, security risks,
              and performance bottlenecks, and delivers actionable markdown feedback in seconds.
            </p>

            <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              {isAuthenticated ? (
                <Button asChild size="lg" className="w-full sm:w-auto gap-2 shadow-md h-11 px-6 font-medium">
                  <Link href={DASHBOARD_ROUTES.overview}>
                    <span>Open Dashboard</span>
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              ) : (
                <Button asChild size="lg" className="w-full sm:w-auto gap-2.5 shadow-md h-11 px-6 font-medium">
                  <Link href="/sign-in">
                    <GitHubIcon className="size-4" />
                    <span>Start for Free with GitHub</span>
                  </Link>
                </Button>
              )}
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto h-11 px-6">
                <a href="#how-it-works" className="gap-1.5">
                  <span>How It Works</span>
                  <ArrowRight className="size-3.5" />
                </a>
              </Button>
            </div>

            {/* GitHub Badge Note */}
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="size-3.5 text-emerald-500" />
              <span>No credit card required • Works on public & private repos</span>
            </div>

            {/* Interactive Mock Review Preview Card */}
            <div className="mt-14 mx-auto max-w-3xl rounded-2xl border border-border/80 bg-card/90 backdrop-blur-sm p-4 sm:p-6 shadow-2xl text-left transition-all hover:border-border">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3 mb-4">
                <div className="flex items-center gap-2 text-xs">
                  <span className="flex size-6 items-center justify-center rounded-md bg-primary/15 text-primary">
                    <Bot className="size-3.5" />
                  </span>
                  <span className="font-semibold text-foreground">ReviewBit Bot</span>
                  <span className="text-muted-foreground">posted review on</span>
                  <span className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[11px] font-semibold text-primary border border-border/60">
                    PR #108
                  </span>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="size-3" />
                  Analysis Complete
                </span>
              </div>

              <div className="space-y-3 font-sans text-xs sm:text-sm">
                <p className="text-foreground/90 font-medium leading-relaxed">
                  Overall changes in <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">features/auth</code> look solid. Here are the automated findings:
                </p>

                <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/[0.04] p-3.5 space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-emerald-700 dark:text-emerald-400 text-xs">
                    <CheckCircle2 className="size-3.5" />
                    <span>What looks good</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Correct usage of HTTP-only session cookies and CSRF-protected redirect callbacks.
                  </p>
                </div>

                <div className="rounded-xl border border-amber-500/25 bg-amber-500/[0.04] p-3.5 space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-amber-700 dark:text-amber-400 text-xs">
                    <Sparkles className="size-3.5" />
                    <span>Suggestions</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Add a database index on <code className="rounded bg-muted px-1 font-mono text-[11px]">installationId</code> to accelerate pull request lookups under high webhook volume.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. How It Works */}
        <section id="how-it-works" className="border-t border-border/80 bg-muted/20 py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-primary">
                3-Step Setup
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                How ReviewBit Works
              </p>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                Connect once with GitHub App permissions. No complex config files or repository changes required.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="relative rounded-2xl border border-border/80 bg-card p-6 shadow-xs transition-all hover:border-border hover:shadow-md">
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary font-bold text-base mb-4">
                  1
                </div>
                <h3 className="text-base font-semibold text-foreground">Connect GitHub App</h3>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Install the ReviewBit GitHub App on your personal profile or team organization. Choose all repositories or handpick specific ones.
                </p>
              </div>

              <div className="relative rounded-2xl border border-border/80 bg-card p-6 shadow-xs transition-all hover:border-border hover:shadow-md">
                <div className="flex size-11 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 font-bold text-base mb-4">
                  2
                </div>
                <h3 className="text-base font-semibold text-foreground">Index Your Codebase</h3>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  ReviewBit extracts repository symbols and embeds codebase architecture into Pinecone for deep semantic surrounding context.
                </p>
              </div>

              <div className="relative rounded-2xl border border-border/80 bg-card p-6 shadow-xs transition-all hover:border-border hover:shadow-md">
                <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-base mb-4">
                  3
                </div>
                <h3 className="text-base font-semibold text-foreground">Automated PR Reviews</h3>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Every opened or updated PR triggers an Inngest background review. The AI assesses correctness and posts structured feedback directly to GitHub.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Features */}
        <section id="features" className="py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-primary">
                Engineered for Teams
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Comprehensive Automated Code Inspection
              </p>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                Catch regressions, edge cases, and architectural issues before they reach production.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl border border-border/80 bg-card p-5 space-y-2.5 transition-all hover:border-border hover:shadow-xs">
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <ShieldCheck className="size-4" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">Security & Injection Checks</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Spots unvalidated user inputs, unsafe deserialization, SQL injection hazards, and exposed secret patterns.
                </p>
              </div>

              <div className="rounded-xl border border-border/80 bg-card p-5 space-y-2.5 transition-all hover:border-border hover:shadow-xs">
                <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Zap className="size-4" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">Performance Analysis</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Detects inefficient database lookups, N+1 query patterns, unindexed filters, and unbounded loops.
                </p>
              </div>

              <div className="rounded-xl border border-border/80 bg-card p-5 space-y-2.5 transition-all hover:border-border hover:shadow-xs">
                <div className="flex size-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <Database className="size-4" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">Repository Context Awareness</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Grounds review feedback using semantic Pinecone vector embeddings of your whole repository, not just isolated lines.
                </p>
              </div>

              <div className="rounded-xl border border-border/80 bg-card p-5 space-y-2.5 transition-all hover:border-border hover:shadow-xs">
                <div className="flex size-9 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  <Bot className="size-4" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">Constructive Feedback</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Structured into summary, good practices, suggestions, and critical issues to minimize review noise.
                </p>
              </div>

              <div className="rounded-xl border border-border/80 bg-card p-5 space-y-2.5 transition-all hover:border-border hover:shadow-xs">
                <div className="flex size-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <Lock className="size-4" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">Public & Private Repositories</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Full security and support for proprietary commercial codebases with GitHub App short-lived tokens.
                </p>
              </div>

              <div className="rounded-xl border border-border/80 bg-card p-5 space-y-2.5 transition-all hover:border-border hover:shadow-xs">
                <div className="flex size-9 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
                  <GitBranch className="size-4" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">Reliable Inngest Queue</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Fault-tolerant event-driven pipeline that automatically handles retries, delays, and usage quotas.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Pricing */}
        <section id="pricing" className="border-t border-border/80 bg-muted/20 py-20 md:py-28">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-primary">
                Plans
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Transparent Pricing
              </p>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                Get started for free or upgrade to Pro for unlimited reviews across all your repositories.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto items-stretch pt-4">
              {/* Free Tier */}
              <Card className="flex flex-col border-border/80 shadow-xs">
                <CardHeader className="p-6">
                  <CardTitle className="text-xl">Free</CardTitle>
                  <CardDescription className="text-xs mt-1">
                    For individual builders and open-source contributors.
                  </CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-extrabold text-foreground">₹0</span>
                    <span className="text-xs text-muted-foreground font-medium"> / month</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 space-y-3 p-6 pt-0 text-xs">
                  <div className="flex items-center gap-2.5 text-foreground/90">
                    <Check className="size-4 text-emerald-500 shrink-0" />
                    <span>Up to 5 AI reviews per month</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-foreground/90">
                    <Check className="size-4 text-emerald-500 shrink-0" />
                    <span>Public & private repositories</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-foreground/90">
                    <Check className="size-4 text-emerald-500 shrink-0" />
                    <span>Automated pull request comments</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-foreground/90">
                    <Check className="size-4 text-emerald-500 shrink-0" />
                    <span>Standard Community support</span>
                  </div>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Button asChild variant="outline" className="w-full h-10">
                    <Link href={isAuthenticated ? DASHBOARD_ROUTES.overview : "/sign-in"}>
                      {isAuthenticated ? "Go to Dashboard" : "Start for Free"}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              {/* Pro Tier */}
              <Card className="relative flex flex-col border-primary/50 bg-card shadow-lg overflow-visible">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3.5 py-0.5 text-[11px] font-semibold text-primary-foreground shadow-xs z-10">
                  Recommended
                </div>
                <CardHeader className="p-6">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">Pro</CardTitle>
                    <Sparkles className="size-4 text-primary" />
                  </div>
                  <CardDescription className="text-xs mt-1">
                    For professional developers and growing teams.
                  </CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-extrabold text-foreground">₹999</span>
                    <span className="text-xs text-muted-foreground font-medium"> / month</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 space-y-3 p-6 pt-0 text-xs">
                  <div className="flex items-center gap-2.5 text-foreground font-medium">
                    <Check className="size-4 text-primary shrink-0" />
                    <span>Unlimited AI reviews on all connected repos</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-foreground/90">
                    <Check className="size-4 text-primary shrink-0" />
                    <span>Codebase semantic indexing with Pinecone</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-foreground/90">
                    <Check className="size-4 text-primary shrink-0" />
                    <span>Priority review queue processing</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-foreground/90">
                    <Check className="size-4 text-primary shrink-0" />
                    <span>Advanced security and logic checks</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-foreground/90">
                    <Check className="size-4 text-primary shrink-0" />
                    <span>Priority developer support</span>
                  </div>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Button asChild className="w-full h-10 shadow-xs font-medium">
                    <Link href={isAuthenticated ? DASHBOARD_ROUTES.settings : "/sign-in"}>
                      {isAuthenticated ? "Manage Subscription" : "Upgrade to Pro"}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {/* 6. Footer */}
      <footer className="border-t border-border/80 bg-background py-10 text-xs text-muted-foreground">
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <span className="flex size-6 items-center justify-center rounded-md bg-primary/10">
              <Image
                src="/review-bit-eye-logo.svg"
                alt="ReviewBit Logo"
                width={16}
                height={16}
                className="object-contain"
              />
            </span>
            <span className="font-semibold text-foreground">ReviewBit</span>
            <span>— Automated AI Code Reviews for GitHub</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href={DASHBOARD_ROUTES.overview} className="transition-colors hover:text-foreground">
              Dashboard
            </Link>
            <Link href={DASHBOARD_ROUTES.repos} className="transition-colors hover:text-foreground">
              Repositories
            </Link>
            <Link href={DASHBOARD_ROUTES.settings} className="transition-colors hover:text-foreground">
              Settings
            </Link>
          </div>

          <p className="text-center sm:text-right">
            &copy; {new Date().getFullYear()} ReviewBit. Built for GitHub developers.
          </p>
        </div>
      </footer>
    </div>
  );
}
