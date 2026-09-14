import {CalendarDays,CheckCircle2,Circle,Pencil,Trash2} from "lucide-react";

const TaskCard = ({ task, onToggle, onEdit, onDelete}) => {
  const completed = task.status === "done";

  const priorityStyle =
    task.priority === "High"
      ? "bg-red-50 text-red-600"
      : task.priority === "Medium"
      ? "bg-yellow-50 text-yellow-600"
      : "bg-green-50 text-green-600";

  const statusLabel =
    task.status === "todo"
      ? "Pending"
      : task.status === "in-progress"
      ? "In Progress"
      : "Completed";


  const formattedDueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      )
    : "No date";

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md lg:flex-row lg:items-center lg:justify-between">

      {/* Task information */}

      <div className="flex min-w-0 items-start gap-3">

        <button
          type="button"
          onClick={() =>
            onToggle(task._id)
          }
          className="mt-1 shrink-0 text-blue-600"
          title="Change task status"
        >
          {completed ? (
            <CheckCircle2 size={22} />
          ) : (
            <Circle size={22} />
          )}
        </button>

        <div className="min-w-0">

          <h3
            className={`font-semibold ${
              completed
                ? "text-slate-400 line-through"
                : "text-slate-900"
            }`}
          >
            {task.title}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {task.project?.name ||
              "No project"}
          </p>

          {task.description && (
            <p className="mt-1 max-w-xl text-xs text-slate-400">
              {task.description}
            </p>
          )}

          {task.assignedTo?.name && (
            <p className="mt-2 text-xs text-slate-500">
              Assigned to:{" "}
              <span className="font-semibold text-slate-700">
                {task.assignedTo.name}
              </span>
            </p>
          )}

        </div>
      </div>

      {/* Task metadata */}

      <div className="flex flex-wrap items-center gap-2 lg:justify-end">

        {/* Priority */}

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${priorityStyle}`}
        >
          {task.priority}
        </span>

        {/* Due Date */}

        <span className="flex items-center gap-1 text-xs text-slate-500">
          <CalendarDays size={14} />

          {formattedDueDate}
        </span>

        {/* Status */}

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          {statusLabel}
        </span>

        {/* Edit */}

        <button
          type="button"
          onClick={() => onEdit(task)}
          className="rounded-lg bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-100"
          title="Edit task"
        >
          <Pencil size={16} />
        </button>

        {/* Delete */}

        <button
          type="button"
          onClick={() =>
            onDelete(task._id)
          }
          className="rounded-lg bg-red-50 p-2 text-red-600 transition hover:bg-red-100"
          title="Delete task"
        >
          <Trash2 size={16} />
        </button>

      </div>
    </div>
  );
};

export default TaskCard;