import { X, Users } from "lucide-react";
import { useEffect, useState } from "react";

const ProjectModal = ({ project, users = [], onClose, onCreate, onUpdate }) => {
  const isEditMode = Boolean(project);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Planning");
  const [members, setMembers] = useState([]);

  useEffect(() => {
    setName(project?.name || "");
    setDescription(project?.description || "");
    setStatus(project?.status || "Planning");
    setMembers((project?.members || []).map((member) => member._id || member));
  }, [project]);

  const toggleMember = (id) => {
    setMembers((current) => current.includes(id) ? current.filter((memberId) => memberId !== id) : [...current, id]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!name.trim()) return;
    const data = { name: name.trim(), description: description.trim(), status, members };
    if (isEditMode) onUpdate(project._id, data);
    else onCreate(data);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/40 p-4">
      <div className="my-8 w-full max-w-lg rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 p-5">
          <div><h2 className="text-lg font-bold text-slate-900">{isEditMode ? "Edit Project" : "Create Project"}</h2><p className="mt-1 text-sm text-slate-500">{isEditMode ? "Update project details and collaborators." : "Create a project and assign your team."}</p></div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Close"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5 p-5">
          <label className="block text-sm font-medium text-slate-700">Project name<input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. DevFlow" required className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500" /></label>
          <label className="block text-sm font-medium text-slate-700">Description<textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your project" rows="3" className="mt-2 w-full resize-none rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500" /></label>
          <label className="block text-sm font-medium text-slate-700">Status<select value={status} onChange={(e) => setStatus(e.target.value)} className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 outline-none focus:border-blue-500"><option>Planning</option><option>Active</option><option>Completed</option></select></label>
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700"><Users size={17} /> Team members</div>
            <div className="max-h-44 space-y-2 overflow-y-auto rounded-xl border border-slate-200 p-3">
              {users.length === 0 ? <p className="text-sm text-slate-500">No team members available.</p> : users.map((user) => (
                <label key={user._id} className="flex cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-slate-50">
                  <input type="checkbox" checked={members.includes(user._id)} onChange={() => toggleMember(user._id)} className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  <span className="flex-1"><span className="block text-sm font-medium text-slate-800">{user.name}</span><span className="block text-xs text-slate-500">{user.email} · {user.role}</span></span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2"><button type="button" onClick={onClose} className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button><button type="submit" className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">{isEditMode ? "Update Project" : "Create Project"}</button></div>
        </form>
      </div>
    </div>
  );
};

export default ProjectModal;
