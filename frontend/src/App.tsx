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
import { getIconicCar } from "./data/iconicCars";
import { getShowroomProfile } from "./data/showroomProfiles";
import { AdminInventoryPage } from "./pages/AdminInventoryPage";
import { AuthPage } from "./pages/AuthPage";
import { CartPage } from "./pages/CartPage";
import { InventoryPage } from "./pages/InventoryPage";
import { IconicCarPage } from "./pages/IconicCarPage";
import { ShowroomCarPage } from "./pages/ShowroomCarPage";
import type { Vehicle } from "./types/domain";

export function App() {
  const { user } = useAuth();
  const [page, setPage] = useState<
    "inventory" | "login" | "register" | "admin" | "cart"
  >("inventory");
  const [cart, setCart] = useState<CartItem[]>(loadCart);
  const [path, setPath] = useState(window.location.pathname);
  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);
  useEffect(() => saveCart(cart), [cart]);
  const navigatePage = (nextPage: typeof page) => {
    if (window.location.pathname !== "/") {
      window.history.pushState({}, "", "/");
      setPath("/");
    }
    setPage(nextPage);
    window.scrollTo?.(0, 0);
  };
  const openIconicCar = (slug: string) => {
    const nextPath = `/cars/${slug}`;
    window.history.pushState({}, "", nextPath);
    setPath(nextPath);
    window.scrollTo?.(0, 0);
  };
  const openShowroomCar = (slug: string) => {
    const nextPath = `/showroom/${slug}`;
    window.history.pushState({}, "", nextPath);
    setPath(nextPath);
    window.scrollTo?.(0, 0);
  };
  const carSlug = path.match(/^\/cars\/([^/]+)\/?$/)?.[1];
  const iconicCar = carSlug ? getIconicCar(carSlug) : undefined;
  const showroomSlug = path.match(/^\/showroom\/([^/]+)\/?$/)?.[1];
  const showroomProfile = showroomSlug
    ? getShowroomProfile(showroomSlug)
    : undefined;
  const addVehicle = (vehicle: Vehicle) =>
    setCart((current) => addToCart(current, vehicle));
  return (
    <div className="min-h-screen bg-[#0b0b0d] text-white">
      <PageHeader
        onNavigate={navigatePage}
        page={page}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
      />
      <main className="mx-auto max-w-7xl px-5 py-7 sm:px-8 sm:py-10">
        {showroomSlug ? (
          showroomProfile ? (
            <ShowroomCarPage
              profile={showroomProfile}
              onBack={() => navigatePage("inventory")}
              onNavigate={openShowroomCar}
            />
          ) : (
            <div className="py-24 text-center">
              <h1 className="text-4xl font-bold">Showroom car not found</h1>
              <button
                className="mt-6 rounded-full bg-red-600 px-6 py-3 font-semibold"
                onClick={() => navigatePage("inventory")}
              >
                Browse cars
              </button>
            </div>
          )
        ) : carSlug ? (
          iconicCar ? (
            <IconicCarPage
              car={iconicCar}
              onBack={() => navigatePage("inventory")}
              onNavigate={openIconicCar}
            />
          ) : (
            <div className="py-24 text-center">
              <h1 className="text-4xl font-bold">Car profile not found</h1>
              <button
                className="mt-6 rounded-full bg-red-600 px-6 py-3 font-semibold"
                onClick={() => navigatePage("inventory")}
              >
                Browse cars
              </button>
            </div>
          )
        ) : page === "inventory" ? (
          <InventoryPage
            onAddToCart={addVehicle}
            onOpenCart={() => navigatePage("cart")}
            onOpenIconicCar={openIconicCar}
            onOpenShowroomCar={openShowroomCar}
          />
        ) : page === "cart" ? (
          <CartPage
            items={cart}
            onQuantity={(id, quantity) =>
              setCart((current) => setCartQuantity(current, id, quantity))
            }
            onClear={() => setCart([])}
            onBrowse={() => navigatePage("inventory")}
          />
        ) : page === "admin" ? (
          user?.role === "admin" ? (
            <div className="admin-theme">
              <AdminInventoryPage />
            </div>
          ) : (
            <InventoryPage
              onAddToCart={addVehicle}
              onOpenCart={() => navigatePage("cart")}
              onOpenIconicCar={openIconicCar}
              onOpenShowroomCar={openShowroomCar}
            />
          )
        ) : (
          <AuthPage
            mode={page}
            onComplete={() =>
              navigatePage(cart.length > 0 ? "cart" : "inventory")
            }
          />
        )}
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
