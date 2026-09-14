import { X } from "lucide-react";
import { useEffect, useState } from "react";

const ProjectModal = ({project,onClose,onCreate,onUpdate}) => {
  const isEditMode = Boolean(project);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Planning");

  useEffect(() => {
    if (project) {
      setName(project.name || "");
      setDescription(
        project.description || ""
      );
      setStatus(
        project.status || "Planning"
      );
    } else {
      setName("");
      setDescription("");
      setStatus("Planning");
    }
  }, [project]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      return;
    }

    const projectData = {
      name: name.trim(),
      description: description.trim(),
      status,
    };

    if (isEditMode) {
      onUpdate(
        project._id,
        projectData
      );
    } else {
      onCreate(projectData);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">

      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-slate-200 p-5">

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {isEditMode
                ? "Edit Project"
                : "Create Project"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {isEditMode
                ? "Update your project details."
                : "Add a new project to your dashboard."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
          >
            <X size={20} />
          </button>

        </div>

        {/* Form */}

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-5"
        >

          {/* Name */}

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
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="e.g. DevFlow"
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none transition focus:border-blue-500"
            />
          </div>

          {/* Description */}

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
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              placeholder="Describe your project"
              rows="4"
              className="w-full resize-none rounded-lg border border-slate-300 px-4 py-2.5 outline-none transition focus:border-blue-500"
            />
          </div>

          {/* Status */}

          <div>
            <label
              htmlFor="project-status"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Status
            </label>

            <select
              id="project-status"
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 outline-none focus:border-blue-500"
            >
              <option value="Planning">
                Planning
              </option>

              <option value="Active">
                Active
              </option>

              <option value="Completed">
                Completed
              </option>
            </select>
          </div>

          {/* Buttons */}

          <div className="flex justify-end gap-3 pt-2">

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              {isEditMode
                ? "Update Project"
                : "Create Project"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default ProjectModal;