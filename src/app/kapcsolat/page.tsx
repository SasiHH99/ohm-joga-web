import { ButtonLink } from "@/components/ui/button";
import { PageHero } from "@/components/site/page-hero";
import { getSettings } from "@/lib/data";
import { contactInfo } from "@/lib/site";

export const metadata = {
  title: "Kapcsolat",
  description:
    "Egyszerű kapcsolat oldal telefonszámmal és e-mail címmel, felesleges űrlapok és marketinges blokkok nélkül.",
};

export default async function ContactPage() {
  const settings = await getSettings();

  return (
    <>
      <PageHero
        eyebrow="Kapcsolat"
        title="Kapcsolat"
        description="Ha kérdésed van, telefonon vagy e-mailben tudsz legegyszerűbben kapcsolódni."
      />

      <section className="section-shell py-18 md:py-24">
        <div className="mx-auto grid max-w-4xl gap-6 rounded-[2rem] border border-white/40 bg-ivory/72 p-6 shadow-[0_24px_90px_rgba(57,49,39,0.08)] md:grid-cols-[1fr_auto] md:items-center md:p-8">
          <div className="space-y-4">
            <div>
              <p className="eyebrow">Telefonszám</p>
              <p className="mt-2 text-2xl font-semibold text-ink">
                {contactInfo.phoneDisplay}
              </p>
            </div>
            <div>
              <p className="eyebrow">E-mail</p>
              <p className="mt-2 text-2xl font-semibold text-ink">{settings.email}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
            <ButtonLink href={`tel:${contactInfo.phoneHref}`}>Hívás</ButtonLink>
            <ButtonLink href={`mailto:${settings.email}`} variant="secondary">
              E-mail
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
