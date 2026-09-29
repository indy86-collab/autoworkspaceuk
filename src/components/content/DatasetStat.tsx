export function DatasetStat({
  value,
  label,
  detail,
}: {
  value: string;
  label: string;
  detail?: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
      <dd className="text-2xl font-semibold tracking-tight text-navy">{value}</dd>
      <dt className="mt-1 text-sm font-medium text-slate-700">{label}</dt>
      {detail ? <p className="mt-2 text-sm leading-6 text-slate-600">{detail}</p> : null}
    </div>
  );
}
