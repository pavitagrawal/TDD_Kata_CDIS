import { useState } from "react";
import { iconicCars } from "../data/iconicCars";

interface Props {
  onOpenCar: (slug: string) => void;
}

export function CarComparison({ onOpenCar }: Props) {
  const [first, setFirst] = useState(iconicCars[0].slug);
  const [second, setSecond] = useState(iconicCars[1].slug);
  const left = iconicCars.find((car) => car.slug === first)!;
  const right = iconicCars.find((car) => car.slug === second)!;

  return (
    <section
      aria-labelledby="comparison-heading"
      className="mt-16 overflow-hidden rounded-[2rem] border border-stone-700 bg-[#171717]"
    >
      <div className="border-b border-stone-800 bg-[radial-gradient(circle_at_80%_20%,#3b0b0b,#171717_60%)] p-7 sm:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-red-400">
          Compare · Decide · Explore
        </p>
        <h2
          id="comparison-heading"
          className="mt-3 font-serif text-3xl font-bold tracking-tight sm:text-5xl"
        >
          Two icons. One clear view.
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-300">
          Choose two famous cars and compare their manufacturer-sourced
          highlights side by side. Figures come from the stated US models and
          trims, not Northstar's fictional concepts.
        </p>
      </div>
      <div className="grid gap-5 p-5 sm:p-8 md:grid-cols-2">
        {[
          { car: left, value: first, setter: setFirst, label: "First car" },
          { car: right, value: second, setter: setSecond, label: "Second car" },
        ].map(({ car, value, setter, label }) => (
          <div
            key={label}
            className="overflow-hidden rounded-2xl border border-stone-700 bg-stone-950"
          >
            <div className="p-5">
              <label className="text-xs font-bold uppercase tracking-[0.2em] text-stone-400">
                {label}
                <select
                  className="mt-2 w-full rounded-lg border border-stone-600 bg-stone-900 px-4 py-3 text-sm font-semibold text-white focus:border-red-500"
                  value={value}
                  onChange={(event) => setter(event.target.value)}
                >
                  {iconicCars.map((option) => (
                    <option key={option.slug} value={option.slug}>
                      {option.brand} {option.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <img
              src={car.image}
              alt={`Illustrative portrait of ${car.brand} ${car.name}`}
              loading="lazy"
              className="aspect-[16/9] w-full object-cover"
            />
            <div className="p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-red-400">
                {car.category} · {car.edition}
              </p>
              <h3 className="mt-2 text-2xl font-bold">
                {car.brand} {car.name}
              </h3>
              <dl className="mt-5 divide-y divide-stone-800">
                {car.quickFacts.map((fact) => (
                  <div
                    key={fact.label}
                    className="flex justify-between gap-4 py-3 text-sm"
                  >
                    <dt className="text-stone-400">{fact.label}</dt>
                    <dd className="font-semibold text-white">{fact.value}</dd>
                  </div>
                ))}
              </dl>
              <button
                onClick={() => onOpenCar(car.slug)}
                className="mt-5 rounded-full border border-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-600"
              >
                Full profile ↗
              </button>
            </div>
          </div>
        ))}
      </div>
      <p className="px-8 pb-7 text-xs leading-5 text-stone-500">
        This is an editorial comparison, not a stock or price quote. Each full
        profile links to the manufacturer sources and explains its market, trim
        and model year.
      </p>
    </section>
  );
}
