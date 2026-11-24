import { supabase } from "../lib/supabaseClient.js";

function requireClient() {
  if (!supabase) throw new Error("Supabase is not configured. Add the values from .env.example to your .env file.");
  return supabase;
}

export const authService = {
  signIn: (email, password) => requireClient().auth.signInWithPassword({ email, password }),
  signUp: (email, password, name) =>
    requireClient().auth.signUp({ email, password, options: { data: { full_name: name } } }),
  signOut: () => requireClient().auth.signOut(),
  getSession: () => requireClient().auth.getSession(),
  onAuthStateChange: (callback) => requireClient().auth.onAuthStateChange(callback),
};
