export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint: string;
}) {
  return (
    <div className="card-surface rounded-[1.75rem] p-5">
      <p className="text-sm uppercase tracking-[0.18em] text-stone">{label}</p>
      <p className="mt-4 font-display text-5xl text-ink">{value}</p>
      <p className="mt-3 text-sm text-stone">{hint}</p>
    </div>
  );
}
