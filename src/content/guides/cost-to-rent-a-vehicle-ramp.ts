import { GUIDE_AUTHOR, GUIDE_PUBLISHED, guideSlug } from "@/content/guide-routes";
import { callout, embed, h2, link, p, strong, ul, type GuideDocument } from "@/content/guides/blocks";

const guide: GuideDocument = {
  slug: guideSlug.pricing,
  title: "How Much Does It Cost to Rent a Vehicle Ramp in the UK?",
  description:
    "Hourly, half-day and day starting prices recorded on live AutoWorkspace UK ramp and lift listings, with the date those figures were last checked.",
  published: GUIDE_PUBLISHED,
  updated: GUIDE_PUBLISHED,
  category: "Pricing",
  author: GUIDE_AUTHOR,
  status: "published",
  relatedCategorySlugs: ["rent-a-ramp", "vehicle-lift-hire", "self-service-garage"],
  relatedGuideSlugs: [guideSlug.rentARamp, guideSlug.checklist, guideSlug.lifts],
  blocks: [
    p(
      "A ramp booking is sold as time. The useful question is not a single UK price. It is what the facility you can actually reach publishes for an hour, a half day, or a day, and what that rate leaves out.",
    ),
    p(
      "The figures below are calculated from live AutoWorkspace UK listings filed under ",
      link("Rent a Ramp", "/category/rent-a-ramp"),
      " or ",
      link("Vehicle Lift Hire", "/category/vehicle-lift-hire"),
      ". They are starting prices recorded for those facilities. They are not quotes, they do not describe every ramp in the UK, and they are not a promise that the same rate is available next week.",
    ),
    callout(
      "note",
      "How to read the summary",
      "Among facilities in our verified dataset that publish hourly prices and are filed under Rent a Ramp or Vehicle Lift Hire, the lowest, highest, and median figures are starting prices. A median is the middle value when those prices are ordered. It is not an average bill for a finished job.",
    ),
    embed("pricing-summary"),

    h2("what-is-measured", "What this page is measuring"),
    p(
      "Each listing can store an hourly, half-day, day, week, or month starting price. This page uses the hourly, half-day, and day fields on ramp and lift listings. A price that was only written as a package, such as a rate for two hours, stays out of the hourly median. Dividing a package into an hourly rate would invent a number the operator did not publish.",
    ),
    p(
      "Spray booth, detailing, and other workspace types can publish hourly rates too. Those rates are a different product. The summary separates them when they exist, so a booth hour is not presented as the cost of a mechanical ramp.",
    ),
    p(
      "Not every operator publishes a price. A listing with no rate is not treated as free, and it is not given an estimated figure. It means you have to ask. Facilities with no published price are left out of the lowest, highest, and median, which is why those three numbers describe only the listings that stated an hourly starting price.",
    ),

    h2("starting-price", "What a starting price does and does not include"),
    p(
      "A starting price is the figure the source gave as the from rate. It may be the price of the ramp for that time unit. It may assume a car rather than a van. It may rise for a longer vehicle, a weekend, a second person, or a tool that is hired on top. Where the source gave that kind of condition, the listing's own pricing note is the place to read it. This page does not fold those conditions into one adjusted rate.",
    ),
    p(
      strong("VAT is a separate question."),
      " The dataset marks a rate as excluding VAT only when the source said so. If a rate is not marked that way, that does not mean VAT is included. Ask. A trade user who can reclaim VAT and a private user who cannot are not looking at the same cost, even when the advertised number matches.",
    ),
    p(
      "The rate also leaves out the cost of doing the job. Parts, oil, a special tool you had to buy, a wasted hour because a bolt sheared, and a second booking if you cannot finish are yours. Comparing two hourly rates is useful. Treating the lower one as the cheaper day out is not, until you know the time you will actually need.",
    ),

    h2("which-unit", "Hourly, half-day, and day bookings"),
    p(
      "An hourly rate is the clearest price for a short, familiar job. It becomes expensive when the work overruns, because the next hour is another booking. A half-day or day rate can be the calmer choice when you need to dismantle something, wait, or keep the vehicle raised while you fetch a part.",
    ),
    p(
      "Where a listing publishes both an hourly starting price and a longer starting price, the summary converts the longer price into hours at that same listing's hourly rate. That is a comparison for that facility only. It is not a discount, and it is not a reason to assume another facility works the same way. Half day still needs a definition: ask how many hours it is.",
    ),
    p(
      "Day rates in the table are not all the same product. A public ramp hired for one car and a workshop day on a site with several ramps can both sit in the vehicle-lift or rent-a-ramp categories. The listing type column is there so a high day rate is not read as the price of a single hourly bay. Open the listing before you treat two day rates as alternatives.",
    ),
    ul([
      ["Use the hourly table when you want the cost of a short booking at sites that publish one."],
      ["Use the half-day and day tables when the job needs the car to stay in the bay."],
      ["Use the listing page for the rate, the VAT note, and the date that record was checked."],
    ]),

    h2("hard-to-compare", "Why two advertised rates are hard to compare"),
    p(
      "Equipment differs. One hourly price may be a two-post lift with a basic toolkit. Another may be the ramp alone, bring your own tools. A third may be a fuller workshop with air, a press, and waste-oil equipment. The cheaper hour is not automatically the better booking if you then cannot do the job.",
    ),
    p(
      "The audience differs. A consumer rate and a trade day rate are aimed at different users. A trade listing may expect a business, a method of payment, and insurance that a private owner does not have. The price on the page is not permission to book.",
    ),
    p(
      "The vehicle differs. A rate published for a car is not evidence of the rate for a van, a motorhome, or a modified car. Capacity and access are separate from the sticker price. The ",
      link("lift comparison", `/guides/${guideSlug.lifts}`),
      " is about choosing the machine. The operator still has to confirm your vehicle.",
    ),
    p(
      "The date differs. Every published listing has its own last-checked date. A starting price from that check can have changed by the time you call. The line marked data last updated is the latest of those dates among the listings used for these figures. It is not a daily price survey, and it is not a promise that every row was checked on that day.",
    ),

    h2("missing", "Prices that are missing"),
    p(
      "If a facility is in the directory and not in these tables, it has not published a starting price in the fields this page uses. That is common. Phone or use the website on the listing and ask for the current rate for your vehicle and your job. Do not fill the gap with the median. The median describes other facilities, in other places, with other equipment.",
    ),
    p(
      "Week and month rates are a different market again: a unit or a bay taken for longer than a job. They are not part of this ramp-hour calculation. Where a listing records one, it is on that listing, not inferred here.",
    ),

    h2("what-to-ask", "What to ask when you enquire"),
    ul([
      ["The rate for the time you want, for your vehicle, on the day you want."],
      ["Whether that figure includes or excludes VAT."],
      ["What the price includes: the lift, tools, air, electricity, waste oil, and a second person."],
      ["The minimum booking, and the charge if you run over."],
      ["Any deposit, and whether a cancelled slot is refunded."],
      ["Whether a diagnostic session, a ramp with an alignment rack, or a second bay is a different price."],
    ]),
    p(
      "Keep the answer with the listing. If it disagrees with the recorded starting price, believe the operator's current answer and ",
      link("report the listing", "/report"),
      " so the directory can be corrected. The report form does not send a message yet, but the listing page is still the place the correction is meant to start.",
    ),

    h2("using-the-directory", "Using the directory without treating it as a price index"),
    p(
      "Start with ",
      link("published rent-a-ramp listings", "/category/rent-a-ramp"),
      " or ",
      link("browse", "/browse"),
      " and filter to a category. Open two or three facilities you could actually travel to. Compare their equipment and their audience before you compare their hourly figures. Then use the tables on this page as context: whether a quoted hour sits at the low end, the middle, or the high end of what similar listings currently publish.",
    ),
    p(
      "That context is only as wide as the dataset. AutoWorkspace UK does not claim to list every ramp for hire in the UK. A town with no listing is not a town where ramp hire costs nothing, and it is not a town where ramp hire is unavailable. It is a gap in this directory.",
    ),
    p(
      "If you are still deciding whether a rented ramp is the right arrangement, read ",
      link("how rent-a-ramp garages work", `/guides/${guideSlug.rentARamp}`),
      " and the ",
      link("checks to make before you hire", `/guides/${guideSlug.checklist}`),
      ". The price is one of those checks. The lift, the tools, and a way to leave with a safe vehicle are the others.",
    ),
  ],
};

export default guide;
