import { useState } from "react";
import { useAuth } from "./auth/useAuth";
import { PageHeader } from "./components/PageHeader";
import { AdminInventoryPage } from "./pages/AdminInventoryPage";
import { AuthPage } from "./pages/AuthPage";
import { InventoryPage } from "./pages/InventoryPage";

export function App() {
  const { user } = useAuth();
  const [page, setPage] = useState<
    "inventory" | "login" | "register" | "admin"
  >("inventory");
  return (
    <div className="min-h-screen bg-[#f7f7f5] text-stone-950">
      <PageHeader onNavigate={setPage} page={page} />
      <main className="mx-auto max-w-7xl px-5 py-7 sm:px-8 sm:py-10">
        {page === "inventory" && (
          <InventoryPage onSignIn={() => setPage("login")} />
        )}
        {page !== "inventory" &&
          (page === "admin" ? (
            user?.role === "admin" ? (
              <AdminInventoryPage />
            ) : (
              <InventoryPage onSignIn={() => setPage("login")} />
            )
          ) : (
            <AuthPage mode={page} onComplete={() => setPage("inventory")} />
          ))}
      </main>
      <footer className="mt-16 border-t border-stone-200 bg-white px-5 py-10 text-center text-sm text-stone-500">
        <p className="font-black tracking-[-0.04em] text-stone-900">
          NORTHSTAR MOTORS
        </p>
        <p className="mt-2">
          A demonstration automotive showroom. Concept vehicles and prices are
          illustrative.
        </p>
        {user && <p className="mt-2">Signed in as {user.email}</p>}
      </footer>
    </div>
  );
}
