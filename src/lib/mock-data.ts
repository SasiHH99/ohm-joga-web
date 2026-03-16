import { addDays, addHours, set, startOfDay, startOfWeek } from "date-fns";

import { imageLibrary } from "@/lib/site";
import type {
  BlogCategory,
  BlogPost,
  Booking,
  ClassSession,
  ContactMessage,
  DashboardStats,
  MediaAsset,
  Service,
  SiteSettings,
  Testimonial,
} from "@/lib/types";

const studioAddress =
  "A pontos személyes helyszínt a foglalás visszaigazolásában küldjük el.";

export const mockSettings: SiteSettings = {
  studioName: "Ohm Jóga",
  tagline: "Kapcsolat önmagaddal a test, a légzés és a figyelem által.",
  description:
    "Prémium, nyugodt, konverzióra optimalizált jógaoldal személyes történettel, tudástárral és adminfelülettel.",
  email: "jogaattilaval@gmail.com",
  phone: "+36 30 123 4567",
  address: studioAddress,
  locationName: "Személyes alkalmak és online kapcsolódás",
  mapEmbedUrl: "",
  instagramUrl: "https://instagram.com/",
  facebookUrl: "https://www.facebook.com/attila.valkovszki",
  heroPrimaryCta: "Órarend megtekintése",
  heroSecondaryCta: "Óra foglalása",
};

export const mockServices: Service[] = [
  {
    id: "service-group",
    slug: "csoportos-jogaora",
    title: "Csoportos jógaóra",
    shortDescription:
      "Kis létszámú, vezetett gyakorlás, ahol az erő, a földeltség és a figyelem együtt mélyül.",
    description:
      "A csoportos órák a tradicionális jóga szemléletét hozzák közel a mai ember ritmusához. A fókusz a légzésen, a stabilitáson és a fokozatos testtudaton van.",
    audience:
      "Azoknak, akik rendszeres, mégis személyes hangvételű gyakorlásra vágynak.",
    durationMinutes: 75,
    priceLabel: "4 900 Ft / alkalom",
    deliveryMode: "Személyesen",
    isActive: true,
    featured: true,
    sortOrder: 1,
  },
  {
    id: "service-private",
    slug: "egyeni-jogaora",
    title: "Egyéni jógaóra",
    shortDescription:
      "Személyre szabott gyakorlás egészségi állapot, célok és aktuális élethelyzet alapján.",
    description:
      "Egyéni órán teljes figyelem jut a testtartásodra, a légzésedre és arra, hogy milyen ritmus támogat leginkább.",
    audience:
      "Akik személyes iránymutatást, biztonságos indulást vagy célzott fejlődést keresnek.",
    durationMinutes: 60,
    priceLabel: "12 900 Ft / alkalom",
    deliveryMode: "Személyesen vagy online",
    isActive: true,
    featured: true,
    sortOrder: 2,
  },
  {
    id: "service-beginner",
    slug: "kezdo-joga",
    title: "Kezdő jóga",
    shortDescription:
      "Nyugodt, strukturált belépő a jóga világába, érthető felépítéssel és fokozatossággal.",
    description:
      "A kezdő program biztonságos alapokra épít. Megtanulod a főbb pózok logikáját, a légzés szerepét és a terhelés helyes adagolását.",
    audience:
      "Első órázóknak vagy azoknak, akik hosszabb kihagyás után szeretnének visszatérni.",
    durationMinutes: 75,
    priceLabel: "4 500 Ft / alkalom",
    deliveryMode: "Személyesen",
    isActive: true,
    featured: true,
    sortOrder: 3,
  },
  {
    id: "service-breath",
    slug: "meditacio-legzogyakorlat",
    title: "Meditáció és légzőgyakorlat",
    shortDescription:
      "Lassítás, belső rendeződés és idegrendszeri szabályozás a figyelem és a légzés segítségével.",
    description:
      "A meditációs és légző alkalmak a pránajáma és az elcsendesedés eszközeit hozzák közel, egyszerűen és hétköznapi nyelven.",
    audience:
      "Akik sok mentális zajjal élnek, és szeretnének egy egyszerű, megtartható belső gyakorlatot.",
    durationMinutes: 60,
    priceLabel: "4 200 Ft / alkalom",
    deliveryMode: "Online vagy személyesen",
    isActive: true,
    featured: false,
    sortOrder: 4,
  },
  {
    id: "service-workshop",
    slug: "workshop-es-kulonleges-esemenyek",
    title: "Workshopok és különleges események",
    shortDescription:
      "Tematikus elmélyülések ászana, filozófia, légzés vagy évszakos belső munka mentén.",
    description:
      "A workshopok hosszabb, fókuszált alkalmak, ahol több tér jut az összefüggések, a technika és a belső folyamatok kibontására.",
    audience:
      "Azoknak, akik a heti órákon túl is szeretnének mélyebben kapcsolódni a gyakorláshoz.",
    durationMinutes: 150,
    priceLabel: "Érdeklődj az aktuális eseményekről",
    deliveryMode: "Személyesen vagy online",
    isActive: true,
    featured: false,
    sortOrder: 5,
  },
];

