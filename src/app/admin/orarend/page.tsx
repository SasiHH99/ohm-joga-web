import { AdminPageHeader } from "@/components/admin/page-header";
import { AdminShell } from "@/components/admin/shell";
import { Button } from "@/components/ui/button";
import { requireAdminProfile } from "@/lib/auth";
import { formatDateRange, toStudioDateTimeLocalInput } from "@/lib/format";
import { getClasses } from "@/lib/data";
import { adminScheduleSuggestions } from "@/lib/site";
import {
  deleteClassSessionAction,
  upsertClassSessionAction,
} from "@/server/actions/admin";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function getNewClassDefaults(day?: string) {
  if (!day || !/^\d{4}-\d{2}-\d{2}$/.test(day)) {
    return {
      startsAtLocal: "",
      endsAtLocal: "",
    };
  }

  return {
    startsAtLocal: `${day}T18:00`,
    endsAtLocal: `${day}T19:15`,
  };
}

export const metadata = {
  title: "Admin órarend",
};

export default async function AdminSchedulePage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const profile = await requireAdminProfile();
  const classes = await getClasses(true);
  const params = searchParams ? await searchParams : {};
  const selectedDay = typeof params.day === "string" ? params.day : "";
  const defaults = getNewClassDefaults(selectedDay);

  return (
    <AdminShell profile={profile} currentPath="/admin/orarend">
      <AdminPageHeader
        title="Órarend"
        description="Itt lehet kezelni az aktuális órákat: dátum, időpont, helyszín és státusz alapján. Az új óráknál heti ismétlés is beállítható."
      />

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <form
          action={upsertClassSessionAction}
          className="card-surface grid gap-4 rounded-[2rem] p-6"
        >
          <div>
            <p className="eyebrow">Új óra</p>
            <h2 className="mt-3 text-2xl font-semibold text-ink">Új dátum felvitele</h2>
            {selectedDay ? (
              <p className="mt-3 text-sm text-stone">
                A naptárból kiválasztott nap: <span className="font-semibold text-ink">{selectedDay}</span>
              </p>
            ) : null}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-semibold text-ink">Óra neve</label>
              <input
                name="title"
                list="class-title-suggestions"
                className="input-field"
                placeholder="Kezdő jóga"
                required
              />
              <datalist id="class-title-suggestions">
                {adminScheduleSuggestions.classTitles.map((item) => (
                  <option key={item} value={item} />
                ))}
              </datalist>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-semibold text-ink">Státusz</label>
              <select name="status" className="select-field" defaultValue="scheduled">
                <option value="scheduled">Tervezett</option>
                <option value="cancelled">Elmarad</option>
                <option value="completed">Megtartva</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-semibold text-ink">Kezdés</label>
              <input
                name="startsAtLocal"
                type="datetime-local"
                defaultValue={defaults.startsAtLocal}
                className="input-field"
                required
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-semibold text-ink">Befejezés</label>
              <input
                name="endsAtLocal"
                type="datetime-local"
                defaultValue={defaults.endsAtLocal}
                className="input-field"
                required
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-semibold text-ink">Helyszín neve</label>
              <input
                name="locationName"
                list="location-name-suggestions"
                className="input-field"
                placeholder="Mezőtúr"
                required
              />
              <datalist id="location-name-suggestions">
                {adminScheduleSuggestions.locationNames.map((item) => (
                  <option key={item} value={item} />
                ))}
              </datalist>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-semibold text-ink">Pontos hely</label>
              <input
                name="locationAddress"
                list="location-address-suggestions"
                className="input-field"
                placeholder="Karcagi Szakképzési Centrum (626)"
                required
              />
              <datalist id="location-address-suggestions">
                {adminScheduleSuggestions.locationAddresses.map((item) => (
                  <option key={item} value={item} />
                ))}
              </datalist>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-[0.35fr_1fr]">
            <div className="grid gap-2">
              <label className="text-sm font-semibold text-ink">Létszám</label>
              <input
                name="capacity"
                type="number"
                min="1"
                max="99"
                defaultValue="20"
                className="input-field"
                required
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-semibold text-ink">Rövid leírás</label>
              <input
                name="description"
                list="description-suggestions"
                className="input-field"
                placeholder="Nyugodt, légzésre épülő gyakorlás."
                required
              />
              <datalist id="description-suggestions">
                {adminScheduleSuggestions.descriptions.map((item) => (
                  <option key={item} value={item} />
                ))}
              </datalist>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-semibold text-ink">Ismétlés</label>
              <select name="repeatMode" className="select-field" defaultValue="none">
                <option value="none">Nincs ismétlés</option>
                <option value="weekly">Hetente ismétlődik</option>
              </select>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-semibold text-ink">Hány hétre előre</label>
              <input
                name="repeatCount"
                type="number"
                min="1"
                max="24"
                defaultValue="1"
                className="input-field"
              />
            </div>
          </div>

          <label className="flex items-center gap-3 text-sm text-stone">
            <input type="checkbox" name="isRecurring" />
            Visszatérő alkalomként jelölöm
          </label>

          <p className="text-sm text-stone">
            A javaslatokból választhatsz, de bármelyik mezőbe szabadon is beírhatsz saját szöveget.
          </p>

          <div>
            <Button>Óra mentése</Button>
          </div>
        </form>

        <section className="card-surface rounded-[2rem] p-6">
          <p className="eyebrow">Mit befolyásol?</p>
          <div className="mt-4 space-y-4 text-stone">
            <p>Az itt felvitt dátumok jelennek meg a publikus órarend oldalon és a kezdőlapi rövid előnézetben is.</p>
            <p>Ha egy alkalom elmarad, a státuszt elég átállítani, nem kell újraírni az egész órarendet.</p>
            <p>Ha heti ismétlést állítasz be, a rendszer egyetlen mentéssel több hétre előre létrehozza ugyanazt az órát.</p>
          </div>
        </section>
      </div>

      <section className="mt-8 grid gap-4">
        <div>
          <p className="eyebrow">Aktuális listád</p>
          <h2 className="mt-3 text-3xl font-semibold text-ink">Mentett időpontok</h2>
        </div>

        {classes.length === 0 ? (
          <div className="card-surface rounded-[2rem] p-6 text-stone">
            Még nincs felvitt dátum. Az első alkalmat a fenti űrlappal tudod hozzáadni.
          </div>
        ) : null}

        {classes.map((item) => (
          <details key={item.id} className="card-surface overflow-hidden rounded-[2rem]" open={false}>
            <summary className="flex cursor-pointer list-none flex-col gap-3 px-6 py-5 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.16em] text-moss">{item.locationName}</p>
                <h3 className="mt-2 text-2xl font-semibold text-ink">{item.title}</h3>
                <p className="mt-2 text-stone">{formatDateRange(item.startsAt, item.endsAt)}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-sage/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-moss">
                  {item.status === "scheduled"
                    ? "Tervezett"
                    : item.status === "cancelled"
                      ? "Elmarad"
                      : "Megtartva"}
                </span>
                <span className="text-sm font-semibold text-stone">Megnyitás</span>
              </div>
            </summary>

            <div className="border-t border-stone/10 px-6 py-5">
              <form action={upsertClassSessionAction} className="grid gap-4">
                <input type="hidden" name="id" value={item.id} />
                <input type="hidden" name="repeatMode" value="none" />
                <input type="hidden" name="repeatCount" value="1" />

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <label className="text-sm font-semibold text-ink">Óra neve</label>
                    <input
                      name="title"
                      defaultValue={item.title}
                      list="class-title-suggestions"
                      className="input-field"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-semibold text-ink">Státusz</label>
                    <select name="status" defaultValue={item.status} className="select-field">
                      <option value="scheduled">Tervezett</option>
                      <option value="cancelled">Elmarad</option>
                      <option value="completed">Megtartva</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <label className="text-sm font-semibold text-ink">Kezdés</label>
                    <input
                      name="startsAtLocal"
                      type="datetime-local"
                      defaultValue={toStudioDateTimeLocalInput(item.startsAt)}
                      className="input-field"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-semibold text-ink">Befejezés</label>
                    <input
                      name="endsAtLocal"
                      type="datetime-local"
                      defaultValue={toStudioDateTimeLocalInput(item.endsAt)}
                      className="input-field"
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <label className="text-sm font-semibold text-ink">Helyszín neve</label>
                    <input
                      name="locationName"
                      defaultValue={item.locationName}
                      list="location-name-suggestions"
                      className="input-field"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-semibold text-ink">Pontos hely</label>
                    <input
                      name="locationAddress"
                      defaultValue={item.locationAddress}
                      list="location-address-suggestions"
                      className="input-field"
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-[0.35fr_1fr]">
                  <div className="grid gap-2">
                    <label className="text-sm font-semibold text-ink">Létszám</label>
                    <input
                      name="capacity"
                      type="number"
                      min="1"
                      max="99"
                      defaultValue={item.capacity}
                      className="input-field"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-semibold text-ink">Leírás</label>
                    <input
                      name="description"
                      defaultValue={item.description}
                      list="description-suggestions"
                      className="input-field"
                      required
                    />
                  </div>
                </div>

                <label className="flex items-center gap-3 text-sm text-stone">
                  <input type="checkbox" name="isRecurring" defaultChecked={item.isRecurring} />
                  Visszatérő alkalomként jelölöm
                </label>

                <div className="flex flex-wrap gap-3">
                  <Button>Módosítás mentése</Button>
                </div>
              </form>

              <form action={deleteClassSessionAction} className="mt-3">
                <input type="hidden" name="id" value={item.id} />
                <Button variant="ghost">Óra törlése</Button>
              </form>
            </div>
          </details>
        ))}
      </section>
    </AdminShell>
  );
}
