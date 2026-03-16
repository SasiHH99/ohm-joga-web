import Link from "next/link";

import { ButtonLink } from "@/components/ui/button";
import { mainNavigation } from "@/lib/site";
import { MobileNav } from "@/components/site/mobile-nav";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/30 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <Link href="/" className="font-display text-3xl text-ink">
          Ohm Jóga
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {mainNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-stone transition hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <ButtonLink href="/foglalas">Óra foglalása</ButtonLink>
        </div>

        <MobileNav />
      </div>
    </header>
  );
}
