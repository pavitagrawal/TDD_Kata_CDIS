import { useState, type FormEvent } from "react";

interface Props {
  carName: string;
}

export function DemoBooking({ carName }: Props) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("11:00");
  const [confirmation, setConfirmation] = useState("");
  const today = new Date().toLocaleDateString("en-CA");

  const book = (event: FormEvent) => {
    event.preventDefault();
    if (!date || date < today) return;
    setConfirmation(
      `Demo viewing preview for ${carName} on ${date} at ${time}. No actual appointment or vehicle hold was created.`,
    );
  };

  return (
    <section
      className="mt-12 rounded-3xl border border-red-900/60 bg-gradient-to-br from-[#280909] to-[#151515] p-6 sm:p-8"
      aria-label="Demo booking"
    >
      <p className="text-xs font-bold uppercase tracking-[0.24em] text-red-400">
        The experience · Demo only
      </p>
      <h2 className="mt-3 font-serif text-3xl font-bold">Plan a viewing</h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-300">
        Try the booking flow for {carName}. This is a demonstration; no
        appointment is sent to a dealership and no car is reserved.
      </p>
      <form onSubmit={book} className="mt-6 flex flex-wrap items-end gap-3">
        <label className="text-sm font-semibold text-stone-200">
          Preferred date
          <input
            aria-label="Preferred date"
            required
            type="date"
            min={today}
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="mt-2 block rounded-lg border border-stone-600 bg-stone-950 px-4 py-3 text-white"
          />
        </label>
        <label className="text-sm font-semibold text-stone-200">
          Preferred time
          <select
            aria-label="Preferred time"
            value={time}
            onChange={(event) => setTime(event.target.value)}
            className="mt-2 block rounded-lg border border-stone-600 bg-stone-950 px-4 py-3 text-white"
          >
            <option value="11:00">11:00 AM</option>
            <option value="14:00">2:00 PM</option>
            <option value="16:00">4:00 PM</option>
          </select>
        </label>
        <button
          type="submit"
          className="rounded-lg bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-500"
        >
          Preview booking
        </button>
      </form>
      {confirmation && (
        <p
          role="status"
          className="mt-5 rounded-xl border border-emerald-700 bg-emerald-950 p-4 text-sm text-emerald-100"
        >
          {confirmation}
        </p>
      )}
    </section>
  );
}
