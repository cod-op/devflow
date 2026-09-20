import {
  BarChart3,
  CheckSquare,
  FolderKanban,
  Home,
  LogOut,
  Settings,
  Users,
  X,
} from "lucide-react";
import { NavLink, Link, useNavigate } from "react-router-dom";

const navItems = [
  { to: "/", label: "Dashboard", icon: Home, end: true },
  { to: "/#projects", label: "Projects", icon: FolderKanban, hash: true },
  { to: "/#tasks", label: "Tasks", icon: CheckSquare, hash: true },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
];

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
    onClose?.();
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
      isActive
        ? "bg-blue-600 text-white shadow-sm"
        : "text-slate-300 hover:bg-slate-800 hover:text-white"
    }`;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-64 bg-slate-950 text-white transition-transform duration-300 md:sticky md:top-0 md:z-30 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-800 px-5">
          <Link
            to="/"
            onClick={onClose}
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 font-bold">
              D
            </div>
            <h1 className="text-xl font-bold tracking-tight">DevFlow</h1>
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white md:hidden"
            aria-label="Close navigation menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="space-y-2 p-4" aria-label="Main navigation">
          {navItems.map(({ to, label, icon: Icon, end, hash }) =>
            hash ? (
              <a
                key={label}
                href={to}
                onClick={onClose}
                className={linkClass({ isActive: false })}
              >
                <Icon size={19} />
                <span>{label}</span>
              </a>
            ) : (
              <NavLink
                key={label}
                to={to}
                end={end}
                onClick={onClose}
                className={linkClass}
              >
                <Icon size={19} />
                <span>{label}</span>
              </NavLink>
            )
          )}

          <NavLink
            to="/team"
            onClick={onClose}
            className={linkClass}
          >
            <Users size={19} />
            <span>Team</span>
          </NavLink>

          <NavLink
            to="/settings"
            onClick={onClose}
            className={linkClass}
          >
            <Settings size={19} />
            <span>Settings</span>
          </NavLink>
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500/20"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
