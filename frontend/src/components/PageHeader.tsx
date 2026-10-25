import { useAuth } from "../auth/useAuth";

interface Props {
  page: "inventory" | "login" | "register" | "admin";
  onNavigate: (page: "inventory" | "login" | "register" | "admin") => void;
}
export function PageHeader({ page, onNavigate }: Props) {
  const { isAuthenticated, logout, user } = useAuth();
  return (
    <header className="border-b border-stone-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <button
          className="text-lg font-semibold tracking-tight text-stone-950"
          onClick={() => onNavigate("inventory")}
        >
          Northstar Motors
        </button>
        <nav
          aria-label="Primary navigation"
          className="flex items-center gap-2"
        >
          {isAuthenticated ? (
            <>
              {user?.role === "admin" && (
                <button
                  className={`rounded-lg px-3 py-2 text-sm font-medium ${page === "admin" ? "bg-stone-100" : ""}`}
                  onClick={() => onNavigate("admin")}
                >
                  Manage inventory
                </button>
              )}
              <button
                className="rounded-lg bg-stone-950 px-3 py-2 text-sm font-semibold text-white"
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
                className={`rounded-lg px-3 py-2 text-sm font-medium ${page === "login" ? "bg-stone-100" : ""}`}
                onClick={() => onNavigate("login")}
              >
                Sign in
              </button>
              <button
                className="rounded-lg bg-stone-950 px-3 py-2 text-sm font-semibold text-white"
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
