import { env } from "@/lib/env";

export const siteConfig = {
  name: "Ohm Jóga",
  siteUrl: env.siteUrl,
  description:
    "Prémium, nyugodt és letisztult jógaélmény magyar nyelven, foglalási rendszerrel, tudástárral és adminfelülettel.",
  locationLabel: "Személyes órák és online kapcsolódás",
};

export const mainNavigation = [
  { href: "/", label: "Kezdőlap" },
  { href: "/rolam", label: "Rólam" },
  { href: "/szolgaltatasok", label: "Jógaórák" },
  { href: "/orarend", label: "Órarend" },
  { href: "/blog", label: "Tudástár" },
  { href: "/kapcsolat", label: "Kapcsolat" },
];

export const adminNavigation = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/foglalasok", label: "Foglalások" },
  { href: "/admin/orarend", label: "Órarend" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/szolgaltatasok", label: "Szolgáltatások" },
  { href: "/admin/uzenetek", label: "Üzenetek" },
  { href: "/admin/velemenyek", label: "Vélemények" },
  { href: "/admin/media", label: "Média" },
];

export const featuredMetrics = [
  { value: "2021", label: "óta tartó jógaoktatás" },
  { value: "5", label: "fókuszált szolgáltatási pillér" },
  { value: "1:1", label: "személyes figyelem az egyéni órákon" },
];

export const aboutValues = [
  {
    title: "Személyesség",
    description:
      "A gyakorlás itt nem futószalag. Figyelmet, ritmust és valódi jelenlétet kapsz.",
  },
  {
    title: "Hitelesség",
    description:
      "A tanítás személyes tapasztalatból nőtt ki: légzésből, gyógyulásból és belső munkából.",
  },
  {
    title: "Letisztultság",
    description:
      "Minden óra úgy van felépítve, hogy a gyakorlás egyszerre legyen befogadható és mély.",
  },
];

export const frequentlyAskedQuestions = [
  {
    question: "Kezdőként is csatlakozhatok?",
    answer:
      "Igen. A kezdő órák és az egyéni alkalmak kifejezetten úgy vannak kialakítva, hogy biztonságosan és érthetően tudj elindulni.",
  },
  {
    question: "Mit vigyek magammal az órára?",
    answer:
      "Kényelmes ruhát, egy nyitott figyelmet, és ha van, saját matracot. A részleteket a visszaigazoló emailben is megkapod.",
  },
  {
    question: "Le lehet mondani a foglalást?",
    answer:
      "Igen. Az adminfelületen a foglalások státusza kezelhető, az érdeklődők pedig emailben vagy telefonon is jelezhetik a lemondást.",
  },
  {
    question: "Van online lehetőség?",
    answer:
      "Igen. Légzés, meditáció és egyéni támogatás online formában is elérhető, ha ez jobban illeszkedik az élethelyzetedhez.",
  },
];

export const bookingBenefits = [
  "Egyszerű, magyar nyelvű foglalási folyamat",
  "Kapacitáskezelés és státuszkövetés adminból",
  "Automatikus email visszaigazolás",
  "Egyedi időpontkérés lehetősége, ha nincs megfelelő sáv",
];

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
