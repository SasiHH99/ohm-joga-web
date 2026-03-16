import Link from "next/link";

import { AdminPageHeader } from "@/components/admin/page-header";
import { AdminShell } from "@/components/admin/shell";
import { requireAdminProfile } from "@/lib/auth";
import { formatDateRange, formatHungarianDate } from "@/lib/format";
import { getBlogPosts, getCalendarDays, getClasses, getSettings } from "@/lib/data";
import { contactInfo } from "@/lib/site";

export const metadata = {
  title: "Admin áttekintés",
};

export default async function AdminDashboardPage() {
  const profile = await requireAdminProfile();
  const [settings, posts, classes, markedDays] = await Promise.all([
    getSettings(),
    getBlogPosts({ includeDrafts: true }),
    getClasses(),
    getCalendarDays(),
  ]);

  const publishedCount = posts.filter((post) => post.status === "published").length;

  return (
    <AdminShell profile={profile} currentPath="/admin">
      <AdminPageHeader
        title="Áttekintés"
        description="Az admin most külön oldalakra van bontva: külön kezelhető az órarend, a naptár, a blog és a média."
      />

      <div className="grid gap-6 md:grid-cols-4">
        <section className="card-surface rounded-[2rem] p-6">
          <p className="eyebrow">Órarend</p>
          <p className="mt-5 text-4xl font-semibold text-ink">{classes.length}</p>
          <p className="mt-2 text-stone">közelgő alkalom</p>
        </section>

        <section className="card-surface rounded-[2rem] p-6">
          <p className="eyebrow">Naptár</p>
          <p className="mt-5 text-4xl font-semibold text-ink">{markedDays.length}</p>
          <p className="mt-2 text-stone">kézzel jelölt nap</p>
        </section>

        <section className="card-surface rounded-[2rem] p-6">
          <p className="eyebrow">Blog</p>
          <p className="mt-5 text-4xl font-semibold text-ink">{publishedCount}</p>
          <p className="mt-2 text-stone">publikált cikk</p>
        </section>

        <section className="card-surface rounded-[2rem] p-6">
          <p className="eyebrow">Kapcsolat</p>
          <p className="mt-5 text-lg font-semibold text-ink">{contactInfo.phoneDisplay}</p>
          <p className="mt-2 text-stone">{settings.email}</p>
        </section>
      </div>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="card-surface rounded-[2rem] p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="eyebrow">Gyors elérés</p>
              <h2 className="mt-3 text-2xl font-semibold text-ink">Fő admin oldalak</h2>
            </div>
          </div>

          <div className="mt-6 grid gap-3">
            {[
              { href: "/admin/orarend", label: "Órarend szerkesztése" },
              { href: "/admin/naptar", label: "Naptár kezelése" },
              { href: "/admin/blog", label: "Blog szerkesztése" },
              { href: "/admin/media", label: "Média kezelése" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-[1.25rem] border border-white/40 bg-background/70 px-4 py-4 text-sm font-semibold text-ink transition hover:border-sage/60 hover:bg-ivory"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="card-surface rounded-[2rem] p-6">
          <p className="eyebrow">Közelgő alkalmak</p>
          <h2 className="mt-3 text-2xl font-semibold text-ink">A következő órák</h2>
          <div className="mt-6 grid gap-3">
            {classes.length === 0 ? (
              <p className="rounded-[1.25rem] bg-background/70 p-4 text-stone">
                Még nincs közelgő alkalom felvéve.
              </p>
            ) : (
              classes.slice(0, 3).map((item) => (
                <div key={item.id} className="rounded-[1.25rem] bg-background/70 p-4">
                  <p className="font-semibold text-ink">{item.title}</p>
                  <p className="mt-2 text-sm text-stone">
                    {formatDateRange(item.startsAt, item.endsAt)}
                  </p>
                  <p className="mt-1 text-sm text-stone">{item.locationName}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="card-surface rounded-[2rem] p-6">
          <p className="eyebrow">Legutóbbi jelölések</p>
          <h2 className="mt-3 text-2xl font-semibold text-ink">Naptárnapok</h2>
          <div className="mt-6 grid gap-3">
            {markedDays.length === 0 ? (
              <p className="rounded-[1.25rem] bg-background/70 p-4 text-stone">
                Még nincs külön megjelölt szabadnap vagy szünet.
              </p>
            ) : (
              markedDays.slice(0, 3).map((item) => (
                <div key={item.id} className="rounded-[1.25rem] bg-background/70 p-4">
                  <p className="font-semibold text-ink">
                    {formatHungarianDate(`${item.day}T12:00:00`)}
                  </p>
                  <p className="mt-2 text-sm text-stone">
                    {item.label ||
                      (item.status === "free-day"
                        ? "Szabadnap"
                        : item.status === "unavailable"
                          ? "Szünet"
                          : "Órás nap")}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card-surface rounded-[2rem] p-6">
          <p className="eyebrow">Blog</p>
          <h2 className="mt-3 text-2xl font-semibold text-ink">Utolsó cikkek</h2>
          <div className="mt-6 grid gap-3">
            {posts.length === 0 ? (
              <p className="rounded-[1.25rem] bg-background/70 p-4 text-stone">
                Még nincs mentett cikk.
              </p>
            ) : (
              posts.slice(0, 3).map((post) => (
                <div key={post.id} className="rounded-[1.25rem] bg-background/70 p-4">
                  <p className="font-semibold text-ink">{post.title}</p>
                  <p className="mt-2 text-sm text-stone">
                    {post.status} • {post.slug}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </AdminShell>
  );
}
