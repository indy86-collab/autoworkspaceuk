import Link from "next/link";

export function ErrorRecoveryLinks() {
  return (
    <div className="mt-8 flex flex-wrap gap-3">
      <Link href="/" className="btn-primary">
        Homepage
      </Link>
      <Link href="/browse" className="btn-secondary">
        Browse
      </Link>
      <Link href="/categories" className="btn-secondary">
        Categories
      </Link>
    </div>
  );
}
