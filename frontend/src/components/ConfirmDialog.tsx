import { useEffect, useRef } from "react";
interface Props {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  pending?: boolean;
}
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  onConfirm,
  onCancel,
  pending = false,
}: Props) {
  const cancelButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (open) cancelButton.current?.focus();
  }, [open]);
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-stone-950/50 p-4"
      role="presentation"
    >
      <section
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        <h2 id="dialog-title" className="text-xl font-semibold text-stone-950">
          {title}
        </h2>
        <p className="mt-2 text-stone-600">{description}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            ref={cancelButton}
            className="rounded-lg px-4 py-2 font-medium text-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-900"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="rounded-lg bg-rose-700 px-4 py-2 font-semibold text-white disabled:opacity-60"
            disabled={pending}
            onClick={onConfirm}
          >
            {pending ? "Working…" : confirmLabel}
          </button>
        </div>
      </section>
    </div>
  );
}
