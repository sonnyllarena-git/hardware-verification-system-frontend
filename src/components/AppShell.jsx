import { NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, ClipboardList, Settings, ShieldCheck, Download } from "lucide-react";
import logoIcon from "../tcp logo/Icon-Circle-Orange-Navy.png";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/results", label: "Results", icon: ClipboardList },
  { to: "/download", label: "Download", icon: Download },
  { to: "/settings", label: "Settings", icon: Settings },
];

function AppShell() {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="bg-gray-900 p-4 text-white md:w-64">
        <div className="mx-auto mb-6 w-fit rounded-full bg-white p-[7.68px]">
          <img src={logoIcon} alt="TheCreditPros" className="h-12 w-12" />
        </div>
        <nav className="flex gap-2 md:flex-col">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
                  isActive ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-800"
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
          <span className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <ShieldCheck className="h-5 w-5 text-blue-600" />
            TCP Hardware Check
          </span>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Sarah (HR Manager)</span>
            <button
              type="button"
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700"
            >
              Logout
            </button>
          </div>
        </header>

        <main className="bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppShell;
