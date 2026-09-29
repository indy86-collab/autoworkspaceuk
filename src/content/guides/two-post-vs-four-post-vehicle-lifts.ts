import { GUIDE_AUTHOR, GUIDE_PUBLISHED, guideSlug } from "@/content/guide-routes";
import { callout, embed, h2, h3, link, p, table, textCell, ul, type GuideDocument } from "@/content/guides/blocks";

const guide: GuideDocument = {
  slug: guideSlug.lifts,
  title: "Two-Post vs Four-Post Vehicle Lifts: Which Workspace Do You Need?",
  description:
    "How two-post and four-post lifts differ when you are choosing a rental bay for wheels-off work, servicing, exhaust work or leaving a vehicle on its wheels.",
  published: GUIDE_PUBLISHED,
  updated: GUIDE_PUBLISHED,
  category: "Choosing a lift",
  author: GUIDE_AUTHOR,
  status: "published",
  relatedCategorySlugs: ["vehicle-lift-hire", "rent-a-ramp", "garage-bay-hire"],
  relatedGuideSlugs: [guideSlug.checklist, guideSlug.rentARamp, guideSlug.pricing],
  blocks: [
    p(
      "The lift type decides what you can sensibly do in a hired bay. A two-post lift raises the body and leaves the wheels hanging. A four-post lift drives the wheels onto runways and raises the vehicle on its tyres. Those are different kinds of access. Booking the wrong one wastes the hire.",
    ),
    p(
      "This guide is about choosing a workspace. It does not explain how to position a vehicle, where to place arms, or how to operate the controls. Follow the operator's instructions for the machine in the bay. If you are not already comfortable with that lift, do not use a self-service booking to learn it.",
    ),
    embed("lift-mentions"),

    h2("names", "The names you will see on a listing"),
    p(
      "UK operators say ramp and lift for both machines. A two-post ramp and a two-post lift are the same kind of request. A four-post ramp is the runway type. A listing that only says vehicle ramp, or vehicle lift, has not told you which. Some buildings have both, and the equipment list may be describing the site rather than the bay in your time slot.",
    ),
    p(
      "You may also see a scissor lift. That is a third machine, with a platform under the vehicle. Treat it as its own question: ask whether the wheels can come off, what it is rated for, and which jobs the operator will accept on it. Do not assume it behaves like a two-post or a four-post.",
    ),
    p(
      "Where a listing records a capacity, that figure belongs to the equipment that was described. It is not a standard UK rating for two-post lifts, and it is not a standard rating for four-post lifts. One site's two-post can be rated higher than another site's four-post. Ask for the plate, or the stated rating, on the lift you will use.",
    ),

    h2("wheels", "Wheel removal"),
    p(
      "Choose a two-post lift when the job needs the wheels off and the vehicle supported by the lift: brake discs and pads, calipers, wheel bearings, many suspension arms, and driveshaft work. The wheels hang free, so you are not supporting the car on its tyres.",
    ),
    p(
      "A four-post lift keeps each wheel on a runway. Removing a wheel on a standard four-post means the vehicle is no longer sitting on that tyre, so you need another proper way to support it. Some four-post lifts have a jacking beam or a rolling jack for that. Many hired ramps will not, or will not allow customers to use one. Ask. If the answer is unclear, book a two-post bay for wheels-off work.",
    ),
    callout(
      "caution",
      "Do not invent a support",
      "A trolley jack, a stack of wood, or a wheel left half off is not a plan for working under a car on a four-post. Either the site confirms a proper method, or you pick a different lift.",
    ),

    h2("suspension-brakes", "Suspension and brake work"),
    p(
      "Most suspension and brake jobs that private hirers book are wheels-off jobs. A two-post bay is the default request. Say that when you book, and say whether you need a spring compressor. The lift type does not include the spring compressor. That tool is either on the equipment list, in your toolbox, or not available.",
    ),
    p(
      "Access around the wheel arch still depends on the car and on how the posts are placed. A wide vehicle, a vehicle with side steps, or a car with a body kit can be awkward on a two-post even when the weight is within the rating. Mention modifications before you travel. The operator can refuse a vehicle that will not sit safely on that lift. That refusal is a useful outcome, not a failed booking.",
    ),

    h2("exhaust", "Exhaust and underside work"),
    p(
      "A two-post lift leaves the middle of the underside open between the posts, which is why people prefer it for exhaust sections, undertrays, and a proper look along the floor. You can usually walk the length of the car once it is at working height. You still have to keep clear of the arms and the posts. The operator's rules decide where you may stand.",
    ),
    p(
      "A four-post lift gives underside access too, but the runways occupy two strips under the car. An exhaust that runs beside a runway can be reachable. An exhaust, tank guard, or fixing that sits above the runway can be blocked. If the job is a specific section, describe it. Do not assume every four-post is useless for exhausts, and do not assume every two-post is automatically clear.",
    ),
    p(
      "A visual inspection, a knock from underneath, or a look at a leak is often possible on either lift. The question is whether you need the wheels off as well. If you do, go back to the two-post.",
    ),

    h2("servicing", "Servicing"),
    p(
      "An oil and filter service needs a way to reach the drain plug and the filter, a container for the old oil, and the new oil. Both lift types can be enough for that when the drain plug is reachable and the site accepts waste oil. A two-post often makes the drain plug easier to reach. A four-post is enough for many routine services if the runway is not in the way and you are not also removing wheels.",
    ),
    p(
      "The lift does not include the oil, the filter, or the disposal point. Those sit in the ",
      link("pre-hire checklist", `/guides/${guideSlug.checklist}`),
      ". A service that grows into brakes, dropped subframes, or a sump that will not seal is the moment the booking length matters more than the lift type.",
    ),

    h2("storage", "Leaving a vehicle, and longer project work"),
    p(
      "A four-post lift is the one people ask about when the car should stay on its wheels: a project that is not being dismantled today, a vehicle stored off the floor, or a car that only needs to be raised for access and then lowered onto its tyres. That is only useful if the operator allows the vehicle to stay. A day rate is not storage. Ask.",
    ),
    p(
      "A two-post lift is a poor place to leave a car for days. The vehicle is held on the arms rather than sitting on its wheels. Even where a site allows it, confirm that in writing or in a clear message before you plan around it. For a project that will span more than one visit, a ",
      link("workshop hire", "/category/automotive-workshop-hire"),
      " or a ",
      link("garage bay", "/category/garage-bay-hire"),
      " with an agreed storage rule is often a better question than which post type is taller.",
    ),

    h2("heavier", "Larger and heavier vehicles"),
    p(
      "Neither type is automatically the lift for a van, a pickup, or a heavy car. Length, width, wheelbase, and rated capacity all have to fit the machine. A four-post runway can be too short for a long van. A two-post can be within its kilogram rating and still be the wrong shape for a vehicle with steps, a tank, or a low spoiler.",
    ),
    p(
      "Use a ",
      link("commercial or HGV listing", "/category/hgv-workshop-hire"),
      " only when that is what the record says. A car ramp that might physically take a small van is not a commercial bay. Give the operator the roof height, the length, and the weight, and wait for a yes that names your vehicle.",
    ),
    h3("capacity", "How to use a capacity figure"),
    ul([
      ["Use a figure only when it was recorded for that lift, or when the operator states it for the bay you will use."],
      ["Compare it with your vehicle, including modifications and a full fuel load if that is how you will arrive."],
      ["Ignore a capacity copied from a different listing. Ratings are not interchangeable."],
      ["If no rating is available, do not invent one from the number of posts."],
    ]),

    h2("which-to-book", "Which workspace to book"),
    table(
      "Choosing between the two for a hire",
      ["You need", "Usually ask for", "Also confirm"],
      [
        [textCell("Wheels off, brakes, or suspension"), textCell("Two-post"), textCell("Capacity, body kit, and a spring compressor if you need one")],
        [textCell("Clear access along the underside"), textCell("Two-post"), textCell("That this bay, not another ramp on site, is the two-post")],
        [textCell("A routine service with the wheels on"), textCell("Either, if the drain plug is reachable"), textCell("Waste oil and the length of the booking")],
        [textCell("Exhaust work"), textCell("Two-post if you need the centre of the floor clear"), textCell("Whether a four-post runway blocks the section you are replacing")],
        [textCell("The car left sitting on its wheels"), textCell("Four-post, if storage is allowed"), textCell("That overnight or multi-day staying is part of the hire")],
        [textCell("A van or a heavy vehicle"), textCell("Whichever lift the operator rates for that vehicle"), textCell("Height, length, and weight, in writing or by a clear reply")],
      ],
    ),
    p(
      "Prices do not follow the post type in a tidy way. Use the ",
      link("recorded ramp prices", `/guides/${guideSlug.pricing}`),
      " as dataset context, then use the listing. A four-post day rate and a two-post hourly rate are not comparable until you know what each booking includes.",
    ),

    h2("before-you-travel", "What to say when you book"),
    ul([
      ["The job in one sentence: wheels off, service, exhaust, or the car staying on its wheels."],
      ["The vehicle, including anything lowered, long, or heavy."],
      ["That you need a two-post, a four-post, or whichever they confirm is suitable."],
      ["Whether a jacking beam exists, if you are considering a four-post for wheels-off work."],
      ["The rated capacity they are happy for you to rely on."],
    ]),
    p(
      "Browse ",
      link("vehicle lift hire", "/category/vehicle-lift-hire"),
      " and ",
      link("rent-a-ramp", "/category/rent-a-ramp"),
      " with that sentence ready. The equipment line is a starting point. The operator's answer about the bay you will stand in is the one that matters.",
    ),
  ],
};

export default guide;
