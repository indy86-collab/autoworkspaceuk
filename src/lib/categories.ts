export const CATEGORY_ICONS = [
  "ramp",
  "diy",
  "workshop",
  "bay",
  "spray",
  "detail",
  "motorcycle",
  "van",
  "lift",
] as const;

export type CategoryIcon = (typeof CATEGORY_ICONS)[number];

export interface CategoryFaq {
  question: string;
  answer: string;
}

export interface CategoryDefinition {
  slug: string;
  name: string;
  shortName: string;
  icon: CategoryIcon;
  explanation: string;
  seoTitle: string;
  metaDescription: string;
  introduction: readonly string[];
  faqs: readonly CategoryFaq[];
  aliases: readonly string[];
  /**
   * Internal category filed under a public category. It does not get its own page.
   * Listing records keep the original slug.
   */
  groupedUnder?: string;
}

export const HOMEPAGE_CATEGORY_SLUGS = [
  "rent-a-ramp",
  "self-service-garage",
  "automotive-workshop-hire",
  "garage-bay-hire",
  "vehicle-lift-hire",
  "spray-booth-hire",
  "detailing-bay-hire",
  "motorcycle-workspace",
  "hgv-workshop-hire",
] as const;

const categories: readonly CategoryDefinition[] = [
  {
    slug: "rent-a-ramp",
    name: "Rent a Ramp",
    shortName: "Rent a Ramp",
    icon: "ramp",
    explanation: "Book a ramp or vehicle lift for a set time and do the work yourself.",
    seoTitle: "Rent a Ramp",
    metaDescription:
      "Rent-a-ramp facilities in the UK where you book a ramp or lift and do the work yourself. Prices and equipment are shown only when they were recorded.",
    introduction: [
      "Rent-a-ramp facilities hire you the lift and the bay around it. You carry out the job, or you bring someone with you. The site is not taking the car in as a repair customer.",
      "People use these bays for brakes, exhausts, suspension, and underbody inspections where the vehicle needs to be raised safely. What you get for the booking is only what that listing records: the lift, any tools, and the time period. Access rules, insurance, and disposal of old parts differ by site.",
    ],
    faqs: [
      {
        question: "What is usually included in ramp hire?",
        answer:
          "A booked period on a ramp or vehicle lift, and the bay it sits in. Tools, jacks, and diagnostic kit are included only when they appear in the equipment list. Confirm anything you need before you travel.",
      },
      {
        question: "Can a private motorist book, or is this trade only?",
        answer:
          "Each listing records an audience of consumer, trade, or both. Consumer means the facility is presented as open to a private user. Trade means it is aimed at people working commercially. Check that label, then confirm the house rules with the site.",
      },
      {
        question: "How are ramp bookings usually charged?",
        answer:
          "Hourly and half-day rates are common. This directory only shows a price when one was recorded for that listing. If the pricing section is empty, ask the facility for the current rate.",
      },
    ],
    aliases: ["rent a ramp", "ramp hire", "ramp rental", "hire a ramp"],
  },
  {
    slug: "self-service-garage",
    name: "DIY / Self-Service Garage",
    shortName: "DIY Garage",
    icon: "diy",
    explanation: "A garage bay you hire to work on your own vehicle, without handing the job to a technician.",
    seoTitle: "DIY and Self-Service Garages",
    metaDescription:
      "Self-service garages and DIY bays in the UK that hire workspace so you can work on your own vehicle. Each listing shows who can book and what equipment is recorded.",
    introduction: [
      "A self-service garage is workspace for the vehicle owner. Staff may unlock the bay and explain the house rules. They are not booked to diagnose or repair the car for you.",
      "These sites overlap with rent-a-ramp, but the emphasis is the hired bay itself: floor space, light, and sometimes a basic tool set. A listing appears here when the record is filed under self-service or DIY garage use. It is not an MOT station unless the facility separately offers testing, and this directory does not treat workspace hire as an MOT booking.",
    ],
    faqs: [
      {
        question: "How is a DIY garage different from renting a ramp?",
        answer:
          "Rent-a-ramp listings centre on the lift. A DIY or self-service garage centres on hiring the bay to do your own work. Some facilities fit both, and they can appear in more than one category when the record supports it.",
      },
      {
        question: "Can I bring my own tools?",
        answer:
          "Most self-service bays expect you to bring specialist tools. Use the equipment list as the record of what the site says is already there. If a tool is not listed, do not assume it is available.",
      },
      {
        question: "Are these listings repair garages that will fix the car for me?",
        answer:
          "No. Ordinary garages that only sell repairs to the public are not the point of this directory. A self-service listing is for hiring space or equipment so an external customer can do the work.",
      },
    ],
    aliases: ["diy garage", "self-service garage", "self service garage", "diy bay"],
  },
  {
    slug: "automotive-workshop-hire",
    name: "Workshop Hire",
    shortName: "Workshop Hire",
    icon: "workshop",
    explanation: "A working workshop bay or unit hired by the day, week, or month.",
    seoTitle: "Workshop Hire",
    metaDescription:
      "Automotive workshops hired by the day, week, or longer for trade users and, where the listing says so, private hirers. Rates and equipment are shown only when recorded.",
    introduction: [
      "Workshop hire is for people who need a working automotive space for longer than a single job. Mobile technicians, new businesses, and trades without their own unit are the usual users. Some sites also accept a private hirer. The audience label on the listing is the record of who it is aimed at.",
      "A workshop booking can mean one bay inside a shared building, or a fuller unit with its own access. The listing does not imply an office, storage, or waste contract unless those things are written in the equipment or notes. Ask about insurance, power, and what must be left as you found it.",
    ],
    faqs: [
      {
        question: "Who is workshop hire for?",
        answer:
          "Listings marked Trade are aimed at people working commercially. Listings marked Consumer say a private hirer can use the space. Read that label before assuming you can book.",
      },
      {
        question: "What should I confirm before paying a deposit?",
        answer:
          "Access hours, the insurance the site requires, which tools stay in the bay, and whether the rate includes electricity and waste disposal. This directory records starting prices and equipment only when they were found for that listing.",
      },
      {
        question: "Is workshop hire the same as garage bay hire?",
        answer:
          "Bay hire usually means one booked space for a job. Workshop hire often means a longer or more complete working arrangement. Use the pricing periods and the equipment list to see which kind of booking the facility actually published.",
      },
    ],
    aliases: ["workshop hire", "automotive workshop hire", "hire a workshop"],
  },
  {
    slug: "garage-bay-hire",
    name: "Garage Bay Hire",
    shortName: "Garage Bay Hire",
    icon: "bay",
    explanation: "One working bay inside a garage, booked without taking the whole building.",
    seoTitle: "Garage Bay Hire",
    metaDescription:
      "Single garage bays and garage space for hire in the UK, without taking the whole building. A lift is mentioned only when that listing records one.",
    introduction: [
      "Garage bay hire is a single working space: enough room for a vehicle, a sound floor, and usually access to a lift or tools that are listed for that site. You are renting the bay, not the business.",
      "It suits a job that needs to stay on a proper floor while you work, including work a driveway cannot safely support. Guest access, overnight storage, and parking for a second vehicle are not included unless the listing says so.",
    ],
    faqs: [
      {
        question: "Does bay hire include a vehicle lift?",
        answer:
          "Only when a lift or ramp is in the equipment list. Some bays are floor space only. Read the equipment before you book a job that needs the vehicle in the air.",
      },
      {
        question: "Can the vehicle stay overnight?",
        answer:
          "This directory does not assume overnight storage. Ask the facility. If storage is not in the notes or equipment, treat the booking as the working period only.",
      },
      {
        question: "Why do some bays show no price?",
        answer:
          "A price is shown only when a starting rate was recorded. If it was not, the listing says to contact the facility. No price on AutoWorkspace UK is estimated or filled in.",
      },
    ],
    aliases: ["garage bay hire", "garage bay", "bay hire"],
  },
  {
    slug: "spray-booth-hire",
    name: "Spray Booth Hire",
    shortName: "Spray Booth",
    icon: "spray",
    explanation: "A controlled booth for paint and refinishing, separate from a general ramp bay.",
    seoTitle: "Spray Booth Hire",
    metaDescription:
      "Spray booths and prep bays hired for paint and refinishing. Paint and materials are not assumed, and trade-only booths are labelled from the listing.",
    introduction: [
      "A spray booth is hired for paint and refinishing. It is a controlled space with extraction and filtration that a normal ramp bay does not provide. Listings here are for that kind of facility, not for a garage that happens to own a spray gun.",
      "Booth hire is often trade-only because of coatings, insurance, and the standard of preparation required. A private user should book only where the audience includes consumer use, and should confirm which materials and masking the hire includes. Nothing in the price should be read as including paint, panels, or a painter.",
    ],
    faqs: [
      {
        question: "Can a private owner hire a spray booth?",
        answer:
          "Only where the listing audience includes Consumer. Many booths are recorded as trade. If consumer use is not shown, assume the site is not offering the booth to the general public until you have asked them.",
      },
      {
        question: "Does the hire include paint and materials?",
        answer:
          "No. Materials are not assumed. The equipment list covers the booth and related kit that was recorded. Paint, clear coat, and consumables need to be agreed with the facility.",
      },
      {
        question: "Why are booths not grouped with ramp hire?",
        answer:
          "Painting needs airflow and filtration. A ramp is for mechanical access. A listing is filed under spray booth hire only when the record supports booth use, not because a workshop might paint cars as a repair service.",
      },
    ],
    aliases: ["spray booth", "spray booth hire", "paint booth"],
  },
  {
    slug: "detailing-bay-hire",
    name: "Detailing Bay Hire",
    shortName: "Detailing Bay",
    icon: "detail",
    explanation: "A bay set up for washing, decontamination, and interior work.",
    seoTitle: "Detailing Bay Hire",
    metaDescription:
      "Detailing bays hired for washing, decontamination, and interior work. The equipment list is the limit of what the directory claims is on site.",
    introduction: [
      "A detailing bay is workspace for washing, decontamination, paint correction, and interior cleaning. Drainage, lighting, and power matter more here than a vehicle lift. Treat it as a valeting space unless tools or a lift are actually listed.",
      "Water use, chemical disposal, and whether a pressure washer is on site vary. The equipment list is the limit of what this directory claims is available. Bring consumables unless the notes say the facility provides them.",
    ],
    faqs: [
      {
        question: "Can I use a pressure washer?",
        answer:
          "Only if pressure-washing equipment is listed, or the facility confirms it when you book. A detailing bay is not automatically a jet-wash bay.",
      },
      {
        question: "Can I carry out mechanical repairs in a detailing bay?",
        answer:
          "Not by default. Use a ramp, DIY garage, or workshop listing for mechanical work. A detailing bay is suitable for repairs only when the equipment and notes say so.",
      },
      {
        question: "Are chemicals included?",
        answer:
          "Assume you bring shampoo, dressings, and machine polish unless the listing records that products are supplied. The directory does not add included products that were not in the source.",
      },
    ],
    aliases: ["detailing bay", "detailing bay hire", "valeting bay", "detailing"],
  },
  {
    slug: "motorcycle-workspace",
    name: "Motorcycle Workspace",
    shortName: "Motorcycle",
    icon: "motorcycle",
    explanation: "Space set up for motorcycles, including stands or a bike lift where listed.",
    seoTitle: "Motorcycle Workspace",
    metaDescription:
      "Workspace that accepts motorcycles, including a bike lift or stand where one is listed. A car ramp is not treated as a motorcycle bay on its own.",
    introduction: [
      "Motorcycle workspace is a bay that accepts bikes and, where listed, provides a paddock stand, bench, or motorcycle lift. A car ramp is not listed here merely because a bike might physically fit on it.",
      "Tyre changes, chain work, and winter servicing are typical uses. The tools on the listing are the only tools this directory will claim. Ask about fuel, oil disposal, and whether the bay is shared with cars at the same time.",
    ],
    faqs: [
      {
        question: "Will any car ramp do for a motorcycle?",
        answer:
          "No. Use a motorcycle listing, or a listing whose equipment names a motorcycle lift or paddock stand. A car ramp without bike equipment is a different kind of hire.",
      },
      {
        question: "Are these race paddocks or storage units?",
        answer:
          "They are hired working spaces. A listing is not a track garage and is not long-term bike storage unless the notes say that explicitly.",
      },
      {
        question: "Can a trade mechanic and a private owner both book?",
        answer:
          "Look at the audience on the listing. Some bays are open to both. The label is the published position; the facility can still set its own insurance conditions.",
      },
    ],
    aliases: ["motorcycle", "motorcycle workspace", "motorbike", "bike bay"],
  },
  {
    slug: "van-commercial-workspace",
    name: "Van / commercial vehicle workspace",
    shortName: "Van / Commercial",
    icon: "van",
    explanation: "Workspace with access suited to vans and light commercial vehicles.",
    seoTitle: "Van and Commercial Vehicle Workspace",
    metaDescription:
      "Bays recorded for vans and light commercial vehicles. Roof height and length are not guessed; confirm the vehicle with the facility before booking.",
    introduction: [
      "Van and commercial listings are for bays that can take a larger vehicle than a typical car ramp: access, height, and floor space for vans and light commercial vehicles. A standard car bay is not placed in this category just because a small van might squeeze in.",
      "Roof height, length, and weight limits are not guessed. Take the vehicle dimensions to the facility before booking. This category is not an HGV park and it is not a loading dock. It is workspace for hire.",
    ],
    faqs: [
      {
        question: "Will my van fit?",
        answer:
          "The listing does not record a universal height or length. Ask the facility with your roof height, wheelbase, and whether you need high-roof access. Book only after they confirm the vehicle.",
      },
      {
        question: "Are heavy goods vehicles included?",
        answer:
          "No. These listings are automotive workspace for vans and light commercial vehicles unless a specific listing says it can take something larger. Nothing here is a lorry park.",
      },
      {
        question: "Is a tail-lift loading bay the same thing?",
        answer:
          "No. A loading dock is for deliveries. Listings in this category are for working on the vehicle. Do not read a commercial workspace listing as goods-in access.",
      },
    ],
    aliases: ["van", "commercial vehicle", "van workspace", "commercial workspace", "van hire bay"],
  },
  {
    slug: "vehicle-lift-hire",
    name: "Vehicle Lift Hire",
    shortName: "Vehicle Lift",
    icon: "lift",
    explanation: "Hire of a vehicle lift, either in a bay you visit or as equipment the listing describes.",
    seoTitle: "Vehicle Lift Hire",
    metaDescription:
      "Vehicle lifts hired in a bay you visit, or mobile lifting equipment where the listing says it is hired out. This is not an MOT booking.",
    introduction: [
      "Vehicle lift hire means the lift is the thing being hired. Sometimes that is a two-post or four-post lift inside a bay you visit. Sometimes a business hires out mobile lifting equipment. The address and notes say which of those the record is. This directory does not assume the lift is delivered.",
      "A listing here is not a certificate that the lift is suitable for your vehicle, and it is not an MOT bay. Ask the operator about the inspection of the equipment and the weight rating. Use the price only when a rate is printed on the listing.",
    ],
    faqs: [
      {
        question: "Is the lift delivered to me?",
        answer:
          "Delivery is not assumed. If the listing has a premises address, treat it as somewhere you go unless the notes say the lift is mobile and hired out to other sites.",
      },
      {
        question: "Does a lift listing include a full workshop?",
        answer:
          "Not always. Some hires are the lift and a small bay. Tools, compressors, and diagnostic equipment appear only when they are listed. Read the equipment section before you plan the job.",
      },
      {
        question: "Can I use a hired lift as an MOT facility?",
        answer:
          "No. Workspace and lift hire are not MOT bookings. Use a business that actually offers testing if you need an MOT.",
      },
    ],
    aliases: ["vehicle lift", "vehicle lift hire", "lift hire", "car lift hire"],
  },
  {
    slug: "hgv-workshop-hire",
    name: "Commercial / HGV Workspace",
    shortName: "Commercial / HGV",
    icon: "van",
    explanation: "Workshop space recorded for heavier vehicles than a standard car bay, including commercial and HGV work where the listing says so.",
    seoTitle: "Commercial and HGV Workspace",
    metaDescription:
      "Commercial and HGV workshop space where a listing records heavier-vehicle access. Confirm height, length, and weight with the facility before booking.",
    introduction: [
      "Commercial and HGV workspace is for facilities whose record mentions heavier vehicles, light commercial access, or HGV workshop hire. A normal car ramp is not placed here just because a van might fit.",
      "The two are not the same booking. Some sites can take a light commercial vehicle. Others mention heavy-vehicle space. The equipment list and notes are the limit of what this directory claims. Take the vehicle height, length, and weight to the facility before you travel.",
    ],
    faqs: [
      {
        question: "Does this category mean the bay can take any lorry?",
        answer:
          "No. The category means the listing recorded commercial, heavy-vehicle, or HGV workspace. It does not record a universal height or weight limit. Ask the facility with your vehicle dimensions.",
      },
      {
        question: "How is this different from a van bay?",
        answer:
          "Van workspace is for light commercial vehicles. This category is used when the record mentions HGV or heavier commercial workshop access. Read the equipment before assuming which vehicles the site can take.",
      },
    ],
    aliases: ["hgv", "hgv workshop", "commercial workspace", "heavy vehicle", "hgv workshop hire"],
  },
  {
    slug: "garage-space-hire",
    name: "Garage space hire",
    shortName: "Garage Space",
    icon: "bay",
    explanation: "Hired garage space. Public pages group this with garage bay hire.",
    seoTitle: "Garage Space Hire",
    metaDescription:
      "Garage space hire is grouped with garage bay hire. The directory does not publish a separate page for the same kind of booking.",
    introduction: [
      "Garage space hire is the same kind of booking as a garage bay: a working space for a vehicle, not the whole business. Listings that use this internal category appear on the garage bay hire page.",
    ],
    faqs: [
      {
        question: "Why is there no separate garage space page?",
        answer:
          "Garage space and garage bay hire describe the same kind of hired workspace. Listings stay on the garage bay hire page so the directory does not split one idea across two thin pages.",
      },
    ],
    aliases: ["garage space", "garage space hire", "private garage"],
    groupedUnder: "garage-bay-hire",
  },
  {
    slug: "prep-bay-hire",
    name: "Prep bay hire",
    shortName: "Prep Bay",
    icon: "spray",
    explanation: "A preparation bay used with paint or refinishing work. Public pages group this with spray booth hire.",
    seoTitle: "Prep Bay Hire",
    metaDescription:
      "Prep bays recorded alongside spray booth hire. They are listed on the spray booth page rather than as a separate category.",
    introduction: [
      "A prep bay is the preparation space used before or beside booth work. Where a listing records prep bay hire, it is shown with spray booth hire.",
    ],
    faqs: [
      {
        question: "Is a prep bay a spray booth?",
        answer:
          "No. A prep bay is the preparation space. It is grouped with spray booth hire because the records that use it are booth facilities, not general ramp bays.",
      },
    ],
    aliases: ["prep bay", "prep bay hire", "preparation bay"],
    groupedUnder: "spray-booth-hire",
  },
  {
    slug: "workshop-hire",
    name: "Workshop hire",
    shortName: "Workshop",
    icon: "workshop",
    explanation: "Workshop hire recorded on a listing. Public pages use the Workshop Hire category.",
    seoTitle: "Workshop Hire",
    metaDescription:
      "Workshop hire is published on the Workshop Hire category page. A second page is not created for the same booking type.",
    introduction: [
      "Some records use a shorter workshop-hire category as well as a primary type such as a spray booth. Those listings also appear under Workshop Hire when the record includes this category.",
    ],
    faqs: [
      {
        question: "Why do some spray booths also appear under workshop hire?",
        answer:
          "Only when the listing itself records workshop hire as well as the booth. The directory does not add that category to make the page longer.",
      },
    ],
    aliases: ["workshop hire"],
    groupedUnder: "automotive-workshop-hire",
  },
  {
    slug: "tool-hire",
    name: "Tool hire",
    shortName: "Tool Hire",
    icon: "diy",
    explanation: "Tools hired with automotive workspace, not a general high-street tool shop.",
    seoTitle: "Tool Hire",
    metaDescription:
      "Tool hire attached to an automotive workspace listing. A general tool shop is not listed here, and this category has a page only when a live listing uses it.",
    introduction: [
      "Tool hire in this directory means tools offered with automotive workspace. It is not a catalogue of tool shops. A listing is filed here only when the record includes tool hire.",
    ],
    faqs: [
      {
        question: "Can I hire tools without a bay?",
        answer:
          "This directory does not list general tool hire on its own. Tool hire appears only as part of a workspace record.",
      },
    ],
    aliases: ["tool hire", "tools for hire"],
  },
];

