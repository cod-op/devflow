import { FolderKanban } from "lucide-react";
import ProgressBar from "./ProgressBar";

const ProjectCard = ({ project }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

      <div className="mb-5 flex items-start justify-between">
        <div className="flex items-center gap-3">

          <div className={`rounded-xl p-3 ${project.color}`}>
            <FolderKanban className="h-5 w-5 text-white" />
          </div>

          <div>
            <h3 className="font-semibold text-slate-900">
              {project.name}
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              {project.description}
            </p>
          </div>

        </div>
      </div>

      <ProgressBar progress={project.progress} />

      <div className="mt-4 flex justify-between text-sm text-slate-500">
        <span>
          {project.completed} completed
        </span>

        <span>
          {project.total} total tasks
        </span>
      </div>

    </div>
  );
};

export default ProjectCard;