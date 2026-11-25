import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/authService.js";
import { isSupabaseConfigured } from "../lib/supabaseClient.js";
import Button from "../components/ui/Button.jsx";
import Brand from "../components/ui/Brand.jsx";

export default function Signup() {
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  async function submit(event) {
    event.preventDefault(); setError(""); setNotice(""); setBusy(true);
    const form = event.currentTarget;
    if (form.password.value !== form.confirm.value) { setBusy(false); setError("Passwords do not match."); return; }
    try {
      const { data, error: authError } = await authService.signUp(form.email.value, form.password.value, form.elements.namedItem("name").value);
      if (authError) throw authError;
      if (data.session) navigate("/");
      else setNotice("Account created. Check your email to confirm your address, then sign in.");
    } catch (err) { setError(err.message || "Could not create account."); }
    finally { setBusy(false); }
  }
  return <div className="auth-page"><Brand className="auth-brand" /><section className="auth-card"><div className="eyebrow">GET STARTED</div><h1>Create your account</h1><p>Set up your quality workspace in moments.</p>{!isSupabaseConfigured && <div className="alert error-alert">Configure Supabase in your <code>.env</code> file before signing up.</div>}{error && <div className="alert error-alert">{error}</div>}{notice && <div className="alert success-alert">{notice}</div>}<form className="auth-form" onSubmit={submit}><label>Your name<input name="name" autoComplete="name" required /></label><label>Email address<input name="email" type="email" autoComplete="email" required /></label><label>Password<input name="password" type="password" minLength="8" autoComplete="new-password" required /></label><label>Confirm password<input name="confirm" type="password" minLength="8" autoComplete="new-password" required /></label><Button disabled={busy || !isSupabaseConfigured}>{busy ? "Creating account…" : "Create account"}</Button></form><div className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></div></section><div className="auth-foot">Test smarter. Ship with confidence.</div></div>;
}
