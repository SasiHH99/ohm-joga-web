import { AdminPageHeader } from "@/components/admin/page-header";
import { MediaUploader } from "@/components/admin/media-uploader";
import { AdminShell } from "@/components/admin/shell";
import { requireAdminProfile } from "@/lib/auth";
import { getMediaAssets } from "@/lib/data";

export default async function AdminMediaPage() {
  const profile = await requireAdminProfile();
  const assets = await getMediaAssets();

  return (
    <AdminShell profile={profile} currentPath="/admin/media">
      <AdminPageHeader
        title="Média"
        description="A bloghoz használt képek feltöltése és gyors másolható URL-jei maradnak meg az adminban."
      />

      <div className="grid gap-6">
        <MediaUploader />

        <div className="grid gap-4 md:grid-cols-2">
          {assets.map((asset) => (
            <article key={asset.name} className="card-surface rounded-[1.75rem] p-6">
              <p className="font-semibold text-ink">{asset.name}</p>
              <a
                href={asset.url}
                target="_blank"
                rel="noreferrer"
                className="mt-3 block text-sm text-moss"
              >
                {asset.url}
              </a>
            </article>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
