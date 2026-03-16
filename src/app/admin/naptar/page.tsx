import { AdminPageHeader } from "@/components/admin/page-header";
import { AdminShell } from "@/components/admin/shell";
import { CalendarGrid } from "@/components/site/calendar-grid";
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
        description="Itt lehet átláthatóan kijelölni, mikor van óra, mikor szabadnap, és mikor nincs semmilyen alkalom. A jelölt napok az órarend oldalon is megjelennek."
      />

      <section className="card-surface rounded-[2rem] p-6 md:p-7">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Naptárnézet</p>
            <h2 className="mt-3 text-3xl font-semibold text-ink">Következő hónapok egyben</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-stone">
            A naptár kapta a teljes szélességet, hogy a jelölések és a napok tényleg olvashatók legyenek desktopon is.
          </p>
        </div>

        <div className="mt-6">
          <CalendarGrid classes={classes} markedDays={markedDays} />
        </div>
      </section>

      <div className="mt-8 grid gap-6 xl:grid-cols-[0.72fr_1.28fr]">
        <section className="card-surface rounded-[2rem] p-6">
          <div>
            <p className="eyebrow">Új jelölés</p>
            <h2 className="mt-3 text-2xl font-semibold text-ink">Nap hozzáadása</h2>
          </div>

          <form action={upsertCalendarDayAction} className="mt-6 grid gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-semibold text-ink">Dátum</label>
              <input name="day" type="date" className="input-field" required />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-semibold text-ink">Jelölés</label>
              <select name="status" className="select-field" defaultValue="free-day">
                <option value="class-day">Órás nap</option>
                <option value="free-day">Szabadnap</option>
                <option value="unavailable">Szünet / nem elérhető</option>
              </select>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-semibold text-ink">Rövid címke</label>
              <input
                name="label"
                className="input-field"
                placeholder="Pihenőnap vagy workshop"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-semibold text-ink">Megjegyzés</label>
              <textarea
                name="note"
                className="textarea-field"
                placeholder="Rövid megjegyzés a naphoz."
              />
            </div>

            <div>
              <Button>Nap mentése</Button>
            </div>
          </form>

          <div className="mt-6 rounded-[1.5rem] bg-background/70 p-4 text-sm leading-6 text-stone">
            A kézzel jelölt napokat akkor érdemes használni, ha Attila nem tart órát, pihenőnap van, vagy külön szeretnél kiemelni egy workshopnapot.
          </div>
        </section>

        <section className="grid gap-4">
          <div>
            <p className="eyebrow">Mentett napok</p>
            <h2 className="mt-3 text-3xl font-semibold text-ink">Kézzel jelölt dátumok</h2>
          </div>

          {markedDays.length === 0 ? (
            <div className="card-surface rounded-[2rem] p-6 text-stone">
              Még nincs külön jelölt nap. A bal oldali űrlappal tudsz szabadnapot vagy szünetet hozzáadni.
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
      </div>
    </AdminShell>
  );
}
