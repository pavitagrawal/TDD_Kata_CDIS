export interface CarFact {
  label: string;
  value: string;
}

export interface IconicCar {
  slug: string;
  name: string;
  brand: string;
  category: "Electric" | "SUV" | "Performance";
  edition: string;
  market: string;
  image: string;
  headline: string;
  overview: string;
  quickFacts: CarFact[];
  sections: { title: string; facts: CarFact[] }[];
  highlights: string[];
  sources: { label: string; url: string }[];
}

export const iconicCars: IconicCar[] = [
  {
    slug: "tesla-model-3-performance",
    name: "Model 3 Performance",
    brand: "Tesla",
    category: "Electric",
    edition: "Current US specification",
    market: "United States",
    image: "/images/iconic/tesla-model-3-performance.png",
    headline: "Electric pace, everyday usability.",
    overview:
      "Tesla's dual-motor performance sedan combines all-wheel drive with a manufacturer-listed 316-mile EPA-estimated range. Figures shown here are for the Performance trim, not every Model 3.",
    quickFacts: [
      { label: "0–60 mph", value: "2.9 s" },
      { label: "EPA-est. range", value: "316 mi" },
      { label: "Drive", value: "Dual-motor AWD" },
    ],
    sections: [
      {
        title: "Performance & charging",
        facts: [
          { label: "Acceleration", value: "0–60 mph in 2.9 s" },
          { label: "EPA-estimated range", value: "316 miles" },
          { label: "Supercharging maximum", value: "250 kW" },
          {
            label: "Charge added",
            value: "Up to 147 miles in 15 minutes (Tesla estimate)",
          },
        ],
      },
      {
        title: "Space & dimensions",
        facts: [
          { label: "Seating", value: "5" },
          { label: "Cargo", value: "24 cu ft" },
          { label: "Overall length", value: "185.9 in" },
          { label: "Overall height", value: "56.3 in" },
          { label: "Curb weight", value: "4,054 lb" },
        ],
      },
      {
        title: "Cabin & warranty",
        facts: [
          { label: "Center display", value: "16 in touchscreen" },
          { label: "Rear display", value: "8 in touchscreen" },
          { label: "Basic vehicle warranty", value: "4 years / 50,000 miles" },
          {
            label: "Battery & drive-unit warranty",
            value: "8 years / 120,000 miles",
          },
        ],
      },
    ],
    highlights: [
      "Dual-motor all-wheel drive",
      "20-inch Warp Wheels",
      "Five-seat electric sport sedan",
    ],
    sources: [
      {
        label: "Tesla Model 3 specifications",
        url: "https://www.tesla.com/model3",
      },
    ],
  },
  {
    slug: "porsche-911-carrera",
    name: "911 Carrera",
    brand: "Porsche",
    category: "Performance",
    edition: "2027 US Coupe",
    market: "United States",
    image: "/images/iconic/porsche-911-carrera.png",
    headline: "A timeless sports-car silhouette.",
    overview:
      "The 911 Carrera pairs its rear-mounted, twin-turbo flat-six with rear-wheel drive and Porsche's eight-speed PDK transmission. These figures describe the US Coupe, not the wider 911 range.",
    quickFacts: [
      { label: "Power", value: "388 hp" },
      { label: "0–60 mph", value: "3.9 s" },
      { label: "Top track speed", value: "183 mph" },
    ],
    sections: [
      {
        title: "Powertrain",
        facts: [
          { label: "Engine", value: "3.0-liter twin-turbo flat-six" },
          { label: "Maximum power", value: "388 hp" },
          { label: "Maximum torque", value: "331 lb-ft" },
          { label: "Transmission", value: "8-speed PDK dual-clutch" },
          { label: "Drive", value: "Rear-wheel drive" },
        ],
      },
      {
        title: "Performance",
        facts: [
          { label: "0–60 mph", value: "3.9 seconds" },
          { label: "Top track speed", value: "183 mph with summer tires" },
          { label: "Body style", value: "Coupe" },
        ],
      },
    ],
    highlights: [
      "Rear-engine architecture",
      "Twin-turbocharged flat-six",
      "Eight-speed PDK",
    ],
    sources: [
      {
        label: "Porsche USA 911 Carrera",
        url: "https://www.porsche.com/usa/models/911/carrera-models/911-carrera/",
      },
    ],
  },
  {
    slug: "bmw-m3-competition-xdrive",
    name: "M3 Competition xDrive",
    brand: "BMW",
    category: "Performance",
    edition: "Current US specification",
    market: "United States",
    image: "/images/iconic/bmw-m3-competition.png",
    headline: "A sports sedan with serious intent.",
    overview:
      "BMW's M3 Competition xDrive adds all-wheel drive to the high-output M3 formula. BMW notes acceleration figures are preliminary comparisons that vary with conditions and equipment.",
    quickFacts: [
      { label: "Power", value: "523 hp" },
      { label: "0–60 mph", value: "3.4 s" },
      { label: "Drive", value: "AWD" },
    ],
    sections: [
      {
        title: "Powertrain & performance",
        facts: [
          { label: "Engine", value: "2,993 cc turbo inline-six" },
          { label: "Horsepower", value: "523 bhp at 6,250 rpm" },
          { label: "Torque", value: "479 lb-ft at 2,750–5,730 rpm" },
          { label: "Transmission", value: "8-speed automatic" },
          { label: "Drive", value: "All-wheel drive" },
          { label: "0–60 mph", value: "3.4 seconds (BMW preliminary test)" },
          { label: "Electronically limited top speed", value: "155 mph" },
        ],
      },
      {
        title: "Dimensions",
        facts: [
          { label: "Length", value: "189.1 in" },
          { label: "Width", value: "74.3 in" },
          { label: "Height", value: "56.6 in" },
          { label: "Wheelbase", value: "112.5 in" },
          { label: "Curb weight", value: "3,990 lb" },
        ],
      },
    ],
    highlights: [
      "High-output inline-six",
      "M xDrive all-wheel drive",
      "Four-door sports sedan",
    ],
    sources: [
      {
        label: "BMW USA M3 technical data",
        url: "https://www.bmwusa.com/vehicles/m-series/m3-series/bmw-m3-sedan-technical-highlights.html/m3-sedan.bmw",
      },
    ],
  },
  {
    slug: "mercedes-g550",
    name: "G 550",
    brand: "Mercedes-Benz",
    category: "SUV",
    edition: "2026 US SUV",
    market: "United States",
    image: "/images/iconic/mercedes-g550.png",
    headline: "The unmistakable off-road icon.",
    overview:
      "The G 550 retains the G-Class's boxy silhouette and serious four-wheel-drive hardware, with an electrified turbo inline-six and three lockable differentials.",
    quickFacts: [
      { label: "Power", value: "443 hp" },
      { label: "0–60 mph", value: "5.3 s" },
      { label: "Towing", value: "7,000 lb" },
    ],
    sections: [
      {
        title: "Engine & capability",
        facts: [
          {
            label: "Engine",
            value: "3.0-liter turbo inline-six with mild-hybrid assist",
          },
          { label: "Power", value: "443 hp at 6,100 rpm" },
          { label: "Torque", value: "413 lb-ft at 1,950–5,500 rpm" },
          { label: "Transmission", value: "9-speed automatic" },
          {
            label: "Drive",
            value: "Permanent AWD with two-speed transfer case",
          },
          { label: "Differentials", value: "Three sequentially lockable" },
          { label: "Towing capacity", value: "7,000 lb" },
        ],
      },
      {
        title: "Size & utility",
        facts: [
          { label: "Seats", value: "5" },
          { label: "Cargo capacity", value: "37.4 cu ft" },
          { label: "Length", value: "190.0 in including spare tire" },
          { label: "Height", value: "77.7 in" },
          { label: "Curb weight", value: "5,534 lb" },
        ],
      },
    ],
    highlights: [
      "Three locking differentials",
      "Two-speed transfer case",
      "Five-seat luxury SUV",
    ],
    sources: [
      {
        label: "Mercedes-Benz USA 2026 G 550",
        url: "https://www.mbusa.com/en/vehicles/model/g-class/suv/g550w4",
      },
    ],
  },
  {
    slug: "ford-mustang-gt",
    name: "Mustang GT Fastback",
    brand: "Ford",
    category: "Performance",
    edition: "2026 US GT",
    market: "United States",
    image: "/images/iconic/ford-mustang-gt.png",
    headline: "The V8 muscle-car benchmark.",
    overview:
      "The 2026 Mustang GT Fastback centers on Ford's naturally aspirated 5.0-liter V8. A six-speed manual with rev matching is standard; a ten-speed automatic is available.",
    quickFacts: [
      { label: "Power", value: "480 hp" },
      { label: "Torque", value: "415 lb-ft" },
      { label: "Engine", value: "5.0L V8" },
    ],
    sections: [
      {
        title: "Powertrain",
        facts: [
          { label: "Engine", value: "5.0-liter Ti-VCT V8" },
          { label: "Standard output", value: "480 hp" },
          { label: "Standard torque", value: "415 lb-ft" },
          {
            label: "Available active-exhaust output",
            value: "486 hp / 418 lb-ft",
          },
          {
            label: "Standard transmission",
            value: "6-speed manual with rev matching",
          },
          { label: "Available transmission", value: "10-speed automatic" },
          { label: "Drive", value: "Rear-wheel drive" },
        ],
      },
      {
        title: "Standard GT equipment",
        facts: [
          { label: "Rear axle", value: "3.55 limited-slip" },
          { label: "Digital cluster", value: "12.4-inch LCD" },
          { label: "Front brakes", value: "Four-piston fixed calipers" },
          { label: "Standard wheels", value: "18 × 8.5-inch aluminum" },
        ],
      },
    ],
    highlights: [
      "Naturally aspirated V8",
      "Manual or automatic transmission",
      "Rear-wheel drive",
    ],
    sources: [
      {
        label: "Ford 2026 Mustang specifications",
        url: "https://es.ford.com/cars/mustang/",
      },
      {
        label: "Ford 2026 Mustang order guide",
        url: "https://www.fromtheroad.ford.com/content/dam/fordmediasite/us/en/library/2026/order-guides/2026_Ford_Mustang_Order_Guide.pdf",
      },
    ],
  },
  {
    slug: "toyota-gr-supra",
    name: "GR Supra 3.0",
    brand: "Toyota",
    category: "Performance",
    edition: "2026 US 3.0",
    market: "United States",
    image: "/images/iconic/toyota-gr-supra.png",
    headline: "A focused two-seat sports car.",
    overview:
      "Toyota's 2026 GR Supra 3.0 is a rear-drive, turbocharged inline-six coupe. The 2026 model year also marks the MkV Final Edition; the facts here describe the standard 3.0 trim.",
    quickFacts: [
      { label: "Power", value: "382 hp" },
      { label: "Torque", value: "368 lb-ft" },
      { label: "Seats", value: "2" },
    ],
    sections: [
      {
        title: "Powertrain & dynamics",
        facts: [
          { label: "Engine", value: "3.0-liter twin-scroll turbo inline-six" },
          { label: "Horsepower", value: "382 hp" },
          { label: "Torque", value: "368 lb-ft" },
          { label: "Drive", value: "Rear-wheel drive" },
          {
            label: "Transmissions",
            value: "Available 6-speed iMT or 8-speed automatic",
          },
          {
            label: "Suspension",
            value: "Double-joint front struts and multi-link rear",
          },
        ],
      },
      {
        title: "Practical details",
        facts: [
          { label: "Seats", value: "2" },
          { label: "Cargo volume", value: "10.2 cu ft" },
          {
            label: "EPA-estimated combined economy",
            value: "25 mpg for 3.0 automatic",
          },
          { label: "Body style", value: "Two-door coupe" },
        ],
      },
    ],
    highlights: [
      "Turbocharged straight-six",
      "Available manual transmission",
      "Rear-drive coupe",
    ],
    sources: [
      {
        label: "Toyota 2026 GR Supra brochure",
        url: "https://www.toyota.com/content/dam/toyota/brochures/pdf/2026/2026-grsupra-brochure.pdf",
      },
      {
        label: "Toyota GR Supra specifications",
        url: "https://www.toyota.com/grsupra/compare/",
      },
    ],
  },
];

export function getIconicCar(slug: string): IconicCar | undefined {
  return iconicCars.find((car) => car.slug === slug);
}
