import { ButtonLink } from "@/components/ui/button";

export function PageHero({
  eyebrow,
  title,
  description,
  primaryCta,
  secondaryCta,
}: {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta?: { href: string; label: string };
  secondaryCta?: { href: string; label: string };
}) {
  return (
    <section className="section-shell pt-14 md:pt-20">
      <div className="relative overflow-hidden rounded-[2rem] border border-white/40 bg-gradient-to-br from-sand/30 via-ivory to-sage/20 px-6 py-14 shadow-[0_30px_120px_rgba(85,107,93,0.12)] md:px-10">
        <div className="absolute inset-y-0 right-0 hidden w-1/3 bg-[radial-gradient(circle_at_center,_rgba(85,107,93,0.18),_transparent_70%)] md:block" />
        <div className="relative max-w-3xl">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="mt-4 font-display text-5xl leading-none text-ink md:text-7xl">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-stone">{description}</p>
          {primaryCta || secondaryCta ? (
            <div className="mt-8 flex flex-wrap gap-4">
              {primaryCta ? <ButtonLink href={primaryCta.href}>{primaryCta.label}</ButtonLink> : null}
              {secondaryCta ? (
                <ButtonLink href={secondaryCta.href} variant="secondary">
                  {secondaryCta.label}
                </ButtonLink>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
