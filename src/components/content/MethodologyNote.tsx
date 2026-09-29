import Link from "next/link";

export function MethodologyNote() {
  return (
    <aside className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-700">
      <p>This is a directory dataset, not a complete census of every automotive workspace in the UK.</p>
      <p className="mt-2">
        <Link href="/methodology" className="font-semibold text-blue-700 hover:text-blue-800">
          How AutoWorkspace UK verifies listings
        </Link>
      </p>
    </aside>
  );
}
