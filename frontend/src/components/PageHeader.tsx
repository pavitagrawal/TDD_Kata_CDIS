import { useAuth } from "../auth/useAuth";

interface Props {
  page: "inventory" | "login" | "register" | "admin";
  onNavigate: (page: "inventory" | "login" | "register" | "admin") => void;
}
export function PageHeader({ page, onNavigate }: Props) {
  const { isAuthenticated, logout, user } = useAuth();
  return (
    <header className="sticky top-0 z-30 border-b border-stone-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-4 sm:px-8">
        <button
          className="text-lg font-black tracking-[-0.06em] text-stone-950 sm:text-xl"
          onClick={() => onNavigate("inventory")}
        >
          NORTHSTAR
          <span className="ml-1 text-sm font-medium tracking-normal text-stone-500">
            MOTORS
          </span>
        </button>
        <button
          className="hidden rounded-full px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-100 sm:block"
          onClick={() => onNavigate("inventory")}
        >
          Explore cars
        </button>
        <nav
          aria-label="Primary navigation"
          className="flex items-center gap-2"
        >
          {isAuthenticated ? (
            <>
              {user?.role === "admin" && (
                <button
                  className={`rounded-full px-3 py-2 text-sm font-medium ${page === "admin" ? "bg-stone-100" : ""}`}
                  onClick={() => onNavigate("admin")}
                >
                  Manage inventory
                </button>
              )}
              <button
                className="rounded-full bg-stone-950 px-4 py-2 text-sm font-semibold text-white"
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
                className={`rounded-full px-3 py-2 text-sm font-medium ${page === "login" ? "bg-stone-100" : ""}`}
                onClick={() => onNavigate("login")}
              >
                Sign in
              </button>
              <button
                className="rounded-full bg-stone-950 px-4 py-2 text-sm font-semibold text-white"
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
