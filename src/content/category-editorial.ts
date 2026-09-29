import { guideSlug } from "@/content/guide-routes";

export interface CategoryEditorial {
  typicalUses: readonly string[];
  mayInclude: readonly string[];
  beforeBooking: readonly string[];
  relatedCategorySlugs: readonly string[];
  relatedGuideSlugs: readonly string[];
  extraFaqs: readonly { question: string; answer: string }[];
}

const editorial: Record<string, CategoryEditorial> = {
  "rent-a-ramp": {
    typicalUses: [
      "Brake, suspension, and exhaust jobs that need the vehicle raised for a set time.",
      "An underbody inspection when you already know what you are looking at.",
      "A mobile mechanic hiring a ramp for a car that should not be worked on in a driveway.",
    ],
    mayInclude: [
      "A booked period on a ramp or lift. The equipment list names two-post, four-post, or another machine only when that was recorded.",
      "Hand tools, air, or a waste-oil point on some sites. None of those are implied by the category.",
      "A bay in a dedicated hire site, or one ramp a working garage makes available to outside users.",
    ],
    beforeBooking: [
      "Which lift you will use, and the vehicle weight and size it is rated for.",
      "Whether the price is hourly, half-day, or day, and whether VAT is extra.",
      "Which tools you must bring, and what happens if the car cannot leave on time.",
    ],
    relatedCategorySlugs: ["self-service-garage", "vehicle-lift-hire", "garage-bay-hire"],
    relatedGuideSlugs: [guideSlug.rentARamp, guideSlug.pricing, guideSlug.lifts],
    extraFaqs: [
      {
        question: "Do I need to be experienced?",
        answer:
          "The booking assumes you can carry out the job, or that you have brought someone who can. Staff are not your mechanic. If you need the repair done for you, this is the wrong kind of listing.",
      },
      {
        question: "What if the job overruns the booked time?",
        answer:
          "Ask how the next hour is charged before you start. A published hourly rate is a starting price. It is not a promise that the bay stays free when you run over.",
      },
    ],
  },
  "self-service-garage": {
    typicalUses: [
      "Servicing and repairs the owner wants to do, with a roof, a floor, and a finish time.",
      "Jobs that have outgrown a driveway but do not need a trade unit for a month.",
      "A first look underneath a car when a ramp is listed, or floor work when it is not.",
    ],
    mayInclude: [
      "The bay itself: space, light, and access for the booking.",
      "A lift, only where the equipment list records one. Some DIY bays are floor space.",
      "A basic tool kit on some sites. Specialist tools stay your responsibility unless they are named.",
    ],
    beforeBooking: [
      "Whether a lift is actually in the bay you will use.",
      "What you may plug in, and where waste oil goes.",
      "Whether the car must leave at the end of the session.",
    ],
    relatedCategorySlugs: ["rent-a-ramp", "garage-bay-hire", "vehicle-lift-hire"],
    relatedGuideSlugs: [guideSlug.ownCar, guideSlug.checklist, guideSlug.rentARamp],
    extraFaqs: [
      {
        question: "Can I leave the car if I do not finish?",
        answer:
          "Only if the facility agrees. A DIY booking is time in a bay. It is not automatic overnight storage, and it is not a space to keep a project car.",
      },
      {
        question: "Is an MOT included?",
        answer:
          "No. Hiring a bay is not an MOT test and it is not a repair carried out by the garage. Book a test with a business that offers testing if that is what you need.",
      },
    ],
  },
  "automotive-workshop-hire": {
    typicalUses: [
      "A mobile mechanic who needs a ramp for a job that cannot be done on site.",
      "Overflow when your own ramp is full or out of use.",
      "A longer bay booking for trade work, where the listing is aimed at commercial users.",
    ],
    mayInclude: [
      "A working bay for a day, or a longer arrangement when that is what the listing publishes.",
      "Lifts, diagnostic kit, or waste handling only when those items are on the equipment list.",
      "Access rules for customer vehicles. Those rules are the operator's, not a standard package.",
    ],
    beforeBooking: [
      "Whether the audience includes trade use, and whether your customer's vehicle is accepted.",
      "Which lift is yours for the booking, and what it is rated for.",
      "VAT, insurance, waste, and what happens if the vehicle cannot be driven out.",
    ],
    relatedCategorySlugs: ["vehicle-lift-hire", "hgv-workshop-hire", "garage-bay-hire"],
    relatedGuideSlugs: [guideSlug.trade, guideSlug.checklist, guideSlug.pricing],
    extraFaqs: [
      {
        question: "Can a mobile mechanic bring a customer's car?",
        answer:
          "Trade listings are the ones aimed at commercial use. Confirm that you can bring a customer's vehicle, not only your own, and ask whether the customer may enter the bay.",
      },
      {
        question: "Are week or month bookings published?",
        answer:
          "A week or month rate is shown only when one was recorded. If the pricing block is empty, ask. Do not turn a day rate into a monthly rent.",
      },
    ],
  },
  "garage-bay-hire": {
    typicalUses: [
      "One vehicle, one job, and a proper floor when a driveway is the wrong place.",
      "Work that needs to stay indoors, including jobs that do not need a lift.",
      "A single space inside a larger building, without taking the whole unit.",
    ],
    mayInclude: [
      "The bay, the booking period, and whatever tools or lifting equipment are actually listed.",
      "Shared facilities such as a compressor, only when the equipment list says so.",
      "A private feel on some sites and a busy shared workshop on others. The listing does not promise you will be alone.",
    ],
    beforeBooking: [
      "Whether this bay has a lift. Floor space and a ramp are different hires.",
      "Whether a second person, a parts delivery, or overnight storage is allowed.",
      "What private means: a locked room, or one bay among others.",
    ],
    relatedCategorySlugs: ["self-service-garage", "rent-a-ramp", "automotive-workshop-hire"],
    relatedGuideSlugs: [guideSlug.checklist, guideSlug.ownCar, guideSlug.lifts],
    extraFaqs: [
      {
        question: "Is the bay private?",
        answer:
          "Some bookings are a single closed space. Others are one bay in a shared building. The listing does not promise an empty workshop unless it says so. Ask who else will be working at the same time.",
      },
      {
        question: "Can I weld or spray paint in a garage bay?",
        answer:
          "Not by default. Hot work and paint need permission, and paint usually needs a spray booth. If the listing does not mention welding or a booth, assume they are outside the hire until the operator says otherwise.",
      },
    ],
  },
  "spray-booth-hire": {
    typicalUses: [
      "Panel and refinishing work that needs extraction and filtration.",
      "A booked booth session for a trade sprayer, where the listing is trade-only.",
      "Prep and booth time together, only where prep space is actually recorded.",
    ],
    mayInclude: [
      "The booth and its recorded size, heat, or bake facility when those details were published.",
      "Guns, masks, or a prep bay only if they appear in the equipment list. Paint is not included.",
      "A trade audience on many listings. Consumer use is real only where the audience says so.",
    ],
    beforeBooking: [
      "Whether a private owner can hire, or whether the booth is trade-only.",
      "What is included besides the booth: prep space, guns, PPE, and bake time.",
      "How overspray, waste, and materials you bring are handled.",
    ],
    relatedCategorySlugs: ["automotive-workshop-hire", "detailing-bay-hire", "garage-bay-hire"],
    relatedGuideSlugs: [guideSlug.checklist, guideSlug.trade],
    extraFaqs: [
      {
        question: "Do I need my own insurance?",
        answer:
          "Ask the site what cover it requires. Many booths are recorded as trade. This directory does not set an insurance rule and does not check your policy.",
      },
      {
        question: "Is a preparation bay included?",
        answer:
          "A prep bay is separate from the booth. It is part of the hire only when the listing records prep space or prep bay hire. Confirm which hours are booth time and which are prep time.",
      },
    ],
  },
  "detailing-bay-hire": {
    typicalUses: [
      "Washing, decontamination, and interior work that needs drainage and light.",
      "A booked bay for paint correction when the equipment list supports that work.",
      "A valeter who needs a proper bay instead of a driveway or a hand-wash pitch.",
    ],
    mayInclude: [
      "Water, drainage, and power only when they are recorded or the operator confirms them.",
      "Machine polishers, towels, or a wash setup if those items are listed. Products are not assumed.",
      "A lift only if one is listed. A detailing bay is not a mechanical ramp by default.",
    ],
    beforeBooking: [
      "Whether a pressure washer is on site, or whether you must bring one.",
      "Where waste water and chemicals are allowed to go.",
      "How long the booking is, and whether the day rate on the listing matches the time you need.",
    ],
    relatedCategorySlugs: ["spray-booth-hire", "garage-bay-hire", "self-service-garage"],
    relatedGuideSlugs: [guideSlug.checklist, guideSlug.ownCar],
    extraFaqs: [
      {
        question: "Can both a private owner and a trade valeter book?",
        answer:
          "Read the audience label. Some detailing bays are recorded as open to both. The label is how the facility was presented, so confirm that your kind of booking is accepted before you travel.",
      },
      {
        question: "Who deals with waste water?",
        answer:
          "Ask where water and chemicals go before you book. A detailing bay is not automatically a drain you can use for any product, and the directory does not record a disposal permission unless the listing says so.",
      },
    ],
  },
  "motorcycle-workspace": {
    typicalUses: [
      "Chain, tyre, and brake work with the bike properly supported.",
      "Winter servicing somewhere drier than a driveway.",
      "A trade or private booking where the audience label includes you.",
    ],
    mayInclude: [
      "A paddock stand, bench, or motorcycle lift when the equipment list names it.",
      "Shared use of a building that also takes cars. Ask whether the bay is bike-only during your slot.",
      "Ordinary hand tools only if they are listed. Bike-specific tools are usually yours.",
    ],
    beforeBooking: [
      "That the site accepts your bike, not merely that a bike might fit on a car ramp.",
      "How the bike will be supported, and whether a lift or a stand is included.",
      "Where fuel and oil go, and whether the bike can stay if you cannot finish.",
    ],
    relatedCategorySlugs: ["self-service-garage", "rent-a-ramp", "garage-bay-hire"],
    relatedGuideSlugs: [guideSlug.ownCar, guideSlug.checklist],
    extraFaqs: [
      {
        question: "Can I remove the engine?",
        answer:
          "Only with enough time, a way to support the bike, and permission to leave it if you cannot finish. A short booking is a poor fit for a stripped engine. Agree that before you start.",
      },
      {
        question: "Will the bay be shared with cars?",
        answer:
          "Ask. Some motorcycle listings are bike space. Others are a bay in a building that also takes cars. The category means bikes were recorded, not that the building is closed to everything else.",
      },
    ],
  },
  "vehicle-lift-hire": {
    typicalUses: [
      "Hiring the lift as the main thing: a two-post or four-post in a bay you visit.",
      "A short mechanical job where ramp hire and lift hire describe the same booking.",
      "A trade user who needs lift access without taking a whole workshop.",
    ],
    mayInclude: [
      "The lift described on the equipment list, at the address on the listing.",
      "A bay around it. Tools, air, and diagnostic kit only when they are listed.",
      "A mobile lift only when the notes say the equipment is hired out to other sites. Delivery is not assumed.",
    ],
    beforeBooking: [
      "The lift type and the rated capacity for your vehicle.",
      "Whether you are going to the premises or the operator is bringing a lift to you.",
      "That this is not an MOT booking and not a repair carried out for you.",
    ],
    relatedCategorySlugs: ["rent-a-ramp", "self-service-garage", "automotive-workshop-hire"],
    relatedGuideSlugs: [guideSlug.lifts, guideSlug.pricing, guideSlug.checklist],
    extraFaqs: [
      {
        question: "How do I know the lift can take my vehicle?",
        answer:
          "Ask the operator for the rated capacity and any limits on height, length, or body style. A category label is not a weight rating, and a figure on a different listing does not transfer.",
      },
      {
        question: "Will it be a two-post or a four-post?",
        answer:
          "The equipment list names the type when that was recorded. If it only says vehicle lift, ask which machine is in the bay you will use. The comparison guide explains why that choice matters.",
      },
    ],
  },
  "hgv-workshop-hire": {
    typicalUses: [
      "Work on a vehicle that a normal car ramp is not presented as able to take.",
      "A trade booking where the listing records commercial or HGV workshop space.",
      "Access to a heavier-duty bay for a job that cannot be done at the roadside.",
    ],
    mayInclude: [
      "The heavier-vehicle space described in the equipment or notes. That description is the limit of the claim.",
      "Ramps or lifts named for that site. A car ramp elsewhere in the directory is not included.",
      "Trade-only access on some listings. Read the audience before you send a driver.",
    ],
    beforeBooking: [
      "Roof height, length, and weight of the actual vehicle, including racks or a tail lift.",
      "Whether the bay is HGV space or light-commercial space. The category covers both kinds of record.",
      "Who must stay with the vehicle, and whether it can be left.",
    ],
    relatedCategorySlugs: ["automotive-workshop-hire", "vehicle-lift-hire"],
    relatedGuideSlugs: [guideSlug.trade, guideSlug.checklist],
    extraFaqs: [
      {
        question: "Can I bring a car into an HGV bay?",
        answer:
          "Ask. The category means commercial, heavy-vehicle, or HGV workspace was recorded. It does not describe every bay on the site, and it does not mean a car is welcome in a lorry workshop.",
      },
      {
        question: "Does the driver have to stay?",
        answer:
          "Ask about keys, site rules, and whether the vehicle can be left. A commercial yard is not unsupervised storage unless the operator says it is.",
      },
      {
        question: "Who is allowed to book?",
        answer:
          "Read the audience label. Some of these workshops are recorded as trade only. A private owner should confirm they can hire the bay before travelling.",
      },
    ],
  },
};

export function getCategoryEditorial(slug: string): CategoryEditorial | undefined {
  return editorial[slug];
}
