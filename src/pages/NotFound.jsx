import { Link } from "react-router-dom";
export default function NotFound() {
  return <div className="not-found"><div className="eyebrow">404 — NOT FOUND</div><h1>This page isn't in the test plan.</h1><p>The page may have moved or the link may be incorrect.</p><Link className="button button-primary" to="/">Back to overview</Link></div>;
}
