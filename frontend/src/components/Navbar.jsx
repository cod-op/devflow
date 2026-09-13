import { Bell, Menu } from "lucide-react";

const Navbar = ({ onMenuClick }) => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">

        {/* Left */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu */}
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          {/* Page title */}
          <div>
            <p className="text-sm font-semibold text-slate-800 sm:text-base">
              Developer Productivity
            </p>

            <p className="hidden text-xs text-slate-500 sm:block">
              Dashboard
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">

          {/* Notification */}
          <button
            type="button"
            className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100"
            aria-label="Notifications"
          >
            <Bell size={20} />

            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
          </button>

          {/* User */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
              S
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-slate-800">
               Shlok Patel
              </p>

              <p className="text-xs text-slate-500">
                Developer
              </p>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;