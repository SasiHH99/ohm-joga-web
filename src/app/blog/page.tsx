import Image from "next/image";

import { ButtonLink } from "@/components/ui/button";
import { PageHero } from "@/components/site/page-hero";
import { getBlogCategories, getBlogPosts } from "@/lib/data";
import { formatHungarianDate } from "@/lib/format";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export const metadata = {
  title: "Tudástár",
  description:
    "Modern, kereshető tudástár kategóriákkal, kiemelt cikkekkel és SEO-barát blog struktúrával.",
};

export default async function BlogPage({ searchParams }: { searchParams?: SearchParams }) {
  const params = searchParams ? await searchParams : {};
  const q = typeof params.q === "string" ? params.q : "";
  const category = typeof params.kategoria === "string" ? params.kategoria : "";
  const [categories, posts] = await Promise.all([
    getBlogCategories(),
    getBlogPosts({ query: q, category }),
  ]);

  return (
    <>
      <PageHero
        eyebrow="Filozófia és tudástár"
        title="Olvasható, kereshető és SEO-barát blogrendszer"
        description="A régi írások szellemiségét modern cikklistává és részletező oldalakká rendeztem át."
      />

      <section className="section-shell py-18 md:py-24">
        <form className="card-surface grid gap-4 rounded-[2rem] p-6 md:grid-cols-[1fr_0.45fr_auto] md:items-end">
          <div className="grid gap-2">
            <label className="text-sm font-semibold text-ink" htmlFor="blog-search">
              Keresés
            </label>
            <input
              id="blog-search"
              name="q"
              defaultValue={q}
              className="input-field"
              placeholder="Keresés címben vagy tartalomban"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-semibold text-ink" htmlFor="blog-category">
              Kategória
            </label>
            <select id="blog-category" name="kategoria" defaultValue={category} className="select-field">
              <option value="">Minden kategória</option>
              {categories.map((item) => (
                <option key={item.id} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <button className="rounded-full bg-moss px-5 py-3 text-sm font-semibold text-ivory">
            Szűrés
          </button>
        </form>

        <div className="mt-12 grid gap-6">
          {posts.map((post) => (
            <article
              key={post.id}
              className="grid gap-6 rounded-[2rem] border border-white/40 bg-ivory/70 p-6 shadow-[0_24px_90px_rgba(38,35,31,0.08)] md:grid-cols-[0.3fr_0.7fr]"
            >
              <div className="relative min-h-[16rem] overflow-hidden rounded-[1.5rem]">
                <Image src={post.coverImageUrl} alt={post.title} fill className="object-cover" />
              </div>
              <div className="flex flex-col">
                <p className="eyebrow">{formatHungarianDate(post.publishedAt)} • {post.readTime}</p>
                <h2 className="mt-4 font-display text-4xl text-ink">{post.title}</h2>
                <p className="mt-4 max-w-3xl text-lg leading-8 text-stone">{post.excerpt}</p>
                <div className="mt-auto pt-8">
                  <ButtonLink href={`/blog/${post.slug}`} variant="secondary">
                    Tovább a cikkhez
                  </ButtonLink>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
