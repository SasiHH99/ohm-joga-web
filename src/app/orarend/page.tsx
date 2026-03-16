import { ButtonLink } from "@/components/ui/button";
import { PageHero } from "@/components/site/page-hero";
import { getClasses, getServices } from "@/lib/data";
import { formatDateRange } from "@/lib/format";

export const metadata = {
  title: "Órarend",
  description:
    "Átlátható heti órarend dátummal, időponttal, helyszínnel, szabad helyekkel és közvetlen foglalási lehetőséggel.",
};

export default async function SchedulePage() {
  const [classes, services] = await Promise.all([getClasses(), getServices(true)]);

  return (
    <>
      <PageHero
        eyebrow="Órarend"
        title="Átlátható, konverzióra optimalizált órarend"
        description="Heti nézet helyett itt egy gyorsan áttekinthető, listás struktúra kapott prioritást mobilon és desktopon is."
        primaryCta={{ href: "/foglalas", label: "Foglalás indítása" }}
      />

      <section className="section-shell py-18 md:py-24">
        <div className="table-shell">
          <div className="grid grid-cols-[1.25fr_1fr_1fr_0.9fr] gap-4 border-b border-stone/10 px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-stone">
            <span>Óra</span>
            <span>Időpont</span>
            <span>Helyszín</span>
            <span>Foglalás</span>
          </div>
          {classes.map((item) => {
            const service = services.find((serviceItem) => serviceItem.id === item.serviceId);

            return (
              <div
                key={item.id}
                className="grid grid-cols-1 gap-4 border-b border-stone/10 px-6 py-6 md:grid-cols-[1.25fr_1fr_1fr_0.9fr]"
              >
                <div>
                  <h2 className="text-xl font-semibold text-ink">{item.title}</h2>
                  <p className="mt-2 text-sm text-stone">{service?.title}</p>
                  <p className="mt-2 text-sm text-stone">{item.description}</p>
                </div>
                <div className="text-sm leading-7 text-stone">{formatDateRange(item.startsAt, item.endsAt)}</div>
                <div className="text-sm leading-7 text-stone">
                  <p>{item.locationName}</p>
                  <p>{item.availableSpots} szabad hely / {item.capacity}</p>
                </div>
                <div className="flex items-start md:justify-end">
                  <ButtonLink href={`/foglalas?service=${item.serviceId}&class=${item.id}`}>
                    Foglalás
                  </ButtonLink>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
