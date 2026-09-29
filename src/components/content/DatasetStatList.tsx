import { DatasetStat } from "@/components/content/DatasetStat";
import { getWorkspaceReport, type ReportStatId } from "@/lib/dataset-insights";

export function DatasetStatList({ ids }: { ids: readonly ReportStatId[] }) {
  const report = getWorkspaceReport();

  return (
    <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {ids.map((id) => {
        const stat = report.stats[id];
        return <DatasetStat key={id} value={stat.display} label={stat.label} detail={stat.detail} />;
      })}
    </dl>
  );
}
