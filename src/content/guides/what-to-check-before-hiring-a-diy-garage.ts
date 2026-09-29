import { GUIDE_AUTHOR, GUIDE_PUBLISHED, guideSlug } from "@/content/guide-routes";
import { callout, checklist, h2, link, p, ul, type GuideDocument } from "@/content/guides/blocks";

const guide: GuideDocument = {
  slug: guideSlug.checklist,
  title: "What to Check Before Hiring a DIY Garage or Vehicle Lift",
  description:
    "A practical checklist before you hire a DIY garage or vehicle lift, from rated capacity and tools to oil disposal, insurance and a vehicle that will not start.",
  published: GUIDE_PUBLISHED,
  updated: GUIDE_PUBLISHED,
  category: "Before you book",
  author: GUIDE_AUTHOR,
  status: "published",
  relatedCategorySlugs: ["self-service-garage", "garage-bay-hire", "vehicle-lift-hire"],
  relatedGuideSlugs: [guideSlug.rentARamp, guideSlug.lifts, guideSlug.ownCar],
  blocks: [
    p(
      "A DIY bay is hired time and hired equipment. The useful checks are the ones that decide whether your vehicle, your job, and your finish time fit that bay. Everything else can wait until you are sure you should travel.",
    ),
    p(
      "Use the list at the end as the call sheet. The notes under each heading explain why the question matters. Confirm the answers with the operator. A listing records what was published. It does not reserve the bay, and it does not inspect the lift.",
    ),

    h2("capacity", "Vehicle weight and lift capacity"),
    p(
      "Match the vehicle to the lift you will use, not to the category name. ",
      link("Vehicle lift hire", "/category/vehicle-lift-hire"),
      " and ",
      link("DIY garage", "/category/self-service-garage"),
      " listings sometimes record a rated capacity, a tonne figure, or a note that a van or an SUV was mentioned. Many do not. No figure in the directory is a guess.",
    ),
    p(
      "Ask for the rated capacity of the actual lift, and tell them the vehicle, including modifications. If they cannot confirm it, choose a different bay.",
    ),
    callout(
      "caution",
      "A category is not a weight rating",
      "Rent-a-ramp, garage bay, and vehicle lift describe the kind of hire. They do not say your car is within the limit. Get the limit for the machine in the bay you have booked.",
    ),

    h2("lift-type", "Lift type"),
    p(
      "Two-post and four-post lifts suit different jobs. Wheels-off brake and suspension work usually needs the wheels free. A four-post keeps the tyres on runways unless the site confirms a jacking beam and allows you to use it. Storage and some simple servicing are a more natural fit for a four-post. The ",
      link("comparison of the two types", `/guides/${guideSlug.lifts}`),
      " is there so you can book the right machine.",
    ),
    p(
      "If the equipment list only says ramp or vehicle lift, ask which type is in your slot. A building can have both. The listing may be describing the site, not the one bay you will stand in.",
    ),

    h2("tools", "Tools"),
    p(
      "Decide which tools the job cannot proceed without. Then split them into three groups: tools you will bring, tools the equipment list names, and tools you still need the operator to confirm. A line that says tools, basic tools, or toolkit is not a full list. It does not include a spring compressor, a torque wrench of a particular size, or a diagnostic head unless those words are there.",
    ),
    p(
      "Special tools for one manufacturer are your problem unless the site has said otherwise. So is a torque wrench you trust. Shared tools get borrowed, damaged, and left in another bay. If losing that tool would stop the job, take one.",
    ),

    h2("workspace", "Workspace"),
    p(
      "A bay that looks large in a photograph can be tight once a door is open and a toolbox is on the floor. Ask whether the booking is a private bay or one space in a shared workshop, and whether you can open doors, use a creeper, and walk around the vehicle. Ask where your toolbox and the removed wheels go so they are not in the next person's bay.",
    ),
    p(
      "Ask whether the bay is indoors and how it is lit. An outdoor ramp is a different booking in the rain.",
    ),

    h2("power-air", "Electricity and air"),
    p(
      "Electric hand tools need a socket you are allowed to use. Air tools need a compressor or an airline. Battery chargers, inspection lamps, and a small grinder are ordinary things to clear before you arrive. Do not assume a domestic extension lead is acceptable. Ask what you may plug in.",
    ),
    p(
      "An equipment line that says air line or compressor means air was recorded. A line that says air tools means tools were recorded, not that you can add your own gun to a supply that is not there.",
    ),

    h2("hoist", "Engine hoist"),
    p(
      "Removing an engine needs a hoist or a crane, a way to support the vehicle, enough height, and enough time. Some listings record an engine crane, an engine hoist, or an engine support beam. Many ramp bookings do not. A one-hour or half-day slot is rarely enough for an engine-out job even when the crane is there, because the vehicle then cannot leave.",
    ),
    p(
      "Ask three things: is the hoist included, is it rated for your engine, and can the vehicle stay if the engine is out at the end of the booking. If the third answer is no, do not start.",
    ),

    h2("gearbox", "Gearbox jack"),
    p(
      "A gearbox or transmission jack is not a trolley jack and it is not included with a ramp. Listings that record a gearbox jack, a transmission jack, or a gearbox stand are the ones where that equipment was mentioned. If yours does not, ask. Lowering a gearbox onto the floor without the right support is how casings and people get hurt, and it is also how a booking overruns.",
    ),
    p(
      "The same overrun problem applies. A gearbox job that slips by an afternoon becomes a vehicle that cannot be driven. Agree the finish rule before you drain the oil.",
    ),

    h2("oil", "Oil and fluid disposal"),
    p(
      "Old engine oil, coolant, brake fluid, and gearbox oil have to go somewhere. Some bays record an oil drainer, a waste-oil tank, or a disposal point. Others expect you to take waste away. Ask which fluids they will accept and which containers you must bring. Do not plan to pour waste into a drain, a yard, or a domestic rubbish bin.",
    ),
    p(
      "Ask what you may leave and what you must take. A bay that accepts waste oil may still refuse old pads, filters, and cardboard.",
    ),

    h2("welding", "Welding, grinding, and paint"),
    p(
      "Hot work and paint are often prohibited in a general ramp bay. Sparks, fumes, extraction, and insurance are the usual reasons. A welder on an equipment list, or a line that says welding is optional, is not the same as permission to weld your chassis during a public hire. Ask, and accept a no.",
    ),
    p(
      "Paint belongs in a ",
      link("spray booth", "/category/spray-booth-hire"),
      " when you need extraction and filtration. A detailing or mechanical bay is the wrong default. If you only need to clean and protect the underside, say that. It is a different request from spraying a panel.",
    ),

    h2("duration", "How long the job will take"),
    p(
      "Book the time the job needs when it goes slowly, not the time it needs when every bolt moves. Add time for setting up, for a part that does not fit, and for cleaning the bay. If you have not done the job before, a rented ramp is an expensive place to discover the next step.",
    ),
    p(
      "Ask what half day and day mean in hours, when the clock starts, and the price of the following hour. A published hourly rate does not tell you that the next hour is free. If the following booking is another customer, you may have to stop while the car is still apart. That is the situation to avoid.",
    ),

    h2("storage", "Storage and overnight"),
    p(
      "A working booking is not storage. Assume the vehicle leaves when the time ends unless the operator agrees it can stay, says where it will sit, and says what it costs. Project cars, engine-out jobs, and cars waiting for a part need that answer in advance.",
    ),
    p(
      "Ask whether you can leave a toolbox overnight, and whether the bay is locked. Some sites are secure buildings. Some are a ramp in a yard. The words secure workspace on a different listing are not evidence about this one.",
    ),

    h2("hours", "Opening hours and access"),
    p(
      "The directory does not invent opening hours. Ask when you can arrive, whether evenings or Sundays exist, and whether someone has to be on site to let you out. A key code or an unattended bay is a different arrangement from a garage that locks up at a fixed time. If you are late, ask whether the slot is lost.",
    ),
    p(
      "Also ask about parking for a second vehicle if someone is dropping you off, and about access for a van delivering parts. A bay on an industrial estate can have a gate that couriers will not wait at.",
    ),

    h2("parts", "Parts delivery"),
    p(
      "Parts rarely arrive exactly when the ramp starts. Ask whether a courier can deliver to the address during your booking, who signs for the parcel, and what happens if it arrives after you have started dismantling. If the part is wrong, you need the overrun rule from the duration check, not a hope that the bay is quiet.",
    ),
    p(
      "Bring the parts you already have, including fastenings and fluids, in a form you can carry from the car park. A bay hire does not include a parts department.",
    ),

    h2("terms", "Insurance and terms"),
    p(
      "Ask what insurance the hire requires and what it does not cover. Some sites want evidence that you are competent. Trade hirers are often asked for their own cover. Private hirers may be asked to follow a written set of rules. AutoWorkspace UK does not interpret those documents and does not sell cover.",
    ),
    p(
      "Read the damage rule before you need it: a broken socket is a different conversation from damage to the lift. Ask who you call if something on the equipment fails during the booking. Stop if the lift does not behave as the operator described. Do not keep raising a vehicle on equipment you no longer trust.",
    ),

    h2("recovery", "If the vehicle cannot leave"),
    p(
      "This is the check people skip. Engines that will not start, brakes that are still apart, and gearboxes that are on the floor all end the same way: the car cannot be driven out, and the next user may be waiting.",
    ),
    ul([
      ["Can the vehicle stay, and for how long?"],
      ["Is there a charge for storage or for the next session?"],
      ["Can a recovery truck reach the bay?"],
      ["Are you allowed to leave the car locked in the building if nobody is with it?"],
      ["If the answer is no, what must be true before you are allowed to start?"],
    ]),
    p(
      "If you cannot accept those answers, book a longer period, book a ",
      link("workshop", "/category/automotive-workshop-hire"),
      " that agrees to a project, or do not start the job in that bay. A recovery plan made up at 5pm is how vehicles get left in the wrong place.",
    ),

    h2("checklist", "Checklist to use when you call"),
    checklist([
      "Vehicle confirmed against the lift rating, height, and length",
      "Lift type named, and it suits the job",
      "Essential tools either packed or confirmed on site",
      "Electricity and air confirmed if the job needs them",
      "Engine hoist or gearbox jack confirmed if the job needs them",
      "Waste oil and used parts: where they go",
      "Welding, grinding, and paint either allowed or not part of the plan",
      "Booking length matches a slow version of the job, including overrun",
      "Overnight storage answered, including a vehicle that cannot be driven",
      "Arrival time, access, and parts delivery agreed",
      "Insurance and damage terms understood",
      "A way for the vehicle to leave, or permission for it to stay",
    ]),
    p(
      "Then read the listing again. The last-checked date tells you how fresh the record is. The ",
      link("rent-a-ramp guide", `/guides/${guideSlug.rentARamp}`),
      " explains the booking itself. Browse ",
      link("DIY and self-service garages", "/category/self-service-garage"),
      " or ",
      link("garage bays", "/category/garage-bay-hire"),
      " once the checks are questions you can ask, rather than surprises on the day.",
    ),
  ],
};

export default guide;
