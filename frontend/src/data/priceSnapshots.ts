export interface PriceSnapshot {
  slug: string;
  modelYear: number;
  usd: number;
  source: string;
  url: string;
}

// Manufacturer US starting prices checked 26 October 2026. These are not
// dealer offers, live quotes, or evidence that a car is in stock.
export const priceSnapshots: PriceSnapshot[] = [
  {
    slug: "tesla-model-3-performance",
    modelYear: 2026,
    usd: 56630,
    source: "Tesla",
    url: "https://www.tesla.com/model3-performance",
  },
  {
    slug: "porsche-911-carrera",
    modelYear: 2027,
    usd: 135500,
    source: "Porsche",
    url: "https://www.porsche.com/usa/models/911/",
  },
  {
    slug: "toyota-gr-supra",
    modelYear: 2026,
    usd: 58300,
    source: "Toyota",
    url: "https://www.toyota.com/grsupra/",
  },
  {
    slug: "ford-mustang-gt",
    modelYear: 2026,
    usd: 46800,
    source: "Ford",
    url: "https://www.ford.com/cars/mustang/models/gt-fastback/",
  },
  {
    slug: "bmw-m3-competition-xdrive",
    modelYear: 2027,
    usd: 88600,
    source: "BMW",
    url: "https://www.bmwusa.com/vehicles/m-series/m3-series/bmw-m3-sedan.html",
  },
  {
    slug: "mercedes-g550",
    modelYear: 2026,
    usd: 153900,
    source: "Mercedes-Benz",
    url: "https://www.mbusa.com/en/vehicles/model/g-class/suv/g550w4",
  },
];

export const priceSnapshotFor = (slug: string) =>
  priceSnapshots.find((item) => item.slug === slug);
