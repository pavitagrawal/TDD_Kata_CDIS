import { useEffect, useMemo, useState } from "react";
import { api, apiConfigurationMessage, ApiError } from "../api/client";
import { useAuth } from "../auth/useAuth";
import { VehicleDetailsDialog } from "../components/VehicleDetailsDialog";
import { VehicleCard } from "../components/VehicleCard";
import { showroomVehicles } from "../data/showroom";
import type { Vehicle } from "../types/domain";

const categories = ["All", "Electric", "SUV", "Performance"];

interface Props {
  onSignIn: () => void;
}

export function InventoryPage({ onSignIn }: Props) {
  const { token } = useAuth();
  const [liveVehicles, setLiveVehicles] = useState<Vehicle[]>([]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [selected, setSelected] = useState<Vehicle | null>(null);

  useEffect(() => {
    let active = true;
    api
      .vehicles({ limit: 100 }, token ?? undefined)
      .then((data) => {
        if (active) {
          setLiveVehicles(data);
          setMessage("");
        }
      })
      .catch((error: unknown) => {
        if (active)
          setMessage(
            error instanceof ApiError
              ? error.message
              : "Live stock is temporarily unavailable.",
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [token]);

  const visibleLive = useMemo(
    () => liveVehicles.filter((vehicle) => matches(vehicle, category, search)),
    [liveVehicles, category, search],
  );
  const visibleShowroom = useMemo(
    () =>
      showroomVehicles.filter((vehicle) => matches(vehicle, category, search)),
    [category, search],
  );

  const purchase = async (vehicle: Vehicle) => {
    if (!token) {
      onSignIn();
      return;
    }
    setPurchasing(vehicle.id);
    try {
      const result = await api.purchase(vehicle.id, token);
      setLiveVehicles((current) =>
        current.map((item) =>
          item.id === result.vehicle.id ? result.vehicle : item,
        ),
      );
      setMessage("Reservation completed. Availability has been updated.");
    } catch (error) {
      setMessage(
        error instanceof ApiError
          ? error.message
          : "Reservation could not be completed.",
      );
    } finally {
      setPurchasing(null);
    }
  };

  return (
    <section aria-labelledby="showroom-heading">
      <div className="relative isolate min-h-[410px] overflow-hidden rounded-[2rem] bg-[#dfe5e5] sm:min-h-[520px]">
        <img
          src="/images/showroom-hero.png"
          alt="Silver grand touring car beside the coast"
          className="absolute inset-0 h-full w-full object-cover object-[65%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/55 to-transparent" />
        <div className="relative max-w-xl px-7 py-16 sm:px-14 sm:py-24">
          <p className="text-xs font-bold uppercase tracking-[0.26em] text-stone-700">
            The Northstar collection
          </p>
          <h1
            id="showroom-heading"
            className="mt-5 text-5xl font-bold tracking-[-0.055em] text-stone-950 sm:text-7xl"
          >
            Drive what moves you.
          </h1>
          <p className="mt-6 max-w-sm text-base leading-7 text-stone-700 sm:text-lg">
            Discover thoughtfully designed cars for every kind of journey.
          </p>
          <a
            href="#explore"
            className="mt-8 inline-flex rounded-full bg-stone-950 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-stone-700 focus:outline-none focus:ring-4 focus:ring-stone-500/30"
          >
            Explore the lineup{" "}
            <span aria-hidden="true" className="ml-2">
              ↗
            </span>
          </a>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-3 rounded-3xl border border-stone-200 bg-white p-5 text-center shadow-sm sm:p-7">
        <div>
          <p className="text-xl font-bold sm:text-2xl">06</p>
          <p className="mt-1 text-xs text-stone-500 sm:text-sm">
            Showroom models
          </p>
        </div>
        <div className="border-x border-stone-200">
          <p className="text-xl font-bold sm:text-2xl">03</p>
          <p className="mt-1 text-xs text-stone-500 sm:text-sm">
            Ways to drive
          </p>
        </div>
        <div>
          <p className="text-xl font-bold sm:text-2xl">
            {loading ? "…" : liveVehicles.length}
          </p>
          <p className="mt-1 text-xs text-stone-500 sm:text-sm">
            Live listings
          </p>
        </div>
      </div>

      <div id="explore" className="scroll-mt-24 pt-16 sm:pt-24">
        <p className="text-xs font-bold uppercase tracking-[0.26em] text-stone-500">
          Find your next drive
        </p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-5">
          <div>
            <h2 className="text-4xl font-bold tracking-[-0.04em] sm:text-5xl">
              Explore the lineup
            </h2>
            <p className="mt-3 text-stone-600">
              From city streets to the open road, find your fit.
            </p>
          </div>
          <label className="w-full sm:w-72">
            <span className="sr-only">Search cars</span>
            <input
              className="field w-full rounded-full! px-5! py-3!"
              placeholder="Search cars"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
        </div>
        <div
          className="mt-8 flex flex-wrap gap-2"
          role="group"
          aria-label="Vehicle categories"
        >
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-stone-800 ${category === item ? "bg-stone-950 text-white" : "border border-stone-300 bg-white text-stone-700 hover:border-stone-950"}`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {apiConfigurationMessage && (
        <p
          className="mt-6 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-900"
          role="alert"
        >
          {apiConfigurationMessage}
        </p>
      )}
      {message && (
        <p
          className="mt-6 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900"
          role="status"
        >
          {message}
        </p>
      )}

      {visibleLive.length > 0 && (
        <div className="mt-12">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
                Available now
              </p>
              <h3 className="mt-1 text-2xl font-bold tracking-tight">
                Live inventory
              </h3>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
              Updated from our inventory
            </span>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {visibleLive.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                purchasing={purchasing === vehicle.id}
                onPurchase={(next) => void purchase(next)}
                onView={setSelected}
              />
            ))}
          </div>
        </div>
      )}

      <div className="mt-12">
        <div className="mb-5">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">
            Design concepts
          </p>
          <h3 className="mt-1 text-2xl font-bold tracking-tight">
            The showroom collection
          </h3>
          <p className="mt-2 text-sm text-stone-600">
            Illustrative models and prices for browsing; these are not live
            stock or available for purchase.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {visibleShowroom.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onPurchase={() => {}}
              onView={setSelected}
            />
          ))}
        </div>
      </div>

      {visibleLive.length === 0 && visibleShowroom.length === 0 && (
        <div className="mt-8 rounded-3xl border border-dashed border-stone-300 bg-white p-10 text-center">
          <h3 className="text-xl font-bold">No cars match your search</h3>
          <p className="mt-2 text-stone-600">
            Try another model or choose All.
          </p>
          <button
            className="mt-5 rounded-full bg-stone-950 px-5 py-2.5 text-sm font-semibold text-white"
            onClick={() => {
              setSearch("");
              setCategory("All");
            }}
          >
            Clear filters
          </button>
        </div>
      )}

      <div className="mt-20 rounded-[2rem] bg-stone-950 px-8 py-14 text-center text-white sm:px-16">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-stone-400">
          Made for the journey
        </p>
        <h2 className="mx-auto mt-4 max-w-xl text-3xl font-bold tracking-tight sm:text-4xl">
          Your next chapter starts behind the wheel.
        </h2>
        <p className="mt-4 text-stone-300">
          Browse the collection, compare the details, and discover what feels
          right.
        </p>
        <a
          href="#explore"
          className="mt-7 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-stone-950"
        >
          Back to cars ↑
        </a>
      </div>
      <VehicleDetailsDialog
        vehicle={selected}
        onClose={() => setSelected(null)}
      />
    </section>
  );
}

function matches(vehicle: Vehicle, category: string, search: string): boolean {
  return (
    (category === "All" ||
      vehicle.category.toLowerCase().includes(category.toLowerCase())) &&
    `${vehicle.make} ${vehicle.model} ${vehicle.category}`
      .toLowerCase()
      .includes(search.trim().toLowerCase())
  );
}
