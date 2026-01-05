export type BlogPostSection = {
  heading: string;
  body: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
  heroImage: string;
  tags: string[];
  featured?: "main" | "secondary";
  trending?: boolean;
  section?: "Latest News" | "Reviews" | "Tips & Advice" | "Car Launches";
  sidebarRank?: number;
  videoHighlight?: boolean;
  metaDescription: string;
  content: BlogPostSection[];
};

export type BlogSummary = Omit<BlogPost, "content" | "metaDescription">;

export const blogPosts: BlogPost[] = [
  {
    slug: "inside-next-gen-ev-platforms",
    title: "Inside the Next-Gen EV Platforms Powering Luxury SUVs",
    excerpt:
      "Modular skateboard platforms let premium SUVs add range, comfort, and software-defined features without adding weight.",
    author: "Amelia Graham",
    date: "May 24, 2024",
    category: "Technology",
    readTime: "6 min read",
    heroImage:
      "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=900&q=60",
    tags: ["EV", "SUV", "Technology"],
    featured: "main",
    trending: true,
    section: "Latest News",
    sidebarRank: 1,
    videoHighlight: true,
    metaDescription:
      "Why new skateboard EV platforms are letting British luxury SUVs deliver more range, quieter cabins, and faster software updates.",
    content: [
      {
        heading: "Why skateboard platforms matter",
        body: [
          "Premium SUVs built on skateboard-style platforms keep batteries, cooling loops, and wiring below the cabin. That layout drops the center of gravity without stealing space from the passenger cell, so a Range Rover-sized EV can feel planted while still packaging three rows of seats.",
          "Suppliers are now shipping modular battery housings that support 800V charging, shared hot/cold plates, and integrated crash rails. Engineers reuse the same underbody across multiple models, which shortens development cycles and simplifies sourcing for Tier 1 partners.",
        ],
      },
      {
        heading: "What owners will notice",
        body: [
          "Owners get cabin designs with completely flat floors, more legroom, and less vibration because there are fewer hard mounting points into the body shell. OTA updates can tweak air suspension, steering feel, or thermal limits without changing hardware.",
          "The same platform can host two- or three-motor layouts. That means a luxury SUV can run quietly in 2WD mode during commutes, then switch to torque-vectoring AWD for holiday road trips without affecting efficiency targets.",
        ],
      },
    ],
  },
  {
    slug: "six-figure-super-sedans",
    title: "Six-figure super sedans that still deliver daily comfort",
    excerpt:
      "Adaptive dampers, quiet cabin materials, and clever drive modes let four-door rockets feel effortless on commutes.",
    author: "Julian Wells",
    date: "May 22, 2024",
    category: "Reviews",
    readTime: "5 min read",
    heroImage:
      "https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&w=600&q=60",
    tags: ["Sedans", "Performance"],
    featured: "secondary",
    section: "Reviews",
    sidebarRank: 4,
    metaDescription:
      "A closer look at the tuning tricks that make 600 hp luxury sedans livable when you are stuck in weekday traffic.",
    content: [
      {
        heading: "Cabin tech keeps the pace relaxing",
        body: [
          "Luxury sedans now link adaptive dampers, seat bolsters, and even rear-wheel steering through a single control unit. Switching to Comfort Plus mode softens the ride within milliseconds without sacrificing body control on the motorway.",
          "Acoustic glass, active noise cancellation, and double-isolated subframes keep cabin decibels low even when the engine is on boil. Several models also add camera-based road preview to preset damping before the wheel hits a pothole.",
        ],
      },
      {
        heading: "Performance without penalties",
        body: [
          "When drivers select the more aggressive drive modes, the ECU relaxes torque limits and primes larger intercooler pumps. But the latest traction software also keeps the rear differential tame so you can still pull away smoothly from a zebra crossing.",
          "Staggered tire setups and rear-steer mean these long sedans rotate like smaller coupes. That keeps the fun factor alive without punishing you with constant correction inputs around town.",
        ],
      },
    ],
  },
  {
    slug: "track-focused-aero-kits",
    title: "Track-focused aero kits now available for compact coupes",
    excerpt:
      "Wind-tunnel validated aero add-ons deliver real downforce numbers without compromising MOT compliance.",
    author: "Priya Banerjee",
    date: "May 21, 2024",
    category: "Performance",
    readTime: "4 min read",
    heroImage:
      "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=600&q=60",
    tags: ["Track", "Aftermarket"],
    featured: "secondary",
    section: "Car Launches",
    sidebarRank: 7,
    metaDescription:
      "New aero packages for compact coupes promise measurable lap-time gains thanks to CFD-validated splitters, canards, and swan-neck wings.",
    content: [
      {
        heading: "Validated hardware for club racers",
        body: [
          "The latest splitter and wing kits come with CFD plots and track data, so owners know exactly how much load they are adding at 160 km/h. Mounting points tie into crash structures, keeping the upgrades legal for road use.",
          "Modular endplates let drivers tweak balance without removing the entire wing, and the kits integrate brake-cooling ducting that slips behind the factory bumper.",
        ],
      },
      {
        heading: "Installation remains reversible",
        body: [
          "Because the kits reuse OEM mounting holes, you can revert to stock when selling the car. Body-colour infill pieces cover unused rivnuts so paintwork still looks tidy.",
          "Vendors also offer TÜV paperwork and light kits so you can pass inspection even with the larger diffusers fitted.",
        ],
      },
    ],
  },
  {
    slug: "2025-honda-civic-hybrid-50mpg",
    title: "2025 Honda Civic Hybrid delivers 50 mpg combined",
    excerpt:
      "Smaller motors with revised gearing give the Civic Hybrid a 50 mpg combined rating without sacrificing cabin tech.",
    author: "Ian Mercer",
    date: "May 23, 2024",
    category: "Efficiency",
    readTime: "3 min read",
    heroImage:
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=400&q=60",
    tags: ["Hybrid", "Efficiency"],
    trending: true,
    section: "Latest News",
    sidebarRank: 2,
    metaDescription:
      "How Honda squeezed 50 mpg out of the Civic Hybrid through motor downsizing, planetary gearing tweaks, and leaner aero.",
    content: [
      {
        heading: "Powertrain tweaks",
        body: [
          "Honda slimmed the primary traction motor and uses a steeper reduction gear, which lowers cruising RPM while still providing plenty of launch torque.",
          "A reshaped front bumper and smoother undertray trim drag by 3 percent, which the engineers say equals roughly 1 mpg on the motorway.",
        ],
      },
      {
        heading: "Cabin upgrades",
        body: [
          "Touring trim now includes the larger 12.3-inch display, wireless CarPlay, and an upgraded acoustic package so the low-rev engine note is less noticeable.",
          "A new Eco Coach widget helps drivers see when the hybrid system is in charge-sustaining mode so they can plan brake regen more efficiently.",
        ],
      },
    ],
  },
  {
    slug: "bosch-solid-state-oem",
    title: "Bosch introduces solid-state battery cells for OEM partners",
    excerpt:
      "Bosch is shipping pilot solid-state cells that offer 30 percent more energy density for premium EV platforms.",
    author: "Maya Patel",
    date: "May 22, 2024",
    category: "Industry",
    readTime: "4 min read",
    heroImage:
      "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=400&q=60",
    tags: ["Battery", "Supply Chain"],
    trending: true,
    section: "Latest News",
    sidebarRank: 3,
    metaDescription:
      "Bosch is preparing solid-state pilot cells for European luxury OEMs, promising cooler operation and simplified pack structures.",
    content: [
      {
        heading: "Pilot line progress",
        body: [
          "The company is shipping A-sample cells that pair sulfide electrolytes with silicon-rich anodes. OEMs will run full-pack validation over the next 12 months.",
          "Bosch says the packaging shrinks by 30 percent, which lets SUVs carry larger third-row footwells or increase cargo volume without sacrificing range.",
        ],
      },
      {
        heading: "Thermal management gains",
        body: [
          "Solid-state cells operate in a narrower temperature window, meaning packs can ditch some coolant channels. That simplifies service and reduces weight.",
          "If the chemistry scales, expect faster urban fast-charging because the cells tolerate higher peak currents without lithium plating.",
        ],
      },
    ],
  },
  {
    slug: "mercedes-ultra-luxury-electric-g-class",
    title: "Mercedes teases ultra-luxury electric G-Class interior",
    excerpt:
      "Sustainable leathers, configurable ambient lighting, and low-profile vents headline the first electric G interior shots.",
    author: "Miles Chen",
    date: "May 21, 2024",
    category: "Design",
    readTime: "3 min read",
    heroImage:
      "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=500&q=60",
    tags: ["Interior", "Luxury"],
    trending: true,
    section: "Car Launches",
    sidebarRank: 6,
    metaDescription:
      "Mercedes-Benz shows how the electric G-Class interior keeps the upright silhouette while adding sustainable materials and coach-style lighting.",
    content: [
      {
        heading: "Cabin updates",
        body: [
          "The dashboard keeps the trademark grab handle but now integrates a widescreen display with split-screen navigation for trail drives.",
          "Mercedes will offer plant-based leather plus Dinamica inserts, keeping weight down while satisfying the sustainability brief.",
        ],
      },
      {
        heading: "Adventure-focused tech",
        body: [
          "A transparent bonnet camera mode stitches feeds from multiple cameras so you can see obstacles underneath the front bumper.",
          "The vehicle also adds a Trail Panel UI that surfaces tire pressures, locking-differential status, and live pitch/roll data.",
        ],
      },
    ],
  },
  {
    slug: "pirelli-all-season-performance-evs",
    title: "Pirelli launches new all-season tires for performance EVs",
    excerpt:
      "A new tread compound balances instant EV torque with winter readiness in one OE-approved tyre.",
    author: "Lena Ortiz",
    date: "May 20, 2024",
    category: "Technology",
    readTime: "3 min read",
    heroImage:
      "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=500&q=60",
    tags: ["Tyres", "EV"],
    trending: true,
    section: "Tips & Advice",
    sidebarRank: 8,
    metaDescription:
      "Pirelli’s latest EV-specific all-season tire adds stronger bead reinforcements and a dual-compound tread to handle heavy performance crossovers.",
    content: [
      {
        heading: "Compound engineering",
        body: [
          "Pirelli mixes two tread compounds—softer outer shoulders for cold bite and a firmer center for crisp steering response.",
          "Noise-cancelling foam inside the carcass offsets the typical drone you get from reinforced sidewalls on heavier EVs.",
        ],
      },
      {
        heading: "Owner benefits",
        body: [
          "The tire carries the 3PMSF logo, so UK buyers can use it year-round, even in Scottish winters, without swapping to dedicated winters.",
          "New RFID tags inside the bead let service centers read tire history for warranty claims or fleet records.",
        ],
      },
    ],
  },
  {
    slug: "ford-bluecruise-hands-free-update",
    title: "Ford adds BlueCruise hands-free driving to midsize lineup",
    excerpt:
      "Version 1.4 of BlueCruise expands lane tracing and brings smoother merges to more than 400,000 km of roads.",
    author: "Elena Walker",
    date: "May 24, 2024",
    category: "Technology",
    readTime: "4 min read",
    heroImage:
      "https://images.unsplash.com/photo-1511910849309-0dffb8785146?auto=format&fit=crop&w=500&q=60",
    tags: ["Autonomy", "Software"],
    section: "Latest News",
    sidebarRank: 9,
    metaDescription:
      "BlueCruise 1.4 improves merging logic, adds UK map coverage, and tightens driver-monitoring responses for Ford’s midsize lineup.",
    content: [
      {
        heading: "Coverage expansion",
        body: [
          "The updated geofence now includes more dual carriageways in the UK along with major autoroutes across Western Europe.",
          "Ford says the adaptive learning model now predicts vehicles cutting in up to 30 percent faster, so speed adjustments feel smoother.",
        ],
      },
      {
        heading: "Driver monitoring",
        body: [
          "Infrared cameras check eye position more frequently to prevent drivers from abusing the system, and warnings arrive earlier.",
          "If hands-free driving is paused, vehicles now provide a countdown so drivers know when they can re-engage after manual input.",
        ],
      },
    ],
  },
  {
    slug: "lucid-trimotor-grand-tourer",
    title: "Lucid debuts tri-motor grand tourer with 1,200 hp",
    excerpt:
      "A revised aero package and active thermal management help the tri-motor Lucid sustain output on longer track sessions.",
    author: "Sonia Keller",
    date: "May 23, 2024",
    category: "Performance",
    readTime: "4 min read",
    heroImage:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=500&q=60",
    tags: ["EV", "Performance"],
    section: "Latest News",
    sidebarRank: 10,
    videoHighlight: true,
    metaDescription:
      "Lucid’s tri-motor flagship combines torque-vectoring front units with a new aero kit to keep repeat lap times consistent.",
    content: [
      {
        heading: "Thermal strategy",
        body: [
          "A secondary chiller cools the battery before track sessions, while a new rear deck blanking plate reduces drag during street driving.",
          "Revised inverter software rotates torque more quickly between the front motors, which keeps the car from overheating during autocross events.",
        ],
      },
      {
        heading: "Interior upgrades",
        body: [
          "Lightweight woven textiles replace leather on the seat backs, and the steering wheel now includes a dedicated Track dial.",
          "Lucid also added ambient lighting tied to drive mode so drivers know, at a glance, when the most aggressive powertrain map is active.",
        ],
      },
    ],
  },
  {
    slug: "toyota-solid-state-pilot-line",
    title: "Toyota ramps up solid-state pilot line ahead of 2026 EV",
    excerpt:
      "The new facility in Aichi validates dry coating processes before Toyota scales its solid-state EV rollout.",
    author: "Haruto Sato",
    date: "May 21, 2024",
    category: "Industry",
    readTime: "4 min read",
    heroImage:
      "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=500&q=60",
    tags: ["Manufacturing", "Battery"],
    section: "Latest News",
    metaDescription:
      "Toyota’s pilot solid-state line will trial dry electrode coating, automated stacking, and pack-integrated cooling ahead of 2026 production.",
    content: [
      {
        heading: "Manufacturing milestones",
        body: [
          "Toyota is experimenting with roll-to-roll dry coating that could remove solvents from the production chain and shrink the factory footprint.",
          "Engineers will use the pilot line to validate stacking tolerances before replicating equipment at global battery plants.",
        ],
      },
      {
        heading: "Impact on future EVs",
        body: [
          "If the chemistry passes durability targets, Toyota says it will prioritize SUVs and commercial vans where packaging gains are largest.",
          "The new cells could also support faster charging for Lexus performance models once infrastructure catches up.",
        ],
      },
    ],
  },
  {
    slug: "bmw-m3-touring-track-pace",
    title: "2024 BMW M3 Touring: wagon utility meets track pace",
    excerpt:
      "Adaptive damping and rear-biased M xDrive make the M3 Touring calm on Alpine passes yet fierce on track days.",
    author: "Sasha Boyd",
    date: "May 19, 2024",
    category: "Road Test",
    readTime: "5 min read",
    heroImage:
      "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=500&q=60",
    tags: ["BMW", "Wagon"],
    section: "Reviews",
    sidebarRank: 11,
    metaDescription:
      "The BMW M3 Touring blends practical wagon packaging with sophisticated torque-vectoring and adaptive dampers.",
    content: [
      {
        heading: "Ride and handling",
        body: [
          "Rear-biased M xDrive lets the Touring rotate like the saloon even when you have luggage stuffed behind the rear seats.",
          "Adaptive dampers use larger valves for better response on broken pavement, so the wagon still feels composed with family aboard.",
        ],
      },
      {
        heading: "Interior practicality",
        body: [
          "The 40:20:40 folding bench stays, so you can load bikes and still seat two passengers. Underfloor bins hide charging cables or helmets.",
          "An available roof box kit keeps aero drag minimal, which is ideal when driving to far-off circuits.",
        ],
      },
    ],
  },
  {
    slug: "genesis-gv60-long-term-update",
    title: "Genesis GV60 Sport Plus long-term update",
    excerpt:
      "A year of ownership highlights useful software tweaks, improved winter charging, and cabin durability wins.",
    author: "Dana Capaldi",
    date: "May 18, 2024",
    category: "Long-Term",
    readTime: "4 min read",
    heroImage:
      "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=500&q=60",
    tags: ["Genesis", "Ownership"],
    section: "Reviews",
    sidebarRank: 12,
    metaDescription:
      "Our long-term GV60 report covers winter charging behaviour, OTA updates, and how the cabin materials are holding up.",
    content: [
      {
        heading: "Charging improvements",
        body: [
          "Software now pre-conditions the pack earlier in a journey, which shaved five minutes from repeated winter DC stops.",
          "Plug & charge support at more forecourts means we hardly pull out RFID cards anymore.",
        ],
      },
      {
        heading: "Cabin durability",
        body: [
          "The recycled yarn upholstery still looks fresh, and the rotating orb shifter hasn’t developed any squeaks.",
          "Only complaint: the bright aluminium trims scuff easily, so we added clear film to protect them.",
        ],
      },
    ],
  },
  {
    slug: "volvo-ex30-scandinavian-calm",
    title: "Volvo EX30: city-sized EV with Scandinavian calm",
    excerpt:
      "Wool-blend upholstery, efficient motors, and thoughtful storage make the EX30 ideal for crowded streets.",
    author: "Luca Steiner",
    date: "May 16, 2024",
    category: "First Drive",
    readTime: "4 min read",
    heroImage:
      "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=500&q=60",
    tags: ["Volvo", "EV"],
    section: "Reviews",
    sidebarRank: 13,
    metaDescription:
      "Volvo’s smallest EV still delivers big on craftsmanship, intuitive tech, and miserly energy use for city dwellers.",
    content: [
      {
        heading: "Interior packaging",
        body: [
          "A centre drawer hides cupholders until you need them, and the door panels use soundbar-style speakers to free up storage pockets.",
          "The panoramic roof keeps the compact cabin feeling airy, yet Volvo still managed to add ISOFIX mounts in both rear seats.",
        ],
      },
      {
        heading: "Efficiency playbook",
        body: [
          "Volvo offers two battery sizes; both include heat pumps as standard because the EX30 is aimed at colder urban markets.",
          "The motors sip just 15.7 kWh/100 km in our testing, which is impressive for a crossover with this much punch.",
        ],
      },
    ],
  },
  {
    slug: "prep-performance-ev-track-days",
    title: "How to prep your performance EV for track days",
    excerpt:
      "Focus on brake cooling, thermal prep cycles, and pre-session charging strategies to keep EV lap times consistent.",
    author: "Samira Holt",
    date: "May 15, 2024",
    category: "Guides",
    readTime: "5 min read",
    heroImage:
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=500&q=60",
    tags: ["Track", "Guides"],
    section: "Tips & Advice",
    sidebarRank: 5,
    metaDescription:
      "Keep your EV fast on track days by planning battery temperature cycles, brake cooling, and charging windows.",
    content: [
      {
        heading: "Thermal prep",
        body: [
          "Arrive with 80 percent SOC so regen remains strong, then run the manufacturer’s pre-conditioning cycle 20 minutes before your session.",
          "Always cool the battery back down with a slow cooldown lap before parking; it shortens recovery time for the next stint.",
        ],
      },
      {
        heading: "Brake and tyre care",
        body: [
          "Remove aero covers to improve rotor airflow, and bring a portable fan if your pits lack ventilation.",
          "Check torque on wheel nuts after each session because many EVs run higher curb weights that stress studs.",
        ],
      },
    ],
  },
  {
    slug: "understanding-ota-updates-data-plans",
    title: "Understanding over-the-air updates and data plans",
    excerpt:
      "Clarify which updates are complimentary, how to schedule installs, and how to manage SIM-based data plans.",
    author: "Aisha Lam",
    date: "May 14, 2024",
    category: "Ownership",
    readTime: "4 min read",
    heroImage:
      "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=500&q=60",
    tags: ["Ownership", "Software"],
    section: "Tips & Advice",
    metaDescription:
      "A guide to OTA update schedules, data-plan fine print, and keeping your connected car secure.",
    content: [
      {
        heading: "Know your tiers",
        body: [
          "Most brands include safety-critical updates for free, but navigation data or entertainment apps may need subscriptions after the trial ends.",
          "Check whether your vehicle uses eSIM or physical SIM cards; swapping networks can save money if you drive across borders frequently.",
        ],
      },
      {
        heading: "Schedule smartly",
        body: [
          "Plan installs overnight and keep a trickle charger connected if your EV requires it. Interrupting installs can brick modules.",
          "Use the companion app to download packages ahead of time on Wi-Fi so you are not burning through the in-car data plan.",
        ],
      },
    ],
  },
  {
    slug: "detailing-matte-paint-hacks",
    title: "Five detailing hacks to preserve matte paint finishes",
    excerpt:
      "Use matte-safe shampoos, ceramic sprays, and microfiber technique to keep unique finishes looking sharp.",
    author: "Lena Ortiz",
    date: "May 13, 2024",
    category: "Care",
    readTime: "3 min read",
    heroImage:
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=500&q=60",
    tags: ["Detailing"],
    section: "Tips & Advice",
    metaDescription:
      "Practical care tips for matte automotive paint, from safe wash routines to ceramic sprays that prevent blotching.",
    content: [
      {
        heading: "Gentle wash process",
        body: [
          "Always rinse loose dirt before contact wash, then use a pH-neutral shampoo designed for matte surfaces to avoid unwanted sheen.",
          "Swap wash mitts mid-session so embedded grit doesn’t mar the flat finish.",
        ],
      },
      {
        heading: "Protection strategy",
        body: [
          "Use spray-on ceramic toppers formulated for matte paint; they add hydrophobic protection without glossing the finish.",
          "If you spot tar or bug etching, use dedicated solvent wipes instead of aggressive polishes.",
        ],
      },
    ],
  },
  {
    slug: "kia-next-gen-sorento-hybrid",
    title: "Kia previews next-gen Sorento with rugged hybrid trims",
    excerpt:
      "Chunky cladding, tow-ready hybrids, and clever storage cubbies highlight Kia’s updated Sorento range.",
    author: "Marco Silva",
    date: "May 12, 2024",
    category: "Launch",
    readTime: "4 min read",
    heroImage:
      "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=500&q=60",
    tags: ["Kia", "SUV"],
    section: "Car Launches",
    metaDescription:
      "Kia’s refreshed Sorento leans into rugged styling while adding hybrid drivetrains that keep towing capacity intact.",
    content: [
      {
        heading: "Design tweaks",
        body: [
          "A new grille, vertical DRLs, and squared-off arches give the Sorento a mini-Telluride vibe.",
          "Inside, split wireless chargers let driver and passenger juice phones simultaneously.",
        ],
      },
      {
        heading: "Hybrid focus",
        body: [
          "Kia boosts the hybrid’s rear motor output so braked towing remains at 2,000 kg.",
          "Battery packaging now sits under the second row so cargo volume stays competitive.",
        ],
      },
    ],
  },
  {
    slug: "nissan-ariya-software-defined-cockpit",
    title: "Nissan readies software-defined cockpit for Ariya refresh",
    excerpt:
      "Expect slimmer dashboards, contextual voice commands, and personalised ambient themes in the Ariya facelift.",
    author: "Keiko Matsumoto",
    date: "May 20, 2024",
    category: "Design",
    readTime: "3 min read",
    heroImage:
      "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=500&q=60",
    tags: ["Nissan", "Interior"],
    section: "Car Launches",
    metaDescription:
      "Nissan’s Ariya refresh introduces slimmer dash components, contextual AI voice, and user-selectable ambient palettes.",
    content: [
      {
        heading: "Cockpit overhaul",
        body: [
          "Toggle-free HVAC controls hide behind a walnut fascia, illuminating only when touched.",
          "The new HUD projects junction guidance directly over lanes, making complicated roundabouts easier to parse.",
        ],
      },
      {
        heading: "Software backbone",
        body: [
          "An Android Automotive-based stack lets Nissan deliver theme packs that change cluster fonts, sounds, and lighting.",
          "An AI voice assistant learns driver routines, suggesting seat heating or favourite podcasts before rush hour.",
        ],
      },
    ],
  },
  {
    slug: "porsche-911-dakar-vs-lamborghini-sterrato",
    title: "Porsche 911 Dakar vs Lamborghini Sterrato",
    excerpt:
      "Two rally-ready supercars prove that lifted suspension and bespoke tyres can make gravel blasts addictive.",
    author: "Claudia Rios",
    date: "May 17, 2024",
    category: "Comparison",
    readTime: "5 min read",
    heroImage:
      "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=500&q=60",
    tags: ["Porsche", "Lamborghini"],
    section: "Reviews",
    metaDescription:
      "We compare the limited-run Porsche 911 Dakar with Lamborghini’s Sterrato to see which rally-ready supercar feels more cohesive.",
    content: [
      {
        heading: "Chassis personalities",
        body: [
          "The Dakar keeps steering purity and communicates grip levels instantly, while the Sterrato leans into drama with a tail-happy tune.",
          "Both cars use bespoke Pirelli Scorpion tyres, but the Porsche’s narrower setup gives better feedback on loose gravel.",
        ],
      },
      {
        heading: "Daily liveability",
        body: [
          "Raised ride heights mean speed bumps are no longer terrifying, though the Sterrato’s roof snorkel whistles on the motorway.",
          "Cabin storage remains token in both, but Porsche fits heated seats and radar cruise as standard.",
        ],
      },
    ],
  },
  {
    slug: "choosing-right-dashcam-4k",
    title: "Choosing the right dashcam for 4K recording",
    excerpt:
      "Compare sensor sizes, HDR chops, parking modes, and cloud escalation plans before buying a 4K dashcam.",
    author: "Marta Doyle",
    date: "May 12, 2024",
    category: "Tech",
    readTime: "3 min read",
    heroImage:
      "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=500&q=60",
    tags: ["Dashcam", "Accessories"],
    section: "Tips & Advice",
    sidebarRank: 14,
    metaDescription:
      "A buyer’s guide to sharp 4K dashcams detailing sensor specs, parking protection, and subscription requirements.",
    content: [
      {
        heading: "Image quality",
        body: [
          "Look for larger CMOS sensors and HDR pipelines that keep number plates readable at night.",
          "Dual-channel systems with discreet rear cameras are worth the wiring hassle if you park on busy streets.",
        ],
      },
      {
        heading: "Smart features",
        body: [
          "Cloud plans now offer impact alerts directly to your phone, but check whether those alerts require a paid subscription.",
          "Hot-swappable SD cards make it easy to archive incidents without pulling apart trim.",
        ],
      },
    ],
  },
];

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}

export function getBlogSummaries(): BlogSummary[] {
  return blogPosts.map(({ content, metaDescription, ...summary }) => summary);
}

export function getBlogPostMetadata() {
  return blogPosts.map((post) => ({
    slug: post.slug,
    title: post.title,
    description: post.metaDescription,
  }));
}
