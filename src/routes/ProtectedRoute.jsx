import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

export default function ProtectedRoute() {
  const { user, loading, configured } = useAuth();
  if (!configured) return <Navigate to="/login" replace />;
  if (loading) return <div className="screen-loading">Loading your workspace…</div>;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
