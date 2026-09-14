import { Bell, Menu } from "lucide-react";

const Navbar = ({
  onMenuClick,
}) => {
  const storedUser =
    localStorage.getItem("user");

  const user = storedUser
    ? JSON.parse(storedUser)
    : null;

  const userName =
    user?.name || "Developer";

  const userRole =
    user?.role || "Developer";

  const firstLetter =
    userName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">

      <div className="flex h-16 items-center justify-between px-4 sm:px-6">

        <div className="flex items-center gap-3">

          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          <div>
            <p className="text-sm font-semibold text-slate-800 sm:text-base">
              Developer Productivity
            </p>

            <p className="hidden text-xs text-slate-500 sm:block">
              Dashboard
            </p>
          </div>

        </div>

        <div className="flex items-center gap-4">

          <button
            type="button"
            className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100"
            aria-label="Notifications"
          >
            <Bell size={20} />

            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
          </button>

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
              {firstLetter}
            </div>

            <div className="hidden sm:block">

              <p className="text-sm font-semibold text-slate-800">
                {userName}
              </p>

              <p className="text-xs text-slate-500">
                {userRole}
              </p>

            </div>

          </div>

        </div>

      </div>
    </header>
  );
};

export default Navbar;