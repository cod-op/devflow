import {
  CalendarDays,
  CheckCircle2,
  Circle,
} from "lucide-react";

const TaskCard = ({ task, onToggle }) => {
  const completed = task.status === "Completed";

  const priorityStyle =
    task.priority === "High"
      ? "bg-red-50 text-red-600"
      : task.priority === "Medium"
      ? "bg-yellow-50 text-yellow-600"
      : "bg-green-50 text-green-600";

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">

      <div className="flex items-start gap-3">

        <button
          type="button"
          onClick={() => onToggle(task.id)}
          className="mt-1 shrink-0 text-blue-600"
          title="Change task status"
        >
          {completed ? (
            <CheckCircle2 size={22} />
          ) : (
            <Circle size={22} />
          )}
        </button>

        <div>
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
            {task.project}
          </p>
        </div>

      </div>

      <div className="flex flex-wrap items-center gap-3 sm:justify-end">

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${priorityStyle}`}
        >
          {task.priority}
        </span>

        <span className="flex items-center gap-1 text-xs text-slate-500">
          <CalendarDays size={14} />
          {task.dueDate || "No date"}
        </span>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          {task.status}
        </span>

      </div>

    </div>
  );
};

export default TaskCard;