import { Link, Route, Routes } from "react-router-dom";
import { DashboardPage } from "@web/features/dashboard/DashboardPage";
import { AgentPanelPage } from "@web/features/agent/AgentPanelPage";
import { SettingsPage } from "@web/features/settings/SettingsPage";

const NAV = [
  { to: "/", label: "Dashboard" },
  { to: "/agent", label: "Agent" },
  { to: "/settings", label: "Settings" },
];

export function App() {
  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">{{projectName}}</div>
        <nav>
          {NAV.map((item) => (
            <Link key={item.to} to={item.to} className="nav-link">
              {item.label}
            </Link>
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
