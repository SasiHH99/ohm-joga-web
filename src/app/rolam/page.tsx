import Image from "next/image";

import { PageHero } from "@/components/site/page-hero";
import { JsonLd } from "@/components/ui/json-ld";
import { aboutValues, imageLibrary, siteConfig } from "@/lib/site";

export const metadata = {
  title: "Rólam",
  description:
    "Hiteles, személyes bemutatkozás modern szerkezetben: az egyéni út, a tapasztalat és a jógaoktatói szemlélet.",
};

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Attila",
          jobTitle: "Jógaoktató",
          worksFor: { "@type": "Organization", name: siteConfig.name },
        }}
      />

      <PageHero
        eyebrow="Rólam"
        title="Egy személyes történetből született tanítás"
        description="A jelenlegi oldal hangulatából azt tartottam meg, ami valódi: a belső út, a légzés, a gyógyulás és az, hogy a jóga itt nem külsőség, hanem megélt tapasztalat."
        primaryCta={{ href: "/foglalas", label: "Első óra foglalása" }}
        secondaryCta={{ href: "/kapcsolat", label: "Kapcsolatfelvétel" }}
      />

      <section className="section-shell py-18 md:py-24">
        <div className="grid gap-10 md:grid-cols-[0.95fr_1.05fr] md:items-start">
          <div className="relative min-h-[36rem] overflow-hidden rounded-[2rem]">
            <Image src={imageLibrary.about} alt="Ohm Jóga portré" fill className="object-cover" />
            <div className="absolute bottom-5 left-5 rounded-[1.5rem] bg-ivory/90 px-5 py-4 shadow-xl backdrop-blur">
              <p className="text-sm uppercase tracking-[0.2em] text-moss">Portré hely</p>
              <p className="mt-1 font-display text-2xl text-ink">Attila • Ohm Jóga</p>
            </div>
          </div>

          <div>
            <p className="eyebrow">Személyes történet</p>
            <div className="mt-6 space-y-5 text-lg leading-9 text-stone">
              <p>
                A mostani oldal egyik legerősebb eleme a személyes hang. Ezt nem
                tompítottam le, inkább strukturáltam: megszületett egy olyan Rólam oldal,
                amely egyszerre emberi és professzionális.
              </p>
              <p>
                A történet gyökere egy gyógyíthatatlannak mondott betegséggel való együttélés,
                a befelé figyelésből fakadó változás és az a felismerés, hogy a légzés nem
                csak technika, hanem kapu is lehet a belső stabilitáshoz.
              </p>
              <p>
                A jóga először légzésként érkezett, később ászanákon keresztül mélyült tovább.
                Az oktatás 2021-ben indult el, de a mögötte lévő tapasztalat sokkal korábban
                kezdődött: sporttal, testmunkával, önismerettel és csenddel.
              </p>
              <p>
                Nem egy merev tanítványi láncolat reprodukálása a cél, hanem egy olyan
                befogadható, mégis mély gyakorlási tér, amely a jelenkor emberének is működik.
              </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {aboutValues.map((item) => (
                <div key={item.title} className="card-surface rounded-[1.5rem] p-5">
                  <h3 className="text-lg font-semibold text-ink">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-stone">{item.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-[1.75rem] border border-sand/30 bg-ivory/70 p-6">
              <p className="eyebrow">Aláírás blokk</p>
              <p className="mt-4 font-display text-4xl text-ink">Attila</p>
              <p className="mt-2 text-stone">
                Jógaoktató • légzés, jelenlét, stabilitás
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
