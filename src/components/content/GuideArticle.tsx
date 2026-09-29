import { InlineContent } from "@/components/content/InlineContent";
import { LiftMentionNote } from "@/components/content/LiftMentionNote";
import { MethodologyNote } from "@/components/content/MethodologyNote";
import { PricingSummary } from "@/components/content/PricingSummary";
import type { GuideDocument } from "@/content/guides/blocks";
import { getCategory } from "@/lib/categories";
import { formatVerifiedDate } from "@/lib/format";
import { getRelatedGuides, guideHeadings, readingMinutes } from "@/lib/guides";
import Link from "next/link";

function GuideCard({ guide }: { guide: GuideDocument }) {
  return (
    <article className="card flex h-full flex-col p-5">
      <p className="text-sm font-semibold text-blue-800">{guide.category}</p>
      <h3 className="mt-2 text-lg font-semibold text-navy">
        <Link href={`/guides/${guide.slug}`} className="hover:text-blue-700">
          {guide.title}
        </Link>
      </h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{guide.description}</p>
      <p className="mt-4 text-sm text-slate-500">{readingMinutes(guide)} min read</p>
    </article>
  );
}

export function GuideCardLink({ guide }: { guide: GuideDocument }) {
  return <GuideCard guide={guide} />;
}

export function GuideArticle({ guide }: { guide: GuideDocument }) {
  const headings = guideHeadings(guide);
  const related = getRelatedGuides(guide);
  const categories = guide.relatedCategorySlugs.flatMap((slug) => {
    const category = getCategory(slug);
    return category ? [category] : [];
  });

  return (
    <article className="min-w-0 max-w-3xl">
      <header>
        <p className="text-sm font-semibold text-blue-800">{guide.category}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-navy sm:text-4xl">{guide.title}</h1>
        <p className="mt-4 text-sm leading-6 text-slate-600">
          Published {formatVerifiedDate(guide.published)}. Updated {formatVerifiedDate(guide.updated)}.{" "}
          {readingMinutes(guide)} min read. Published by {guide.author}.
        </p>
      </header>

      {headings.length > 0 ? (
        <nav aria-label="On this page" className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-navy">On this page</p>
          <ol className="mt-2 space-y-1.5 text-sm">
            {headings.map((heading) => (
              <li key={heading.id}>
                <a href={`#${heading.id}`} className="text-slate-700 hover:text-blue-700">
                  {heading.text}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      ) : null}

      <div className="mt-8 space-y-5 text-base leading-7 text-slate-700">
        {guide.blocks.map((block, index) => {
          switch (block.type) {
            case "h2":
              return (
                <h2 key={block.id} id={block.id} className="scroll-mt-24 pt-4 text-2xl font-semibold text-navy">
                  {block.text}
                </h2>
              );
            case "h3":
              return (
                <h3 key={block.id} id={block.id} className="scroll-mt-24 pt-2 text-xl font-semibold text-navy">
                  {block.text}
                </h3>
              );
            case "p":
              return (
                <p key={index}>
                  <InlineContent parts={block.parts} />
                </p>
              );
            case "ul":
            case "ol": {
              const List = block.type === "ul" ? "ul" : "ol";
              return (
                <List key={index} className={block.type === "ul" ? "list-disc space-y-2 pl-5" : "list-decimal space-y-2 pl-5"}>
                  {block.items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      <InlineContent parts={item} />
                    </li>
                  ))}
                </List>
              );
            }
            case "callout":
              return (
                <aside
                  key={index}
                  className={
                    block.tone === "caution"
                      ? "rounded-lg border border-orange-200 bg-orange-50 px-4 py-4"
                      : "rounded-lg border border-slate-200 bg-slate-50 px-4 py-4"
                  }
                >
                  <p className="font-semibold text-navy">{block.title}</p>
                  <p className="mt-2">
                    <InlineContent parts={block.parts} />
                  </p>
                </aside>
              );
            case "table":
              return (
                <figure key={index} className="min-w-0">
                  <figcaption className="text-sm font-semibold text-navy">{block.caption}</figcaption>
                  <div className="mt-2 max-w-full overflow-x-auto">
                    <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-600">
                          {block.headers.map((header) => (
                            <th key={header} scope="col" className="py-2 pr-3 font-medium">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {block.rows.map((row, rowIndex) => (
                          <tr key={rowIndex} className="border-b border-slate-100 align-top">
                            {row.map((cell, cellIndex) => (
                              <td key={cellIndex} className="py-2 pr-3 text-slate-700">
                                <InlineContent parts={cell} />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </figure>
              );
            case "checklist":
              return (
                <ul key={index} className="space-y-2 rounded-lg border border-slate-200 bg-white p-4">
                  {block.items.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 rounded border border-slate-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              );
            case "embed":
              if (block.id === "pricing-summary") {
                return <PricingSummary key={block.id} />;
              }
              if (block.id === "lift-mentions") {
                return <LiftMentionNote key={block.id} />;
              }
              return <MethodologyNote key={block.id} />;
            default:
              return null;
          }
        })}
      </div>

      {related.length > 0 ? (
        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-navy">Related guides</h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2">
            {related.map((item) => (
              <li key={item.slug}>
                <GuideCard guide={item} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-10 rounded-lg bg-navy px-6 py-8 text-white">
        <h2 className="text-2xl font-semibold">Find a workspace</h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-200">
          Browse published listings, then confirm the price, the equipment, and the vehicle with the facility.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-navy hover:bg-slate-100"
            >
              {category.name}
            </Link>
          ))}
          <Link
            href="/browse"
            className="inline-flex items-center justify-center rounded-full border border-white/40 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
          >
            Browse all
          </Link>
        </div>
      </section>
    </article>
  );
}
