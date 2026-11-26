interface ListingEditorial {
  overview: string;
  bookingQuestion: string;
}

export const listingEditorial: Readonly<Partial<Record<string, ListingEditorial>>> = {
  "atc-autocare-liverpool": {
    overview: "ATC has three indoor hire bays, including two-post lifts rated at three and four tonnes. The bays differ in the equipment provided, so the lift rating and the tools needed for the job both matter when choosing a slot.",
    bookingQuestion: "Which bay has the lift rating and tools I need, and which items cost extra to hire?",
  },
  "rent-a-ramp-cardiff": {
    overview: "The Ipswich Road garage hires out ramps to private motorists and businesses. It advertises both short and longer bookings. The duration and vehicle are the two details to establish before comparing its quote with an hourly or full-day rate elsewhere.",
    bookingQuestion: "What does the slot cost for my vehicle and job, and what equipment comes with it?",
  },
  "gtg-edinburgh-workshop-hire": {
    overview: "GTG Edinburgh offers workshop days for automotive businesses and trainers. Its mix of two-post and four-post ramps, diagnostics and an optional EV kit gives course organisers several ways to set up practical sessions.",
    bookingQuestion: "Which ramps can our delegates use, and can we reserve the classroom and any EV equipment for the same dates?",
  },
  "gtg-wolverhampton-workshop-hire": {
    overview: "GTG Wolverhampton hires out workshop space to manufacturers, fleet partners and other automotive organisations. The site lists 15 vehicle ramps and space for heavier vehicles. Bookings can cover a day, a multi-day course or a longer arrangement.",
    bookingQuestion: "How many bays can our group use at once, and which are suitable for the largest vehicle we plan to bring?",
  },
  "anyday-rentals-heanor": {
    overview: "Anyday hires out ramp space at Agate House with an air supply. Its two published hire offers list different rates, equipment and booking days. Ask the operator to confirm which offer applies to the slot you want.",
    bookingQuestion: "Which lift will I get, what tools should I bring, and what is the total for that slot?",
  },
  "the-car-bunker-newport": {
    overview: "The Car Bunker rents out three 3.5-tonne two-post lifts in Newport. For jobs that go beyond an inspection, the workshop also lists gearbox jacks, an engine hoist and a bearing press. Welding equipment is an extra on the applicable booking.",
    bookingQuestion: "Which ramp should I book if I need the welder, and can I reserve the hoist or gearbox jack for the same session?",
  },
  "east-coast-cars-hoveton": {
    overview: "East Coast Cars rents a three-tonne two-post lift with standard hand tools, jacks and stands. Staff help position the vehicle and you sign a waiver on arrival. Bring power tools or other specialist kit you need for the job.",
    bookingQuestion: "Can I do the planned work on this lift, and how do I get approval for welding, grinding or work that needs extra force?",
  },
  "dba-self-service-garage-bognor": {
    overview: "DBA lets customers who are comfortable doing their own repairs book a bay with standard tools. It quotes hourly, half-day and full-day rates, which makes it possible to compare a short job with a longer booking before calling.",
    bookingQuestion: "Does my chosen self-service slot include the ramp, and are the tools for my specific job available?",
  },
  "rent-a-ramp-northeast-stanley": {
    overview: "This Stanley garage hires a two-post ramp in half-day and full-day blocks. Each booking includes a toolset, a heavy-duty jack and a gearbox stand. The operator confirms appointments after you request a slot.",
    bookingQuestion: "What are the start and finish times for my block, and how is the refundable deposit returned?",
  },
  "auto-barn-lovedean": {
    overview: "Auto-Barn sets aside Saturday slots for ramp hire in two-, four- and five-hour blocks. The workshop lists equipment for jobs needing more than a hand-tool kit, including a gearbox jack, an engine crane and a press.",
    bookingQuestion: "Can I reserve the specialist equipment I need for my Saturday slot, and what happens if the work runs beyond the booked block?",
  },
  "roman-motors-stratford": {
    overview: "Roman Motors hires a three-tonne ramp in half-day and full-day blocks. Basic tools, a gearbox jack and fluid-drain equipment are listed, and the published rates include VAT. Saturdays are by arrangement.",
    bookingQuestion: "Can you confirm the session times and which fluids, if any, can be left for disposal?",
  },
  "rent-a-ramp-cumbria": {
    overview: "The Brampton workshop offers a four-tonne lift and workbench space for DIY repairs. Undersealing has a separate hourly rate, and the operator publishes a charge for vehicles that cannot leave after the session.",
    bookingQuestion: "If I need to underseal the vehicle, what preparation is required and when must it be ready to leave?",
  },
  "borders-ramp-hire": {
    overview: "The workshop at Club Japan Imports takes advance bookings for DIY mechanics, painters and valeters. It offers a two-post lift and equipment for mechanical jobs, plus a wash area. Short bookings have a two-hour minimum, and longer projects can be quoted against weekly or flexible-use options.",
    bookingQuestion: "Will my vehicle fit the workshop height limit, and can I use a flexi booking for the dates I need?",
  },
  "ramp-hire-services-louth": {
    overview: "This DIY-only Louth ramp has a published 4.2-tonne safe working load. The operator offers different weekday and weekend prices and lists a transmission jack and oil-drain tank. Disposal of used fluids costs extra.",
    bookingQuestion: "Where is the workshop entrance, and what vehicle-specific tools or consumables should I bring?",
  },
  "weil-king-blackpool": {
    overview: "Weil-King advertises two-post ramp hire in Blackpool for maintenance, repairs and project work. The public offer confirms the lift type. Check tool access and vehicle fit with the garage when enquiring about the hire rate.",
    bookingQuestion: "What lifting capacity applies to the hire ramp, and which tools are available to renters?",
  },
  "ufixit-worcester": {
    overview: "uFIXit offers separate supervised and unsupervised paint-booth sessions, as well as a preparation bay. If the work will need help with setup or equipment, the choice of supervision changes what you should book and how much it costs.",
    bookingQuestion: "Do I need to book preparation time separately, and which spray equipment and protective kit are required for my session?",
  },
  "dream-machine-workshop-bidford": {
    overview: "The Dream Machine lists workshop time and paint-booth hire as separate bookings. The full-size booth can take tall vehicles such as high-top campers, subject to fit. Workshop tiers vary with the equipment and skills needed.",
    bookingQuestion: "Will the vehicle fit through the booth entrance, and should I book separate workshop time for preparation?",
  },
  "sr-nicholls-swinton": {
    overview: "S&R Nicholls offers customers access to a SprayBake booth in Swinton for their own paint work. It advertises extraction and a baking facility, with rates and session lengths agreed directly with the operator.",
    bookingQuestion: "Does the quote include bake time, and can I use my own spray gun and coating materials?",
  },
  "a-team-automotive-chessington": {
    overview: "A-Team Automotive hires out both a ventilated paint booth and a private workshop bay in Chessington. Choose based on whether you need to prepare a vehicle, spray it or carry out work in a private bay. Ask for the exact address when you arrange your visit.",
    bookingQuestion: "Can I reserve the bay and the booth in sequence, and what is included in the quote for each?",
  },
  "spray-masters-derby": {
    overview: "Spray Masters offers a managed booth day for approved jobs. For automotive work, the operator asks to review the vehicle or parts, dimensions and materials ahead of time. The hiring process includes an induction and competence assessment.",
    bookingQuestion: "Can you approve this vehicle and coating system in advance, and which materials or equipment are included in the day rate?",
  },
  "this-is-your-garage-culham": {
    overview: "This Is Your Garage has seven Culham bays with a mix of two-post, four-post and scissor lifts. Hourly workshop hire carries a separate consumables fee per booking. The choice of lift is worth making before reserving time.",
    bookingQuestion: "Which bay works for my vehicle and the access I need, and can I reserve shared tools for the same slot?",
  },
  "ramp2rent-chesham": {
    overview: "Ramp2Rent offers access-code workshop hire with a 3,000 kg lift and a briefing for first-time users. It lists hourly off-peak weekday hire and longer sessions. The workshop excludes welding, undersealing, paint spraying and commercial LGV or HGV use.",
    bookingQuestion: "Can I get the off-peak hours I need, and when are the directions and access code sent?",
  },
  "ramp-garage-iver": {
    overview: "Ramp Garage advertises two lifts for DIY and mobile mechanics in Iver. Its hire model assumes you bring your own tools, and the first hour is charged at a higher rate than later hours.",
    bookingQuestion: "Can you confirm the workshop entrance, the lift capacity and whether I can leave used oil on site?",
  },
  "car-ramp-hire-gravesend": {
    overview: "This Essex Road listing is a self-service garage with a two-post lift. Its published profile describes workshop and air tools for customers. Check the rate and available equipment by phone before making the trip.",
    bookingQuestion: "Is the lift available for my vehicle, and are the air tools included in the session price?",
  },
  "auto-paint-supplies-rainford": {
    overview: "Auto Paint Supplies hires a heated Haltech Airstream booth on a day basis. It supplies guns and a compressor, and a technician can advise less experienced users. High-top vans are outside the stated booth height limit.",
    bookingQuestion: "Will my vehicle fit, and can you quote for the booth, the consumables and any extra time after the booked day?",
  },
  "macs-auto-detailing-leigh": {
    overview: "MACS hires its Leigh bay for exclusive daytime detailing use. Water and washing and drying equipment are part of the setup. Detailing products are separate, and the published hire terms require customers to carry their own insurance.",
    bookingQuestion: "Which detailing machines are included, and can I bring the products I plan to use?",
  },
  "gtg-glasgow-workshop-hire": {
    overview: "GTG Glasgow offers short- and long-term workshop space for automotive businesses and training groups. The venue lists vehicle lifts, brake-testing equipment and classrooms, so practical work and classroom training can be planned at the same site.",
    bookingQuestion: "Which lifts, diagnostics and rooms can we reserve together, and can the bays take our light commercial vehicles?",
  },
  "vdr-auto-dundee": {
    overview: "VDR takes online ramp bookings for eligible cars and vans. Staff handle lifting and lowering, while the customer brings tools, parts and fluids. Independent mechanics can enquire about hiring for customer vehicles with the garage’s approval.",
    bookingQuestion: "Which ramp fits my vehicle, and can I add waste disposal or arrange storage if the job overruns?",
  },
  "auto-opulence-norwich": {
    overview: "Auto Opulence hires out an indoor Norwich detailing bay with drainage, inspection lighting and spotless water. Public and trade sessions have different prices. Professional detailers can also enquire about a booking that includes overnight curing time.",
    bookingQuestion: "Is the extraction or polishing kit I need included in my session, and what collection time applies if the vehicle stays overnight?",
  },
  "sm-auto-tech-truro": {
    overview: "SM Auto Tech offers ramp and covered bay hire in Threemilestone for motorists doing their own repairs. The operator also lists access to specialist tools and diagnostics. Availability and equipment are agreed with the garage.",
    bookingQuestion: "Can I reserve the ramp and the diagnostic or specialist tools I need in the same booking, and what are the separate charges?",
  },
  "pit-start-garage-park-royal": {
    overview: "Pit Start advertises hourly garage bays and four-post lift hire in Park Royal. Staff allocate space according to the job you describe and show you the equipment, so mention whether you need to raise the vehicle or just work under cover.",
    bookingQuestion: "Can you reserve a four-post lift for my job, and what does the hourly price include?",
  },
};
