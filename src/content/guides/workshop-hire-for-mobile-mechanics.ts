import { GUIDE_AUTHOR, GUIDE_PUBLISHED, guideSlug } from "@/content/guide-routes";
import { callout, h2, link, p, strong, table, textCell, ul, type GuideDocument } from "@/content/guides/blocks";

const guide: GuideDocument = {
  slug: guideSlug.trade,
  title: "Automotive Workshop Hire for Mobile Mechanics and Trade Users",
  description:
    "How mobile mechanics and trade users can hire a temporary workshop, ramp or commercial bay, and what to confirm on equipment, vehicle limits, VAT and price.",
  published: GUIDE_PUBLISHED,
  updated: GUIDE_PUBLISHED,
  category: "Trade",
  author: GUIDE_AUTHOR,
  status: "published",
  relatedCategorySlugs: ["automotive-workshop-hire", "hgv-workshop-hire", "vehicle-lift-hire"],
  relatedGuideSlugs: [guideSlug.checklist, guideSlug.pricing, guideSlug.lifts],
  blocks: [
    p(
      "A mobile mechanic or a small workshop sometimes needs somebody else's bay: the driveway is the wrong place, their own ramp is full, or a job needs a lift they do not own. Workshop hire is that bay, sold as time or as a longer booking, without the host business taking the repair.",
    ),
    p(
      "AutoWorkspace UK files those facilities under ",
      link("Workshop Hire", "/category/automotive-workshop-hire"),
      " when the record is a working workshop, and under ",
      link("Commercial / HGV workspace", "/category/hgv-workshop-hire"),
      " when the record mentions heavier or commercial vehicle space. Read the audience. Trade means the listing is aimed at commercial users. Consumer means a private hirer is also in view. Both means both were recorded. The label is not a contract.",
    ),

    h2("when-it-helps", "When a temporary workshop is the right tool"),
    p(
      "The usual reasons are practical. The job needs the vehicle raised and the customer's drive is on a slope, on the street, or too tight. The weather has turned a day of brake work into a soaked job. Your own unit is already full, or the ramp is out of use. You have a one-off van, a project, or a vehicle you cannot take back to base.",
    ),
    p(
      "It is a weak fit when you need a permanent address, a storage yard, or an office. A day in a host workshop does not create those. It is also a weak fit when the host's rules ban the exact work you do, such as welding, paint, or commercial vehicles. Read the restrictions on the listing, then ask. A restriction that is missing from the page may still exist on site.",
    ),
    ul([
      ["Overflow: your ramp is booked and the next job cannot wait."],
      ["Capability: you need a two-post, a four-post, or a heavier bay you do not have."],
      ["Place: the vehicle cannot be worked on where it is parked."],
      ["Downtime: your workshop is shut for a repair, a move, or a let that has ended."],
    ]),

    h2("short-term", "Short bookings and longer project space"),
    p(
      "Hourly and half-day hires suit a defined job you can finish and drive away. Day hire suits diagnostics that turn into work, a clutch, or two vehicles if the operator allows that. A week or a month is a different conversation: power, insurance, waste, and whether you are a guest in someone else's building or the occupier of a bay.",
    ),
    p(
      "Published week and month rates are uncommon in the directory compared with hourly and day rates. If the listing does not show one, ask. Do not scale a day rate into a monthly rent in your head and treat that as the price. The operator may not offer a monthly bay at all.",
    ),
    p(
      "For a vehicle that will be apart for more than the booking, agree storage before you start. Trade users leave customer cars. Leaving a customer's car in a host workshop without an agreement is how both businesses end up with a problem at locking-up time.",
    ),

    h2("ramp-access", "Ramp and lift access"),
    p(
      "Say which lift you need. Wheels-off brake and suspension work points to a two-post. A vehicle that should stay on its wheels, or an inspection that does not need the wheels off, may suit a four-post. The ",
      link("two-post and four-post guide", `/guides/${guideSlug.lifts}`),
      " is the selection guide. It is not operating instructions. Use the host's procedure on their equipment.",
    ),
    p(
      "Ask whether the ramp is yours for the whole booking or shared, and whether an MOT bay or a staff job can take priority. A training workshop and a public rent-a-ramp can both be filed near vehicle lifts. They do not run the same day. The equipment list tells you what was recorded. The operator tells you what is free on Tuesday.",
    ),
    callout(
      "note",
      "Capacity stays specific",
      "A commercial category does not raise the weight limit. Quote the vehicle. A car ramp, a light-commercial bay, and an HGV workshop are different hires even when one business offers more than one of them.",
    ),

    h2("diagnostics", "Diagnostics and equipment"),
    p(
      "Some listings record diagnostic equipment, a scan tool, or a brake tester. Many do not. Bring the kit you trust unless the equipment line names what you need and the operator confirms it is available to hirers, not only to their own staff or their students.",
    ),
    p(
      "Air, a press, a gearbox jack, an engine crane, and waste-oil equipment are the other items that change whether the bay can replace your own workshop for a day. The ",
      link("pre-hire checklist", `/guides/${guideSlug.checklist}`),
      " goes through them one by one. For trade work, add a question about how many vehicles you may have on site and where the customer waits. A host may not want your customer in the bay.",
    ),

    h2("secure", "A secure place to work"),
    p(
      "Security means different things: a locked industrial unit, a bay inside a staffed garage, or a ramp in a yard. Ask what is locked, who else has access during your booking, and whether you can leave a toolbox and a customer's keys. Do not infer security from a photograph or from the word workshop.",
    ),
    p(
      "Also ask about end-of-day responsibility. If you are the last person out, you may be the person who sets the alarm. If staff lock up at a fixed time, your booking ends then even if the job has not. Neither arrangement is better in the abstract. You need the one that matches the job.",
    ),

    h2("vehicles", "Vehicle restrictions"),
    p(
      "Car, van, and HGV space are not one product. ",
      link("Commercial and HGV listings", "/category/hgv-workshop-hire"),
      " are used when the record mentions heavier-vehicle or HGV workshop access. A rent-a-ramp listing that might accept a small van is still a ramp listing. Take height, length, wheelbase, and weight to the operator, including roof racks, tail lifts, and loaded or unladen if that changes the answer.",
    ),
    p(
      "Electric and hybrid vehicles need their own question. A few equipment lists mention EV or hybrid kit. Most do not. If the job involves the high-voltage system, ask whether the bay and your way of working are accepted there. Do not treat silence as permission.",
    ),
    p(
      "Customer vehicles come with customer expectations. Agree with the host whether the car can be road-tested, where it is parked before and after the ramp, and what happens if it fails and cannot leave. Build that into the time you buy.",
    ),

    h2("vat-price", "VAT, pricing, and what to compare"),
    p(
      "Trade prices are often discussed excluding VAT. The directory marks a recorded rate as excluding VAT only when the source said so. If the flag is absent, ask. Do not assume a consumer hourly rate and a trade day rate are comparable, and do not assume either includes electricity, waste, or a second ramp.",
    ),
    p(
      "The ",
      link("ramp price research", `/guides/${guideSlug.pricing}`),
      " shows starting prices on live rent-a-ramp and vehicle-lift listings in this dataset. Workshop day rates that are also filed under vehicle lift hire appear there with their listing type, so a multi-ramp training workshop is not mistaken for an hourly public bay. Use it as context. Get the quote for your vehicle from the operator.",
    ),
    p(
      strong("A missing price is an enquiry, not a negotiation against the median."),
      " Plenty of trade facilities publish no starting rate because the price depends on the vehicle, the day, and the length of the hire. Ask for that price. The median of other people's hourly rates will not answer it.",
    ),

    h2("downtime", "Covering your own workshop downtime"),
    p(
      "If your ramp is broken or your unit is unavailable, a host bay is a bridge, not a new premises. Book the shortest arrangement that keeps the current jobs moving, and ask whether the host can take more than one day if the repair to your own workshop slips. A single confirmed day is better than a vague option on a busy ramp.",
    ),
    p(
      "Tell the host what you will be doing. A business that hires a bay to mobile mechanics may still refuse fabrication, spray, or fleet work. Restrictions protect their insurance and their own customers. Plan a second option before the day, especially for a vehicle that cannot sit on the street if the host says no.",
    ),

    h2("questions", "Questions to ask the operator"),
    table(
      "Trade booking questions",
      ["Topic", "Ask"],
      [
        [textCell("The bay"), textCell("Is it mine for the whole booking, and which lift is in it?")],
        [textCell("The vehicle"), textCell("Will you take this vehicle, at this weight, height, and length?")],
        [textCell("People"), textCell("Can I bring a colleague, and can the customer enter the bay?")],
        [textCell("Tools"), textCell("Which of your tools may I use, and which must I bring?")],
        [textCell("Diagnostics"), textCell("Is any scan tool or brake equipment available to hirers?")],
        [textCell("Waste"), textCell("Which fluids and parts can I leave, and which must I remove?")],
        [textCell("Price"), textCell("The rate for this booking, whether VAT is extra, and the overrun charge.")],
        [textCell("Insurance"), textCell("What cover you require, and what your policy does not include.")],
        [textCell("If it will not leave"), textCell("Can the vehicle stay, and can a recovery truck reach the bay?")],
        [textCell("The building"), textCell("Who locks up, and can a toolbox stay if I return tomorrow?")],
      ],
    ),
    p(
      "Write the answers against the listing. If the published price or the equipment is wrong, use ",
      link("report incorrect information", "/report"),
      " from that listing. The form is the correction route. It does not currently send or store the report.",
    ),

    h2("where-to-look", "Where to look in the directory"),
    p(
      "Start with ",
      link("workshop hire", "/category/automotive-workshop-hire"),
      " for a working bay aimed at longer or trade use. Add ",
      link("commercial and HGV workspace", "/category/hgv-workshop-hire"),
      " when the vehicle is bigger than a car. Use ",
      link("vehicle lift hire", "/category/vehicle-lift-hire"),
      " and ",
      link("rent-a-ramp", "/category/rent-a-ramp"),
      " when you need a few hours on a lift rather than a unit. ",
      link("Browse", "/browse"),
      " is the full published set.",
    ),
    p(
      "Private owners booking a bay for their own car should read ",
      link("can you rent a garage to work on your own car", `/guides/${guideSlug.ownCar}`),
      " as well. The facilities overlap. The questions about insurance, a customer vehicle, and VAT are where trade hire becomes its own booking.",
    ),
  ],
};

export default guide;
