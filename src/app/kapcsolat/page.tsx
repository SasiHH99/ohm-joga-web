import { ContactForm } from "@/components/forms/contact-form";
import { PageHero } from "@/components/site/page-hero";
import { frequentlyAskedQuestions } from "@/lib/site";
import { getSettings } from "@/lib/data";

export const metadata = {
  title: "Kapcsolat",
  description:
    "Kapcsolatfelvételi űrlap, email, telefon, helyszíninformáció, social linkek és GYIK blokk.",
};

export default async function ContactPage() {
  const settings = await getSettings();

  return (
    <>
      <PageHero
        eyebrow="Kapcsolat"
        title="Kérdezz, érdeklődj, vagy indulj el egy személyes beszélgetéssel"
        description="A kapcsolat oldal nem zsákutca: egyformán működik inquiry, bizalomépítés és foglaláselőkészítés céljára."
      />

      <section className="section-shell py-18 md:py-24">
        <div className="grid gap-10 md:grid-cols-[0.92fr_1.08fr]">
          <div className="grid gap-5">
            <div className="card-surface rounded-[2rem] p-6">
              <p className="eyebrow">Elérhetőségek</p>
              <div className="mt-5 space-y-3 text-stone">
                <p>{settings.locationName}</p>
                <p>{settings.address}</p>
                <a href={`mailto:${settings.email}`} className="block text-ink">
                  {settings.email}
                </a>
                <a href={`tel:${settings.phone.replace(/\s+/g, "")}`} className="block text-ink">
                  {settings.phone}
                </a>
                <a href={settings.facebookUrl} target="_blank" className="block text-ink">
                  Facebook
                </a>
              </div>
            </div>

            <div className="card-surface rounded-[2rem] p-6">
              <p className="eyebrow">Helyszín / térkép</p>
              <div className="mt-5 rounded-[1.5rem] bg-gradient-to-br from-sand/30 via-ivory to-sage/30 p-8">
                <p className="text-lg font-semibold text-ink">{settings.locationName}</p>
                <p className="mt-2 text-stone">{settings.address}</p>
                <p className="mt-4 text-sm text-stone">
                  A pontos stúdióhelyszín settingsből vagy Supabase adminból konfigurálható.
                </p>
              </div>
            </div>
          </div>

          <ContactForm />
        </div>
      </section>

      <section className="section-shell pb-20 md:pb-24">
        <div className="grid gap-4">
          {frequentlyAskedQuestions.map((faq) => (
            <details key={faq.question} className="card-surface rounded-[1.5rem] p-5">
              <summary className="cursor-pointer text-lg font-semibold text-ink">
                {faq.question}
              </summary>
              <p className="mt-4 max-w-3xl leading-8 text-stone">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
