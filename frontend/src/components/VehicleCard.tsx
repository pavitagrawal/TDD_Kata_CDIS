import type { Vehicle } from "../types/domain";
import { isShowroomVehicle, vehicleImage } from "../data/showroom";
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
  const showroom = isShowroomVehicle(vehicle);
  const price = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(vehicle.price));
  return (
    <article className="group overflow-hidden rounded-[1.75rem] border border-stone-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[16/10] overflow-hidden bg-[#f2f2f2]">
        <img
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          src={vehicleImage(vehicle)}
          alt={`${vehicle.make} ${vehicle.model}`}
          loading="lazy"
        />
        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-bold uppercase tracking-wider text-stone-900">
          {showroom ? "Concept" : vehicle.category}
        </span>
        <span className="absolute bottom-3 right-4 rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-medium text-stone-700">
          Illustrative image
        </span>
      </div>
      <div className="p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
          {vehicle.make} · {vehicle.category}
        </p>
        <h2 className="mt-2 truncate text-2xl font-bold tracking-tight text-stone-950">
          {vehicle.model}
        </h2>
        <div className="mt-5 flex items-end justify-between gap-3">
          <div>
            <p className="text-2xl font-bold text-stone-950">{price}</p>
            <p
              className={`mt-1 text-sm ${available ? "text-emerald-700" : "text-rose-700"}`}
            >
              {showroom
                ? "Illustrative price"
                : available
                  ? `${vehicle.stock_quantity} in stock`
                  : "Out of stock"}
            </p>
          </div>
          <button
            className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-900"
            onClick={() => onView(vehicle)}
          >
            Details
          </button>
        </div>
        {showroom ? (
          <button
            className="mt-5 w-full rounded-full bg-stone-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-stone-800"
            onClick={() => onView(vehicle)}
          >
            Explore model
          </button>
        ) : (
          <button
            className="mt-5 w-full rounded-full bg-stone-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-300"
            disabled={!available || purchasing}
            onClick={() => onPurchase(vehicle)}
          >
            {purchasing
              ? "Reserving…"
              : available
                ? "Reserve vehicle"
                : "Out of stock"}
          </button>
        )}
      </div>
    </article>
  );
}
