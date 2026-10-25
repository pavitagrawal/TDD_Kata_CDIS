import { useEffect, useState } from "react";
import { useAuth } from "./auth/useAuth";
import {
  addToCart,
  loadCart,
  saveCart,
  setCartQuantity,
  type CartItem,
} from "./cart/cart";
import { PageHeader } from "./components/PageHeader";
import { AdminInventoryPage } from "./pages/AdminInventoryPage";
import { AuthPage } from "./pages/AuthPage";
import { CartPage } from "./pages/CartPage";
import { InventoryPage } from "./pages/InventoryPage";
import type { Vehicle } from "./types/domain";

export function App() {
  const { user } = useAuth();
  const [page, setPage] = useState<
    "inventory" | "login" | "register" | "admin" | "cart"
  >("inventory");
  const [cart, setCart] = useState<CartItem[]>(loadCart);
  useEffect(() => saveCart(cart), [cart]);
  const addVehicle = (vehicle: Vehicle) =>
    setCart((current) => addToCart(current, vehicle));
  return (
    <div className="min-h-screen bg-[#0b0b0d] text-white">
      <PageHeader
        onNavigate={setPage}
        page={page}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
      />
      <main className="mx-auto max-w-7xl px-5 py-7 sm:px-8 sm:py-10">
        {page === "inventory" && (
          <InventoryPage
            onAddToCart={addVehicle}
            onOpenCart={() => setPage("cart")}
          />
        )}
        {page === "cart" && (
          <CartPage
            items={cart}
            onQuantity={(id, quantity) =>
              setCart((current) => setCartQuantity(current, id, quantity))
            }
            onPurchased={(id) =>
              setCart((current) => {
                const item = current.find((entry) => entry.vehicle.id === id);
                return item
                  ? setCartQuantity(current, id, item.quantity - 1)
                  : current;
              })
            }
            onClear={() => setCart([])}
            onBrowse={() => setPage("inventory")}
            onSignIn={() => setPage("login")}
          />
        )}
        {page !== "inventory" &&
          page !== "cart" &&
          (page === "admin" ? (
            user?.role === "admin" ? (
              <div className="admin-theme">
                <AdminInventoryPage />
              </div>
            ) : (
              <InventoryPage
                onAddToCart={addVehicle}
                onOpenCart={() => setPage("cart")}
              />
            )
          ) : (
            <AuthPage
              mode={page}
              onComplete={() => setPage(cart.length > 0 ? "cart" : "inventory")}
            />
          ))}
      </main>
      <footer className="mt-16 border-t border-stone-800 bg-black px-5 py-10 text-center text-sm text-stone-500">
        <p className="font-black tracking-[-0.04em] text-white">
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
