"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { mainNavigation } from "@/lib/site";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label="Menü megnyitása"
        className="rounded-full border border-stone/20 bg-ivory p-3 text-ink"
        onClick={() => setOpen((current) => !current)}
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm">
          <div className="ml-auto flex h-full w-[80%] max-w-sm flex-col bg-background px-6 py-8 shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="font-display text-2xl text-ink">Ohm Jóga</span>
              <button
                type="button"
                aria-label="Menü bezárása"
                className="rounded-full border border-stone/20 p-3"
                onClick={() => setOpen(false)}
              >
                <X size={18} />
              </button>
            </div>
            <nav className="mt-10 flex flex-1 flex-col gap-5">
              {mainNavigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-lg text-ink"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      ) : null}
    </div>
  );
}
