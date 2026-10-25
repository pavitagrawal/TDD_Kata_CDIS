import type { Vehicle } from "../types/domain";
import { isShowroomVehicle, vehicleImage } from "../data/showroom";

interface Props {
  vehicle: Vehicle | null;
  onClose: () => void;
}

export function VehicleDetailsDialog({ vehicle, onClose }: Props) {
  if (!vehicle) return null;
  const price = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(vehicle.price));
  return (
    <div
      className="fixed inset-0 z-40 grid place-items-center bg-black/80 p-4"
      role="presentation"
    >
      <section
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-stone-700 bg-[#171717] p-7 text-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="vehicle-title"
      >
        <button
          className="float-right rounded-lg px-2 py-1 text-stone-300 focus:outline-none focus:ring-2 focus:ring-red-500"
          onClick={onClose}
          aria-label="Close vehicle details"
        >
          ×
        </button>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-500">
          {vehicle.category}
        </p>
        <img
          className="mt-5 w-full rounded-2xl bg-stone-900"
          src={vehicleImage(vehicle)}
          alt={`${vehicle.make} ${vehicle.model}`}
        />
        <h2
          id="vehicle-title"
          className="mt-3 text-3xl font-semibold text-white"
        >
          {vehicle.make} {vehicle.model}
        </h2>
        <dl className="mt-7 grid grid-cols-2 gap-5">
          <div>
            <dt className="text-sm text-stone-400">Price</dt>
            <dd className="mt-1 text-xl font-semibold">{price}</dd>
          </div>
          <div>
            <dt className="text-sm text-stone-400">Availability</dt>
            <dd className="mt-1 text-xl font-semibold">
              {isShowroomVehicle(vehicle)
                ? "Showroom concept"
                : vehicle.stock_quantity > 0
                  ? `${vehicle.stock_quantity} in stock`
                  : "Out of stock"}
            </dd>
          </div>
        </dl>
        {isShowroomVehicle(vehicle) && (
          <p className="mt-5 rounded-xl border border-red-900 bg-red-950 p-3 text-sm text-red-100">
            Illustrative model and price. You can try demo checkout; no payment
            or reservation is made.
          </p>
        )}
        <button
          className="mt-8 rounded-full bg-red-600 px-5 py-3 font-semibold text-white"
          onClick={onClose}
        >
          Done
        </button>
      </section>
    </div>
  );
}
