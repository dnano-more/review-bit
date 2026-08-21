import Image from "next/image";
import Link from "next/link";

import { DASHBOARD_ROUTES } from "@/features/dashboard/lib/routes";
import { DashboardNav } from "@/features/dashboard/components/dashboard-nav";
import { SidebarUserButton } from "@/features/dashboard/components/sidebar-user-button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { UserMenuUser } from "@/features/auth/components/user-menu";

type DashboardSidebarProps = {
  user: UserMenuUser;
  plan?: string;
};

export function DashboardSidebar({ user, plan = "Pro" }: DashboardSidebarProps) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              tooltip="ReviewBit"
            >
              <Link href={DASHBOARD_ROUTES.overview} className="flex items-center gap-2">
                <span className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-none group-data-[collapsible=icon]:flex hidden">
                  <Image
                    src="/review-bit-eye-logo.svg"
                    alt="ReviewBit Logo"
                    width={32}
                    height={20}
                    className="object-contain"
                  />
                </span>
                <Image
                  src="/review-bit-logo.svg"
                  alt="ReviewBit"
                  width={140}
                  height={26}
                  className="object-contain object-left dark:invert group-data-[collapsible=icon]:hidden"
                />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <DashboardNav />
      </SidebarContent>
      <SidebarFooter>
        <SidebarSeparator />
        <SidebarUserButton user={user} plan={plan} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}