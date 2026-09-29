import { getWorkspaceReport } from "@/lib/dataset-insights";
import { MethodologyNote } from "@/components/content/MethodologyNote";

export function LiftMentionNote() {
  const report = getWorkspaceReport();

  return (
    <div className="space-y-3">
      <aside className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-4 text-sm leading-6 text-slate-700">
        <p className="font-semibold text-navy">What the current listings actually name</p>
        <p className="mt-2">
          {report.twoPostCount} published listings mention a two-post lift or ramp in the equipment text. {report.fourPostCount}{" "}
          mention a four-post lift or ramp. A site can mention both. {report.liftWithoutNamedPostCount} listings are in the
          wider lift-or-ramp group, but the equipment text does not name two-post or four-post. A mention is not a
          specification for the bay you will be given. Ask which machine is in the slot.
        </p>
      </aside>
      <MethodologyNote />
    </div>
  );
}
