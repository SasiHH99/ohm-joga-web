import { AdminPageHeader } from "@/components/admin/page-header";
import { AdminShell } from "@/components/admin/shell";
import { Button } from "@/components/ui/button";
import { requireAdminProfile } from "@/lib/auth";
import { getServices } from "@/lib/data";
import { upsertServiceAction } from "@/server/actions/admin";

export default async function AdminServicesPage() {
  const profile = await requireAdminProfile();
  const services = await getServices(true);

  return (
    <AdminShell profile={profile} currentPath="/admin/szolgaltatasok">
      <AdminPageHeader
        title="Szolgáltatások kezelése"
        description="Új szolgáltatás felvétele, árazás, időtartam és aktív/inaktív állapot egy helyen."
      />

      <div className="grid gap-6">
        <form
          action={upsertServiceAction}
          className="card-surface grid gap-4 rounded-[2rem] p-6 md:grid-cols-2"
        >
          <div className="grid gap-2">
            <label className="text-sm font-semibold text-ink">Slug</label>
            <input name="slug" className="input-field" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-semibold text-ink">Név</label>
            <input name="title" className="input-field" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-semibold text-ink">Időtartam</label>
            <input name="durationMinutes" type="number" className="input-field" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-semibold text-ink">Ár</label>
            <input name="priceLabel" className="input-field" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-semibold text-ink">Delivery mode</label>
            <input name="deliveryMode" className="input-field" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-semibold text-ink">Sorrend</label>
            <input name="sortOrder" type="number" defaultValue="10" className="input-field" />
          </div>
          <div className="grid gap-2 md:col-span-2">
            <label className="text-sm font-semibold text-ink">Rövid leírás</label>
            <input name="shortDescription" className="input-field" />
          </div>
          <div className="grid gap-2 md:col-span-2">
            <label className="text-sm font-semibold text-ink">Teljes leírás</label>
            <textarea name="description" className="textarea-field" />
          </div>
          <div className="grid gap-2 md:col-span-2">
            <label className="text-sm font-semibold text-ink">Kinek szól</label>
            <textarea name="audience" className="textarea-field" />
          </div>
          <div className="flex flex-wrap gap-4 md:col-span-2">
            <label className="flex items-center gap-3 text-sm text-stone">
              <input type="checkbox" name="isActive" defaultChecked />
              Aktív
            </label>
            <label className="flex items-center gap-3 text-sm text-stone">
              <input type="checkbox" name="featured" />
              Kiemelt
            </label>
          </div>
          <div className="md:col-span-2">
            <Button>Szolgáltatás mentése</Button>
          </div>
        </form>

        <div className="grid gap-4">
          {services.map((service) => (
            <article key={service.id} className="card-surface rounded-[1.75rem] p-6">
              <h2 className="text-xl font-semibold text-ink">{service.title}</h2>
              <p className="mt-2 text-sm text-stone">
                {service.priceLabel} - {service.deliveryMode}
              </p>
            </article>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