const categoryBySlug = new Map<string, CategoryDefinition>(
  categories.map((category) => [category.slug, category]),
);

export function getAllCategories(): readonly CategoryDefinition[] {
  return categories;
}

export function getCategory(slug: string): CategoryDefinition | undefined {
  return categoryBySlug.get(slug);
}

export function isPublicCategory(category: CategoryDefinition): boolean {
  return !category.groupedUnder;
}

export function getPublicCategories(): CategoryDefinition[] {
  return categories.filter(isPublicCategory);
}

/** The public category slug plus any internal slugs grouped under it. */
export function slugsForPublicCategory(slug: string): string[] {
  return [slug, ...categories.filter((category) => category.groupedUnder === slug).map((category) => category.slug)];
}

export function publicCategoryOf(slug: string): CategoryDefinition | undefined {
  const category = getCategory(slug);
  if (!category) {
    return undefined;
  }
  if (category.groupedUnder) {
    return getCategory(category.groupedUnder) ?? category;
  }
  return category;
}

export function listingMatchesCategory(
  listing: { primary_category: string; categories: readonly string[] },
  slug: string,
): boolean {
  const accepted = new Set(slugsForPublicCategory(slug));
  return accepted.has(listing.primary_category) || listing.categories.some((category) => accepted.has(category));
}

export function publicCategoriesForListing(listing: {
  primary_category: string;
  categories: readonly string[];
}): CategoryDefinition[] {
  const seen = new Set<string>();
  const result: CategoryDefinition[] = [];

  for (const slug of [listing.primary_category, ...listing.categories]) {
    const category = publicCategoryOf(slug);
    if (!category || seen.has(category.slug)) {
      continue;
    }
    seen.add(category.slug);
    result.push(category);
  }

  return result;
}

export function categoryLabels(slug: string): string[] {
  const category = getCategory(slug);
  if (!category) {
    return [slug];
  }

  const labels = [category.slug, category.name, category.shortName, ...category.aliases];
  const parent = category.groupedUnder ? getCategory(category.groupedUnder) : undefined;
  if (parent) {
    labels.push(parent.slug, parent.name, parent.shortName, ...parent.aliases);
  }
  return labels;
}
