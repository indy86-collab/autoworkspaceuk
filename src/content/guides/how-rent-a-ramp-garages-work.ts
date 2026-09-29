import { GUIDE_AUTHOR, GUIDE_PUBLISHED, guideSlug } from "@/content/guide-routes";
import { callout, h2, link, p, strong, table, textCell, ul, type GuideDocument } from "@/content/guides/blocks";

const guide: GuideDocument = {
  slug: guideSlug.rentARamp,
  title: "How Rent-a-Ramp Garages Work in the UK",
  description:
    "How a UK rent-a-ramp bay works: who does the work, how time is booked, and what to ask about tools, vehicle limits and safety before you travel.",
  published: GUIDE_PUBLISHED,
  updated: GUIDE_PUBLISHED,
  category: "Rent a ramp",
  author: GUIDE_AUTHOR,
  status: "published",
  relatedCategorySlugs: ["rent-a-ramp", "self-service-garage", "vehicle-lift-hire"],
  relatedGuideSlugs: [guideSlug.pricing, guideSlug.lifts, guideSlug.checklist],
  blocks: [
    p(
      "A rent-a-ramp booking is time on a vehicle ramp or lift, in a bay you use yourself. You carry out the job, or you bring someone with you. The site is not taking the car in as a repair customer.",
    ),
    p(
      "That distinction is the whole product. A conventional garage sells labour and a finished repair. A ",
      link("rent-a-ramp", "/category/rent-a-ramp"),
      " listing sells access to the ramp and the space around it. The equipment list, the audience label, and the price on the listing are the only things AutoWorkspace UK claims were recorded. House rules still come from the operator.",
    ),
    callout(
      "note",
      "Who the bay is for",
      "Consumer means the facility is presented as open to a private user. Trade means it is aimed at people working commercially. Some listings record both. Read the label, then confirm you can book.",
    ),

    h2("what-it-means", "What rent-a-ramp means"),
    p(
      "In UK workshop language, ramp and lift are often used for the same idea: a piece of equipment that raises a vehicle so you can work underneath or take the wheels off. A two-post lift, a four-post ramp, and a scissor lift are different machines. The ",
      link("lift comparison", `/guides/${guideSlug.lifts}`),
      " explains which jobs each type suits. The category name does not tell you which machine is in the bay.",
    ),
    p(
      "The hire is usually the ramp plus the floor around it for a set period. It can also include light, a bench, and sometimes tools. It does not include a technician, a diagnosis, or parts, unless the operator has agreed that separately and the listing says so. If you want the garage to do the job, book a repair. If you want the ramp, book the ramp.",
    ),

    h2("how-it-runs", "How a self-service bay usually runs"),
    p(
      "A typical visit is short to describe. You book a period and arrive with the vehicle, the parts, and the tools you were told to bring. Someone lets you in and points out the ramp, the power, the bins, and the things you must not do. Showing you the controls is not the same as repairing the car, and it is not training. If you have not used that type of lift before, say so before you travel.",
    ),
    p(
      "You are usually expected to bring consumables: oil, filters, brake parts, gloves, and a plan for old fluid. Waste oil is the operator's problem only when the listing or the booking says there is a drain tank or a disposal point. If it does not, ask where used oil goes before you drain the sump. You keep responsibility for the work. The operator keeps responsibility for the premises and the rules.",
    ),

    h2("time", "Hourly hire, half days, and full days"),
    p(
      "Operators publish time in different units. An hourly booking suits one defined job: a brake disc and pad set you have already done on the ground, an underbody inspection, a sensor you can reach once the car is in the air. A half day suits work that involves dismantling, waiting, or putting a stubborn fixing back. A day suits a clutch, a larger suspension job, or anything that should not be rushed against a one-hour clock.",
    ),
    p(
      "Half day is not a national standard. One site may mean a morning. Another may mean a set number of hours. Ask what the clock covers, when it starts, and how an overrun is charged. A published hourly rate is a starting price for the time unit they advertise. It is not a promise that the bay stays yours if the job takes longer.",
    ),
    table(
      "How to match the booking to the job",
      ["Booking", "Usually suits", "Ask before you pay"],
      [
        [textCell("Hour"), textCell("One job you can finish in that hour"), textCell("What happens in the next hour if you are not done")],
        [textCell("Half day"), textCell("Dismantling, a service, or a job with some waiting"), textCell("How many hours the half day actually is")],
        [textCell("Day"), textCell("Larger work, or a car that must stay raised"), textCell("Whether the vehicle can stay if it will not drive out")],
      ],
    ),
    p(
      "Recorded starting prices for ramp and lift listings are collected on the ",
      link("pricing guide", `/guides/${guideSlug.pricing}`),
      ". Use that page for the range in the current AutoWorkspace UK dataset. Use the listing you intend to book for the rate that applies to you. The two are not the same number.",
    ),

    h2("tools", "Bringing your own tools, or using theirs"),
    p(
      "Some bays are bring-your-own. You arrive with a socket set, a torque wrench, axle stands if the job needs them, and any special tool the vehicle requires. Other bays list hand tools, air tools, or a toolkit. A third group lists a compressor or an airline and expects you to bring the gun.",
    ),
    p(
      "Read the equipment list as a record, not as a catalogue you can extend. If a spring compressor, a ball-joint separator, or a diagnostic tool is not listed, assume it is not there until the operator says otherwise. Generic words such as tools or basic tools do not mean a full professional kit, and they do not mean the one special tool your car needs.",
    ),
    p(
      strong("Air tools need air."),
      " An airline or a compressor has to be on the equipment list, or confirmed, before you plan the job around an impact wrench. The same is true of a socket for a grinder or a charger. A listed toolkit can still be a basic set, incomplete, or in use on another bay. If a tool is essential, take your own or confirm it the day before.",
    ),

    h2("booking", "How booking usually works"),
    p(
      "There is no single UK booking system for ramp hire. Some operators take a phone call and a time. Some use a page on their own website. A few ask for a deposit or payment before the day. AutoWorkspace UK does not take the booking and does not hold the bay.",
    ),
    p(
      "When you contact the site, give them the vehicle, the job, and the time you want. Mention if the car is lowered, long, a van, or fitted with side steps or a body kit. Mention if you need to remove the engine or the gearbox. Those facts change whether the ramp is suitable and whether the time slot is long enough.",
    ),
    p(
      "Ask what you must bring to be allowed in: identification, proof of insurance, or confirmation that you are competent to use the lift. Requirements differ, and this directory does not set them. If the listing is marked trade, a private owner should not travel on the assumption that the bay is open to the public. Also ask the finish time, whether a deposit is kept if you cancel, and who meets you if you are late.",
    ),

    h2("vehicle-limits", "Vehicle limits"),
    p(
      "Every lift has a rated capacity and a set of vehicles it can physically take. The directory records a capacity only when one was stated. A category called rent-a-ramp is not a weight limit. A kilogram figure on one listing describes that equipment, not every ramp in the country.",
    ),
    p(
      "Height, length, and ground clearance matter as much as weight. A long van can be within the kilogram rating and still not fit the roof. A very low car can still be difficult to position. Take the make, model, and any modifications to the operator, and book only after they confirm that vehicle. A car ramp is not a ",
      link("motorcycle workspace", "/category/motorcycle-workspace"),
      " unless the equipment list names a bike lift or stand, or the facility accepts bikes.",
    ),

    h2("which-jobs", "Jobs that suit a rented ramp"),
    p(
      "A rented ramp is a good fit when you already know the job, you have the parts, and the work needs the vehicle raised or the wheels off. Brake replacement, a visual check of the underside, an exhaust section, and many suspension tasks are the usual reasons people book an hour or a half day.",
    ),
    p(
      "It is a weak fit when you have not started the diagnosis, when parts are still on order, or when the car may have to stay overnight. Engine-out and gearbox-out work needs a hoist or a transmission jack, enough time, and a clear answer on what happens if the vehicle cannot leave. Paint and welding are often restricted: a ramp bay is not a ",
      link("spray booth", "/category/spray-booth-hire"),
      ". If the listing does not allow that work, ask before you travel with the equipment.",
    ),

    h2("before-you-arrive", "What to ask before you arrive"),
    p("These are the questions that change the booking:"),
    ul([
      ["Which lift will I actually use, and what vehicles is it rated for?"],
      ["Is the price for the ramp alone, and does the operator's price include or exclude VAT?"],
      ["Which tools, airline, and waste-oil point are included?"],
      ["Can a second person come in to help, and can a courier deliver parts to the bay?"],
      ["What time must I be clear, and what does an overrun cost?"],
      ["If the car will not start or will not drive, can it stay, and on what terms?"],
      ["What insurance do you require, and what is my responsibility if I damage the bay?"],
    ]),
    p(
      "Write the answers down against the listing. Prices and rules change. The ",
      link("checklist before you hire", `/guides/${guideSlug.checklist}`),
      " goes through the same ground in more detail, including storage, opening hours, and recovery.",
    ),

    h2("safety", "Safety"),
    p(
      "AutoWorkspace UK does not teach you how to operate a lift, and a guide is not a substitute for the operator's instructions. Use the ramp only within the weight, the vehicle type, and the rules they give you. If you are not already comfortable with that kind of lift, do not use a self-service booking as your first lesson.",
    ),
    p(
      "A few boundaries are worth settling before you travel. Do not plan to support the vehicle on a trolley jack alone once you are working under it. Do not remove wheels on a four-post ramp unless the site has confirmed a proper way to support the vehicle, such as a jacking beam they allow you to use. Do not take a passenger or an untrained helper into the bay unless the operator has agreed. The directory has not inspected the lift. Ask how it is looked after, and what it is rated for, before you decide the bay is right.",
    ),

    h2("not-a-garage", "How this differs from a conventional garage"),
    p(
      "A conventional garage takes the vehicle, diagnoses or follows an agreed job, supplies labour, and returns the car. You are a customer of a repair business. You do not stand in the working bay, and you do not bring your own tools. The price is for the work, not for an hour of ramp time.",
    ),
    p(
      "A rent-a-ramp or ",
      link("DIY garage", "/category/self-service-garage"),
      " booking reverses that. You are hiring the means to do the work. The result depends on your parts, your skill, and the time you bought. Ordinary repair garages are not added here just because they own a ramp. A listing appears when there is evidence that someone outside the business can hire the space or the equipment.",
    ),

    h2("where-next", "Where to look next"),
    p(
      "Browse published ",
      link("rent-a-ramp facilities", "/category/rent-a-ramp"),
      ", then open the listing for the lift type, the tools, the audience, and the last-checked date. Compare ",
      link("recorded ramp prices", `/guides/${guideSlug.pricing}`),
      " only as a picture of this dataset, not as a quote. If you are choosing between lift types, read the ",
      link("two-post and four-post comparison", `/guides/${guideSlug.lifts}`),
      " before you book the wrong machine for the job.",
    ),
  ],
};

export default guide;
