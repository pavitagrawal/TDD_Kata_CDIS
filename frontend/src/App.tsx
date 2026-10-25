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
    <div className="editorial-site min-h-screen bg-[#0b0b0d] text-white">
      <PageHeader
        onNavigate={navigatePage}
        page={page}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
      />
      <main className="mx-auto max-w-7xl px-5 pb-12 pt-0 sm:px-8">
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
      <footer className="mt-16 border-t border-stone-800 bg-[#111] px-5 py-12 text-sm text-stone-400 sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[2fr_1fr_1fr]">
          <div>
            <p className="font-serif text-2xl font-bold text-white">
              Northstar<span className="text-red-500">.</span>
            </p>
            <p className="mt-4 max-w-sm leading-6">
              An editorial automotive showroom for discovering and comparing
              remarkable cars.
            </p>
            <p className="mt-4 max-w-sm text-xs leading-5 text-stone-500">
              This is a demonstration. Northstar concepts, bookings and checkout
              are illustrative; no real vehicle sale or appointment occurs here.
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-400">
              Explore
            </p>
            <div className="mt-4 grid gap-3">
              <a className="hover:text-white" href="/#showroom">
                The collection
              </a>
              <a className="hover:text-white" href="/#compare">
                Compare cars
              </a>
              <a className="hover:text-white" href="/#prices">
                Price watch
              </a>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-400">
              Your workspace
            </p>
            <div className="mt-4 grid gap-3">
              <button
                className="text-left hover:text-white"
                onClick={() => navigatePage("cart")}
              >
                Your cart
              </button>
              <button
                className="text-left hover:text-white"
                onClick={() => navigatePage(user ? "inventory" : "login")}
              >
                {user ? "Explore cars" : "Sign in"}
              </button>
              {user?.role === "admin" && (
                <button
                  className="text-left hover:text-white"
                  onClick={() => navigatePage("admin")}
                >
                  Manage inventory
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="mx-auto mt-12 flex max-w-7xl flex-wrap justify-between gap-2 border-t border-stone-800 pt-5 text-xs text-stone-600">
          <span>
            © {new Date().getFullYear()} Northstar Motors · Demonstration
            project
          </span>
          {user && <span>Signed in as {user.email}</span>}
        </div>
      </footer>
    </div>
  );
}
