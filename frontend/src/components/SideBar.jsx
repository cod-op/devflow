import {
  BarChart3,
  CheckSquare,
  FolderKanban,
  Home,
  Settings,
  Users,
  X,
} from "lucide-react";

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 z-50 h-screen w-64
          bg-slate-950 text-white
          transition-transform duration-300

          md:sticky md:top-0 md:z-30
          md:translate-x-0

          ${
            isOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-slate-800 px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 font-bold">
              D
            </div>

            <h1 className="text-xl font-bold">
              DevFlow
            </h1>
          </div>

          {/* Close button - mobile only */}
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white md:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 p-4">

          {/* Dashboard */}
          <a
            href="#"
            className="flex items-center gap-3 rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white"
          >
            <Home size={19} />
            <span>Dashboard</span>
          </a>

          {/* Projects */}
          <a
            href="#projects"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            <FolderKanban size={19} />
            <span>Projects</span>
          </a>

          {/* Tasks */}
          <a
            href="#tasks"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            <CheckSquare size={19} />
            <span>Tasks</span>
          </a>

          {/* Team */}
          <a
            href="#"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            <Users size={19} />
            <span>Team</span>
          </a>

          {/* Analytics */}
          <a
            href="#"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            <BarChart3 size={19} />
            <span>Analytics</span>
          </a>

          {/* Settings */}
          <a
            href="#"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            <Settings size={19} />
            <span>Settings</span>
          </a>

        </nav>s

        {/* Upgrade Card */}
        <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-slate-900 p-4">
          <h3 className="text-sm font-bold text-white">
            Upgrade your plan
          </h3>

          <p className="mt-2 text-xs leading-5 text-slate-400">
            Get more projects and advanced
            features.
          </p>

          <button
            type="button"
            className="mt-4 w-full rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
          >
            Upgrade
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;