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
    <header className="sticky top-0 z-30 border-b border-[#392022] bg-[#101010]/97 backdrop-blur-xl">
      <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto] items-center gap-x-2 gap-y-3 px-4 py-3 lg:grid-cols-[1fr_auto_1fr] lg:gap-x-4 lg:px-8">
        <button
          className="flex w-fit items-center gap-2 whitespace-nowrap text-left font-serif text-lg font-bold tracking-tight text-white sm:text-2xl"
          onClick={() => onNavigate("inventory")}
        >
          <span
            aria-hidden="true"
            className="grid h-8 w-8 place-items-center border border-red-500 bg-[#2a090b] font-sans text-sm font-black text-red-400"
          >
            N
          </span>
          Northstar<span className="hidden text-red-500 sm:inline">.</span>
        </button>
        <nav
          aria-label="Collection navigation"
          className="order-3 col-span-2 flex items-center gap-0 overflow-x-auto border border-stone-700 bg-[#171717] text-xs font-semibold text-stone-200 lg:order-none lg:col-span-1 lg:text-sm"
        >
          {[
            ["Collection", "/#explore"],
            ["Showroom", "/#showroom"],
            ["Compare", "/#compare"],
            ["Price watch", "/#prices"],
          ].map(([label, href]) => (
            <a
              key={label}
              href={href}
              className="shrink-0 border-r border-stone-700 px-3 py-3 transition hover:bg-[#310b0d] hover:text-white last:border-r-0 sm:px-4"
            >
              {label}
            </a>
          ))}
        </nav>
        <nav
          aria-label="Primary navigation"
          className="flex items-center justify-end gap-1 whitespace-nowrap text-xs sm:gap-2 sm:text-sm"
        >
          <button
            className="relative border border-stone-700 px-2 py-2 font-semibold text-white hover:border-red-500 sm:px-3"
            onClick={() => onNavigate("cart")}
          >
            Cart{" "}
            <span
              aria-label={`${cartCount} items in cart`}
              className="ml-1 bg-red-600 px-1.5 py-0.5 text-xs text-white"
            >
              {cartCount}
            </span>
          </button>
          {isAuthenticated ? (
            <>
              {user?.role === "admin" && (
                <button
                  className={`border border-stone-700 px-3 py-2 font-medium text-white ${page === "admin" ? "bg-stone-800" : ""}`}
                  onClick={() => onNavigate("admin")}
                >
                  Manage inventory
                </button>
              )}
              <button
                className="bg-red-600 px-3 py-2 font-semibold text-white shadow-[3px_3px_0_#5d1014] sm:px-4"
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
                className={`border border-stone-700 px-2 py-2 font-medium text-white sm:px-3 ${page === "login" ? "bg-stone-800" : ""}`}
                onClick={() => onNavigate("login")}
              >
                Sign in
              </button>
              <button
                className="bg-red-600 px-3 py-2 font-semibold text-white shadow-[3px_3px_0_#5d1014] sm:px-4"
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
