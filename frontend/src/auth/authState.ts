import { createContext } from "react";

export interface AuthState {
  isAuthenticated: boolean;
}

export const anonymousState: AuthState = { isAuthenticated: false };
export const AuthContext = createContext<AuthState>(anonymousState);
