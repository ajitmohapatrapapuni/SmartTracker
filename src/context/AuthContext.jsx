import { createContext, useEffect, useMemo, useState } from "react";
import { authService } from "../services/authService.js";
import { isSupabaseConfigured } from "../lib/supabaseClient.js";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured) return undefined;
    authService.getSession()
      .then(({ data, error }) => {
        if (error) throw error;
        setUser(data.session?.user ?? null);
      })
      .catch((error) => console.error("Could not load session:", error))
      .finally(() => setLoading(false));
    const { data } = authService.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const value = useMemo(() => ({ user, loading, configured: isSupabaseConfigured }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
