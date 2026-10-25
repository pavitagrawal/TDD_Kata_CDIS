import { useEffect, useMemo, useState, type FormEvent } from "react";

import { api, ApiError } from "../api/client";
import { useAuth } from "../auth/useAuth";
import { ConfirmDialog } from "../components/ConfirmDialog";
import {
  filterInventory,
  inventoryInsights,
  type InventorySort,
  type StockView,
} from "../data/inventoryView";
import type { Vehicle, VehicleInput } from "../types/domain";

const blankVehicle = (): VehicleInput => ({
  make: "",
  model: "",
  category: "",
  price: 0,
  stock_quantity: 0,
});

function messageFor(error: unknown, fallback: string) {
  return error instanceof ApiError ? error.message : fallback;
}

export function AdminInventoryPage() {
  const { token } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [form, setForm] = useState<VehicleInput>(blankVehicle);
  const [editing, setEditing] = useState<Vehicle | null>(null);
  const [pending, setPending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [failure, setFailure] = useState("");
  const [deleting, setDeleting] = useState<Vehicle | null>(null);
  const [query, setQuery] = useState("");
  const [stockView, setStockView] = useState<StockView>("all");
  const [sort, setSort] = useState<InventorySort>("name");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [layout, setLayout] = useState<"list" | "grid">("list");
  const [refreshing, setRefreshing] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const insights = useMemo(() => inventoryInsights(vehicles), [vehicles]);
  const visible = useMemo(
    () =>
      filterInventory(vehicles, {
        query,
        stock: stockView,
        sort,
        minPrice,
        maxPrice,
      }),
    [vehicles, query, stockView, sort, minPrice, maxPrice],
  );
  const currency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);

  const refresh = async () => {
    if (!token) return;
    setRefreshing(true);
    setFailure("");
    try {
      setVehicles(await api.vehicles({}, token));
      setNotice("Inventory refreshed.");
    } catch (error) {
      setFailure(messageFor(error, "Unable to refresh inventory."));
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    let active = true;
    api
      .vehicles({}, token)
      .then((inventory) => {
        if (active) setVehicles(inventory);
      })
      .catch((error: unknown) => {
        if (active) setFailure(messageFor(error, "Unable to load inventory."));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [token]);

  const resetForm = () => {
    setEditing(null);
    setForm(blankVehicle());
    setShowForm(false);
  };

  const save = async (event: FormEvent) => {
    event.preventDefault();
    if (!token) return;
    setPending(true);
    setFailure("");
    setNotice("");
    try {
      const vehicle = editing
        ? await api.updateVehicle(editing.id, form, token)
        : await api.createVehicle(form, token);
      setVehicles((current) =>
        editing
          ? current.map((item) => (item.id === vehicle.id ? vehicle : item))
          : [vehicle, ...current],
      );
      setNotice(editing ? "Vehicle updated." : "Vehicle added to inventory.");
      resetForm();
    } catch (error) {
      setFailure(messageFor(error, "Unable to save the vehicle."));
    } finally {
      setPending(false);
    }
  };

  const startEdit = (vehicle: Vehicle) => {
    setEditing(vehicle);
    setForm({
      make: vehicle.make,
      model: vehicle.model,
      category: vehicle.category,
      price: Number(vehicle.price),
      stock_quantity: vehicle.stock_quantity,
    });
    setNotice("");
    setFailure("");
    setShowForm(true);
  };

  const restock = async (vehicle: Vehicle) => {
    if (!token) return;
    setFailure("");
    try {
      const result = await api.restock(vehicle.id, { quantity: 1 }, token);
      setVehicles((current) =>
        current.map((item) =>
          item.id === result.vehicle.id ? result.vehicle : item,
        ),
      );
      setNotice(`${vehicle.make} ${vehicle.model} restocked by one unit.`);
    } catch (error) {
      setFailure(messageFor(error, "Unable to restock the vehicle."));
    }
  };

  const remove = async () => {
    if (!token || !deleting) return;
    setPending(true);
    try {
      await api.deleteVehicle(deleting.id, token);
      setVehicles((current) =>
        current.filter((item) => item.id !== deleting.id),
      );
      setNotice(`${deleting.make} ${deleting.model} was removed.`);
      setDeleting(null);
    } catch (error) {
      setFailure(messageFor(error, "Unable to remove the vehicle."));
    } finally {
      setPending(false);
    }
  };

  return (
    <section aria-labelledby="manage-inventory-heading">
      <header className="rounded-3xl border border-stone-800 bg-[radial-gradient(circle_at_80%_20%,#3b0b0b,#171717_55%)] p-7 sm:p-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-red-400">
              Northstar command center · Live inventory
            </p>
            <h1
              id="manage-inventory-heading"
              className="mt-4 font-serif text-4xl font-bold tracking-tight text-white sm:text-6xl"
            >
              Inventory, clearly in view.
            </h1>
            <p className="mt-4 max-w-2xl text-stone-300">
              Track availability, find models quickly, and keep every listing
              current. Admin actions remain protected by the API.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void refresh()}
              disabled={refreshing}
              className="rounded-lg border border-stone-500 px-5 py-3 text-sm font-semibold text-white hover:border-red-500 disabled:opacity-50"
            >
              {refreshing ? "Refreshing…" : "↻ Refresh"}
            </button>
            <button
              type="button"
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="rounded-lg bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-500"
            >
              + Add vehicle
            </button>
          </div>
        </div>
      </header>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: "Models", value: insights.models },
          { label: "Units in stock", value: insights.units },
          { label: "Low stock", value: insights.lowStock },
          { label: "Stock value", value: currency(insights.stockValue) },
        ].map((metric) => (
          <div
            key={metric.label}
            className="rounded-2xl border border-stone-800 bg-[#171717] p-5"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-stone-400">
              {metric.label}
            </p>
            <p className="mt-3 text-2xl font-bold text-white sm:text-3xl">
              {loading ? "…" : metric.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside
          className="h-fit rounded-2xl border border-stone-800 bg-[#171717] p-4 lg:sticky lg:top-28"
          aria-label="Inventory workspace navigation"
        >
          <p className="px-3 py-2 text-xs font-bold uppercase tracking-[0.2em] text-stone-500">
            Workspace views
          </p>
          <nav
            aria-label="Stock views"
            className="mt-2 grid grid-cols-2 gap-1 lg:grid-cols-1"
          >
            {(
              [
                ["all", "All vehicles", insights.models],
                [
                  "available",
                  "In stock",
                  insights.models - insights.outOfStock,
                ],
                ["low", "Low stock", insights.lowStock],
                ["empty", "Out of stock", insights.outOfStock],
              ] as const
            ).map(([value, label, count]) => (
              <button
                key={value}
                type="button"
                onClick={() => setStockView(value)}
                aria-pressed={stockView === value}
                className={`flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-semibold ${stockView === value ? "bg-red-600 text-white" : "text-stone-300 hover:bg-stone-800"}`}
              >
                <span>{label}</span>
                <span className="text-xs opacity-70">{count}</span>
              </button>
            ))}
          </nav>
          <div className="mt-5 rounded-xl border border-red-900/50 bg-red-950/30 p-4 text-xs leading-5 text-stone-300">
            <strong className="text-white">Inventory note</strong>
            <p className="mt-2">
              Low stock means 1–3 units. Counts and value use live records, not
              showroom concepts.
            </p>
          </div>
        </aside>

        <div className="min-w-0">
          {notice && (
            <p
              className="mb-5 rounded-xl border border-emerald-800 bg-emerald-950 px-4 py-3 text-sm text-emerald-100"
              role="status"
            >
              {notice}
            </p>
          )}
          {failure && (
            <p
              className="mb-5 rounded-xl border border-red-800 bg-red-950 px-4 py-3 text-sm text-red-100"
              role="alert"
            >
              {failure}
            </p>
          )}
          <section
            className="rounded-2xl border border-stone-800 bg-[#171717] p-5 sm:p-6"
            aria-label="Inventory filters"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-400">
                  Find a vehicle
                </p>
                <h2 className="mt-1 text-xl font-bold text-white">
                  Search & filter
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setStockView("all");
                  setSort("name");
                  setMinPrice("");
                  setMaxPrice("");
                }}
                className="text-sm font-semibold text-stone-300 underline hover:text-white"
              >
                Clear filters
              </button>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <label className="text-xs font-semibold text-stone-400">
                Make, model or category
                <input
                  className="mt-2 w-full rounded-lg border border-stone-700 bg-stone-900 px-3 py-2.5 text-sm text-white outline-none focus:border-red-500"
                  placeholder="Search inventory"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </label>
              <label className="text-xs font-semibold text-stone-400">
                Minimum price
                <input
                  className="mt-2 w-full rounded-lg border border-stone-700 bg-stone-900 px-3 py-2.5 text-sm text-white outline-none focus:border-red-500"
                  type="number"
                  min="0"
                  value={minPrice}
                  onChange={(event) => setMinPrice(event.target.value)}
                />
              </label>
              <label className="text-xs font-semibold text-stone-400">
                Maximum price
                <input
                  className="mt-2 w-full rounded-lg border border-stone-700 bg-stone-900 px-3 py-2.5 text-sm text-white outline-none focus:border-red-500"
                  type="number"
                  min="0"
                  value={maxPrice}
                  onChange={(event) => setMaxPrice(event.target.value)}
                />
              </label>
              <label className="text-xs font-semibold text-stone-400">
                Sort by
                <select
                  className="mt-2 w-full rounded-lg border border-stone-700 bg-stone-900 px-3 py-2.5 text-sm text-white outline-none focus:border-red-500"
                  value={sort}
                  onChange={(event) =>
                    setSort(event.target.value as InventorySort)
                  }
                >
                  <option value="name">Make & model</option>
                  <option value="price-low">Price: low to high</option>
                  <option value="price-high">Price: high to low</option>
                  <option value="stock-low">Stock: lowest first</option>
                </select>
              </label>
            </div>
          </section>

          {showForm && (
            <form
              id="vehicle-form"
              className="mt-6 grid gap-4 rounded-2xl border border-red-900/60 bg-[#171717] p-6 md:grid-cols-2"
              onSubmit={(event) => void save(event)}
            >
              <h2 className="md:col-span-2 text-xl font-semibold text-white">
                {editing ? "Edit vehicle" : "Add vehicle"}
              </h2>
              {(["make", "model", "category"] as const).map((field) => (
                <label
                  className="block text-sm font-medium text-stone-200"
                  key={field}
                >
                  {field[0].toUpperCase() + field.slice(1)}
                  <input
                    className="field mt-2 w-full"
                    required
                    value={form[field]}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        [field]: event.target.value,
                      }))
                    }
                  />
                </label>
              ))}
              <label className="block text-sm font-medium text-stone-200">
                Price
                <input
                  className="field mt-2 w-full"
                  min="0"
                  step="0.01"
                  required
                  type="number"
                  value={form.price}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      price: Number(event.target.value),
                    }))
                  }
                />
              </label>
              <label className="block text-sm font-medium text-stone-200">
                Stock quantity
                <input
                  className="field mt-2 w-full"
                  min="0"
                  required
                  type="number"
                  value={form.stock_quantity}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      stock_quantity: Number(event.target.value),
                    }))
                  }
                />
              </label>
              <div className="flex gap-3 md:col-span-2">
                <button
                  className="rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
                  disabled={pending}
                >
                  {pending
                    ? "Saving..."
                    : editing
                      ? "Save changes"
                      : "Add vehicle"}
                </button>
                {editing && (
                  <button
                    className="rounded-lg border border-stone-600 px-4 py-3 text-sm font-semibold text-white"
                    type="button"
                    onClick={resetForm}
                  >
                    Cancel edit
                  </button>
                )}
              </div>
            </form>
          )}
          <div className="mt-6 overflow-hidden rounded-2xl border border-stone-800 bg-[#171717]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-800 px-6 py-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-400">
                  Live catalogue
                </p>
                <h2 className="mt-1 text-xl font-bold text-white">
                  Current inventory{" "}
                  <span className="ml-2 text-sm font-normal text-stone-400">
                    {visible.length} shown
                  </span>
                </h2>
              </div>
              <div
                role="group"
                aria-label="Inventory layout"
                className="flex rounded-lg border border-stone-700 p-1"
              >
                <button
                  type="button"
                  aria-pressed={layout === "list"}
                  onClick={() => setLayout("list")}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold ${layout === "list" ? "bg-red-600 text-white" : "text-stone-300"}`}
                >
                  List
                </button>
                <button
                  type="button"
                  aria-pressed={layout === "grid"}
                  onClick={() => setLayout("grid")}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold ${layout === "grid" ? "bg-red-600 text-white" : "text-stone-300"}`}
                >
                  Grid
                </button>
              </div>
            </div>
            {loading ? (
              <p className="p-6 text-stone-400">Loading inventory...</p>
            ) : vehicles.length === 0 ? (
              <p className="p-6 text-stone-400">
                No vehicles yet. Add the first vehicle above.
              </p>
            ) : visible.length === 0 ? (
              <p className="p-6 text-stone-400">
                No vehicles match these filters. Clear filters to see every
                listing.
              </p>
            ) : (
              <ul
                className={
                  layout === "grid"
                    ? "grid gap-3 p-4 sm:grid-cols-2"
                    : "divide-y divide-stone-800"
                }
              >
                {visible.map((vehicle) => (
                  <li
                    className={
                      layout === "grid"
                        ? "rounded-xl border border-stone-800 bg-stone-900 p-5"
                        : "flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
                    }
                    key={vehicle.id}
                  >
                    <div>
                      <h3 className="font-semibold text-white">
                        {vehicle.make} {vehicle.model}
                      </h3>
                      <p className="text-sm text-stone-400">
                        {vehicle.category} · {currency(Number(vehicle.price))} ·{" "}
                        {vehicle.stock_quantity} in stock
                      </p>
                      <span
                        className={`mt-2 inline-block rounded-full px-2.5 py-1 text-xs font-bold ${vehicle.stock_quantity === 0 ? "bg-stone-700 text-stone-200" : vehicle.stock_quantity <= 3 ? "bg-red-950 text-red-300" : "bg-emerald-950 text-emerald-300"}`}
                      >
                        {vehicle.stock_quantity === 0
                          ? "Out of stock"
                          : vehicle.stock_quantity <= 3
                            ? "Low stock"
                            : "Available"}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        className="rounded-lg border border-stone-600 px-3 py-2 text-sm font-medium text-white hover:border-red-500"
                        onClick={() => startEdit(vehicle)}
                      >
                        Edit
                      </button>
                      <button
                        className="rounded-lg border border-stone-600 px-3 py-2 text-sm font-medium text-white hover:border-red-500"
                        onClick={() => void restock(vehicle)}
                      >
                        Restock +1
                      </button>
                      <button
                        className="rounded-lg border border-red-900 px-3 py-2 text-sm font-medium text-red-300 hover:bg-red-950"
                        onClick={() => setDeleting(vehicle)}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      <ConfirmDialog
        open={deleting !== null}
        title="Remove vehicle"
        description={
          deleting
            ? `Remove ${deleting.make} ${deleting.model} from inventory? This cannot be undone.`
            : ""
        }
        confirmLabel="Remove vehicle"
        pending={pending}
        onCancel={() => setDeleting(null)}
        onConfirm={() => void remove()}
      />
    </section>
  );
}