function buildSession(
  id: string,
  serviceId: string,
  dayOffset: number,
  hour: number,
  minute: number,
  durationMinutes: number,
  title: string,
  description: string,
  capacity: number,
  reserved: number,
  locationName: string,
  locationAddress: string,
  isRecurring = true,
): ClassSession {
  const today = startOfDay(new Date());
  const base = startOfWeek(today, { weekStartsOn: 1 });
  const startsAt = set(addDays(base, dayOffset), {
    hours: hour,
    minutes: minute,
    seconds: 0,
    milliseconds: 0,
  });
  const normalizedStart = startsAt < today ? addDays(startsAt, 7) : startsAt;

  return {
    id,
    serviceId,
    title,
    description,
    startsAt: normalizedStart.toISOString(),
    endsAt: addHours(normalizedStart, durationMinutes / 60).toISOString(),
    locationName,
    locationAddress,
    capacity,
    availableSpots: Math.max(capacity - reserved, 0),
    status: "scheduled",
    isRecurring,
  };
}

export const mockClasses: ClassSession[] = [
  buildSession(
    "class-grounded-flow",
    "service-group",
    1,
    18,
    0,
    75,
    "Esti földelő áramlás",
    "Légzésközpontú, erősítő és idegrendszert kiegyensúlyozó gyakorlás.",
    14,
    6,
    "Ohm Jóga közösségi terem",
    studioAddress,
  ),
  buildSession(
    "class-beginner-sat",
    "service-beginner",
    5,
    9,
    30,
    75,
    "Kezdő jóga alapok",
    "Biztonságos belépő, részletes vezetéssel és letisztult tempóval.",
    12,
    4,
    "Ohm Jóga közösségi terem",
    studioAddress,
  ),
  buildSession(
    "class-breath-online",
    "service-breath",
    2,
    19,
    0,
    60,
    "Légzés és belső csend",
    "Online alkalom pránajáma és vezetett meditáció fókuszokkal.",
    20,
    11,
    "Online Zoom alkalom",
    "Online csatlakozási link a visszaigazolásban",
  ),
  buildSession(
    "class-sunrise-flow",
    "service-group",
    3,
    7,
    0,
    60,
    "Reggeli finom átmozgatás",
    "Lágyabb, mégis ébresztő gyakorlás a nap tiszta indításához.",
    10,
    3,
    "Ohm Jóga közösségi terem",
    studioAddress,
  ),
  buildSession(
    "class-workshop-monthly",
    "service-workshop",
    6,
    14,
    0,
    150,
    "Workshop: kapcsolat önmagaddal",
    "Tematikus elmélyülés ászana, légzés és belső figyelem mentén.",
    18,
    7,
    "Különleges eseménytér",
    studioAddress,
    false,
  ),
];

export const mockBookings: Booking[] = [
  {
    id: "booking-001",
    serviceId: "service-group",
    classId: "class-grounded-flow",
    requestType: "scheduled",
    preferredDate: null,
    name: "Kovács Anna",
    email: "anna@example.com",
    phone: "+36 30 111 2233",
    note: "Első alkalom, enyhe derékfájással.",
    status: "confirmed",
    privacyAccepted: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "booking-002",
    serviceId: "service-private",
    classId: null,
    requestType: "custom",
    preferredDate: addDays(new Date(), 4).toISOString(),
    name: "Nagy Júlia",
    email: "julia@example.com",
    phone: "+36 20 555 6677",
    note: "Egyéni óra érdekel, online is jó.",
    status: "pending",
    privacyAccepted: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "booking-003",
    serviceId: "service-breath",
    classId: "class-breath-online",
    requestType: "scheduled",
    preferredDate: null,
    name: "Varga Péter",
    email: "peter@example.com",
    phone: "+36 70 222 3344",
    note: "",
    status: "confirmed",
    privacyAccepted: true,
    createdAt: new Date().toISOString(),
  },
];

