import Image from "next/image";
import { notFound } from "next/navigation";

import { ButtonLink } from "@/components/ui/button";
import { JsonLd } from "@/components/ui/json-ld";
import { getBlogPostBySlug, getBlogPosts } from "@/lib/data";
import { formatHungarianDate } from "@/lib/format";
import { siteConfig } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {};
  }

  return {
    title: post.metaTitle,
    description: post.metaDescription,
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      type: "article",
      images: [post.coverImageUrl],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [post, relatedPosts] = await Promise.all([
    getBlogPostBySlug(slug),
    getBlogPosts(),
  ]);

  if (!post) {
    notFound();
  }

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.metaDescription,
          datePublished: post.publishedAt,
          image: [post.coverImageUrl],
          mainEntityOfPage: `${siteConfig.siteUrl}/blog/${post.slug}`,
        }}
      />

      <section className="section-shell pt-14 md:pt-20">
        <div className="mx-auto max-w-5xl">
          <p className="eyebrow">
            {formatHungarianDate(post.publishedAt)} • {post.readTime}
          </p>
          <h1 className="mt-4 font-display text-5xl leading-none text-ink md:text-7xl">
            {post.title}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-stone">{post.excerpt}</p>
          <div className="relative mt-10 min-h-[28rem] overflow-hidden rounded-[2rem]">
            <Image src={post.coverImageUrl} alt={post.title} fill className="object-cover" />
          </div>
        </div>
      </section>

      <section className="section-shell py-18 md:py-24">
        <article className="article-copy mx-auto max-w-3xl rounded-[2rem] bg-ivory/72 p-8 shadow-[0_24px_90px_rgba(38,35,31,0.08)] md:p-12">
          {post.content.split("\n\n").map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </article>
      </section>

      <section className="section-shell pb-20 md:pb-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-display text-4xl text-ink">Kapcsolódó írások</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {relatedPosts
              .filter((item) => item.slug !== post.slug)
              .slice(0, 2)
              .map((item) => (
                <article key={item.id} className="card-surface rounded-[1.75rem] p-6">
                  <p className="eyebrow">{item.readTime}</p>
                  <h3 className="mt-4 text-2xl font-semibold text-ink">{item.title}</h3>
                  <p className="mt-3 text-stone">{item.excerpt}</p>
                  <ButtonLink href={`/blog/${item.slug}`} variant="secondary" className="mt-6">
                    Tovább olvasom
                  </ButtonLink>
                </article>
              ))}
          </div>
        </div>
      </section>
    </>
  );
}
