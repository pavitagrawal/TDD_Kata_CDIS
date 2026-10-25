import type { Vehicle } from "../types/domain";
interface Props {
  vehicle: Vehicle;
  onPurchase: (vehicle: Vehicle) => void;
  onView: (vehicle: Vehicle) => void;
  purchasing?: boolean;
}
export function VehicleCard({
  vehicle,
  onPurchase,
  onView,
  purchasing = false,
}: Props) {
  const available = vehicle.stock_quantity > 0;
  const price = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(vehicle.price));
  return (
    <article className="group overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative aspect-[16/10] overflow-hidden bg-stone-200">
        <img
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          src={`https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=80&sig=${vehicle.id}`}
          alt={`${vehicle.make} ${vehicle.model}`}
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
        <span className="absolute left-4 top-4 rounded-full bg-stone-950/85 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
          {vehicle.category}
        </span>
      </div>
      <div className="p-5">
        <p className="text-sm text-stone-500">{vehicle.make}</p>
        <h2 className="mt-1 truncate text-xl font-semibold text-stone-950">
          {vehicle.model}
        </h2>
        <div className="mt-5 flex items-end justify-between gap-3">
          <div>
            <p className="text-2xl font-semibold text-stone-950">{price}</p>
            <p
              className={`mt-1 text-sm ${available ? "text-emerald-700" : "text-rose-700"}`}
            >
              {available
                ? `${vehicle.stock_quantity} in stock`
                : "Out of stock"}
            </p>
          </div>
          <button
            className="rounded-lg border border-stone-300 px-3 py-2 text-sm font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-900"
            onClick={() => onView(vehicle)}
          >
            Details
          </button>
        </div>
        <button
          className="mt-5 w-full rounded-lg bg-stone-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-300"
          disabled={!available || purchasing}
          onClick={() => onPurchase(vehicle)}
        >
          {purchasing
            ? "Reserving…"
            : available
              ? "Purchase vehicle"
              : "Out of stock"}
        </button>
      </div>
    </article>
  );
}
