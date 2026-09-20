import { useEffect, useState } from "react";
import { LockKeyhole, Save, UserRound } from "lucide-react";
import Sidebar from "../components/SideBar";
import Navbar from "../components/Navbar";
import { getCurrentUser, updateUser } from "../service/api.js";
import { useToast } from "../components/Toast";

const Settings = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    getCurrentUser()
      .then((response) => {
        const data = response?.data || response;
        setUser(data);
        setName(data.name || "");
        setEmail(data.email || "");
      })
      .catch((error) => showToast(error.message || "Unable to load profile.", "error"));
  }, [showToast]);

  const saveProfile = async (event) => {
    event.preventDefault();
    if (!user) return;
    try {
      setSaving(true);
      const response = await updateUser(user._id || user.id, { name, email });
      const updated = response?.data || response;
      setUser(updated);
      localStorage.setItem("user", JSON.stringify(updated));
      window.dispatchEvent(new Event("profile:updated"));
      showToast("Profile updated successfully.", "success");
    } catch (error) {
      showToast(error.message || "Unable to update profile.", "error");
    } finally { setSaving(false); }
  };

  const changePassword = async (event) => {
    event.preventDefault();
    if (!user) return;
    if (newPassword.length < 8) return showToast("New password must be at least 8 characters.", "error");
    try {
      setChangingPassword(true);
      await updateUser(user._id || user.id, { currentPassword, password: newPassword });
      setCurrentPassword("");
      setNewPassword("");
      showToast("Password changed successfully.", "success");
    } catch (error) {
      showToast(error.message || "Unable to change password.", "error");
    } finally { setChangingPassword(false); }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="min-w-0 flex-1">
          <Navbar onMenuClick={() => setSidebarOpen(true)} />
          <main className="p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-4xl">
              <div className="mb-8"><p className="text-sm font-semibold text-blue-600">Account</p><h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Settings</h1><p className="mt-2 text-slate-500">Manage your profile and account security.</p></div>

              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 p-6"><div className="flex items-center gap-3"><div className="rounded-xl bg-blue-50 p-2.5 text-blue-600"><UserRound size={20} /></div><div><h2 className="font-semibold text-slate-900">Profile information</h2><p className="text-sm text-slate-500">Keep your workspace identity up to date.</p></div></div></div>
                <form onSubmit={saveProfile} className="space-y-5 p-6">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="text-sm font-medium text-slate-700">Full name<input value={name} onChange={(e) => setName(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" required minLength={2} /></label>
                    <label className="text-sm font-medium text-slate-700">Email address<input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" required /></label>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-500">Role</p><p className="mt-1 font-semibold text-slate-900">{user?.role || "Developer"}</p></div>
                    <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-500">Account</p><p className="mt-1 font-semibold text-emerald-700">Active</p></div>
                  </div>
                  <button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"><Save size={17} />{saving ? "Saving..." : "Save profile"}</button>
                </form>
              </section>

              <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 p-6"><div className="flex items-center gap-3"><div className="rounded-xl bg-amber-50 p-2.5 text-amber-600"><LockKeyhole size={20} /></div><div><h2 className="font-semibold text-slate-900">Security</h2><p className="text-sm text-slate-500">Change your password securely.</p></div></div></div>
                <form onSubmit={changePassword} className="space-y-5 p-6">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="text-sm font-medium text-slate-700">Current password<input value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} type="password" autoComplete="current-password" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" required /></label>
                    <label className="text-sm font-medium text-slate-700">New password<input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} type="password" autoComplete="new-password" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" required minLength={8} /></label>
                  </div>
                  <button disabled={changingPassword} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"><LockKeyhole size={17} />{changingPassword ? "Updating..." : "Change password"}</button>
                </form>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Settings;
