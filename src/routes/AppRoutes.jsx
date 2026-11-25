import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

const Login = lazy(() => import("../pages/Login.jsx"));
const Signup = lazy(() => import("../pages/Signup.jsx"));
const Dashboard = lazy(() => import("../pages/Dashboard.jsx"));
const Projects = lazy(() => import("../pages/Projects.jsx"));
const Requirements = lazy(() => import("../pages/Requirements.jsx"));
const TestCases = lazy(() => import("../pages/TestCases.jsx"));
const Bugs = lazy(() => import("../pages/Bugs.jsx"));
const AiGenerator = lazy(() => import("../pages/AiGenerator.jsx"));
const Documents = lazy(() => import("../pages/Documents.jsx"));
const Appearance = lazy(() => import("../pages/Appearance.jsx"));
const NotFound = lazy(() => import("../pages/NotFound.jsx"));

const loadPage = (Page) => <Suspense fallback={<div className="screen-loading">Loading page…</div>}><Page /></Suspense>;

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={loadPage(Login)} />
      <Route path="/signup" element={loadPage(Signup)} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={loadPage(Dashboard)} />
          <Route path="projects" element={loadPage(Projects)} />
          <Route path="requirements" element={loadPage(Requirements)} />
          <Route path="test-cases" element={loadPage(TestCases)} />
          <Route path="bugs" element={loadPage(Bugs)} />
          <Route path="ai-generator" element={loadPage(AiGenerator)} />
          <Route path="documents" element={loadPage(Documents)} />
          <Route path="appearance" element={loadPage(Appearance)} />
          <Route path="*" element={loadPage(NotFound)} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
