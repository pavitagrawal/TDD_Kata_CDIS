export function PageHeader() {
  return (
    <header className="border-b border-white/10 bg-slate-900/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <a className="text-lg font-semibold tracking-tight" href="/">
          Northstar Motors
        </a>
        <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-sm text-emerald-300">
          Inventory workspace
        </span>
      </div>
    </header>
  );
}
