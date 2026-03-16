import { BookingForm } from "@/components/forms/booking-form";
import { PageHero } from "@/components/site/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { bookingBenefits } from "@/lib/site";
import { getClasses, getServices } from "@/lib/data";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export const metadata = {
  title: "Foglalás",
  description:
    "Teljes foglalási rendszer szolgáltatásválasztással, időponttal, adatokkal, adatkezelési checkboxszal és email visszaigazolással.",
};

export default async function BookingPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const params = searchParams ? await searchParams : {};
  const defaultServiceId = typeof params.service === "string" ? params.service : undefined;
  const defaultClassId = typeof params.class === "string" ? params.class : undefined;
  const [services, classes] = await Promise.all([getServices(), getClasses()]);

  return (
    <>
      <PageHero
        eyebrow="Foglalás"
        title="Foglalj órát néhány tiszta lépésben"
        description="A rendszer kezeli a fix órákat, az egyedi időpontkérést, az admin státuszokat és az automatikus visszaigazolást is."
      />

      <section className="section-shell py-18 md:py-24">
        <div className="grid gap-10 md:grid-cols-[0.82fr_1.18fr]">
          <div>
            <SectionHeading
              eyebrow="Mi történik foglalás után?"
              title="Visszaigazolás, státuszkövetés és kapacitáskezelés"
              description="A publikus űrlap mögött üzleti logika is van, nem csak egy kapcsolatfelvételi forma."
            />
            <div className="mt-8 grid gap-4">
              {bookingBenefits.map((benefit) => (
                <div key={benefit} className="card-surface rounded-[1.5rem] p-5 text-stone">
                  {benefit}
                </div>
              ))}
            </div>
          </div>

          <BookingForm
            services={services}
            classes={classes}
            defaultServiceId={defaultServiceId}
            defaultClassId={defaultClassId}
          />
        </div>
      </section>
    </>
  );
}
