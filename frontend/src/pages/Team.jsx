import { useEffect, useMemo, useState } from "react";
import { Search, Users, UserRound } from "lucide-react";
import Sidebar from "../components/SideBar";
import Navbar from "../components/Navbar";
import { getTasks, getUsers } from "../service/api.js";
import { useToast } from "../components/Toast";

const initials = (name = "U") => name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();

const Team = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    Promise.all([getUsers(), getTasks()])
      .then(([userResponse, taskResponse]) => {
        setUsers(userResponse?.data || []);
        setTasks(taskResponse?.data || []);
      })
      .catch((error) => showToast(error.message || "Unable to load team.", "error"))
      .finally(() => setLoading(false));
  }, [showToast]);

  const filteredUsers = useMemo(() => users.filter((user) => {
    const value = `${user.name} ${user.email} ${user.role}`.toLowerCase();
    return value.includes(search.toLowerCase().trim());
  }), [users, search]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="min-w-0 flex-1">
          <Navbar onMenuClick={() => setSidebarOpen(true)} />
          <main className="p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">
              <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-blue-600">Workspace</p>
                  <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Team</h1>
                  <p className="mt-2 text-slate-500">Manage your collaborators and see their current workload.</p>
                </div>
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search team members" className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                </div>
              </div>

              {loading ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">Loading team members...</div>
              ) : filteredUsers.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
                  <Users className="mx-auto text-slate-400" size={36} />
                  <h2 className="mt-4 font-semibold text-slate-900">No team members found</h2>
                </div>
              ) : (
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {filteredUsers.map((user) => {
                    const userTasks = tasks.filter((task) => task.assignedTo?._id === user._id);
                    const completed = userTasks.filter((task) => task.status === "done").length;
                    return (
                      <article key={user._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 font-bold text-blue-700">{initials(user.name)}</div>
                            <div>
                              <h2 className="font-semibold text-slate-900">{user.name}</h2>
                              <p className="text-sm text-slate-500">{user.email}</p>
                            </div>
                          </div>
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">{user.role}</span>
                        </div>
                        <div className="mt-5 grid grid-cols-2 gap-3">
                          <div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">Assigned tasks</p><p className="mt-1 text-xl font-bold text-slate-900">{userTasks.length}</p></div>
                          <div className="rounded-xl bg-emerald-50 p-3"><p className="text-xs text-emerald-700">Completed</p><p className="mt-1 text-xl font-bold text-emerald-800">{completed}</p></div>
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-sm text-slate-500"><UserRound size={16} /> Active workspace member</div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Team;
