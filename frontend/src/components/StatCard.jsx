import {CheckCircle2,Clock3,FolderKanban,ListTodo} from "lucide-react";

const icons = {
  projects: FolderKanban,
  tasks: ListTodo,
  completed: CheckCircle2,
  progress: Clock3,
};

const StatCard = ({title,value,type,}) => {
  const Icon =icons[type] || ListTodo;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h3 className="mt-2 text-2xl font-bold text-slate-900">
            {value}
          </h3>
        </div>

        <div className="rounded-xl bg-blue-50 p-3">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>

      </div>

    </div>
  );
};

export default StatCard;