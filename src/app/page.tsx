import Image from "next/image";

import { ButtonLink } from "@/components/ui/button";
import { JsonLd } from "@/components/ui/json-ld";
import { SectionHeading } from "@/components/ui/section-heading";
import { getSettings, getUpcomingClasses } from "@/lib/data";
import { formatDateRange, formatWeekdayLong } from "@/lib/format";
import {
  audienceNotes,
  contactInfo,
  homeHeroText,
  imageLibrary,
  introductionText,
  introductionTitle,
  scheduleEntries,
  siteConfig,
  teachingSinceLabel,
} from "@/lib/site";

export const metadata = {
  title: "Kezdőlap",
  description:
    "Letisztult és spirituális jógaoldal bemutatkozással, órarenddel és egyszerű kapcsolati információkkal.",
};

export default async function HomePage() {
  const [settings, upcomingClasses] = await Promise.all([getSettings(), getUpcomingClasses(3)]);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SportsActivityLocation",
          name: settings.studioName,
          description: siteConfig.description,
          email: settings.email,
          telephone: contactInfo.phoneDisplay,
          url: siteConfig.siteUrl,
        }}
      />

      <section className="section-shell pt-8 md:pt-14">
        <div className="grid gap-8 overflow-hidden rounded-[2.75rem] border border-white/40 bg-[linear-gradient(135deg,rgba(255,252,247,0.94),rgba(229,214,196,0.36),rgba(222,230,221,0.24))] p-6 shadow-[0_30px_120px_rgba(57,49,39,0.10)] md:grid-cols-[1.05fr_0.95fr] md:p-10">
          <div className="flex flex-col justify-center">
            <p className="eyebrow">Ohm Jóga</p>
            <h1 className="mt-5 max-w-3xl font-display text-5xl leading-[1.02] text-ink md:text-7xl">
              {homeHeroText}
            </h1>
            <p className="mt-6 inline-flex w-fit rounded-full border border-sand/60 bg-ivory/80 px-4 py-2 text-sm tracking-[0.14em] text-moss">
              {teachingSinceLabel}
            </p>
            <div className="mt-8">
              <ButtonLink href="/orarend">Órarend megtekintése</ButtonLink>
            </div>
          </div>

          <div className="relative min-h-[24rem] overflow-hidden rounded-[2rem] bg-ivory md:min-h-[36rem]">
            <div className="absolute -right-8 top-10 h-40 w-40 rounded-full bg-sand/40 blur-3xl" />
            <div className="absolute bottom-5 left-5 z-10 max-w-xs rounded-[1.5rem] bg-ivory/88 p-5 shadow-xl backdrop-blur">
              <p className="eyebrow">Jelenlét és belső figyelem</p>
              <p className="mt-3 text-sm leading-7 text-stone">
                A gyakorlás itt nem sietség, hanem visszatalálás ahhoz a csendhez,
                ahol a test, a légzés és a belső figyelem újra egymásra találhat.
              </p>
            </div>
            <Image
              src={imageLibrary.hero}
              alt="Ohm Jóga hangulati kép"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      <section className="section-shell py-18 md:py-24">
        <div className="grid gap-10 md:grid-cols-[0.92fr_1.08fr] md:items-center">
          <div className="relative min-h-[25rem] overflow-hidden rounded-[2rem]">
            <Image
              src={imageLibrary.about}
              alt="Bemutatkozó portré"
              fill
              className="object-cover"
            />
          </div>

          <div className="card-surface rounded-[2rem] p-7 md:p-9">
            <SectionHeading eyebrow={introductionTitle} title="A jóga útja számomra belső tapasztalásból született." />
            <p className="mt-6 text-lg leading-9 text-stone">{introductionText}</p>
          </div>
        </div>
      </section>

      <section className="section-shell py-18 md:py-24">
        <SectionHeading
          eyebrow="Kinek szól?"
          title="Finomabb kapcsolódás azoknak, akik valódi jelenlétre vágynak."
          description="A gyakorlás nyitott azok felé, akik a jógában nem teljesítményt, hanem mélyebb önkapcsolatot keresnek."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {audienceNotes.map((item) => (
            <article key={item.title} className="card-surface rounded-[1.75rem] p-6">
              <h3 className="font-display text-3xl text-ink">{item.title}</h3>
              <p className="mt-4 text-base leading-8 text-stone">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell py-18 md:py-24">
        <SectionHeading
          eyebrow="Órarend"
          title="Következő alkalmak és heti ritmus egy külön oldalon összerendezve."
          description="A teljes dátumlista, időpontok és a jelölt napok a külön órarend oldalon jelennek meg."
        />

        <div className="mt-12 grid gap-4">
          {upcomingClasses.length > 0
            ? upcomingClasses.map((item) => (
                <div
                  key={item.id}
                  className="grid gap-3 rounded-[1.75rem] border border-white/40 bg-ivory/72 px-6 py-5 shadow-[0_20px_70px_rgba(57,49,39,0.07)] md:grid-cols-[0.95fr_1.15fr_0.9fr]"
                >
                  <div>
                    <p className="text-sm uppercase tracking-[0.18em] text-moss">
                      {formatWeekdayLong(item.startsAt)}
                    </p>
                    <p className="mt-2 text-stone">{formatDateRange(item.startsAt, item.endsAt)}</p>
                  </div>
                  <p className="text-lg font-semibold text-ink">{item.title}</p>
                  <p className="text-stone">{item.locationName}</p>
                </div>
              ))
            : scheduleEntries.map((item) => (
                <div
                  key={`${item.day}-${item.location}`}
                  className="grid gap-3 rounded-[1.75rem] border border-white/40 bg-ivory/72 px-6 py-5 shadow-[0_20px_70px_rgba(57,49,39,0.07)] md:grid-cols-[0.8fr_1fr_0.9fr]"
                >
                  <p className="text-sm uppercase tracking-[0.18em] text-moss">{item.day}</p>
                  <p className="text-lg font-semibold text-ink">{item.className}</p>
                  <p className="text-stone">{item.location}</p>
                </div>
              ))}
        </div>

        <div className="mt-8">
          <ButtonLink href="/orarend" variant="secondary">
            Teljes órarend és naptár
          </ButtonLink>
        </div>
      </section>

      <section className="section-shell pb-20 md:pb-24">
        <div className="grid gap-8 rounded-[2rem] bg-moss px-6 py-10 text-ivory shadow-[0_24px_90px_rgba(56,76,64,0.22)] md:grid-cols-[1fr_auto] md:items-center md:px-10">
          <div>
            <p className="eyebrow text-ivory/70">Kapcsolat</p>
            <h2 className="mt-4 font-display text-4xl md:text-5xl">
              Elérhetőség egyszerűen, közvetlenül.
            </h2>
            <div className="mt-5 space-y-2 text-lg text-ivory/85">
              <p>{contactInfo.phoneDisplay}</p>
              <p>{settings.email}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={`tel:${contactInfo.phoneHref}`} variant="secondary">
              Hívás
            </ButtonLink>
            <ButtonLink href={`mailto:${settings.email}`} variant="secondary">
              E-mail
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
