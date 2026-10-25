import { iconicCars } from "../data/iconicCars";
import { priceSnapshots } from "../data/priceSnapshots";

interface Props {
  onOpenCar: (slug: string) => void;
}

export function PriceWatch({ onOpenCar }: Props) {
  const money = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
  return (
    <section
      className="mt-16 overflow-hidden rounded-3xl border border-stone-800 bg-[#171717]"
      aria-labelledby="price-watch-heading"
    >
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-stone-800 bg-gradient-to-r from-[#290909] to-[#171717] p-6 sm:p-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-red-400">
            Market reference · Demo listings
          </p>
          <h2
            id="price-watch-heading"
            className="mt-2 font-serif text-3xl font-bold sm:text-4xl"
          >
            The price watch
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-stone-300">
            Six editorial car profiles with dated US manufacturer starting-price
            snapshots. No vehicle shown here is our live stock.
          </p>
        </div>
        <span className="rounded-lg border border-red-800 px-3 py-2 text-xs font-semibold text-red-200">
          Checked 26 Oct 2026
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[660px] text-left text-sm">
          <thead className="bg-black/40 text-xs uppercase tracking-wider text-stone-400">
            <tr>
              <th className="px-6 py-4">Model</th>
              <th className="px-4 py-4">Year</th>
              <th className="px-4 py-4">US starting MSRP</th>
              <th className="px-4 py-4">Last checked</th>
              <th className="px-6 py-4">Source</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-800">
            {priceSnapshots.map((snapshot) => {
              const car = iconicCars.find(
                (item) => item.slug === snapshot.slug,
              );
              return (
                <tr key={snapshot.slug} className="hover:bg-stone-900/70">
                  <td className="px-6 py-4">
                    <button
                      type="button"
                      onClick={() => onOpenCar(snapshot.slug)}
                      className="font-semibold text-white hover:text-red-400"
                    >
                      {car?.brand} {car?.name} ↗
                    </button>
                    <span className="mt-1 block text-xs text-stone-500">
                      Editorial demo · not in stock
                    </span>
                  </td>
                  <td className="px-4 py-4 text-stone-300">
                    {snapshot.modelYear}
                  </td>
                  <td className="px-4 py-4 font-bold text-white">
                    {money.format(snapshot.usd)}
                  </td>
                  <td className="px-4 py-4 text-stone-400">26 Oct 2026</td>
                  <td className="px-6 py-4">
                    <a
                      href={snapshot.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-red-400 underline hover:text-red-300"
                    >
                      {snapshot.source} ↗
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="border-t border-stone-800 px-6 py-4 text-xs leading-5 text-stone-400">
        Snapshots are manually sourced, not an internet price feed. Manufacturer
        figures may exclude destination, taxes and options; dealer selling
        prices vary. Follow the source for current pricing.
      </p>
    </section>
  );
}
