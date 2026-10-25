import { useEffect, useMemo, useState } from "react";
import { api, apiConfigurationMessage, ApiError } from "../api/client";
import { useAuth } from "../auth/useAuth";
import { VehicleDetailsDialog } from "../components/VehicleDetailsDialog";
import { VehicleCard } from "../components/VehicleCard";
import { FeaturedCarousel } from "../components/FeaturedCarousel";
import { iconicCars } from "../data/iconicCars";
import { showroomVehicles } from "../data/showroom";
import { getShowroomProfileByVehicleId } from "../data/showroomProfiles";
import type { Vehicle } from "../types/domain";

const categories = ["All", "Electric", "SUV", "Performance"];

interface Props {
  onAddToCart: (vehicle: Vehicle) => void;
  onOpenCart: () => void;
  onOpenIconicCar: (slug: string) => void;
  onOpenShowroomCar: (slug: string) => void;
}

export function InventoryPage({
  onAddToCart,
  onOpenCart,
  onOpenIconicCar,
  onOpenShowroomCar,
}: Props) {
  const { token } = useAuth();
  const [liveVehicles, setLiveVehicles] = useState<Vehicle[]>([]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
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
  const visibleIconic = iconicCars.filter(
    (car) =>
      (category === "All" || car.category === category) &&
      `${car.brand} ${car.name} ${car.category}`
        .toLowerCase()
        .includes(search.trim().toLowerCase()),
  );

  const addVehicle = (vehicle: Vehicle) => {
    onAddToCart(vehicle);
    setMessage(`${vehicle.make} ${vehicle.model} added to your cart.`);
  };

  return (
    <section aria-labelledby="showroom-heading">
      <div className="relative isolate min-h-[410px] overflow-hidden rounded-[2rem] bg-[#171717] sm:min-h-[520px]">
        <img
          src="/images/showroom-hero.png"
          alt="Silver grand touring car beside the coast"
          className="absolute inset-0 h-full w-full object-cover object-[65%_center] brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-transparent" />
        <div className="relative max-w-xl px-7 py-16 sm:px-14 sm:py-24">
          <p className="text-xs font-bold uppercase tracking-[0.26em] text-red-400">
            The Northstar collection
          </p>
          <h1
            id="showroom-heading"
            className="mt-5 text-5xl font-bold tracking-[-0.055em] text-white sm:text-7xl"
          >
            Drive what moves you.
          </h1>
          <p className="mt-6 max-w-sm text-base leading-7 text-stone-200 sm:text-lg">
            Discover thoughtfully designed cars for every kind of journey.
          </p>
          <a
            href="#explore"
            className="mt-8 inline-flex rounded-full bg-red-600 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-red-500 focus:outline-none focus:ring-4 focus:ring-red-500/30"
          >
            Explore the lineup{" "}
            <span aria-hidden="true" className="ml-2">
              ↗
            </span>
          </a>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-3 rounded-3xl border border-stone-800 bg-[#171717] p-5 text-center shadow-sm sm:p-7">
        <div>
          <p className="text-xl font-bold sm:text-2xl">
            {String(iconicCars.length).padStart(2, "0")}
          </p>
          <p className="mt-1 text-xs text-stone-400 sm:text-sm">
            Iconic profiles
          </p>
        </div>
        <div className="border-x border-stone-800">
          <p className="text-xl font-bold sm:text-2xl">
            {String(new Set(iconicCars.map((car) => car.brand)).size).padStart(
              2,
              "0",
            )}
          </p>
          <p className="mt-1 text-xs text-stone-400 sm:text-sm">Famous makes</p>
        </div>
        <div>
          <p className="text-xl font-bold sm:text-2xl">
            {loading ? "…" : liveVehicles.length}
          </p>
          <p className="mt-1 text-xs text-stone-400 sm:text-sm">
            Live listings
          </p>
        </div>
      </div>

      <FeaturedCarousel
        onOpenIconic={onOpenIconicCar}
        onOpenShowroom={onOpenShowroomCar}
      />

      <div id="explore" className="scroll-mt-24 pt-16 sm:pt-24">
        <p className="text-xs font-bold uppercase tracking-[0.26em] text-red-500">
          Find your next drive
        </p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-5">
          <div>
            <h2 className="text-4xl font-bold tracking-[-0.04em] sm:text-5xl">
              Explore the lineup
            </h2>
            <p className="mt-3 text-stone-400">
              From city streets to the open road, find your fit.
            </p>
          </div>
          <label className="w-full sm:w-72">
            <span className="sr-only">Search cars</span>
            <input
              className="field w-full rounded-full! border-stone-700! bg-stone-900! px-5! py-3! text-white!"
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
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-red-500 ${category === item ? "bg-red-600 text-white" : "border border-stone-700 bg-stone-900 text-stone-200 hover:border-red-500"}`}
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
          className="mt-6 flex items-center justify-between gap-3 rounded-xl border border-stone-700 bg-stone-900 px-4 py-3 text-sm text-stone-100"
          role="status"
        >
          <span>{message}</span>
          <button
            onClick={onOpenCart}
            className="shrink-0 font-semibold text-red-400 underline"
          >
            View cart
          </button>
        </p>
      )}

      {visibleLive.length > 0 && (
        <div className="mt-12">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-500">
                Available now
              </p>
              <h3 className="mt-1 text-2xl font-bold tracking-tight">
                Live inventory
              </h3>
            </div>
            <span className="rounded-full bg-stone-800 px-3 py-1 text-xs font-semibold text-stone-200">
              Updated from our inventory
            </span>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {visibleLive.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onAddToCart={addVehicle}
                onView={setSelected}
              />
            ))}
          </div>
        </div>
      )}

      {visibleIconic.length > 0 && (
        <div className="mt-12">
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-500">
              The icons
            </p>
            <h3 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              Famous cars, closer up
            </h3>
            <p className="mt-2 text-sm text-stone-400">
              Explore manufacturer-sourced facts, detailed specifications and a
              dedicated page for each model. Editorial profiles are not live
              stock.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {visibleIconic.map((car) => (
              <button
                key={car.slug}
                type="button"
                onClick={() => onOpenIconicCar(car.slug)}
                className="group overflow-hidden rounded-3xl border border-stone-800 bg-[#171717] text-left transition hover:-translate-y-1 hover:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={car.image}
                    alt={`Illustrative portrait of ${car.brand} ${car.name}`}
                    loading="lazy"
                    className="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-black/80 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                    {car.category}
                  </span>
                </div>
                <div className="p-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-red-400">
                    {car.brand} · {car.edition}
                  </p>
                  <h4 className="mt-2 text-2xl font-bold tracking-tight">
                    {car.name}
                  </h4>
                  <p className="mt-2 text-sm text-stone-400">{car.headline}</p>
                  <span className="mt-5 inline-block text-sm font-bold text-white">
                    Explore model <span className="text-red-400">↗</span>
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-12">
        <div className="mb-5">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-500">
            Design concepts
          </p>
          <h3 className="mt-1 text-2xl font-bold tracking-tight">
            The showroom collection
          </h3>
          <p className="mt-2 text-sm text-stone-400">
            Illustrative models and prices for browsing; these are not live
            stock or available for purchase.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {visibleShowroom.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onAddToCart={addVehicle}
              onView={(vehicle) => {
                const profile = getShowroomProfileByVehicleId(vehicle.id);
                if (profile) onOpenShowroomCar(profile.slug);
              }}
            />
          ))}
        </div>
      </div>

      {visibleLive.length === 0 &&
        visibleShowroom.length === 0 &&
        visibleIconic.length === 0 && (
          <div className="mt-8 rounded-3xl border border-dashed border-stone-700 bg-stone-900 p-10 text-center">
            <h3 className="text-xl font-bold">No cars match your search</h3>
            <p className="mt-2 text-stone-400">
              Try another model or choose All.
            </p>
            <button
              className="mt-5 rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white"
              onClick={() => {
                setSearch("");
                setCategory("All");
              }}
            >
              Clear filters
            </button>
          </div>
        )}

      <div className="mt-20 rounded-[2rem] bg-gradient-to-r from-[#320707] to-black px-8 py-14 text-center text-white sm:px-16">
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
          className="mt-7 inline-flex rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white"
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
