import { AdminPageHeader } from "@/components/admin/page-header";
import { AdminShell } from "@/components/admin/shell";
import { Button } from "@/components/ui/button";
import { requireAdminProfile } from "@/lib/auth";
import { getClasses, getServices } from "@/lib/data";
import { upsertClassAction } from "@/server/actions/admin";

export default async function AdminSchedulePage() {
  const profile = await requireAdminProfile();
  const [classes, services] = await Promise.all([getClasses(true), getServices(true)]);

  return (
    <AdminShell profile={profile} currentPath="/admin/orarend">
      <AdminPageHeader
        title="Órarend kezelése"
        description="Új óra létrehozása, ismétlődő alkalmak, helyszín és kapacitás kezelése egyetlen admin nézetben."
      />

      <div className="grid gap-6">
        <form
          action={upsertClassAction}
          className="card-surface grid gap-4 rounded-[2rem] p-6 md:grid-cols-2"
        >
          <input type="hidden" name="status" value="scheduled" />
          <div className="grid gap-2">
            <label className="text-sm font-semibold text-ink">Szolgáltatás</label>
            <select name="serviceId" className="select-field">
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.title}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-semibold text-ink">Cím</label>
            <input name="title" className="input-field" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-semibold text-ink">Kezdés</label>
            <input name="startsAt" type="datetime-local" className="input-field" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-semibold text-ink">Vége</label>
            <input name="endsAt" type="datetime-local" className="input-field" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-semibold text-ink">Helyszín</label>
            <input name="locationName" className="input-field" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-semibold text-ink">Cím / leírás</label>
            <input name="locationAddress" className="input-field" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-semibold text-ink">Kapacitás</label>
            <input name="capacity" type="number" min="1" className="input-field" />
          </div>
          <div className="grid gap-2 md:col-span-2">
            <label className="text-sm font-semibold text-ink">Leírás</label>
            <textarea name="description" className="textarea-field" />
          </div>
          <label className="flex items-center gap-3 text-sm text-stone">
            <input type="checkbox" name="isRecurring" />
            Ismétlődő óra
          </label>
          <div className="md:col-span-2">
            <Button>Új óra létrehozása</Button>
          </div>
        </form>

        <div className="grid gap-4">
          {classes.map((item) => (
            <article key={item.id} className="card-surface rounded-[1.75rem] p-6">
              <h2 className="text-xl font-semibold text-ink">{item.title}</h2>
              <p className="mt-2 text-sm text-stone">{item.locationName}</p>
              <p className="mt-2 text-sm text-stone">
                {item.startsAt} - kapacitás: {item.capacity}
              </p>
            </article>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
