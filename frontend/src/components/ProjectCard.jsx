import {FolderKanban,Pencil,Trash2,Eye} from "lucide-react";

const ProjectCard = ({ project,onEdit,onDelete,onView}) => {
  const statusStyle =
    project.status === "Completed"
      ? "bg-green-50 text-green-600"
      : project.status === "Active"
      ? "bg-blue-50 text-blue-600"
      : "bg-yellow-50 text-yellow-600";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

      {/* Header */}

      <div className="flex items-start gap-3">

        <div className="rounded-xl bg-blue-600 p-3">
          <FolderKanban
            className="h-5 w-5 text-white"
          />
        </div>

        <div className="min-w-0 flex-1">

          <h3 className="truncate font-semibold text-slate-900">
            {project.name}
          </h3>

          <p className="mt-1 line-clamp-2 text-sm text-slate-500">
            {project.description ||
              "No description"}
          </p>

        </div>
      </div>

      {/* Status */}

      <div className="mt-5">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle}`}
        >
          {project.status}
        </span>
      </div>

      {/* Owner */}

      <div className="mt-4 text-sm text-slate-500">
        Owner:{" "}

        <span className="font-medium text-slate-700">
          {project.owner?.name ||
            "Not assigned"}
        </span>
      </div>

      {/* Actions */}

      <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4">

        <button
          type="button"
          onClick={() =>
            onView(project)
          }
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
        >
          <Eye size={16} />
          View
        </button>

        <button
          type="button"
          onClick={() =>
            onEdit(project)
          }
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-100"
        >
          <Pencil size={16} />
          Edit
        </button>

        <button
          type="button"
          onClick={() =>
            onDelete(project._id)
          }
          className="flex items-center justify-center rounded-lg bg-red-50 p-2 text-red-500 transition hover:bg-red-100"
          title="Delete project"
        >
          <Trash2 size={17} />
        </button>

      </div>
    </div>
  );
};

export default ProjectCard;