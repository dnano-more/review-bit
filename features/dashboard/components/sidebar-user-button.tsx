"use client";

import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { UserMenu, UserMenuUser } from "@/features/auth/components/user-menu";

type SidebarUserButtonProps = {
  user: UserMenuUser;
  plan?: string;
};

export function SidebarUserButton({ user, plan }: SidebarUserButtonProps) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <UserMenu
          user={user}
          plan={plan}
          variant="profile"
          className="w-full"
        />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}