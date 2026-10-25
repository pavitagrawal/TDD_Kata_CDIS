import { useEffect, useState } from "react";
import { api, apiConfigurationMessage, ApiError } from "../api/client";
import { useAuth } from "../auth/useAuth";
import { FilterBar } from "../components/FilterBar";
import { VehicleDetailsDialog } from "../components/VehicleDetailsDialog";
import { VehicleCard } from "../components/VehicleCard";
import type { Vehicle, VehicleQuery } from "../types/domain";

const demoVehicles: Vehicle[] = [
  {
    id: "demo-1",
    make: "Aurelia",
    model: "Gran Lusso",
    category: "Grand tourer",
    price: "128500.00",
    stock_quantity: 2,
    created_at: "",
    updated_at: "",
  },
  {
    id: "demo-2",
    make: "Orion",
    model: "Sovereign EV",
    category: "Electric",
    price: "96400.00",
    stock_quantity: 0,
    created_at: "",
    updated_at: "",
  },
  {
    id: "demo-3",
    make: "Valiant",
    model: "Apex RS",
    category: "Performance",
    price: "74200.00",
    stock_quantity: 4,
    created_at: "",
    updated_at: "",
  },
];

export function InventoryPage() {
  const { token, isAuthenticated } = useAuth();
  const [query, setQuery] = useState<VehicleQuery>({});
  const [requestedQuery, setRequestedQuery] = useState<VehicleQuery>({});
  const [vehicles, setVehicles] = useState<Vehicle[]>(demoVehicles);
  const [message, setMessage] = useState(
    "Previewing sample vehicles. Sign in to search live inventory.",
  );
  const [loading, setLoading] = useState(token !== null);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [selected, setSelected] = useState<Vehicle | null>(null);
  useEffect(() => {
    if (!token) return;
    let active = true;
    api
      .vehicles(requestedQuery, token)
      .then((data) => {
        if (!active) return;
        setVehicles(data);
        setMessage("");
      })
      .catch((error: unknown) => {
        if (!active) return;
        setMessage(
          error instanceof ApiError
            ? error.message
            : "Unable to load inventory.",
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [requestedQuery, token]);
  const purchase = async (vehicle: Vehicle) => {
    if (!token) {
      setMessage("Please sign in before purchasing a vehicle.");
      return;
    }
    setPurchasing(vehicle.id);
    try {
      const result = await api.purchase(vehicle.id, token);
      setVehicles((current) =>
        current.map((item) =>
          item.id === result.vehicle.id ? result.vehicle : item,
        ),
      );
      setMessage("Purchase completed. Inventory has been refreshed.");
    } catch (error) {
      setMessage(
        error instanceof ApiError
          ? error.message
          : "Purchase could not be completed.",
      );
    } finally {
      setPurchasing(null);
    }
  };
  return (
    <section aria-labelledby="inventory-heading">
      <div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
            Curated inventory
          </p>
          <h1
            id="inventory-heading"
            className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl"
          >
            Exceptional vehicles, selected with intent.
          </h1>
          <p className="mt-4 max-w-xl leading-7 text-stone-600">
            Search distinctive vehicles, review availability, and reserve your
            next drive with confidence.
          </p>
        </div>
        <p className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm text-stone-600">
          {isAuthenticated ? "Live inventory access" : "Preview mode"}
        </p>
      </div>
      <FilterBar
        query={query}
        onChange={setQuery}
        onSubmit={() => {
          if (!token) {
            setMessage("Sign in to search live inventory.");
            return;
          }
          setLoading(true);
          setRequestedQuery({ ...query });
        }}
      />
      {message && (
        <p
          className="mt-5 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900"
          role="status"
        >
          {message}
        </p>
      )}
      {apiConfigurationMessage && (
        <p
          className="mt-5 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-900"
          role="alert"
        >
          {apiConfigurationMessage}
        </p>
      )}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {loading
          ? Array.from({ length: 3 }, (_, index) => (
              <div
                key={index}
                className="h-96 animate-pulse rounded-2xl bg-stone-200"
              />
            ))
          : vehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                purchasing={purchasing === vehicle.id}
                onPurchase={(next) => void purchase(next)}
                onView={setSelected}
              />
            ))}
      </div>
      {!loading && vehicles.length === 0 && (
        <div className="mt-8 rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center">
          <h2 className="text-xl font-semibold text-stone-950">
            No vehicles match those filters
          </h2>
          <p className="mt-2 text-stone-600">
            Broaden your search or clear one of the filter fields.
          </p>
        </div>
      )}
      <VehicleDetailsDialog
        vehicle={selected}
        onClose={() => setSelected(null)}
      />
    </section>
  );
}
