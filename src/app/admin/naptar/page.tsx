import { AdminCalendarManager } from "@/components/admin/calendar-manager";
import { AdminPageHeader } from "@/components/admin/page-header";
import { AdminShell } from "@/components/admin/shell";
import { Button } from "@/components/ui/button";
import { requireAdminProfile } from "@/lib/auth";
import { formatHungarianDate } from "@/lib/format";
import { getCalendarDays, getClasses } from "@/lib/data";
import {
  deleteCalendarDayAction,
  upsertCalendarDayAction,
} from "@/server/actions/admin";

export const metadata = {
  title: "Admin naptár",
};

export default async function AdminCalendarPage() {
  const profile = await requireAdminProfile();
  const [classes, markedDays] = await Promise.all([getClasses(true), getCalendarDays()]);

  return (
    <AdminShell profile={profile} currentPath="/admin/naptar">
      <AdminPageHeader
        title="Naptár"
        description="A napok most már kattinthatók: kiválasztod a dátumot, rögtön látod a részleteket, és ugyanonnan tudsz jelölést menteni vagy átmenni az órarendhez."
      />

      <AdminCalendarManager classes={classes} markedDays={markedDays} />

      <section className="mt-8 grid gap-4">
        <div>
          <p className="eyebrow">Mentett napok</p>
          <h2 className="mt-3 text-3xl font-semibold text-ink">Kézzel jelölt dátumok</h2>
        </div>

        {markedDays.length === 0 ? (
          <div className="card-surface rounded-[2rem] p-6 text-stone">
            Még nincs külön jelölt nap. A fenti kattintható naptárból tudsz új napot kijelölni és menteni.
          </div>
        ) : null}

        {markedDays.map((item) => (
          <article key={item.id} className="card-surface rounded-[2rem] p-6">
            <div className="flex flex-col gap-2 border-b border-stone/10 pb-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.16em] text-moss">
                  {item.status === "class-day"
                    ? "Órás nap"
                    : item.status === "free-day"
                      ? "Szabadnap"
                      : "Szünet"}
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-ink">
                  {formatHungarianDate(`${item.day}T12:00:00`)}
                </h3>
              </div>
              <div className="rounded-full bg-background/80 px-4 py-2 text-sm text-stone">
                {item.label || "Nincs külön címke"}
              </div>
            </div>

            <form
              action={upsertCalendarDayAction}
              className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-[0.7fr_0.75fr_1fr_auto]"
            >
              <input type="hidden" name="id" value={item.id} />

              <div className="grid gap-2">
                <label className="text-sm font-semibold text-ink">Dátum</label>
                <input name="day" type="date" defaultValue={item.day} className="input-field" />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-semibold text-ink">Jelölés</label>
                <select name="status" defaultValue={item.status} className="select-field">
                  <option value="class-day">Órás nap</option>
                  <option value="free-day">Szabadnap</option>
                  <option value="unavailable">Szünet / nem elérhető</option>
                </select>
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-semibold text-ink">Címke / megjegyzés</label>
                <div className="grid gap-3 md:grid-cols-2">
                  <input name="label" defaultValue={item.label} className="input-field" />
                  <input name="note" defaultValue={item.note} className="input-field" />
                </div>
              </div>

              <div className="flex flex-wrap items-end gap-3 xl:justify-end">
                <Button>Módosítás</Button>
              </div>
            </form>

            <form action={deleteCalendarDayAction} className="mt-3">
              <input type="hidden" name="id" value={item.id} />
              <Button variant="ghost">Nap törlése</Button>
            </form>
          </article>
        ))}
      </section>
    </AdminShell>
  );
}
