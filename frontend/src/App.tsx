import { useState } from "react";
import { useAuth } from "./auth/useAuth";
import { PageHeader } from "./components/PageHeader";
import { AuthPage } from "./pages/AuthPage";
import { InventoryPage } from "./pages/InventoryPage";

export function App() {
  const { user } = useAuth();
  const [page, setPage] = useState<"inventory" | "login" | "register">(
    "inventory",
  );
  return (
    <div className="min-h-screen bg-stone-100 text-stone-950">
      <PageHeader onNavigate={setPage} page={page} />
      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        {page === "inventory" && <InventoryPage />}
        {page !== "inventory" && (
          <AuthPage mode={page} onComplete={() => setPage("inventory")} />
        )}
      </main>
      <footer className="border-t border-stone-200 px-5 py-8 text-center text-sm text-stone-500">
        Northstar Motors ·{" "}
        {user ? `Signed in as ${user.email}` : "Private client inventory"}
      </footer>
    </div>
  );
}
