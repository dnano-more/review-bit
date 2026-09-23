
import { requiredAuth } from "@/features/auth/actions";
import { DashboardShell } from "@/features/dashboard/components/dashboard-shell";
import { getUserSubscription } from "@/features/billing/server/subscription";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requiredAuth();
  const subscription = await getUserSubscription(session.user.id);
  const plan =
    subscription.plan === "pro" && subscription.status === "active"
      ? "Pro"
      : "Free";

  return (
    <DashboardShell user={session.user} plan={plan}>
      {children}
    </DashboardShell>
  );
}