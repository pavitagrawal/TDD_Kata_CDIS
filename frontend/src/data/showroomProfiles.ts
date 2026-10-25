export interface ShowroomProfile {
  slug: string;
  model: string;
  vehicleId: string;
  category: string;
  image: string;
  tagline: string;
  story: string;
  design: string;
  cabin: string;
  drive: string;
  highlights: string[];
  inspiration: { title: string; maker: string; videoId: string };
}

// Northstar models are fictional design concepts. These descriptions are
// creative direction, never measured specifications or production promises.
export const showroomProfiles: ShowroomProfile[] = [
  {
    slug: "arc",
    model: "Arc",
    vehicleId: "showroom-northstar-arc",
    category: "Electric",
    image: "/images/arc.png",
    tagline: "Electric calm for the everyday escape.",
    story:
      "Arc imagines a clean, quiet electric sedan that makes every trip feel a little more considered. The concept balances city-friendly proportions with a grand-touring sense of occasion.",
    design:
      "A low, flowing roofline, crisp lighting and a restrained surface treatment give Arc a confident silhouette without visual clutter.",
    cabin:
      "The design brief favors an uncluttered cockpit, intuitive controls and generous visual space for passengers.",
    drive:
      "The intended character is smooth, responsive and relaxed rather than focused on headline acceleration figures.",
    highlights: [
      "Sculpted electric-sedan form",
      "Calm interior direction",
      "Everyday grand-touring brief",
    ],
    inspiration: {
      title: "New Model 3 Performance | Tesla",
      maker: "Tesla",
      videoId: "krQKnhMwxn4",
    },
  },
  {
    slug: "arc-gt",
    model: "Arc GT",
    vehicleId: "showroom-northstar-arc-gt",
    category: "Electric",
    image: "/images/arc-gt.png",
    tagline: "The electric concept with a sharper edge.",
    story:
      "Arc GT takes the Arc design language toward a more expressive grand tourer. It is an imagined performance-oriented companion, not a production trim.",
    design:
      "A more assertive front graphic, lower visual stance and darker details distinguish the GT concept from Arc.",
    cabin:
      "The cabin brief adds a sportier atmosphere while retaining the simple, technology-led layout of the Arc family.",
    drive:
      "The concept suggests an energetic, composed drive; no acceleration, range or charging results have been measured.",
    highlights: [
      "Grand-touring silhouette",
      "Sport-inspired details",
      "Electric performance direction",
    ],
    inspiration: {
      title: "New Model 3 Performance | Tesla",
      maker: "Tesla",
      videoId: "krQKnhMwxn4",
    },
  },
  {
    slug: "roam",
    model: "Roam",
    vehicleId: "showroom-northstar-roam",
    category: "SUV",
    image: "/images/roam.png",
    tagline: "Room for the routes you haven't planned.",
    story:
      "Roam is an exploratory SUV concept built around comfort, flexible space and the idea that a daily drive can turn into an adventure.",
    design:
      "An upright profile and strong shoulders communicate utility, while softened forms keep the design approachable.",
    cabin:
      "The imagined interior prioritizes an open feeling, useful storage and an adaptable passenger environment.",
    drive:
      "Roam's intended personality is assured and easygoing. Off-road capability and towing figures have not been engineered or tested.",
    highlights: [
      "Adventure-ready design brief",
      "Flexible-space concept",
      "Confident SUV stance",
    ],
    inspiration: {
      title: "The G-Class | One Love. Endless Adventures.",
      maker: "Mercedes-Benz",
      videoId: "7IIhYiqvXPk",
    },
  },
  {
    slug: "roam-xl",
    model: "Roam XL",
    vehicleId: "showroom-northstar-roam-xl",
    category: "SUV",
    image: "/images/roam-xl.png",
    tagline: "Think bigger. Go farther in comfort.",
    story:
      "Roam XL expands the Roam idea into a more spacious, travel-minded concept for people and their gear.",
    design:
      "A longer visual footprint and broad cabin volume give the XL concept a commanding presence.",
    cabin:
      "The concept brief focuses on flexible seating, luggage space and a restful atmosphere for longer journeys; exact capacities are not specified.",
    drive:
      "The intended experience is stable, quiet and confident across longer trips, without claiming tested performance or range.",
    highlights: [
      "Expanded SUV concept",
      "Travel-first interior",
      "Versatile design direction",
    ],
    inspiration: {
      title: "The G-Class | One Love. Endless Adventures.",
      maker: "Mercedes-Benz",
      videoId: "7IIhYiqvXPk",
    },
  },
  {
    slug: "velocity",
    model: "Velocity",
    vehicleId: "showroom-northstar-velocity",
    category: "Performance",
    image: "/images/velocity.png",
    tagline: "A sports-car idea with pure momentum.",
    story:
      "Velocity is Northstar's imagined low-slung sports coupe, designed to celebrate the connection between driver and road.",
    design:
      "A long, sculpted hood, compact cabin and taut rear create a purposeful profile.",
    cabin:
      "The design brief puts the driver at the center with a focused layout and clear sightlines.",
    drive:
      "Velocity is conceived as agile and engaging. Horsepower, top speed and lap times are intentionally not invented.",
    highlights: [
      "Driver-focused concept",
      "Low coupe silhouette",
      "Expressive sports-car styling",
    ],
    inspiration: {
      title: "2026 Toyota GR Supra Overview",
      maker: "Toyota USA",
      videoId: "jp5Rk8_I8Mw",
    },
  },
  {
    slug: "velocity-r",
    model: "Velocity R",
    vehicleId: "showroom-northstar-velocity-r",
    category: "Performance",
    image: "/images/velocity-r.png",
    tagline: "The most focused Northstar concept.",
    story:
      "Velocity R turns the Velocity design theme into an imagined track-inspired flagship. It remains an editorial concept rather than a tested or orderable car.",
    design:
      "Sharper aero-inspired forms, bolder color and a wider visual stance set the R apart.",
    cabin:
      "The concept cabin would emphasize supportive seating, clear driver information and minimal distraction.",
    drive:
      "Its creative brief is precision and immediacy, with no verified power, acceleration or circuit data.",
    highlights: [
      "Track-inspired direction",
      "Aerodynamic design cues",
      "Focused driver environment",
    ],
    inspiration: {
      title: "2026 Toyota GR Supra Overview",
      maker: "Toyota USA",
      videoId: "jp5Rk8_I8Mw",
    },
  },
];

export const getShowroomProfile = (slug: string) =>
  showroomProfiles.find((profile) => profile.slug === slug);
export const getShowroomProfileByVehicleId = (vehicleId: string) =>
  showroomProfiles.find((profile) => profile.vehicleId === vehicleId);
