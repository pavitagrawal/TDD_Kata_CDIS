import { PageHeader } from "./components/PageHeader";
import { InventoryPage } from "./pages/InventoryPage";

export function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <PageHeader />
      <main className="mx-auto max-w-6xl px-6 py-16">
        <InventoryPage />
      </main>
    </div>
  );
}
