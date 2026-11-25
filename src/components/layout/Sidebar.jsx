import { Bug, ClipboardCheck, FileText, FolderKanban, LayoutDashboard, Paintbrush, Sparkles, Target } from "lucide-react";
import { NavLink } from "react-router-dom";
import Brand from "../ui/Brand.jsx";

const links = [
  ["/", "Overview", LayoutDashboard],
  ["/projects", "Projects", FolderKanban],
  ["/requirements", "Requirements", Target],
  ["/test-cases", "Test cases", ClipboardCheck],
  ["/bugs", "Bug tracker", Bug],
  ["/ai-generator", "AI generator", Sparkles],
  ["/documents", "Documents", FileText],
  ["/appearance", "Appearance", Paintbrush],
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <Brand />
      <div className="nav-caption">WORKSPACE</div>
      <nav className="side-nav">
        {links.map(([to, label, Icon]) => (
          <NavLink key={to} to={to} end={to === "/"} className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>
            <Icon size={18} strokeWidth={1.8} /><span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer"><div className="avatar">ST</div><div><strong>Quality workspace</strong><small>Private workspace</small></div></div>
    </aside>
  );
}
