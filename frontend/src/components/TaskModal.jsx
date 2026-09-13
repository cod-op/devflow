import { X } from "lucide-react";
import { useEffect, useState } from "react";

const TaskModal = ({
  projects = [],
  onClose,
  onCreate,
}) => {
  const [title, setTitle] = useState("");
  const [project, setProject] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    if (projects.length > 0) {
      setProject(projects[0].name);
    } else {
      setProject("");
    }
  }, [projects]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      return;
    }

    if (!project) {
      return;
    }

    onCreate({
      title: title.trim(),
      project,
      priority,
      dueDate,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">

      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 p-5">

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Create Task
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Add a new task to a project.
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

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-5"
        >

          {/* Title */}
          <div>
            <label
              htmlFor="task-title"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Task title
            </label>

            <input
              id="task-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Build login page"
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500"
            />
          </div>

          {/* Project */}
          <div>
            <label
              htmlFor="task-project"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Project
            </label>

            <select
              id="task-project"
              value={project}
              onChange={(e) => setProject(e.target.value)}
              required
              disabled={projects.length === 0}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 outline-none focus:border-blue-500 disabled:bg-slate-100"
            >
              {projects.length === 0 ? (
                <option value="">
                  Create a project first
                </option>
              ) : (
                projects.map((item) => (
                  <option
                    key={item.id}
                    value={item.name}
                  >
                    {item.name}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Priority */}
          <div>
            <label
              htmlFor="task-priority"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Priority
            </label>

            <select
              id="task-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 outline-none focus:border-blue-500"
            >
              <option value="High">
                High
              </option>

              <option value="Medium">
                Medium
              </option>

              <option value="Low">
                Low
              </option>
            </select>
          </div>

          {/* Due Date */}
          <div>
            <label
              htmlFor="task-date"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Due date
            </label>

            <input
              id="task-date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500"
            />
          </div>

          {/* Buttons */}
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
              disabled={projects.length === 0}
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Create Task
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default TaskModal;