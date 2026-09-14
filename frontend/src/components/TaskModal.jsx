import { X } from "lucide-react";
import { useEffect, useState } from "react";

const TaskModal = ({
  projects = [],
  users = [],
  task = null,
  onClose,
  onCreate,
  onUpdate,
}) => {
  const isEditMode = Boolean(task);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [project, setProject] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("todo");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");

      setProject(
        task.project?._id ||
          task.project ||
          ""
      );

      setAssignedTo(
        task.assignedTo?._id ||
          task.assignedTo ||
          ""
      );

      setPriority(task.priority || "Medium");
      setStatus(task.status || "todo");

      setDueDate(
        task.dueDate
          ? new Date(task.dueDate)
              .toISOString()
              .split("T")[0]
          : ""
      );
    } else {
      setTitle("");
      setDescription("");

      setProject(
        projects.length > 0
          ? projects[0]._id
          : ""
      );

      setAssignedTo("");
      setPriority("Medium");
      setStatus("todo");
      setDueDate("");
    }
  }, [task, projects]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      return;
    }

    if (!project) {
      return;
    }

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      project,
      assignedTo: assignedTo || null,
      priority,
      status,
      dueDate: dueDate || null,
    };

    if (isEditMode) {
      onUpdate(task._id, taskData);
    } else {
      onCreate(taskData);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/40 p-4">

      <div className="my-8 w-full max-w-lg rounded-2xl bg-white shadow-xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-slate-200 p-5">

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {isEditMode
                ? "Edit Task"
                : "Create Task"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {isEditMode
                ? "Update task details."
                : "Add a new task to your project."}
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
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="e.g. Build login page"
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none transition focus:border-blue-500"
            />
          </div>

          {/* Description */}

          <div>
            <label
              htmlFor="task-description"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Description
            </label>

            <textarea
              id="task-description"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              rows="3"
              placeholder="Describe the task..."
              className="w-full resize-none rounded-lg border border-slate-300 px-4 py-2.5 outline-none transition focus:border-blue-500"
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
              onChange={(e) =>
                setProject(e.target.value)
              }
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
                    key={item._id}
                    value={item._id}
                  >
                    {item.name}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Assignment */}

          <div>
            <label
              htmlFor="task-assigned"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Assign to
            </label>

            <select
              id="task-assigned"
              value={assignedTo}
              onChange={(e) =>
                setAssignedTo(e.target.value)
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 outline-none focus:border-blue-500"
            >
              <option value="">
                Unassigned
              </option>

              {users.map((user) => (
                <option
                  key={user._id}
                  value={user._id}
                >
                  {user.name} — {user.role}
                </option>
              ))}
            </select>
          </div>

          {/* Priority + Status */}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

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
                onChange={(e) =>
                  setPriority(e.target.value)
                }
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

            <div>
              <label
                htmlFor="task-status"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Status
              </label>

              <select
                id="task-status"
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value)
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 outline-none focus:border-blue-500"
              >
                <option value="todo">
                  Pending
                </option>

                <option value="in-progress">
                  In Progress
                </option>

                <option value="done">
                  Completed
                </option>
              </select>
            </div>

          </div>

          {/* Due date */}

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
              onChange={(e) =>
                setDueDate(e.target.value)
              }
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500"
            />
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
              disabled={!project}
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isEditMode
                ? "Update Task"
                : "Create Task"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default TaskModal;