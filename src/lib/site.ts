import { env } from "@/lib/env";

function getSafeSiteUrl() {
  try {
    return new URL(env.siteUrl).toString();
  } catch {
    return "https://ohm-joga-web.vercel.app";
  }
}

export const siteConfig = {
  name: "Ohm Jóga",
  siteUrl: getSafeSiteUrl(),
  description:
    "Letisztult, spirituális hangulatú jógaoldal bemutatkozással, órarenddel és kapcsolati információkkal.",
  locationLabel: "Mezőtúr és Gyomaendrőd",
};

export const mainNavigation = [
  { href: "/", label: "Kezdőlap" },
  { href: "/rolam", label: "Bemutatkozás" },
  { href: "/orarend", label: "Órarend" },
  { href: "/blog", label: "Blog" },
  { href: "/kapcsolat", label: "Kapcsolat" },
];

export const adminNavigation = [
  { href: "/admin", label: "Áttekintés" },
  { href: "/admin/orarend", label: "Órarend" },
  { href: "/admin/naptar", label: "Naptár" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/media", label: "Média" },
];

export const contactInfo = {
  phoneDisplay: "06 70 385 6749",
  phoneHref: "+36703856749",
};

export const homeHeroText =
  "Az Ohm az első, egyetemes mantra, mely a bennünk élő Egység visszhangja. Az Ohm-jóga a Brahmanhoz való visszatérés szimbolikájaként jelenik meg. A testi és lelki gyakorlás általi megérkezés valódi Önmagunkhoz.";

export const teachingSinceLabel = "2021 óta tartó jógaoktatás";

export const introductionTitle = "Rövid bemutatkozás";

export const introductionText =
  "Egy hosszú belső utazás és megélt tapasztalatok, amik a jóga útjára vittek. A meditáció és a pránajáma volt az első, ami a gyakorlásomban megjelent, később az ászanák, mint a testtel való mély kapcsolódás alapjai vittek tovább. Egy bő évtizednyi tapasztalat pedig megmutatta, hogy hogyan tudom átadni a megszerzett tudást a jóga eszköztárán keresztül úgy, hogy a tradíció mélysége és a jelen kor tapasztalata mind teret nyerve a mai korhoz igazodva teljes egységet alkothassanak.";

export const audienceNotes = [
  {
    title: "Akik csendesebb belső ritmust keresnek",
    description:
      "Azoknak, akik szeretnének kiszállni a hétköznapok állandó zajából, és finomabb figyelemmel fordulni önmaguk felé.",
  },
  {
    title: "Akik a testtel is újra kapcsolódnának",
    description:
      "A gyakorlás támaszt ad abban, hogy a mozdulat, a légzés és a belső jelenlét ne váljon szét egymástól.",
  },
  {
    title: "Akik nem teljesítményt, hanem mélységet keresnek",
    description:
      "Itt nem a külső forma kerül előtérbe, hanem az a tér, ahol a gyakorlás valóban önismeretté válhat.",
  },
];

export const scheduleEntries = [
  { day: "Hétfő", className: "kezdő jóga", location: "Mezőtúr" },
  { day: "Szerda", className: "középhaladó jóga", location: "Gyomaendrőd" },
  { day: "Csütörtök", className: "középhaladó jóga", location: "Mezőtúr" },
];

export const pricingItems = [
  "Ár: 3000 Ft / alkalom",
  "8 alkalmas bérlet: 20 000 Ft",
  "A bérlet 10 hétig használható fel.",
];

export const locationItems = [
  "Mezőtúr: Karcagi Szakképzési Centrum (626)",
  "Gyomaendrőd: Mozgáskultúra Stúdió",
];

export const workshopNote =
  "Workshopok időről időre indulnak, évente 1–2 alkalommal.";

export const imageLibrary = {
  hero:
    "https://267a11ce2e.cbaul-cdnwnd.com/89e3e6c30a1cd3cf1fb6f9f97db78804/200000004-2431a2431c/IMG_4083.jpeg?ph=267a11ce2e",
  about:
    "https://267a11ce2e.cbaul-cdnwnd.com/89e3e6c30a1cd3cf1fb6f9f97db78804/200000002-9961199613/J%C3%B3ga%20h%C3%A1tt%C3%A9rk%C3%A9p-.jpeg?ph=267a11ce2e",
  warrior:
    "https://267a11ce2e.cbaul-cdnwnd.com/89e3e6c30a1cd3cf1fb6f9f97db78804/200000007-039b0039b2/IMG_4074.jpeg?ph=267a11ce2e",
  hipOpening:
    "https://267a11ce2e.cbaul-cdnwnd.com/89e3e6c30a1cd3cf1fb6f9f97db78804/200000005-49f2249f23/IMG_4195.jpeg?ph=267a11ce2e",
  meditation:
    "https://267a11ce2e.cbaul-cdnwnd.com/89e3e6c30a1cd3cf1fb6f9f97db78804/200000006-897f5897f6/IMG_4212.jpeg?ph=267a11ce2e",
  sunSalute:
    "https://267a11ce2e.cbaul-cdnwnd.com/89e3e6c30a1cd3cf1fb6f9f97db78804/200000026-9e55c9e55e/nap%C3%BCdv%C3%B6zlet.jpeg?ph=267a11ce2e",
  articleMovement:
    "https://267a11ce2e.cbaul-cdnwnd.com/89e3e6c30a1cd3cf1fb6f9f97db78804/200000024-d25b9d25bb/%C3%A1szana%2C%20l%C3%A9lek.jpeg?ph=267a11ce2e",
};
