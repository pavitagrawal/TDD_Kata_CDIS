import type { Vehicle } from "../types/domain";

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
      className="fixed inset-0 z-40 grid place-items-center bg-stone-950/50 p-4"
      role="presentation"
    >
      <section
        className="w-full max-w-lg rounded-2xl bg-white p-7 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="vehicle-title"
      >
        <button
          className="float-right rounded-lg px-2 py-1 text-stone-600 focus:outline-none focus:ring-2 focus:ring-stone-900"
          onClick={onClose}
          aria-label="Close vehicle details"
        >
          ×
        </button>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
          {vehicle.category}
        </p>
        <h2
          id="vehicle-title"
          className="mt-3 text-3xl font-semibold text-stone-950"
        >
          {vehicle.make} {vehicle.model}
        </h2>
        <dl className="mt-7 grid grid-cols-2 gap-5">
          <div>
            <dt className="text-sm text-stone-500">Price</dt>
            <dd className="mt-1 text-xl font-semibold">{price}</dd>
          </div>
          <div>
            <dt className="text-sm text-stone-500">Availability</dt>
            <dd className="mt-1 text-xl font-semibold">
              {vehicle.stock_quantity > 0
                ? `${vehicle.stock_quantity} in stock`
                : "Out of stock"}
            </dd>
          </div>
        </dl>
        <button
          className="mt-8 rounded-lg bg-stone-950 px-4 py-3 font-semibold text-white"
          onClick={onClose}
        >
          Done
        </button>
      </section>
    </div>
  );
}
