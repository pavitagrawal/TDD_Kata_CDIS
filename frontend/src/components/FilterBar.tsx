import type { FormEvent } from "react";
import type { VehicleQuery } from "../types/domain";
interface Props {
  query: VehicleQuery;
  onChange: (query: VehicleQuery) => void;
  onSubmit: () => void;
}
export function FilterBar({ query, onChange, onSubmit }: Props) {
  const update = (key: keyof VehicleQuery, value: string) =>
    onChange({ ...query, [key]: value });
  const submit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit();
  };
  return (
    <form
      onSubmit={submit}
      className="grid gap-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-6"
    >
      <input
        aria-label="Filter by make"
        value={query.make ?? ""}
        onChange={(e) => update("make", e.target.value)}
        placeholder="Make"
        className="field"
      />
      <input
        aria-label="Filter by model"
        value={query.model ?? ""}
        onChange={(e) => update("model", e.target.value)}
        placeholder="Model"
        className="field"
      />
      <input
        aria-label="Filter by category"
        value={query.category ?? ""}
        onChange={(e) => update("category", e.target.value)}
        placeholder="Category"
        className="field"
      />
      <input
        aria-label="Minimum price"
        type="number"
        min="0"
        value={query.min_price ?? ""}
        onChange={(e) => update("min_price", e.target.value)}
        placeholder="Min price"
        className="field"
      />
      <input
        aria-label="Maximum price"
        type="number"
        min="0"
        value={query.max_price ?? ""}
        onChange={(e) => update("max_price", e.target.value)}
        placeholder="Max price"
        className="field"
      />
      <button className="rounded-lg bg-stone-950 px-4 py-2.5 font-semibold text-white focus:outline-none focus:ring-2 focus:ring-stone-900">
        Search
      </button>
    </form>
  );
}
