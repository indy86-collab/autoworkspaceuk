import type { InlinePart } from "@/content/guides/blocks";
import Link from "next/link";
import { Fragment } from "react";

export function InlineContent({ parts }: { parts: readonly InlinePart[] }) {
  return (
    <>
      {parts.map((part, index) => {
        if (typeof part === "string") {
          return <Fragment key={index}>{part}</Fragment>;
        }
        if (part.type === "strong") {
          return (
            <strong key={index} className="font-semibold text-navy">
              {part.text}
            </strong>
          );
        }
        return (
          <Link key={index} href={part.href} className="font-semibold text-blue-700 hover:text-blue-800">
            {part.label}
          </Link>
        );
      })}
    </>
  );
}
