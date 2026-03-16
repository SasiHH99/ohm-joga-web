import Image from "next/image";

import { PageHero } from "@/components/site/page-hero";
import { introductionText, imageLibrary, introductionTitle, teachingSinceLabel } from "@/lib/site";

export const metadata = {
  title: "Bemutatkozás",
  description:
    "Személyes hangú bemutatkozás az Ohm Jóga útjáról, a meditációról, a pránajámáról és az ászanák megtartó erejéről.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Bemutatkozás"
        title="Egy hosszú belső utazás tapasztalata a gyakorlásban és az átadásban."
        description="A jóga számomra nem szerep, hanem megélt út: csend, légzés, ászana és jelenlét egyetlen finomabb egységben."
      />

      <section className="section-shell py-18 md:py-24">
        <div className="grid gap-10 md:grid-cols-[0.95fr_1.05fr] md:items-start">
          <div className="relative min-h-[34rem] overflow-hidden rounded-[2rem]">
            <Image
              src={imageLibrary.about}
              alt="Ohm Jóga portré"
              fill
              className="object-cover"
            />
          </div>

          <div className="card-surface rounded-[2rem] p-7 md:p-9">
            <p className="eyebrow">{introductionTitle}</p>
            <p className="mt-6 text-lg leading-9 text-stone">{introductionText}</p>
            <p className="mt-6 rounded-full border border-sand/60 bg-ivory/80 px-4 py-2 text-sm tracking-[0.14em] text-moss">
              {teachingSinceLabel}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
