import { AdminPageHeader } from "@/components/admin/page-header";
import { AdminShell } from "@/components/admin/shell";
import { requireAdminProfile } from "@/lib/auth";
import {
  contactInfo,
  locationItems,
  mainNavigation,
  scheduleEntries,
  workshopNote,
} from "@/lib/site";
import { getBlogPosts, getSettings } from "@/lib/data";

export const metadata = {
  title: "Admin áttekintés",
};

export default async function AdminDashboardPage() {
  const profile = await requireAdminProfile();
  const [settings, posts] = await Promise.all([
    getSettings(),
    getBlogPosts({ includeDrafts: true }),
  ]);

  const publishedCount = posts.filter((post) => post.status === "published").length;
  const draftCount = posts.filter((post) => post.status === "draft").length;

  return (
    <AdminShell profile={profile} currentPath="/admin">
      <AdminPageHeader
        title="Áttekintés"
        description="A lecsupaszított adminban most csak a valóban használt részek maradnak: az oldal áttekintése, a blog és a média."
      />

      <div className="grid gap-6 md:grid-cols-3">
        <section className="card-surface rounded-[2rem] p-6">
          <p className="eyebrow">Publikus menü</p>
          <div className="mt-5 space-y-3 text-stone">
            {mainNavigation.map((item) => (
              <p key={item.href}>{item.label}</p>
            ))}
          </div>
        </section>

        <section className="card-surface rounded-[2rem] p-6">
          <p className="eyebrow">Kapcsolat</p>
          <div className="mt-5 space-y-3 text-stone">
            <p>{contactInfo.phoneDisplay}</p>
            <p>{settings.email}</p>
          </div>
        </section>

        <section className="card-surface rounded-[2rem] p-6">
          <p className="eyebrow">Blog</p>
          <div className="mt-5 space-y-3 text-stone">
            <p>Összes cikk: {posts.length}</p>
            <p>Publikált: {publishedCount}</p>
            <p>Vázlat: {draftCount}</p>
          </div>
        </section>
      </div>

      <section className="mt-8 card-surface rounded-[2rem] p-6">
        <h2 className="text-2xl font-semibold text-ink">Jelenlegi órarend</h2>
        <div className="mt-6 grid gap-4">
          {scheduleEntries.map((item) => (
            <div
              key={`${item.day}-${item.location}`}
              className="rounded-[1.25rem] bg-background/70 p-4"
            >
              <p className="text-sm uppercase tracking-[0.16em] text-moss">{item.day}</p>
              <p className="mt-2 text-lg font-semibold text-ink">{item.className}</p>
              <p className="mt-1 text-stone">{item.location}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="card-surface rounded-[2rem] p-6">
          <h2 className="text-2xl font-semibold text-ink">Legutóbbi cikkek</h2>
          <div className="mt-5 space-y-4">
            {posts.slice(0, 3).map((post) => (
              <div key={post.id} className="rounded-[1.25rem] bg-background/70 p-4">
                <p className="font-semibold text-ink">{post.title}</p>
                <p className="mt-2 text-sm text-stone">
                  {post.slug} • {post.status}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="card-surface rounded-[2rem] p-6">
          <h2 className="text-2xl font-semibold text-ink">Helyszínek és workshopok</h2>
          <div className="mt-5 space-y-3 text-stone">
            {locationItems.map((item) => (
              <p key={item}>{item}</p>
            ))}
            <p className="pt-3">{workshopNote}</p>
          </div>
        </div>
      </section>
    </AdminShell>
  );
}
