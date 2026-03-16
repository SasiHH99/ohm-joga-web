import { AdminPageHeader } from "@/components/admin/page-header";
import { AdminShell } from "@/components/admin/shell";
import { Button } from "@/components/ui/button";
import { requireAdminProfile } from "@/lib/auth";
import { getTestimonials } from "@/lib/data";
import { upsertTestimonialAction } from "@/server/actions/admin";

export default async function AdminTestimonialsPage() {
  const profile = await requireAdminProfile();
  const testimonials = await getTestimonials(true);

  return (
    <AdminShell profile={profile} currentPath="/admin/velemenyek">
      <AdminPageHeader
        title="Vélemények kezelése"
        description="Új ajánlás felvétele és megjelenítés/elrejtés üzleti fókuszú testimonial blokkokhoz."
      />

      <div className="grid gap-6">
        <form action={upsertTestimonialAction} className="card-surface grid gap-4 rounded-[2rem] p-6 md:grid-cols-2">
          <div className="grid gap-2">
            <label className="text-sm font-semibold text-ink">Név</label>
            <input name="authorName" className="input-field" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-semibold text-ink">Szerep</label>
            <input name="authorRole" className="input-field" />
          </div>
          <div className="grid gap-2 md:col-span-2">
            <label className="text-sm font-semibold text-ink">Idézet</label>
            <textarea name="quote" className="textarea-field" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-semibold text-ink">Sorrend</label>
            <input name="sortOrder" type="number" defaultValue="10" className="input-field" />
          </div>
          <label className="flex items-center gap-3 text-sm text-stone">
            <input type="checkbox" name="isVisible" defaultChecked />
            Látható
          </label>
          <div className="md:col-span-2">
            <Button>Vélemény mentése</Button>
          </div>
        </form>

        <div className="grid gap-4">
          {testimonials.map((item) => (
            <article key={item.id} className="card-surface rounded-[1.75rem] p-6">
              <h2 className="text-xl font-semibold text-ink">{item.authorName}</h2>
              <p className="mt-2 text-sm text-stone">{item.authorRole} • {item.isVisible ? "látható" : "rejtett"}</p>
              <p className="mt-4 text-sm leading-7 text-stone">{item.quote}</p>
            </article>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
