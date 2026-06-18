import { NavLink, Route, Routes } from "react-router-dom";
import { AppIcon } from "@web/components/AppIcon";
import { DashboardPage } from "@web/features/dashboard/DashboardPage";
import { AgentPanelPage } from "@web/features/agent/AgentPanelPage";
import { SettingsPage } from "@web/features/settings/SettingsPage";

const NAV = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/agent", label: "Agent" },
  { to: "/settings", label: "Settings" },
];

export function App() {
  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">
          <AppIcon className="brand-mark" size={20} />
          <span>Shuttle</span>
        </div>
        <nav className="nav">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="main">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/agent" element={<AgentPanelPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>
    </div>
  );
}
