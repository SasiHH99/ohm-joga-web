import { PageHero } from "@/components/site/page-hero";
import { PublicCalendarExplorer } from "@/components/site/public-calendar-explorer";
import { getCalendarDays, getClasses } from "@/lib/data";
import { formatDateRange, formatWeekdayLong } from "@/lib/format";
import {
  locationItems,
  pricingItems,
  scheduleEntries,
  workshopNote,
} from "@/lib/site";

export const metadata = {
  title: "Órarend",
  description:
    "Egyszerűen átlátható órarend dátumokkal, időpontokkal, helyszínekkel és jelölt naptárnapokkal.",
};

export default async function SchedulePage() {
  const [classes, markedDays] = await Promise.all([getClasses(), getCalendarDays()]);

  const displayLocations =
    classes.length > 0
      ? Array.from(
          new Map(
            classes.map((item) => [
              `${item.locationName}::${item.locationAddress}`,
              `${item.locationName}: ${item.locationAddress}`,
            ]),
          ).values(),
        )
      : locationItems;

  return (
    <>
      <PageHero
        eyebrow="Órarend"
        title="Aktuális dátumok, időpontok és nyugodt rend."
        description="Az órarend itt már nem csak heti vázlatként jelenik meg: a közelgő alkalmak pontos dátummal, idővel és naptárnézettel láthatók."
      />

      <section className="section-shell py-18 md:py-24">
        <div className="grid gap-4">
          {classes.length > 0
            ? classes.map((item) => (
                <article
                  key={item.id}
                  className="grid gap-4 rounded-[1.75rem] border border-white/40 bg-ivory/72 px-6 py-5 shadow-[0_20px_70px_rgba(57,49,39,0.07)] md:grid-cols-[0.9fr_1.05fr_0.85fr]"
                >
                  <div>
                    <p className="text-sm uppercase tracking-[0.18em] text-moss">
                      {formatWeekdayLong(item.startsAt)}
                    </p>
                    <p className="mt-2 text-stone">{formatDateRange(item.startsAt, item.endsAt)}</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-ink">{item.title}</p>
                    <p className="mt-2 text-stone">{item.description}</p>
                  </div>
                  <p className="text-stone">{item.locationName}</p>
                </article>
              ))
            : scheduleEntries.map((item) => (
                <article
                  key={`${item.day}-${item.location}`}
                  className="grid gap-3 rounded-[1.75rem] border border-white/40 bg-ivory/72 px-6 py-5 shadow-[0_20px_70px_rgba(57,49,39,0.07)] md:grid-cols-[0.75fr_1fr_0.9fr]"
                >
                  <p className="text-sm uppercase tracking-[0.18em] text-moss">{item.day}</p>
                  <p className="text-lg font-semibold text-ink">{item.className}</p>
                  <p className="text-stone">{item.location}</p>
                </article>
              ))}
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="card-surface rounded-[1.75rem] p-6">
            <p className="eyebrow">Árak</p>
            <div className="mt-5 space-y-3 text-lg leading-8 text-stone">
              {pricingItems.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          </div>

          <div className="card-surface rounded-[1.75rem] p-6">
            <p className="eyebrow">Helyszínek</p>
            <div className="mt-5 space-y-3 text-lg leading-8 text-stone">
              {displayLocations.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-[1.75rem] border border-sage/40 bg-sage/20 px-6 py-5 text-stone">
          {workshopNote}
        </div>
      </section>

      <section className="section-shell pb-20 md:pb-24">
        <div className="mb-8">
          <p className="eyebrow">Naptár</p>
          <h2 className="mt-3 font-display text-4xl text-ink md:text-5xl">
            Jelölt napok és közelgő alkalmak egy nézetben.
          </h2>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-stone">
            A naptár külön jelöli az órás napokat, a szabadnapokat és azokat a napokat is, amikor nincs alkalom.
          </p>
        </div>

        {classes.length === 0 && markedDays.length === 0 ? (
          <div className="card-surface rounded-[2rem] p-6 text-stone">
            A naptárjelölések feltöltés alatt állnak.
          </div>
        ) : (
          <PublicCalendarExplorer classes={classes} markedDays={markedDays} />
        )}
      </section>
    </>
  );
}
