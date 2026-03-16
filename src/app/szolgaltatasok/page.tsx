import { ButtonLink } from "@/components/ui/button";
import { PageHero } from "@/components/site/page-hero";
import { getServices } from "@/lib/data";
import { minutesToDurationLabel } from "@/lib/format";

export const metadata = {
  title: "Jógaórák és szolgáltatások",
  description:
    "Csoportos és egyéni jóga, kezdő programok, meditáció és tematikus workshopok átlátható szolgáltatási oldalon.",
};

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <>
      <PageHero
        eyebrow="Jógaórák"
        title="Szolgáltatások, amelyek valóban támogatják az utadat"
        description="Minden szolgáltatás külön üzleti blokkot kapott: leírással, célcsoporttal, időtartammal, árazással és foglalási CTA-val."
        primaryCta={{ href: "/foglalas", label: "Foglalás indítása" }}
        secondaryCta={{ href: "/orarend", label: "Órarend megtekintése" }}
      />

      <section className="section-shell py-18 md:py-24">
        <div className="grid gap-6">
          {services.map((service) => (
            <article
              key={service.id}
              className="grid gap-8 rounded-[2rem] border border-white/40 bg-ivory/70 p-6 shadow-[0_24px_90px_rgba(38,35,31,0.08)] md:grid-cols-[0.85fr_0.15fr]"
            >
              <div>
                <p className="eyebrow">{service.deliveryMode}</p>
                <h2 className="mt-4 font-display text-4xl text-ink">{service.title}</h2>
                <p className="mt-4 max-w-3xl text-lg leading-8 text-stone">
                  {service.description}
                </p>
                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  <div className="rounded-[1.25rem] bg-background/70 p-4">
                    <p className="text-sm uppercase tracking-[0.18em] text-stone">Kinek szól</p>
                    <p className="mt-2 text-sm leading-7 text-ink">{service.audience}</p>
                  </div>
                  <div className="rounded-[1.25rem] bg-background/70 p-4">
                    <p className="text-sm uppercase tracking-[0.18em] text-stone">Időtartam</p>
                    <p className="mt-2 text-sm leading-7 text-ink">
                      {minutesToDurationLabel(service.durationMinutes)}
                    </p>
                  </div>
                  <div className="rounded-[1.25rem] bg-background/70 p-4">
                    <p className="text-sm uppercase tracking-[0.18em] text-stone">Ár</p>
                    <p className="mt-2 text-sm leading-7 text-ink">{service.priceLabel}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-end justify-start md:justify-end">
                <ButtonLink href={`/foglalas?service=${service.id}`}>Foglalás</ButtonLink>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