export const mockCategories: BlogCategory[] = [
  {
    id: "category-philosophy",
    slug: "filozofia",
    name: "Filozófia",
    description: "A jóga szemléleti rétegei és az önismeret mélyebb kérdései.",
  },
  {
    id: "category-practice",
    slug: "gyakorlas",
    name: "Gyakorlás",
    description: "Ászana, mozgás, légzés és a testtel való tudatos kapcsolat.",
  },
  {
    id: "category-meditation",
    slug: "meditacio",
    name: "Meditáció",
    description: "Lassítás, figyelem, belső béke és az önvaló felé vezető út.",
  },
];

export const mockBlogPosts: BlogPost[] = [
  {
    id: "post-1",
    slug: "unalmas-aszanak",
    title: "Unalmas ászanák?",
    excerpt:
      "Mi történik akkor, amikor nem a látványos pózok, hanem az egyszerűség kezd el formálni belülről?",
    content:
      "Azok a pózok, amelyek elsőre egyszerűnek vagy akár unalmasnak tűnnek, gyakran mélyebb rétegekhez visznek közelebb.\n\nAz egyszerű gyakorlás nem kevesebb. Inkább őszintébb. Megmutatja, hogyan viszonyulunk a türelmetlenséghez, a bizonyítási vágyhoz és a csendhez.\n\nA fejlődés sokszor nem akkor történik, amikor különlegesnek látszunk, hanem amikor képesek vagyunk benne maradni abban, ami valóban dolgozik bennünk.",
    coverImageUrl: imageLibrary.sunSalute,
    categoryId: "category-practice",
    featured: true,
    publishedAt: "2026-02-18T08:00:00.000Z",
    readTime: "4 perc",
    status: "published",
    metaTitle: "Unalmas ászanák? | Ohm Jóga tudástár",
    metaDescription:
      "Miért lehetnek a legegyszerűbb jógapózok a legmélyebb tanítók a gyakorlásban?",
  },
  {
    id: "post-2",
    slug: "aszana-es-lelek-a-mozgasban",
    title: "Ászana és lélek a mozgásban",
    excerpt:
      "A mozgás nem csak teljesítmény. Lehet figyelem, önmegismerés és belső párbeszéd is.",
    content:
      "Az ászana akkor válik többé egyszerű fizikai munkánál, amikor a mozdulat közben megjelenik a figyelem minősége is.\n\nA mozgás így nem meneküléssé, hanem tükörré válik. Megmutatja az ellenállást, a túlzást, a félelmet és az örömöt is.\n\nA jóga ezért nem pusztán testmunka, hanem olyan eszköztár, amelyen keresztül a test és a lélek egyszerre kezd beszélni.",
    coverImageUrl: imageLibrary.articleMovement,
    categoryId: "category-practice",
    featured: true,
    publishedAt: "2026-01-29T09:30:00.000Z",
    readTime: "5 perc",
    status: "published",
    metaTitle: "Ászana és lélek a mozgásban | Ohm Jóga",
    metaDescription:
      "Hogyan válik a mozgás önismereti gyakorlattá a jóga terében?",
  },
  {
    id: "post-3",
    slug: "a-joga-eszkozei",
    title: "A jóga eszközei I.",
    excerpt:
      "A nyolclépcsős rendszer nem elméleti díszlet, hanem nagyon is gyakorlati iránytű.",
    content:
      "A jóga eszköztáráról beszélve gyakran a Patandzsali által rendszerezett úthoz térünk vissza.\n\nAz első lépések sokkal földközelibbek, mint azt sokan gondolják: kapcsolódnak az életvitelhez, a testhez és a légzéshez.\n\nA rendszer nem azért fontos, mert szabályokat kényszerít ránk, hanem mert fokozatos irányt mutat.",
    coverImageUrl: imageLibrary.warrior,
    categoryId: "category-philosophy",
    featured: false,
    publishedAt: "2025-12-10T11:00:00.000Z",
    readTime: "6 perc",
    status: "published",
    metaTitle: "A jóga eszközei I. | Ohm Jóga filozófia",
    metaDescription:
      "A jógarendszer első lépcsői és azok jelentősége a mai ember életében.",
  },
  {
    id: "post-4",
    slug: "a-joga-eszkozei-ii",
    title: "A jóga eszközei II.",
    excerpt:
      "A belső figyelem és az elmélyülés nem külön világ, hanem a gyakorlás természetes folytatása.",
    content:
      "Amikor a jóga gyakorlása túllép a pusztán fizikai szinten, természetes módon kerül elő a figyelem befelé fordítása.\n\nA meditáció nem a kiváltságosak terepe. Sokkal inkább annak a következménye, hogy a gyakorló megtanul megmaradni a saját jelenlétében.\n\nA mélyebb rétegek nem látványosak, mégis ezek adják a jóga erejét.",
    coverImageUrl: imageLibrary.meditation,
    categoryId: "category-meditation",
    featured: false,
    publishedAt: "2025-11-20T07:30:00.000Z",
    readTime: "5 perc",
    status: "published",
    metaTitle: "A jóga eszközei II. | Meditáció és figyelem",
    metaDescription:
      "Mit jelent a figyelem befelé fordítása, és hogyan mélyül tovább a jóga a meditációban?",
  },
  {
    id: "post-5",
    slug: "miert-a-joga",
    title: "Igaz, vagy hamis? Miért a jóga?",
    excerpt:
      "A jóga körül sok félreértés kering. Ideje letisztázni, mire való valójában a gyakorlás.",
    content:
      "A jóga nem menekülés a valóságból, hanem egyre tisztább találkozás vele.\n\nSegít érzékelni a testünket, szabályozni a légzésünket és pontosabban látni a belső működésünket.\n\nA gyakorlás akkor válik élővé, ha nem szerepként vesszük fel, hanem megtapasztaljuk a saját életünkben.",
    coverImageUrl: imageLibrary.hero,
    categoryId: "category-philosophy",
    featured: true,
    publishedAt: "2025-10-05T10:00:00.000Z",
    readTime: "4 perc",
    status: "published",
    metaTitle: "Miért a jóga? | Ohm Jóga tudástár",
    metaDescription:
      "Emberi, hiteles összefoglaló arról, miért releváns a jóga a mai ember számára.",
  },
];

