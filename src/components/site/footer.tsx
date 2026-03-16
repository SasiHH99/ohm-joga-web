import Link from "next/link";

import { mainNavigation } from "@/lib/site";
import type { SiteSettings } from "@/lib/types";

export function Footer({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="border-t border-stone/15 bg-ivory/60">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-14 md:grid-cols-[1.2fr_0.8fr_1fr] md:px-8">
        <div>
          <p className="eyebrow">Ohm Jóga</p>
          <h3 className="mt-4 font-display text-3xl text-ink">
            Nyugodt tér a belső figyelemhez és a tudatos gyakorláshoz.
          </h3>
          <p className="mt-4 max-w-md text-stone">{settings.description}</p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.22em] text-stone">
            Oldalak
          </h4>
          <div className="mt-5 flex flex-col gap-3">
            {mainNavigation.map((item) => (
              <Link key={item.href} href={item.href} className="text-ink transition hover:text-moss">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.22em] text-stone">
            Elérhetőség
          </h4>
          <div className="mt-5 space-y-3 text-stone">
            <p>{settings.locationName}</p>
            <p>{settings.address}</p>
            <a href={`mailto:${settings.email}`} className="block text-ink">
              {settings.email}
            </a>
            <a href={`tel:${settings.phone.replace(/\s+/g, "")}`} className="block text-ink">
              {settings.phone}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
