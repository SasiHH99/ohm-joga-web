import Link from "next/link";

import { contactInfo, mainNavigation } from "@/lib/site";
import type { SiteSettings } from "@/lib/types";

export function Footer({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="border-t border-stone/15 bg-ivory/60">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-[1fr_0.8fr_0.9fr] md:px-8">
        <div>
          <p className="font-display text-4xl text-ink">Ohm Jóga</p>
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
            <a href={`mailto:${settings.email}`} className="block text-ink">
              {settings.email}
            </a>
            <a href={`tel:${contactInfo.phoneHref}`} className="block text-ink">
              {contactInfo.phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
