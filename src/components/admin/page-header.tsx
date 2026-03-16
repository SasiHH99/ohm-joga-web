export function AdminPageHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mb-8">
      <p className="eyebrow">Admin</p>
      <h1 className="mt-3 font-display text-4xl text-ink md:text-5xl">{title}</h1>
      <p className="mt-3 max-w-2xl text-stone">{description}</p>
    </div>
  );
}
