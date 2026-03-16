import { AdminPageHeader } from "@/components/admin/page-header";
import { AdminShell } from "@/components/admin/shell";
import { Button } from "@/components/ui/button";
import { requireAdminProfile } from "@/lib/auth";
import { getBookings, getServices } from "@/lib/data";
import { updateBookingStatusAction } from "@/server/actions/admin";

export default async function AdminBookingsPage() {
  const profile = await requireAdminProfile();
  const [bookings, services] = await Promise.all([getBookings(), getServices(true)]);

  return (
    <AdminShell profile={profile} currentPath="/admin/foglalasok">
      <AdminPageHeader
        title="Foglalások kezelése"
        description="Lista, státuszfrissítés, lemondás és archiválás ugyanazon a nézeten belül."
      />

      <div className="grid gap-5">
        {bookings.map((item) => {
          const service = services.find((serviceItem) => serviceItem.id === item.serviceId);

          return (
            <article key={item.id} className="card-surface rounded-[1.75rem] p-6">
              <div className="grid gap-4 md:grid-cols-[1fr_0.65fr]">
                <div>
                  <h2 className="text-2xl font-semibold text-ink">{item.name}</h2>
                  <p className="mt-2 text-stone">{service?.title ?? "Ismeretlen szolgáltatás"}</p>
                  <p className="mt-1 text-sm text-stone">{item.email} • {item.phone}</p>
                  {item.note ? <p className="mt-4 text-sm text-stone">{item.note}</p> : null}
                </div>
                <form action={updateBookingStatusAction} className="grid gap-3">
                  <input type="hidden" name="id" value={item.id} />
                  <label className="text-sm font-semibold text-ink" htmlFor={`booking-${item.id}`}>
                    Státusz
                  </label>
                  <select
                    id={`booking-${item.id}`}
                    name="status"
                    defaultValue={item.status}
                    className="select-field"
                  >
                    <option value="pending">pending</option>
                    <option value="confirmed">confirmed</option>
                    <option value="cancelled">cancelled</option>
                    <option value="archived">archived</option>
                  </select>
                  <Button variant="secondary">Mentés</Button>
                </form>
              </div>
            </article>
          );
        })}
      </div>
    </AdminShell>
  );
}
