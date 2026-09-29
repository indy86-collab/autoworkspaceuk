import { GUIDE_AUTHOR, GUIDE_PUBLISHED, guideSlug } from "@/content/guide-routes";
import { callout, h2, link, p, table, textCell, ul, type GuideDocument } from "@/content/guides/blocks";

const guide: GuideDocument = {
  slug: guideSlug.ownCar,
  title: "Can You Rent a Garage to Work on Your Own Car in the UK?",
  description:
    "The UK options for working on your own car, from a DIY bay and ramp hire to a project space, and why a normal repair garage is a different booking.",
  published: GUIDE_PUBLISHED,
  updated: GUIDE_PUBLISHED,
  category: "Hiring workspace",
  author: GUIDE_AUTHOR,
  status: "published",
  relatedCategorySlugs: ["self-service-garage", "rent-a-ramp", "automotive-workshop-hire", "garage-bay-hire"],
  relatedGuideSlugs: [guideSlug.rentARamp, guideSlug.checklist, guideSlug.trade],
  blocks: [
    p(
      "Yes, some facilities hire a bay so you can work on your own car. They are a specific kind of business. A normal repair garage, an MOT station, and a dealer workshop are usually not that business, even though they also have ramps.",
    ),
    p(
      "This guide maps the options you will actually see, and the AutoWorkspace UK category that matches each one. It does not describe your legal right to be admitted to somebody else's workshop. Whether you can book depends on the operator, the audience on the listing, and the terms they set.",
    ),

    h2("why-garages-say-no", "Why a normal garage does not hand you the ramp"),
    p(
      "A repair garage's workshop is the place its own people work. The business is organised around staff, booked repairs, and customers who leave the car. Letting a customer bring tools into that space is a different offer: different insurance questions, a different way of supervising the building, and a different use of a ramp that may already be booked for paying repair work.",
    ),
    p(
      "So the usual answer from a high-street garage is no, even when the ramp is empty that afternoon. The refusal is about how that business runs. It is not evidence that DIY bays do not exist. They exist where someone has chosen to hire the space out. Those are the facilities this directory looks for.",
    ),
    callout(
      "note",
      "What this directory lists",
      "A facility is published when there is current evidence that someone outside the business can hire automotive workspace or equipment. A garage that only repairs customer cars is not added because it owns a ramp.",
    ),

    h2("options", "The options, and what each one is for"),
    p(
      "People use the same words for different hires. Ramp hire, a DIY garage, a unit, and a lockup are not interchangeable. Use the job and the time to pick the row, then open that category and read the individual listings.",
    ),
    table(
      "Which hire matches the job",
      ["You want", "What it usually is", "Category"],
      [
        [
          textCell("A few hours on a ramp, and you do the work"),
          textCell("The lift and the bay for a booked period"),
          [link("Rent a Ramp", "/category/rent-a-ramp")],
        ],
        [
          textCell("A bay to work on your own car, whether or not a lift is the main point"),
          textCell("Hired workshop space aimed at the vehicle owner"),
          [link("DIY / self-service garage", "/category/self-service-garage")],
        ],
        [
          textCell("The lift itself, in a bay you visit"),
          textCell("Hire of the lifting equipment, sometimes with a small bay"),
          [link("Vehicle lift hire", "/category/vehicle-lift-hire")],
        ],
        [
          textCell("One working space, not a whole building"),
          textCell("A single bay inside a garage"),
          [link("Garage bay hire", "/category/garage-bay-hire")],
        ],
        [
          textCell("Several days, or a base for repeated jobs"),
          textCell("A workshop arrangement, often aimed at trade as well as private hirers"),
          [link("Workshop hire", "/category/automotive-workshop-hire")],
        ],
        [
          textCell("A project that will not finish in one visit"),
          textCell("Space where the operator agrees the car can stay"),
          [link("Workshop hire", "/category/automotive-workshop-hire")],
        ],
      ],
    ),
    p(
      "A listing can sit in more than one of those categories when the record supports each one. A DIY garage with a ramp can appear under both self-service and rent-a-ramp. Read the equipment. The category chip is a filing label, not a full description.",
    ),

    h2("diy", "DIY and self-service garages"),
    p(
      "A ",
      link("self-service garage", "/category/self-service-garage"),
      " is the closest thing to renting a garage to work on your own car. You get a bay. Staff may unlock it and explain the rules. They are not booked to diagnose the fault or to complete the repair. Some of these sites are also rent-a-ramp businesses. The emphasis in this category is the hired bay, not only the lift.",
    ),
    p(
      "Expect to bring specialist tools. Expect a time limit. Expect to take the car away at the end unless storage was agreed. The ",
      link("checks before you hire", `/guides/${guideSlug.checklist}`),
      " are written for this kind of booking: capacity, tools, oil, overrun, and a car that will not start.",
    ),

    h2("ramp", "Ramp and lift hire"),
    p(
      "Ramp hire is the same family of booking with the lift at the centre. You want the car in the air, or the wheels off, for a defined job. ",
      link("How rent-a-ramp garages work", `/guides/${guideSlug.rentARamp}`),
      " covers tools, vehicle limits, and the difference between an hour and a day. ",
      link("Two-post and four-post lifts", `/guides/${guideSlug.lifts}`),
      " covers which machine to ask for.",
    ),
    p(
      "Vehicle lift hire overlaps. Sometimes you are visiting a bay. Sometimes a business hires lifting equipment out. The address and the notes say which. Delivery is not assumed. If the listing has a premises, plan to go there until the operator says the lift comes to you.",
    ),

    h2("bay", "A single garage bay"),
    p(
      "Garage bay hire is one working space rather than a whole unit. It can be the right size for a service or a weekend job when you need a sound floor, light, and a roof. It does not automatically include a lift. If the job needs the car in the air, the equipment list has to say so, or you need a ramp category instead.",
    ),
    p(
      "Overnight parking of a second car, a friend working with you, and use of the customer's waiting room are not part of a bay hire unless they are agreed. Ask what private means for that site. A single bay in a shared building is still a single bay. It is not always an empty building.",
    ),

    h2("project", "Project cars and longer workshop rental"),
    p(
      "A project car needs somewhere the vehicle can stay while it is apart. That is a storage question joined to a workspace question. Short ramp hire answers the second and usually refuses the first. Before you loosen the first bolt, ask whether the car can remain, for how many days, and at what charge.",
    ),
    p(
      "Longer workshop rental is closer to taking a unit or a bay by the week or the month. Fewer listings publish a monthly rate than an hourly one. Absence of a monthly price is not a monthly price of zero. Ask. Also ask about insurance, power, waste, and what must be removed when you leave. A project that fills a bay with a shell, a toolbox, and parts is a different hire from an afternoon on a ramp.",
    ),
    ul([
      ["One visit, car driven home: ramp, DIY bay, or garage bay."],
      ["More than one visit, car must stay: get the storage answer first, usually from workshop hire."],
      ["You want someone else to do the work: a repair garage, which is outside this directory."],
    ]),

    h2("mobile", "Using a bay while a mobile mechanic does the work"),
    p(
      "Some owners do not want to do the work themselves. They want a ramp their own mechanic can use, because the driveway is unsafe or illegal for that job, or because the mechanic has no workshop. That can be a consumer booking if the site allows a helper, or a trade booking if the mechanic hires the bay.",
    ),
    p(
      "Ask who the contract is with, and who is allowed in the bay. A site marked trade may refuse a private booking even when your mechanic is insured. A site marked consumer may still limit how many people come in. The ",
      link("guide for mobile mechanics and trade hirers", `/guides/${guideSlug.trade}`),
      " is written from the mechanic's side of that conversation.",
    ),

    h2("not-these", "Bookings that look similar and are not"),
    p(
      "An MOT test is a test, not a hire of the bay. A service booked with a garage is labour. A storage unit without a right to work on the car, a car park, and a domestic garage tenancy that forbids repairs are not automotive workspace hire. Spray painting needs a ",
      link("spray booth", "/category/spray-booth-hire"),
      " if you need extraction. Washing and paint correction belong in a ",
      link("detailing bay", "/category/detailing-bay-hire"),
      " when that is the facility on offer. A motorcycle needs a ",
      link("motorcycle workspace", "/category/motorcycle-workspace"),
      " rather than a guess that the bike will balance on a car ramp.",
    ),
    p(
      "None of those categories means every UK business of that type is listed. ",
      link("Browse", "/browse"),
      " shows published facilities only. If your town is missing, the directory has a gap. It has not proved that no bay exists there.",
    ),

    h2("how-to-choose", "How to choose before you enquire"),
    ul([
      ["Name the job and whether the wheels have to come off."],
      ["Decide whether the car must leave the same day."],
      ["Decide whether you are doing the work or a mechanic is coming with you."],
      ["Open the matching category and read the audience, equipment, and last-checked date."],
      ["Ask the operator the capacity, the tools, the price, the VAT, and the overrun rule."],
    ]),
    p(
      "Start with ",
      link("DIY and self-service garages", "/category/self-service-garage"),
      " if the bay itself is what you need, and with ",
      link("rent-a-ramp", "/category/rent-a-ramp"),
      " if the lift is the point. Confirm the current details with the facility. The listing is the research. The booking is theirs.",
    ),
  ],
};

export default guide;
