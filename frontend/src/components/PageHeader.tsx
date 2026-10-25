import { useAuth } from "../auth/useAuth";

interface Props {
  page: "inventory" | "login" | "register" | "admin" | "cart";
  onNavigate: (
    page: "inventory" | "login" | "register" | "admin" | "cart",
  ) => void;
  cartCount: number;
}
export function PageHeader({ page, onNavigate, cartCount }: Props) {
  const { isAuthenticated, logout, user } = useAuth();
  return (
    <header className="sticky top-0 z-30 border-b border-stone-800 bg-black/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-4 sm:flex-nowrap sm:px-8">
        <button
          className="text-lg font-black tracking-[-0.06em] text-white sm:text-xl"
          onClick={() => onNavigate("inventory")}
        >
          <span className="text-red-600">N</span>ORTHSTAR
          <span className="ml-1 hidden text-sm font-medium tracking-normal text-stone-500 sm:inline">
            MOTORS
          </span>
        </button>
        <button
          className="hidden rounded-full px-4 py-2 text-sm font-semibold text-stone-300 hover:bg-stone-900 sm:block"
          onClick={() => onNavigate("inventory")}
        >
          Explore cars
        </button>
        <nav
          aria-label="Primary navigation"
          className="flex w-full items-center justify-end gap-2 sm:w-auto"
        >
          <button
            className="relative rounded-full px-3 py-2 text-sm font-semibold text-white hover:bg-stone-900"
            onClick={() => onNavigate("cart")}
          >
            Cart{" "}
            <span
              aria-label={`${cartCount} items in cart`}
              className="ml-1 rounded-full bg-red-600 px-2 py-0.5 text-xs text-white"
            >
              {cartCount}
            </span>
          </button>
          {isAuthenticated ? (
            <>
              {user?.role === "admin" && (
                <button
                  className={`rounded-full px-3 py-2 text-sm font-medium text-white ${page === "admin" ? "bg-stone-800" : ""}`}
                  onClick={() => onNavigate("admin")}
                >
                  Manage inventory
                </button>
              )}
              <button
                className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white"
                onClick={() => {
                  logout();
                  onNavigate("inventory");
                }}
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <button
                className={`rounded-full px-3 py-2 text-sm font-medium text-white ${page === "login" ? "bg-stone-800" : ""}`}
                onClick={() => onNavigate("login")}
              >
                Sign in
              </button>
              <button
                className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white"
                onClick={() => onNavigate("register")}
              >
                Register
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
