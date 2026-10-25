import { useState, type FormEvent } from "react";
import { api, ApiError } from "../api/client";
import { useAuth } from "../auth/useAuth";
interface Props {
  mode: "login" | "register";
  onComplete: () => void;
}
export function AuthPage({ mode, onComplete }: Props) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!email.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setPending(true);
    setError("");
    try {
      if (mode === "register") await api.register({ email, password });
      const credential = await api.login({ email, password });
      const user = await api.me(credential.access_token);
      login(credential.access_token, user);
      onComplete();
    } catch (reason) {
      setError(
        reason instanceof ApiError
          ? reason.message
          : "Unable to continue. Please try again.",
      );
    } finally {
      setPending(false);
    }
  };
  const title = mode === "login" ? "Welcome back" : "Create your account";
  return (
    <section className="mx-auto max-w-md py-12">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-500">
        Northstar Motors
      </p>
      <h1 className="mt-3 text-4xl font-semibold text-white">{title}</h1>
      <p className="mt-3 text-stone-400">
        {mode === "login"
          ? "Sign in to reserve a vehicle from live inventory. You can browse the showroom without an account."
          : "Create an account to reserve cars from live inventory. The showroom is open to everyone."}
      </p>
      <form
        className="mt-8 space-y-5 rounded-2xl border border-stone-800 bg-[#171717] p-6 shadow-sm"
        onSubmit={(event) => void submit(event)}
        noValidate
      >
        <label className="block text-sm font-medium text-stone-200">
          Email
          <input
            className="field mt-2 w-full border-stone-700! bg-stone-900! text-white!"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </label>
        <label className="block text-sm font-medium text-stone-200">
          Password
          <input
            className="field mt-2 w-full border-stone-700! bg-stone-900! text-white!"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={
              mode === "login" ? "current-password" : "new-password"
            }
          />
        </label>
        {error && (
          <p
            className="rounded-lg bg-red-950 p-3 text-sm text-red-100"
            role="alert"
          >
            {error}
          </p>
        )}
        <button
          className="w-full rounded-full bg-red-600 px-4 py-3 font-semibold text-white disabled:bg-stone-700"
          disabled={pending}
        >
          {pending
            ? "Please wait…"
            : mode === "login"
              ? "Sign in"
              : "Create account"}
        </button>
      </form>
    </section>
  );
}
