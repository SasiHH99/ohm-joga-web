import { AdminPageHeader } from "@/components/admin/page-header";
import { AdminShell } from "@/components/admin/shell";
import { Button } from "@/components/ui/button";
import { requireAdminProfile } from "@/lib/auth";
import { getBlogCategories, getBlogPosts } from "@/lib/data";
import { upsertBlogPostAction } from "@/server/actions/admin";

export default async function AdminBlogPage() {
  const profile = await requireAdminProfile();
  const [posts, categories] = await Promise.all([
    getBlogPosts({ includeDrafts: true }),
    getBlogCategories(),
  ]);

  return (
    <AdminShell profile={profile} currentPath="/admin/blog">
      <AdminPageHeader
        title="Blog admin"
        description="Új cikk írása, slug, kategória, borítókép, publikálás és meta SEO mezők kezelése."
      />

      <div className="grid gap-6">
        <form action={upsertBlogPostAction} className="card-surface grid gap-4 rounded-[2rem] p-6 md:grid-cols-2">
          <div className="grid gap-2">
            <label className="text-sm font-semibold text-ink">Slug</label>
            <input name="slug" className="input-field" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-semibold text-ink">Cím</label>
            <input name="title" className="input-field" />
          </div>
          <div className="grid gap-2 md:col-span-2">
            <label className="text-sm font-semibold text-ink">Excerpt</label>
            <input name="excerpt" className="input-field" />
          </div>
          <div className="grid gap-2 md:col-span-2">
            <label className="text-sm font-semibold text-ink">Tartalom</label>
            <textarea name="content" className="textarea-field" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-semibold text-ink">Borítókép URL</label>
            <input name="coverImageUrl" className="input-field" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-semibold text-ink">Kategória</label>
            <select name="categoryId" className="select-field">
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-semibold text-ink">Publikálás ideje</label>
            <input name="publishedAt" type="datetime-local" className="input-field" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-semibold text-ink">Olvasási idő</label>
            <input name="readTime" defaultValue="4 perc" className="input-field" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-semibold text-ink">Meta title</label>
            <input name="metaTitle" className="input-field" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-semibold text-ink">Meta description</label>
            <input name="metaDescription" className="input-field" />
          </div>
          <div className="flex flex-wrap gap-4 md:col-span-2">
            <label className="flex items-center gap-3 text-sm text-stone">
              <input type="checkbox" name="featured" />
              Kiemelt
            </label>
            <label className="flex items-center gap-3 text-sm text-stone">
              <input type="radio" name="status" value="published" defaultChecked />
              Publikált
            </label>
            <label className="flex items-center gap-3 text-sm text-stone">
              <input type="radio" name="status" value="draft" />
              Vázlat
            </label>
          </div>
          <div className="md:col-span-2">
            <Button>Cikk mentése</Button>
          </div>
        </form>

        <div className="grid gap-4">
          {posts.map((post) => (
            <article key={post.id} className="card-surface rounded-[1.75rem] p-6">
              <h2 className="text-xl font-semibold text-ink">{post.title}</h2>
              <p className="mt-2 text-sm text-stone">{post.slug} • {post.status}</p>
            </article>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
