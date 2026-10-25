import { useEffect, useMemo, useState } from "react";
import { api, apiConfigurationMessage, ApiError } from "../api/client";
import { useAuth } from "../auth/useAuth";
import { VehicleDetailsDialog } from "../components/VehicleDetailsDialog";
import { VehicleCard } from "../components/VehicleCard";
import { FeaturedCarousel } from "../components/FeaturedCarousel";
import { CarComparison } from "../components/CarComparison";
import { PriceWatch } from "../components/PriceWatch";
import { iconicCars } from "../data/iconicCars";
import { showroomVehicles } from "../data/showroom";
import { getShowroomProfileByVehicleId } from "../data/showroomProfiles";
import { filterInventory, type InventorySort } from "../data/inventoryView";
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
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState<InventorySort>("name");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [lastInventoryCheck, setLastInventoryCheck] = useState<Date | null>(
    null,
  );

  useEffect(() => {
    let active = true;
    const refresh = () =>
      api
        .vehicles({ limit: 100 }, token ?? undefined)
        .then((data) => {
          if (active) {
            setLiveVehicles(data);
            setMessage("");
            setLastInventoryCheck(new Date());
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
    void refresh();
    const interval = window.setInterval(() => void refresh(), 60_000);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [token]);

  const visibleLive = useMemo(
    () =>
      filterInventory(
        liveVehicles.filter((vehicle) => matches(vehicle, category, search)),
        {
          query: "",
          stock: inStockOnly ? "available" : "all",
          sort,
          minPrice,
          maxPrice,
        },
      ),
    [liveVehicles, category, search, inStockOnly, sort, minPrice, maxPrice],
  );
  const visibleShowroom = useMemo(
    () =>
      inStockOnly
        ? []
        : filterInventory(
            showroomVehicles.filter((vehicle) =>
              matches(vehicle, category, search),
            ),
            { query: "", stock: "all", sort, minPrice, maxPrice },
          ),
    [category, search, inStockOnly, sort, minPrice, maxPrice],
  );
  const visibleIconic = iconicCars.filter(
    (car) =>
      !inStockOnly &&
      minPrice === "" &&
      maxPrice === "" &&
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
      <div className="editorial-hero relative overflow-hidden border-x border-b border-stone-800 px-6 pb-16 pt-20 text-center sm:px-12 sm:pb-20 sm:pt-24">
        <div className="mx-auto w-fit border border-red-700 bg-red-950/40 px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-red-300 sm:text-xs">
          <span aria-hidden="true" className="mr-2 text-red-500">
            ●
          </span>{" "}
          The Northstar motor collection
        </div>
        <h1
          id="showroom-heading"
          className="mx-auto mt-7 max-w-5xl font-serif text-5xl font-bold leading-[0.99] tracking-[-0.055em] text-[#f6f1ea] sm:text-7xl lg:text-[6.5rem]"
        >
          Drive what <span className="text-red-500">moves</span> you.
        </h1>
        <p className="mx-auto mt-8 max-w-2xl text-base leading-8 text-stone-300 sm:text-xl">
          Explore iconic machines, compare the details and find your next drive
          in a curated automotive workspace.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <a
            href="#explore"
            className="border border-red-500 bg-red-600 px-6 py-3.5 text-sm font-bold text-white shadow-[4px_4px_0_#6a1319] transition hover:bg-red-500"
          >
            Explore the collection →
          </a>
          <a
            href="#compare"
            className="border border-stone-500 bg-[#171717] px-6 py-3.5 text-sm font-bold text-white transition hover:border-red-500"
          >
            Compare cars
          </a>
        </div>
        <p className="mt-10 text-[10px] font-bold uppercase tracking-[0.22em] text-stone-500 sm:text-xs">
          Six iconic profiles &nbsp;·&nbsp; Six design concepts &nbsp;·&nbsp;
          Source-linked prices
        </p>
      </div>

      <div
        role="region"
        aria-label="Showroom at a glance"
        className="grid grid-cols-2 border-x border-b border-stone-800 bg-[#161616] lg:grid-cols-4"
      >
        {[
          [
            String(iconicCars.length).padStart(2, "0"),
            "Iconic profiles",
            "Manufacturer-sourced stories",
          ],
          [
            String(showroomVehicles.length).padStart(2, "0"),
            "Design concepts",
            "Illustrative collection",
          ],
          ["06", "Price references", "Linked to official sources"],
          [
            loading ? "…" : String(liveVehicles.length),
            "Live listings",
            "Fetched from inventory",
          ],
        ].map(([value, label, detail]) => (
          <div
            key={label}
            className="border-b border-r border-stone-800 p-5 text-left last:border-r-0 sm:p-7 lg:border-b-0"
          >
            <p className="font-serif text-4xl font-bold text-[#f4eee8] sm:text-5xl">
              {value}
            </p>
            <p className="mt-3 text-xs font-bold uppercase tracking-[0.14em] text-red-400">
              {label}
            </p>
            <p className="mt-1 text-xs text-stone-500">{detail}</p>
          </div>
        ))}
      </div>

      <div id="showroom" className="scroll-mt-32 pt-16 sm:pt-20">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-red-400">
          01 / The collection
        </p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-5 border-b border-stone-700 pb-6">
          <h2 className="max-w-2xl font-serif text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            An extraordinary car deserves a closer look.
          </h2>
          <p className="max-w-xs text-sm leading-6 text-stone-400">
            Swipe through every featured model, then open its dedicated profile
            for the details.
          </p>
        </div>
      </div>

      <FeaturedCarousel
        onOpenIconic={onOpenIconicCar}
        onOpenShowroom={onOpenShowroomCar}
      />

      <CarComparison onOpenCar={onOpenIconicCar} />
      <PriceWatch onOpenCar={onOpenIconicCar} />

      <div id="explore" className="scroll-mt-24 pt-16 sm:pt-24">
        <p className="text-xs font-bold uppercase tracking-[0.26em] text-red-500">
          04 / Find your next drive
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
        <details className="mt-6 rounded-2xl border border-stone-800 bg-[#171717] p-5">
          <summary className="cursor-pointer text-sm font-semibold text-white">
            Advanced inventory filters{" "}
            <span className="ml-2 text-red-400">↗</span>
          </summary>
          <p className="mt-3 text-xs leading-5 text-stone-400">
            Price and stock filters apply to live listings and illustrative
            showroom prices. Editorial car profiles have no listing prices and
            are hidden when these filters are active.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <label className="text-xs font-semibold text-stone-400">
              Minimum price
              <input
                type="number"
                min="0"
                value={minPrice}
                onChange={(event) => setMinPrice(event.target.value)}
                className="mt-2 w-full rounded-lg border border-stone-700 bg-stone-900 px-3 py-2.5 text-sm text-white"
              />
            </label>
            <label className="text-xs font-semibold text-stone-400">
              Maximum price
              <input
                type="number"
                min="0"
                value={maxPrice}
                onChange={(event) => setMaxPrice(event.target.value)}
                className="mt-2 w-full rounded-lg border border-stone-700 bg-stone-900 px-3 py-2.5 text-sm text-white"
              />
            </label>
            <label className="text-xs font-semibold text-stone-400">
              Sort by
              <select
                value={sort}
                onChange={(event) =>
                  setSort(event.target.value as InventorySort)
                }
                className="mt-2 w-full rounded-lg border border-stone-700 bg-stone-900 px-3 py-2.5 text-sm text-white"
              >
                <option value="name">Make & model</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
                <option value="stock-low">Stock: lowest first</option>
              </select>
            </label>
            <label className="flex items-center gap-3 self-end rounded-lg border border-stone-700 bg-stone-900 px-3 py-2.5 text-sm font-semibold text-white">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(event) => setInStockOnly(event.target.checked)}
                className="accent-red-600"
              />{" "}
              In-stock live listings only
            </label>
          </div>
          <button
            type="button"
            onClick={() => {
              setMinPrice("");
              setMaxPrice("");
              setSort("name");
              setInStockOnly(false);
            }}
            className="mt-5 text-sm font-semibold text-red-400 underline"
          >
            Clear advanced filters
          </button>
        </details>
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
              {lastInventoryCheck
                ? `Inventory checked ${lastInventoryCheck.toLocaleTimeString()}`
                : "Checking inventory"}
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
      {!loading && liveVehicles.length === 0 && (
        <p
          className="mt-12 rounded-2xl border border-stone-700 bg-stone-900 p-5 text-sm text-stone-300"
          role="status"
        >
          No live saleable listings are available right now. The car profiles
          and showroom concepts below are clearly labelled demonstrations. Live
          inventory is checked every minute while this page is open.
        </p>
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
