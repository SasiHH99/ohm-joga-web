import Image from "next/image";
import { ArrowRight, CalendarDays, MapPin, Sparkles } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { JsonLd } from "@/components/ui/json-ld";
import { SectionHeading } from "@/components/ui/section-heading";
import { getFeaturedBlogPosts, getSettings, getServices, getTestimonials, getUpcomingClasses } from "@/lib/data";
import { formatDateRange } from "@/lib/format";
import { featuredMetrics, imageLibrary, siteConfig } from "@/lib/site";

export const metadata = {
  title: "Kezdőlap",
  description:
    "Modern, prémium és emberi jógaoldal személyes történettel, órarenddel és foglalási rendszerrel.",
};

export default async function HomePage() {
  const [settings, services, classes, testimonials, posts] = await Promise.all([
    getSettings(),
    getServices(),
    getUpcomingClasses(3),
    getTestimonials(),
    getFeaturedBlogPosts(3),
  ]);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "HealthAndBeautyBusiness",
          name: settings.studioName,
          description: settings.description,
          email: settings.email,
          telephone: settings.phone,
          url: siteConfig.siteUrl,
        }}
      />

      <section className="section-shell pt-8 md:pt-14">
        <div className="grid gap-10 overflow-hidden rounded-[2.5rem] border border-white/40 bg-[linear-gradient(135deg,rgba(255,253,248,0.92),rgba(220,200,176,0.42),rgba(215,225,213,0.35))] p-6 shadow-[0_30px_120px_rgba(85,107,93,0.14)] md:grid-cols-[1.1fr_0.9fr] md:p-10">
          <div className="flex flex-col justify-between">
            <div className="animate-rise">
              <p className="eyebrow">Prémium jógaélmény magyarul</p>
              <h1 className="mt-5 max-w-3xl font-display text-6xl leading-none text-ink md:text-8xl">
                Kapcsolat önmagaddal a test, a légzés és a figyelem által.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-stone md:text-xl">
                Az Ohm Jóga személyes, nyugodt és modern teret ad azoknak, akik nem
                csak mozogni szeretnének, hanem valóban megérkezni önmagukhoz.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <ButtonLink href="/orarend">{settings.heroPrimaryCta}</ButtonLink>
                <ButtonLink href="/foglalas" variant="secondary">
                  {settings.heroSecondaryCta}
                </ButtonLink>
              </div>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {featuredMetrics.map((metric) => (
                <div key={metric.label} className="card-surface rounded-[1.5rem] p-4">
                  <p className="font-display text-4xl text-ink">{metric.value}</p>
                  <p className="mt-2 text-sm text-stone">{metric.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-[26rem] overflow-hidden rounded-[2rem] bg-ivory">
            <div className="absolute -left-10 top-8 h-36 w-36 rounded-full bg-sand/50 blur-3xl" />
            <div className="absolute bottom-4 right-4 z-10 max-w-xs rounded-[1.5rem] bg-ivory/92 p-5 shadow-xl backdrop-blur">
              <p className="eyebrow">Miben segít?</p>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-stone">
                <li>Testtudat és stabilitás fejlesztése</li>
                <li>Légzés és idegrendszer finomhangolása</li>
                <li>Belső béke és fókusz erősítése</li>
              </ul>
            </div>
            <Image
              src={imageLibrary.hero}
              alt="Ohm Jóga hero kép"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      <section className="section-shell py-18 md:py-24">
        <div className="grid gap-10 md:grid-cols-[0.85fr_1.15fr]">
          <div>
            <SectionHeading
              eyebrow="Rövid bemutatkozás"
              title="A jóga számomra nem szerep, hanem megélt út."
              description="A jelenlegi oldal személyes hangulatát megtartva az új felület a hitelességet, a szakmai keretet és a foglalási egyszerűséget egyszerre emeli ki."
            />
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="card-surface rounded-[1.75rem] p-6">
              <Sparkles className="text-moss" />
              <h3 className="mt-5 text-xl font-semibold text-ink">Kinek szól?</h3>
              <p className="mt-3 leading-8 text-stone">
                Kezdőknek, újrakezdőknek, túlterhelt hétköznapokban élőknek és
                mindenkinek, aki emberi és tiszta kapcsolódást keres a gyakorlásban.
              </p>
            </div>
            <div className="card-surface rounded-[1.75rem] p-6">
              <CalendarDays className="text-moss" />
              <h3 className="mt-5 text-xl font-semibold text-ink">Hogyan működik?</h3>
              <p className="mt-3 leading-8 text-stone">
                Választhatsz fix órát az órarendből vagy kérhetsz egyedi időpontot.
                A foglalás után automatikus visszaigazolást kapsz.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell py-18 md:py-24">
        <SectionHeading
          eyebrow="Szolgáltatások"
          title="Letisztult kínálat, valódi igényekre tervezve."
          description="Nem sablonos csomagok, hanem átlátható, üzletileg is jól működő szolgáltatási struktúra."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <article key={service.id} className="card-surface rounded-[2rem] p-6">
              <p className="eyebrow">{service.deliveryMode}</p>
              <h3 className="mt-4 font-display text-3xl text-ink">{service.title}</h3>
              <p className="mt-4 text-stone">{service.shortDescription}</p>
              <div className="mt-6 flex items-center justify-between text-sm text-stone">
                <span>{service.durationMinutes} perc</span>
                <span>{service.priceLabel}</span>
              </div>
              <ButtonLink
                href={`/foglalas?service=${service.id}`}
                variant="secondary"
                className="mt-7"
              >
                Foglalás indítása
              </ButtonLink>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell py-18 md:py-24">
        <SectionHeading
          eyebrow="Következő órák"
          title="Közelgő alkalmak és események"
          description="Az órarend blokk közvetlen konverziós belépési pontként működik a kezdőlapról."
        />
        <div className="mt-12 grid gap-5">
          {classes.map((session) => (
            <div
              key={session.id}
              className="card-surface flex flex-col gap-4 rounded-[1.75rem] p-6 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <h3 className="text-2xl font-semibold text-ink">{session.title}</h3>
                <p className="mt-2 text-stone">{formatDateRange(session.startsAt, session.endsAt)}</p>
                <p className="mt-1 text-sm text-stone">
                  {session.locationName} • {session.availableSpots} szabad hely
                </p>
              </div>
              <ButtonLink href={`/foglalas?service=${session.serviceId}&class=${session.id}`}>
                Óra foglalása
              </ButtonLink>
            </div>
          ))}
        </div>
      </section>

      <section className="section-shell py-18 md:py-24">
        <SectionHeading
          eyebrow="Vélemények"
          title="Bizalomépítés hiteles visszajelzésekkel"
          description="A nyelvezet szándékosan emberi és visszafogott, nem marketinges túlzás."
          align="center"
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <blockquote key={item.id} className="card-surface rounded-[1.75rem] p-6">
              <p className="text-lg leading-8 text-ink">“{item.quote}”</p>
              <footer className="mt-6 text-sm text-stone">
                {item.authorName} • {item.authorRole}
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="section-shell py-18 md:py-24">
        <div className="grid gap-8 md:grid-cols-[1fr_0.9fr]">
          <div>
            <SectionHeading
              eyebrow="Tudástár"
              title="A mostani filozófiai hang megmarad, csak végre profi blogrendszerben."
              description="Kiemelt cikkek, kereshető tudástár, kategóriák és SEO-barát szerkezet."
            />
            <div className="mt-8">
              <ButtonLink href="/blog" variant="secondary">
                Tudástár megnyitása
              </ButtonLink>
            </div>
          </div>
          <div className="grid gap-5">
            {posts.map((post) => (
              <article key={post.id} className="card-surface rounded-[1.75rem] p-6">
                <p className="eyebrow">{post.readTime}</p>
                <h3 className="mt-4 text-2xl font-semibold text-ink">{post.title}</h3>
                <p className="mt-3 text-stone">{post.excerpt}</p>
                <ButtonLink
                  href={`/blog/${post.slug}`}
                  variant="ghost"
                  className="mt-6 self-start"
                >
                  Tovább olvasom <ArrowRight size={16} className="ml-2" />
                </ButtonLink>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell pb-20 md:pb-24">
        <div className="grid gap-6 rounded-[2rem] bg-moss px-6 py-10 text-ivory md:grid-cols-[1fr_auto] md:items-center md:px-10">
          <div>
            <p className="eyebrow text-ivory/70">Kapcsolat és helyszín</p>
            <h2 className="mt-4 font-display text-4xl md:text-5xl">Kérdésed van, vagy inkább egyeztetnél?</h2>
            <div className="mt-5 flex flex-col gap-3 text-ivory/80 md:flex-row md:gap-6">
              <span className="inline-flex items-center gap-2">
                <MapPin size={16} /> {settings.locationName}
              </span>
              <span>{settings.email}</span>
              <span>{settings.phone}</span>
            </div>
          </div>
          <ButtonLink href="/kapcsolat" variant="secondary">
            Kapcsolatfelvétel
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
