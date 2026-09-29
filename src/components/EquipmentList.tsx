import { displayEquipmentList } from "@/lib/equipment";

export function EquipmentList({
  equipment,
  limit,
}: {
  equipment: readonly string[];
  limit?: number;
}) {
  const normalised = displayEquipmentList(equipment);
  const visible = typeof limit === "number" ? normalised.slice(0, limit) : normalised;

  if (visible.length === 0) {
    return null;
  }

  if (typeof limit === "number") {
    return (
      <ul className="flex flex-wrap gap-2">
        {visible.map((item, index) => (
          <li
            key={`${item}-${index}`}
            className="max-w-full rounded-full bg-slate-100 px-3 py-1 text-sm break-words text-slate-700"
          >
            {item}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {visible.map((item, index) => (
        <li key={`${item}-${index}`} className="rounded-lg bg-slate-50 px-3 py-2 text-sm break-words text-slate-700">
          {item}
        </li>
      ))}
    </ul>
  );
}
