import { useEffect, useState, type FormEvent } from "react";

import { api, ApiError } from "../api/client";
import { useAuth } from "../auth/useAuth";
import { ConfirmDialog } from "../components/ConfirmDialog";
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
    window.scrollTo({ top: 0, behavior: "smooth" });
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
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
        Administrator workspace
      </p>
      <h1
        id="manage-inventory-heading"
        className="mt-3 text-4xl font-semibold tracking-tight text-stone-950"
      >
        Manage inventory
      </h1>
      <p className="mt-3 max-w-2xl text-stone-600">
        Add, edit, restock, or remove vehicles. These actions are enforced by
        the API administrator role.
      </p>
      {notice && (
        <p
          className="mt-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
          role="status"
        >
          {notice}
        </p>
      )}
      {failure && (
        <p
          className="mt-5 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-900"
          role="alert"
        >
          {failure}
        </p>
      )}
      <form
        className="mt-8 grid gap-4 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm md:grid-cols-2"
        onSubmit={(event) => void save(event)}
      >
        <h2 className="md:col-span-2 text-xl font-semibold">
          {editing ? "Edit vehicle" : "Add vehicle"}
        </h2>
        {(["make", "model", "category"] as const).map((field) => (
          <label
            className="block text-sm font-medium text-stone-800"
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
        <label className="block text-sm font-medium text-stone-800">
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
        <label className="block text-sm font-medium text-stone-800">
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
            className="rounded-lg bg-stone-950 px-4 py-3 text-sm font-semibold text-white disabled:bg-stone-300"
            disabled={pending}
          >
            {pending ? "Saving..." : editing ? "Save changes" : "Add vehicle"}
          </button>
          {editing && (
            <button
              className="rounded-lg border border-stone-300 px-4 py-3 text-sm font-semibold"
              type="button"
              onClick={resetForm}
            >
              Cancel edit
            </button>
          )}
        </div>
      </form>
      <div className="mt-10 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="border-b border-stone-200 px-6 py-4">
          <h2 className="font-semibold">Current inventory</h2>
        </div>
        {loading ? (
          <p className="p-6 text-stone-600">Loading inventory...</p>
        ) : vehicles.length === 0 ? (
          <p className="p-6 text-stone-600">
            No vehicles yet. Add the first vehicle above.
          </p>
        ) : (
          <ul className="divide-y divide-stone-200">
            {vehicles.map((vehicle) => (
              <li
                className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
                key={vehicle.id}
              >
                <div>
                  <h3 className="font-semibold text-stone-950">
                    {vehicle.make} {vehicle.model}
                  </h3>
                  <p className="text-sm text-stone-600">
                    {vehicle.category} · $
                    {Number(vehicle.price).toLocaleString()} ·{" "}
                    {vehicle.stock_quantity} in stock
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    className="rounded-lg border border-stone-300 px-3 py-2 text-sm font-medium"
                    onClick={() => startEdit(vehicle)}
                  >
                    Edit
                  </button>
                  <button
                    className="rounded-lg border border-stone-300 px-3 py-2 text-sm font-medium"
                    onClick={() => void restock(vehicle)}
                  >
                    Restock +1
                  </button>
                  <button
                    className="rounded-lg border border-rose-200 px-3 py-2 text-sm font-medium text-rose-700"
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
