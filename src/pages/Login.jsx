import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/authService.js";
import { isSupabaseConfigured } from "../lib/supabaseClient.js";
import Button from "../components/ui/Button.jsx";
import Brand from "../components/ui/Brand.jsx";

export default function Login() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  async function submit(event) {
    event.preventDefault(); setError(""); setBusy(true);
    try { const { error: authError } = await authService.signIn(event.currentTarget.email.value, event.currentTarget.password.value); if (authError) throw authError; navigate("/"); }
    catch (err) { setError(err.message || "Sign in failed."); }
    finally { setBusy(false); }
  }
  return <div className="auth-page"><Brand className="auth-brand" /><section className="auth-card"><div className="eyebrow">WELCOME BACK</div><h1>Sign in to your workspace</h1><p>Keep quality work moving forward.</p>{!isSupabaseConfigured && <div className="alert error-alert">Supabase is not configured. Copy <code>.env.example</code> to <code>.env</code> and add your project URL and anon key.</div>}{error && <div className="alert error-alert">{error}</div>}<form className="auth-form" onSubmit={submit}><label>Email address<input name="email" type="email" autoComplete="email" required /></label><label>Password<input name="password" type="password" autoComplete="current-password" required /></label><Button disabled={busy || !isSupabaseConfigured}>{busy ? "Signing in…" : "Sign in"}</Button></form><div className="auth-switch">New to SmartTracker? <Link to="/signup">Create an account</Link></div></section><div className="auth-foot">Test smarter. Ship with confidence.</div></div>;
}
