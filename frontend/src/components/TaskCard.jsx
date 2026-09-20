import { CalendarDays, CheckCircle2, Circle, Clock3, Pencil, Trash2 } from "lucide-react";

const STATUS_META = {
  todo: { label: "Pending", className: "bg-slate-100 text-slate-600", icon: Circle },
  "in-progress": { label: "In Progress", className: "bg-amber-50 text-amber-700", icon: Clock3 },
  done: { label: "Completed", className: "bg-emerald-50 text-emerald-700", icon: CheckCircle2 },
};

const TaskCard = ({ task, onStatusChange, onEdit, onDelete }) => {
  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  })();

  const userId = String(currentUser?._id || currentUser?.id || "");
  const ownerId = String(task.project?.owner?._id || task.project?.owner || "");
  const assigneeId = String(task.assignedTo?._id || task.assignedTo || "");
  const isOwner = Boolean(userId && ownerId && userId === ownerId);
  const isAssignee = Boolean(userId && assigneeId && userId === assigneeId);
  const canManage = isOwner;
  const canChangeStatus = isOwner || isAssignee;

  const completed = task.status === "done";
  const priorityStyle =
    task.priority === "High"
      ? "bg-red-50 text-red-600"
      : task.priority === "Medium"
      ? "bg-yellow-50 text-yellow-700"
      : "bg-green-50 text-green-700";

  const status = STATUS_META[task.status] || STATUS_META.todo;
  const StatusIcon = status.icon;

  const formattedDueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "No date";

  const overdue = task.dueDate && !completed && new Date(task.dueDate) < new Date();

  const handleStatusClick = () => {
    if (!canChangeStatus) return;
    const next = task.status === "todo" ? "in-progress" : task.status === "in-progress" ? "done" : "todo";
    onStatusChange(task._id, next);
  };

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md lg:flex-row lg:items-center lg:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <button
          type="button"
          onClick={handleStatusClick}
          disabled={!canChangeStatus}
          aria-label={`Change status for ${task.title}`}
          title={canChangeStatus ? "Click to move task to the next status" : "Only the owner or assignee can change status"}
          className="mt-1 shrink-0 rounded-full text-blue-600 outline-none transition hover:scale-105 focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <StatusIcon size={22} />
        </button>

        <div className="min-w-0">
          <h3 className={`font-semibold ${completed ? "text-slate-400 line-through" : "text-slate-900"}`}>
            {task.title}
          </h3>

          <p className="mt-1 text-sm text-slate-500">{task.project?.name || "No project"}</p>

          {task.description && <p className="mt-1 max-w-xl text-xs leading-5 text-slate-400">{task.description}</p>}

          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            {task.assignedTo?.name ? (
              <span>
                Assigned to <span className="font-semibold text-slate-700">{task.assignedTo.name}</span>
              </span>
            ) : (
              <span className="rounded-full bg-slate-100 px-2 py-1">Unassigned</span>
            )}
            {isAssignee && !isOwner && (
              <span className="rounded-full bg-blue-50 px-2 py-1 font-medium text-blue-700">Your task</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 lg:justify-end">
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${priorityStyle}`}>{task.priority}</span>

        <span className={`flex items-center gap-1 text-xs ${overdue ? "font-semibold text-red-600" : "text-slate-500"}`}>
          <CalendarDays size={14} />
          {overdue ? "Overdue · " : ""}{formattedDueDate}
        </span>

        <button
          type="button"
          onClick={handleStatusClick}
          disabled={!canChangeStatus}
          className={`rounded-full px-3 py-1 text-xs font-semibold transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-60 ${status.className}`}
          title={canChangeStatus ? "Advance status" : "You cannot change this task"}
        >
          {status.label}
        </button>

        {canManage && (
          <>
            <button type="button" onClick={() => onEdit(task)} className="rounded-lg bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-100" title="Edit task" aria-label="Edit task">
              <Pencil size={16} />
            </button>
            <button type="button" onClick={() => onDelete(task._id)} className="rounded-lg bg-red-50 p-2 text-red-600 transition hover:bg-red-100" title="Delete task" aria-label="Delete task">
              <Trash2 size={16} />
            </button>
          </>
        )}
      </div>
    </article>
  );
};

export default TaskCard;
