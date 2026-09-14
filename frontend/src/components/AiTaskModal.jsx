import { Bot, X, CheckCircle2, CalendarDays } from "lucide-react";
import { useEffect, useState } from "react";

const AiTaskModal = ({
  projects = [],
  onClose,
  onGenerate,
  loading = false,
}) => {
  const [project, setProject] = useState(
    projects[0]?._id || ""
  );

  const [count, setCount] = useState("8");
  const [generatedTasks, setGeneratedTasks] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!project && projects.length > 0) {
      setProject(projects[0]._id);
    }
  }, [projects, project]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!project) {
      setError("Please select a project.");
      return;
    }

    setError("");
    setGeneratedTasks([]);

    try {
      const result = await onGenerate(
        project,
        Number(count)
      );

      console.log("AI generated tasks:", result);

      const tasks = Array.isArray(result)
        ? result
        : result?.data || [];

      if (!tasks.length) {
        setError(
          "AI did not generate any tasks. Please try again."
        );
        return;
      }

      setGeneratedTasks(tasks);
    } catch (err) {
      console.error("AI generation failed:", err);

      setError(
        err.message ||
          "Failed to generate AI tasks. Please try again."
      );
    }
  };

  const handleGenerateAgain = () => {
    setGeneratedTasks([]);
    setError("");
  };

  const formatDueDate = (date) => {
    if (!date) return "No due date";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "No due date";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-purple-100 p-3">
              <Bot
                size={22}
                className="text-purple-600"
              />
            </div>

            <div>
              <h2 className="font-bold text-slate-900">
                AI Task Generator
              </h2>

              <p className="text-sm text-slate-500">
                Generate practical development tasks using AI.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[calc(90vh-90px)] overflow-y-auto">

          {/* Generate Form */}
          {!generatedTasks.length && (
            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-5"
            >
              {/* Project */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Select project
                </label>

                <select
                  value={project}
                  onChange={(e) =>
                    setProject(e.target.value)
                  }
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 outline-none focus:border-purple-500"
                >
                  <option value="">
                    Select a project
                  </option>

                  {projects.map((item) => (
                    <option
                      key={item._id}
                      value={item._id}
                    >
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Number of tasks */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Number of tasks
                </label>

                <select
                  value={count}
                  onChange={(e) =>
                    setCount(e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 outline-none focus:border-purple-500"
                >
                  <option value="3">3 Tasks</option>
                  <option value="5">5 Tasks</option>
                  <option value="8">8 Tasks</option>
                  <option value="10">10 Tasks</option>
                  <option value="15">15 Tasks</option>
                </select>
              </div>

              {/* Information */}
              <div className="rounded-xl bg-purple-50 p-4 text-sm leading-6 text-purple-700">
                AI will analyze the project name and description
                and generate practical software development tasks
                with priority levels, status, and due dates.
              </div>

              {/* Important information */}
              <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm leading-6 text-green-700">
                Generated tasks will be automatically saved to
                your selected project.
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* Buttons */}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading || !project}
                  className="flex items-center gap-2 rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Bot size={17} />

                  {loading
                    ? "Generating..."
                    : "Generate Tasks"}
                </button>
              </div>
            </form>
          )}

          {/* Generated Tasks */}
          {generatedTasks.length > 0 && (
            <div className="space-y-5 p-5">

              {/* Success message */}
              <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2
                    size={22}
                    className="mt-0.5 text-green-600"
                  />

                  <div>
                    <h3 className="font-semibold text-green-900">
                      AI generated {generatedTasks.length} tasks
                    </h3>

                    <p className="mt-1 text-sm text-green-700">
                      These tasks have already been saved to
                      your selected project.
                    </p>
                  </div>
                </div>
              </div>

              {/* Task List */}
              <div className="space-y-3">
                {generatedTasks.map((task, index) => (
                  <div
                    key={task._id || index}
                    className="rounded-xl border border-slate-200 bg-white p-4"
                  >
                    <div className="flex items-start gap-3">

                      <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple-100">
                        <CheckCircle2
                          size={17}
                          className="text-purple-600"
                        />
                      </div>

                      <div className="min-w-0 flex-1">

                        {/* Title + Priority */}
                        <div className="flex flex-wrap items-start justify-between gap-2">

                          <h4 className="font-semibold text-slate-900">
                            {task.title}
                          </h4>

                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                              task.priority === "High"
                                ? "bg-red-100 text-red-700"
                                : task.priority === "Low"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {task.priority || "Medium"}
                          </span>
                        </div>

                        {/* Description */}
                        {task.description && (
                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            {task.description}
                          </p>
                        )}

                        {/* Task information */}
                        <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">

                          <span className="rounded-md bg-slate-100 px-2 py-1">
                            Status:{" "}
                            {task.status || "todo"}
                          </span>

                          <span className="flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1">
                            <CalendarDays size={13} />

                            Due:{" "}
                            {formatDueDate(
                              task.dueDate
                            )}
                          </span>

                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-slate-200 pt-4">

                <p className="text-sm text-slate-500">
                  {generatedTasks.length} tasks added
                </p>

                <div className="flex gap-3">

                  <button
                    type="button"
                    onClick={handleGenerateAgain}
                    className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Generate Again
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-purple-700"
                  >
                    Done
                  </button>

                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AiTaskModal;