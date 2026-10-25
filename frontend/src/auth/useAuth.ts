import { useContext } from "react";

import { AuthContext, type AuthState } from "./authState";

export function useAuth(): AuthState {
  return useContext(AuthContext);
}
