import Link from "next/link";
import { clsx } from "clsx";

import { adminNavigation } from "@/lib/site";
import type { AdminProfile } from "@/lib/types";

export function AdminSidebar({
  profile,
  currentPath,
}: {
  profile: AdminProfile;
  currentPath: string;
}) {
  return (
    <aside className="card-surface rounded-[2rem] p-5">
      <p className="font-display text-3xl text-ink">Ohm Jóga Admin</p>
      <p className="mt-2 text-sm text-stone">
        {profile.fullName} • {profile.role}
      </p>
      {profile.previewMode ? (
        <p className="mt-4 rounded-[1rem] bg-sage/30 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-moss">
          Preview mód
        </p>
      ) : null}
      <nav className="mt-8 flex flex-col gap-2">
        {adminNavigation.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              "rounded-[1rem] px-4 py-3 text-sm font-medium transition",
              currentPath === item.href
                ? "bg-moss text-ivory"
                : "text-stone hover:bg-ivory hover:text-ink",
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
