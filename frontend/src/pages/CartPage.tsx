import { useState } from "react";
import { api, ApiError } from "../api/client";
import { useAuth } from "../auth/useAuth";
import { cartTotal, type CartItem } from "../cart/cart";
import { isShowroomVehicle, vehicleImage } from "../data/showroom";

interface Props {
  items: CartItem[];
  onQuantity: (id: string, quantity: number) => void;
  onPurchased: (id: string) => void;
  onClear: () => void;
  onBrowse: () => void;
  onSignIn: () => void;
}

const money = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);

export function CartPage({
  items,
  onQuantity,
  onPurchased,
  onClear,
  onBrowse,
  onSignIn,
}: Props) {
  const { token } = useAuth();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const conceptCount = items.filter((item) =>
    isShowroomVehicle(item.vehicle),
  ).length;
  const liveCount = items.length - conceptCount;

  const checkout = async () => {
    setError("");
    setConfirmation("");
    if (conceptCount && liveCount) {
      setError(
        "Concept and live cars need separate checkouts. Remove one type of car to continue.",
      );
      return;
    }
    if (conceptCount) {
      onClear();
      setConfirmation(
        "Demo checkout complete. No payment was taken and no vehicle was reserved.",
      );
      return;
    }
    if (!token) {
      onSignIn();
      return;
    }
    setPending(true);
    let completed = 0;
    try {
      for (const item of items) {
        for (let index = 0; index < item.quantity; index++) {
          await api.purchase(item.vehicle.id, token);
          onPurchased(item.vehicle.id);
          completed++;
        }
      }
      setConfirmation(
        `${completed} vehicle ${completed === 1 ? "reservation" : "reservations"} completed. No online payment was taken.`,
      );
    } catch (reason) {
      setError(
        `${completed ? `${completed} reservation(s) completed. ` : ""}${reason instanceof ApiError ? reason.message : "Checkout could not be completed."} Remaining items are still in your cart.`,
      );
    } finally {
      setPending(false);
    }
  };

  return (
    <section className="mx-auto max-w-6xl py-4" aria-labelledby="cart-heading">
      <p className="text-xs font-bold uppercase tracking-[0.24em] text-red-500">
        Your selection
      </p>
      <h1
        id="cart-heading"
        className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl"
      >
        Your cart
      </h1>
      <p className="mt-3 text-stone-400">Review your cars before continuing.</p>
      {confirmation && (
        <div
          role="status"
          className="mt-7 rounded-2xl border border-emerald-700 bg-emerald-950 p-5 text-emerald-100"
        >
          {confirmation}
        </div>
      )}
      {error && (
        <div
          role="alert"
          className="mt-7 rounded-2xl border border-red-700 bg-red-950 p-5 text-red-100"
        >
          {error}
        </div>
      )}
      {items.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-stone-800 bg-[#171717] p-10 text-center">
          <h2 className="text-2xl font-bold text-white">Your cart is empty</h2>
          <p className="mt-2 text-stone-400">
            Explore the collection and add a car you love.
          </p>
          <button
            onClick={onBrowse}
            className="mt-6 rounded-full bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-500"
          >
            Browse cars
          </button>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            {items.map(({ vehicle, quantity }) => (
              <article
                key={vehicle.id}
                className="flex flex-col gap-5 rounded-3xl border border-stone-800 bg-[#171717] p-5 sm:flex-row"
              >
                <img
                  src={vehicleImage(vehicle)}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  className="aspect-[16/10] w-full rounded-2xl object-cover sm:w-44"
                />
                <div className="flex flex-1 flex-col justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-red-400">
                      {isShowroomVehicle(vehicle)
                        ? "Demo concept"
                        : "Live inventory"}
                    </p>
                    <h2 className="mt-1 text-xl font-bold text-white">
                      {vehicle.make} {vehicle.model}
                    </h2>
                    <p className="mt-1 text-sm text-stone-400">
                      {vehicle.category} · {money(Number(vehicle.price))} each
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center overflow-hidden rounded-full border border-stone-700 text-white">
                      <button
                        aria-label={`Decrease ${vehicle.model} quantity`}
                        className="px-4 py-2 hover:bg-stone-800"
                        onClick={() => onQuantity(vehicle.id, quantity - 1)}
                      >
                        −
                      </button>
                      <span
                        aria-label="Quantity"
                        className="min-w-6 text-center"
                      >
                        {quantity}
                      </span>
                      <button
                        aria-label={`Increase ${vehicle.model} quantity`}
                        className="px-4 py-2 hover:bg-stone-800 disabled:opacity-40"
                        disabled={
                          quantity >=
                          (isShowroomVehicle(vehicle)
                            ? 10
                            : vehicle.stock_quantity)
                        }
                        onClick={() => onQuantity(vehicle.id, quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="text-sm font-semibold text-stone-400 underline hover:text-red-400"
                      onClick={() => onQuantity(vehicle.id, 0)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <aside className="h-fit rounded-3xl border border-stone-800 bg-[#171717] p-6">
            <h2 className="text-xl font-bold text-white">Order summary</h2>
            <div className="mt-6 flex justify-between border-b border-stone-800 pb-5 text-sm text-stone-300">
              <span>
                {items.reduce((sum, item) => sum + item.quantity, 0)} cars
              </span>
              <span>{money(cartTotal(items))}</span>
            </div>
            <div className="mt-5 flex justify-between text-lg font-bold text-white">
              <span>Estimated total</span>
              <span>{money(cartTotal(items))}</span>
            </div>
            <p className="mt-4 text-xs leading-5 text-stone-400">
              {conceptCount
                ? "Concept checkout is a simulation. No payment, order, or vehicle reservation will be created."
                : "Live checkout updates inventory but does not collect online payment."}
            </p>
            <button
              disabled={pending}
              onClick={() => void checkout()}
              className="mt-6 w-full rounded-full bg-red-600 px-5 py-3 font-bold text-white hover:bg-red-500 disabled:opacity-50"
            >
              {pending
                ? "Processing…"
                : conceptCount
                  ? "Complete demo checkout"
                  : "Reserve cars"}
            </button>
            <button
              onClick={onBrowse}
              className="mt-3 w-full rounded-full border border-stone-700 px-5 py-3 font-semibold text-white hover:bg-stone-800"
            >
              Continue browsing
            </button>
          </aside>
        </div>
      )}
    </section>
  );
}
