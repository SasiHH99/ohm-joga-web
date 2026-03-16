import type { ReactNode } from "react";

import { AdminSidebar } from "@/components/admin/sidebar";
import { Button } from "@/components/ui/button";
import { logoutAdminAction } from "@/server/actions/admin";
import type { AdminProfile } from "@/lib/types";

export function AdminShell({
  profile,
  currentPath,
  children,
}: {
  profile: AdminProfile;
  currentPath: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f5efe7_0%,#f8f4ee_100%)]">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-8 md:grid-cols-[18rem_1fr] md:px-8">
        <div className="space-y-5">
          <AdminSidebar profile={profile} currentPath={currentPath} />
          <form action={logoutAdminAction}>
            <Button variant="secondary" className="w-full">
              Kijelentkezés
            </Button>
          </form>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
