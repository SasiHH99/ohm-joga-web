import { PageHero } from "@/components/site/page-hero";
import {
  locationItems,
  pricingItems,
  scheduleEntries,
  workshopNote,
} from "@/lib/site";

export const metadata = {
  title: "Órarend",
  description:
    "Egyszerűen áttekinthető órarend, árak, helyszínek és rövid workshop információ egy nyugodt, letisztult oldalon.",
};

export default function SchedulePage() {
  return (
    <>
      <PageHero
        eyebrow="Órarend"
        title="Heti órák, átlátható rendben."
        description="Az órarend letisztult formában mutatja a jelenlegi alkalmakat, az árakat és a helyszíneket."
      />

      <section className="section-shell py-18 md:py-24">
        <div className="grid gap-4">
          {scheduleEntries.map((item) => (
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
              {locationItems.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-[1.75rem] border border-sage/40 bg-sage/20 px-6 py-5 text-stone">
          {workshopNote}
        </div>
      </section>
    </>
  );
}
