import { X } from "lucide-react";
import { useState } from "react";

const ProjectModal = ({ onClose, onCreate }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("bg-blue-500");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      return;
    }

    onCreate({
      name: name.trim(),
      description: description.trim() || "New project",
      color,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">

      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">

        <div className="flex items-center justify-between border-b border-slate-200 p-5">

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Create Project
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Add a new project to your dashboard.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            <X size={20} />
          </button>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-5"
        >

          <div>
            <label
              htmlFor="project-name"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Project name
            </label>

            <input
              id="project-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. AI Productivity App"
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="project-description"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Description
            </label>

            <textarea
              id="project-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your project"
              rows="3"
              className="w-full resize-none rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="project-color"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Project color
            </label>

            <select
              id="project-color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500"
            >
              <option value="bg-blue-500">Blue</option>
              <option value="bg-purple-500">Purple</option>
              <option value="bg-green-500">Green</option>
              <option value="bg-orange-500">Orange</option>
              <option value="bg-pink-500">Pink</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2">

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Create Project
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default ProjectModal;