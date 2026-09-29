import { ListingDetail } from "@/components/ListingDetail";
import { getListingBySlug, liveListingParams } from "@/lib/listings";
import { buildMetadata, isIndexableListing, listingDescription, listingMetaTitle } from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamicParams = false;

export function generateStaticParams() {
  return liveListingParams();
}

export async function generateMetadata(props: PageProps<"/listing/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const listing = getListingBySlug(slug);
  if (!listing) {
    return { title: "Listing not found", robots: { index: false, follow: false } };
  }

  const title = listingMetaTitle(listing);
  return {
    ...buildMetadata({
      title,
      description: listingDescription(listing),
      path: `/listing/${listing.slug}`,
      index: isIndexableListing(listing),
    }),
    title: { absolute: title },
  };
}

export default async function ListingPage(props: PageProps<"/listing/[slug]">) {
  const { slug } = await props.params;
  const listing = getListingBySlug(slug);
  if (!listing) {
    notFound();
  }

  return <ListingDetail listing={listing} />;
}
