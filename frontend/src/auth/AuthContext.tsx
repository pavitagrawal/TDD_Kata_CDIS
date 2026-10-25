import type { PropsWithChildren } from "react";

import { anonymousState, AuthContext } from "./authState";

export function AuthProvider({ children }: PropsWithChildren) {
  return (
    <AuthContext.Provider value={anonymousState}>
      {children}
    </AuthContext.Provider>
  );
}
