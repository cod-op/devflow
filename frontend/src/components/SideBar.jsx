import {BarChart3,CheckSquare,FolderKanban,Home,LogOut,Settings,Users,X} from "lucide-react";

const Sidebar = ({ isOpen, onClose }) => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={onClose}
        />
      )}  

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

        <div className="flex h-16 items-center justify-between border-b border-slate-800 px-5">
          <a
            href="/"
            onClick={onClose}
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 font-bold">
              D
            </div>

            <h1 className="text-xl font-bold">
              DevFlow
            </h1>
          </a>

          {/* Mobile close button */}

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white md:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="space-y-2 p-4">

          <a
            href="/"
            onClick={onClose}
            className="flex items-center gap-3 rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            <Home size={19} />
            <span>Dashboard</span>
          </a>

          <a
            href="/#projects"
            onClick={onClose}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            <FolderKanban size={19} />
            <span>Projects</span>
          </a>

          <a
            href="/#tasks"
            onClick={onClose}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            <CheckSquare size={19} />
            <span>Tasks</span>
          </a>

          <div
            className="flex cursor-not-allowed items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-500"
            title="Team members can be selected when assigning tasks"
          >
            <Users size={19} />
            <span>Team</span>

            <span className="ml-auto rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-400">
              Soon
            </span>
          </div>


          <a
            href="/analytics"
            onClick={onClose}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            <BarChart3 size={19} />
            <span>Analytics</span>
          </a>

          <div
            className="flex cursor-not-allowed items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-500"
            title="Settings coming soon"
          >
            <Settings size={19} />
            <span>Settings</span>

            <span className="ml-auto rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-400">
              Soon
            </span>
          </div>
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