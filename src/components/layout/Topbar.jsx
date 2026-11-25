import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import Button from "../ui/Button.jsx";
import { authService } from "../../services/authService.js";

const titles = { "/": "Overview", "/projects": "Projects", "/requirements": "Requirements", "/test-cases": "Test cases", "/bugs": "Bug tracker", "/ai-generator": "AI test generator", "/documents": "Documents", "/appearance": "Appearance" };

export default function Topbar() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const [error, setError] = useState("");
  async function signOut() {
    setError("");
    try {
      const { error: signOutError } = await authService.signOut();
      if (signOutError) setError(signOutError.message || "Could not sign out.");
    } catch (signOutError) {
      setError(signOutError.message || "Could not sign out.");
    }
  }
  return (
    <header>
      <div className="topbar">
        <div className="crumb">Workspace <span>/</span> <strong>{titles[pathname] || "Workspace"}</strong></div>
        <div className="topbar-actions"><div className="user-chip"><div className="avatar small">{(user?.user_metadata?.full_name || user?.email || "U").slice(0, 1).toUpperCase()}</div><span>{user?.user_metadata?.full_name || user?.email}</span></div><Button variant="ghost" onClick={signOut}>Sign out</Button></div>
      </div>
      {error && <div className="topbar-error" role="alert">{error}</div>}
    </header>
  );
}
