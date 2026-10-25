import { iconicCars, type IconicCar } from "../data/iconicCars";
import { DemoBooking } from "../components/DemoBooking";
import { priceSnapshotFor } from "../data/priceSnapshots";

interface Props {
  car: IconicCar;
  onBack: () => void;
  onNavigate: (slug: string) => void;
}

export function IconicCarPage({ car, onBack, onNavigate }: Props) {
  const snapshot = priceSnapshotFor(car.slug);
  const related = iconicCars
    .filter((item) => item.slug !== car.slug)
    .slice(0, 3);

  return (
    <article>
      <button
        onClick={onBack}
        className="mb-6 text-sm font-semibold text-stone-300 hover:text-white"
      >
        ← All cars
      </button>
      <div className="relative isolate overflow-hidden rounded-[2rem] bg-[#171717]">
        <img
          src={car.image}
          alt={`Illustrative studio portrait inspired by the ${car.brand} ${car.name}`}
          className="h-[360px] w-full object-cover object-center sm:h-[580px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-7 sm:p-12">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-red-400">
            Iconic cars · {car.category}
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-black tracking-[-0.05em] sm:text-6xl">
            {car.brand} {car.name}
          </h1>
          <p className="mt-3 text-lg text-stone-200">{car.headline}</p>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-stone-400">
        <span className="rounded-full border border-stone-700 px-3 py-1">
          {car.edition}
        </span>
        <span className="rounded-full border border-stone-700 px-3 py-1">
          {car.market}
        </span>
        <span>Illustrative image · Not a live listing</span>
      </div>

      {snapshot && (
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-stone-800 bg-[#171717] p-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-red-400">
              Manufacturer price snapshot · US
            </p>
            <p className="mt-2 font-serif text-3xl font-bold">
              From{" "}
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0,
              }).format(snapshot.usd)}
            </p>
            <p className="mt-1 text-xs text-stone-400">
              {snapshot.modelYear} model · checked 26 October 2026 · not a
              dealer quote or live price
            </p>
          </div>
          <a
            href={snapshot.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-stone-600 px-4 py-2 text-sm font-semibold hover:border-red-500"
          >
            Verify at {snapshot.source} ↗
          </a>
        </div>
      )}

      <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(260px,0.7fr)]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-red-400">
            The overview
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Get to know the car
          </h2>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-stone-300">
            {car.overview}
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {car.quickFacts.map((fact) => (
              <div
                key={fact.label}
                className="rounded-2xl border border-stone-800 bg-[#171717] p-5"
              >
                <p className="text-sm text-stone-400">{fact.label}</p>
                <p className="mt-2 text-2xl font-bold tracking-tight">
                  {fact.value}
                </p>
              </div>
            ))}
          </div>
        </div>
        <aside className="rounded-3xl border border-red-900/50 bg-gradient-to-br from-[#2a0808] to-[#171717] p-6">
          <h2 className="text-xl font-bold">Why it stands out</h2>
          <ul className="mt-5 space-y-4 text-sm leading-6 text-stone-200">
            {car.highlights.map((highlight) => (
              <li key={highlight} className="flex gap-3">
                <span className="text-red-400">✦</span>
                {highlight}
              </li>
            ))}
          </ul>
          <p className="mt-8 border-t border-stone-700 pt-5 text-sm leading-6 text-stone-400">
            This editorial profile is for discovery. It is not a vehicle in our
            live inventory and cannot be purchased here.
          </p>
        </aside>
      </div>

      <DemoBooking carName={`${car.brand} ${car.name}`} />

      <div className="mt-16">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-red-400">
          The details
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Specifications
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {car.sections.map((section) => (
            <section
              key={section.title}
              className="rounded-3xl border border-stone-800 bg-[#171717] p-6 sm:p-8"
            >
              <h3 className="text-xl font-bold">{section.title}</h3>
              <dl className="mt-5 divide-y divide-stone-800">
                {section.facts.map((fact) => (
                  <div
                    key={fact.label}
                    className="flex flex-wrap justify-between gap-x-6 gap-y-1 py-3 text-sm"
                  >
                    <dt className="text-stone-400">{fact.label}</dt>
                    <dd className="font-semibold text-stone-100">
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
      </div>

      <section className="mt-12 rounded-3xl border border-stone-800 bg-stone-900 p-6 sm:p-8">
        <h2 className="text-xl font-bold">Sources & notes</h2>
        <p className="mt-3 text-sm leading-6 text-stone-400">
          Manufacturer information checked 26 October 2026. Figures are for the
          model, trim and US market stated above; options, tires, testing
          methods and later updates can change results. The image is
          AI-generated editorial artwork, not an official manufacturer
          photograph.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          {car.sources.map((source) => (
            <a
              key={source.url}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-stone-600 px-4 py-2 text-sm font-semibold text-white hover:border-red-500"
            >
              {source.label} ↗
            </a>
          ))}
        </div>
      </section>

      <section className="mt-20">
        <h2 className="text-3xl font-bold tracking-tight">
          Discover more icons
        </h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-3">
          {related.map((item) => (
            <button
              key={item.slug}
              onClick={() => onNavigate(item.slug)}
              className="overflow-hidden rounded-2xl border border-stone-800 bg-[#171717] text-left transition hover:border-red-500"
            >
              <img
                src={item.image}
                alt=""
                loading="lazy"
                className="aspect-[16/10] w-full object-cover"
              />
              <span className="block p-5 font-bold">
                {item.brand} {item.name} <span className="text-red-400">↗</span>
              </span>
            </button>
          ))}
        </div>
      </section>
    </article>
  );
}