export const mockTestimonials: Testimonial[] = [
  {
    id: "testimonial-1",
    authorName: "Eszter",
    authorRole: "csoportos óralátogató",
    quote:
      "Az órák egyszerre nyugtatnak meg és adnak tartást. Ritka, hogy valami ennyire finoman, mégis mélyen hasson.",
    isVisible: true,
    sortOrder: 1,
  },
  {
    id: "testimonial-2",
    authorName: "Márk",
    authorRole: "egyéni jógaóra",
    quote:
      "A személyes figyelem miatt végre nem elveszettnek éreztem magam egy gyakorláson, hanem valóban vezetve voltam.",
    isVisible: true,
    sortOrder: 2,
  },
  {
    id: "testimonial-3",
    authorName: "Juli",
    authorRole: "meditáció és légzés",
    quote:
      "Nem túl misztikus, nem túl rideg. Emberi, tiszta és biztonságos tér a lelassuláshoz.",
    isVisible: true,
    sortOrder: 3,
  },
];

export const mockMessages: ContactMessage[] = [
  {
    id: "message-1",
    name: "Tóth Réka",
    email: "reka@example.com",
    phone: "+36 30 444 5588",
    subject: "Kezdő óra érdekel",
    message: "Most kezdenék jógázni, melyik időpontot ajánlanád első alkalomnak?",
    status: "unread",
    createdAt: new Date().toISOString(),
  },
  {
    id: "message-2",
    name: "Balázs",
    email: "balazs@example.com",
    phone: "+36 20 999 1010",
    subject: "Workshop részletek",
    message: "A következő workshop személyesen lesz vagy online is lehet csatlakozni?",
    status: "read",
    createdAt: new Date().toISOString(),
  },
];

export const mockMediaAssets: MediaAsset[] = [
  {
    name: "hero-cover.jpg",
    url: imageLibrary.hero,
    bucket: "media",
    createdAt: "2026-02-01T08:00:00.000Z",
  },
  {
    name: "about-portrait.jpg",
    url: imageLibrary.about,
    bucket: "media",
    createdAt: "2026-02-04T08:00:00.000Z",
  },
];

export const mockDashboardStats: DashboardStats = {
  bookingCount: mockBookings.length,
  upcomingClassCount: mockClasses.length,
  unreadMessageCount: mockMessages.filter((message) => message.status === "unread")
    .length,
  publishedPostCount: mockBlogPosts.filter((post) => post.status === "published")
    .length,
};
