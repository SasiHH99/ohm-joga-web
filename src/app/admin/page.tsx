import Link from "next/link";

import { AdminPageHeader } from "@/components/admin/page-header";
import { AdminShell } from "@/components/admin/shell";
import { StatCard } from "@/components/admin/stat-card";
import { requireAdminProfile } from "@/lib/auth";
import { getAdminDashboardSnapshot } from "@/lib/data";
import { formatDateRange } from "@/lib/format";

export const metadata = {
  title: "Admin dashboard",
};

export default async function AdminDashboardPage() {
  const profile = await requireAdminProfile();
  const snapshot = await getAdminDashboardSnapshot();

  return (
    <AdminShell profile={profile} currentPath="/admin">
      <AdminPageHeader
        title="Dashboard"
        description="Összkép a foglalásokról, következő órákról, üzenetekről és tartalomról."
      />

      <div className="grid gap-5 md:grid-cols-4">
        <StatCard
          label="Foglalás"
          value={snapshot.stats.bookingCount}
          hint="Összes aktív és demo booking"
        />
        <StatCard
          label="Következő órák"
          value={snapshot.stats.upcomingClassCount}
          hint="Órarendből számolva"
        />
        <StatCard
          label="Új üzenetek"
          value={snapshot.stats.unreadMessageCount}
          hint="Olvasatlan kapcsolatfelvételek"
        />
        <StatCard
          label="Publikált cikkek"
          value={snapshot.stats.publishedPostCount}
          hint="Blog admin státusz alapján"
        />
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <section className="card-surface rounded-[2rem] p-6">
          <h2 className="text-2xl font-semibold text-ink">Következő órák</h2>
          <div className="mt-5 space-y-4">
            {snapshot.upcomingClasses.map((item) => (
              <div key={item.id} className="rounded-[1.25rem] bg-background/70 p-4">
                <p className="font-semibold text-ink">{item.title}</p>
                <p className="mt-2 text-sm text-stone">
                  {formatDateRange(item.startsAt, item.endsAt)}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="card-surface rounded-[2rem] p-6">
          <h2 className="text-2xl font-semibold text-ink">Legfrissebb foglalások</h2>
          <div className="mt-5 space-y-4">
            {snapshot.recentBookings.map((item) => (
              <div key={item.id} className="rounded-[1.25rem] bg-background/70 p-4">
                <p className="font-semibold text-ink">{item.name}</p>
                <p className="mt-2 text-sm text-stone">{item.email}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-moss">
                  {item.status}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-8 card-surface rounded-[2rem] p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-ink">Új üzenetek</h2>
          <Link href="/admin/uzenetek" className="text-sm font-semibold text-moss">
            Összes üzenet
          </Link>
        </div>
        <div className="mt-5 space-y-4">
          {snapshot.recentMessages.map((item) => (
            <div key={item.id} className="rounded-[1.25rem] bg-background/70 p-4">
              <p className="font-semibold text-ink">{item.subject}</p>
              <p className="mt-1 text-sm text-stone">
                {item.name} • {item.email}
              </p>
            </div>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}
