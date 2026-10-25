import { createContext } from "react";
import type { AuthenticatedUser } from "../types/domain";
export interface AuthState {
  user: AuthenticatedUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: AuthenticatedUser) => void;
  logout: () => void;
}
export const anonymousState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  login: () => undefined,
  logout: () => undefined,
};
export const AuthContext = createContext<AuthState>(anonymousState);
