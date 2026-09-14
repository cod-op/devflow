import { useEffect, useMemo, useState } from "react";

import {
  createProject,
  createTask,
  deleteProject,
  deleteTask,
  generateAITasks,
  getProjects,
  getTasks,
  getUsers,
  updateProject,
  updateTask,
  updateTaskStatus,
} from "../service/api.js";

import {Bot,ClipboardPlus,FolderPlus,Search} from "lucide-react";

import Sidebar from "../components/SideBar";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import ProjectCard from "../components/ProjectCard";
import TaskCard from "../components/TaskCard";
import ProjectModal from "../components/ProjectModal";
import TaskModal from "../components/TaskModal";
import AITaskModal from "../components/AiTaskModal";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [showProjectModal, setShowProjectModal] = useState(false);

  const [showTaskModal, setShowTaskModal] =useState(false);

  const [showAIModal, setShowAIModal] =useState(false);

  const [editingProject, setEditingProject] =useState(null);

  const [editingTask, setEditingTask] =useState(null);

  const [sidebarOpen, setSidebarOpen] =useState(false);
const [loading, setLoading] = useState(true);
const [aiLoading, setAiLoading] = useState(false);



  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const [projectResponse, taskResponse,userResponse] = await Promise.all([getProjects(),getTasks(),getUsers(),]);

        setProjects(
          Array.isArray(projectResponse)
            ? projectResponse
            : projectResponse?.data || []
        );

        setTasks(
          Array.isArray(taskResponse)
            ? taskResponse
            : taskResponse?.data || []
        );

        setUsers(
          Array.isArray(userResponse)
            ? userResponse
            : userResponse?.data || []
        );
      } catch (error) {
        console.error(
          "Failed to load dashboard data:",
          error
        );

        const message =
          error?.message?.toLowerCase() || "";

        if (
          message.includes("authorized") ||
          message.includes("token") ||
          message.includes("login")
        ) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // ==================== SEARCH + FILTER ====================

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const searchText =
        search.toLowerCase().trim();

      const projectName =
        task.project?.name || "";

      const taskTitle =
        task.title || "";

      const assignedUser =
        task.assignedTo?.name || "";

      const matchesSearch =
        taskTitle
          .toLowerCase()
          .includes(searchText) ||
        projectName
          .toLowerCase()
          .includes(searchText) ||
        assignedUser
          .toLowerCase()
          .includes(searchText);

      const matchesFilter =
        filter === "All" ||
        task.status === filter;

      return (
        matchesSearch &&
        matchesFilter
      );
    });
  }, [tasks, search, filter]);


  const totalProjects =
    projects.length;

  const totalTasks =
    tasks.length;

  const completedTasks =
    tasks.filter(
      (task) =>
        task.status === "done"
    ).length;

  const inProgressTasks =
    tasks.filter(
      (task) =>
        task.status === "in-progress"
    ).length;

  // ==================== PROJECT CREATE ====================

  const handleCreateProject = async (
    data
  ) => {
    try {
      const response =
        await createProject({
          name: data.name,
          description:
            data.description ||
            "New development project",
          status:
            data.status || "Planning",
        });

      const newProject =
        response.data || response;

      setProjects((current) => [
        newProject,
        ...current,
      ]);

      setShowProjectModal(false);

      alert(
        "Project created successfully!"
      );
    } catch (error) {
      console.error(
        "Create project failed:",
        error
      );

      alert(
        error.message ||
          "Failed to create project"
      );
    }
  };

  // ==================== PROJECT UPDATE ====================

  const handleUpdateProject = async (
    projectId,
    data
  ) => {
    try {
      const response =
        await updateProject(
          projectId,
          data
        );

      const updatedProject =
        response.data || response;

      setProjects((current) =>
        current.map((project) =>
          project._id === projectId
            ? updatedProject
            : project
        )
      );

      setEditingProject(null);
      setShowProjectModal(false);

      alert(
        "Project updated successfully!"
      );
    } catch (error) {
      console.error(
        "Update project failed:",
        error
      );

      alert(
        error.message ||
          "Failed to update project"
      );
    }
  };

  // ==================== PROJECT DELETE ====================

  const handleDeleteProject = async (
    projectId
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this project? All related tasks will also be deleted."
      );

    if (!confirmed) return;

    try {
      await deleteProject(projectId);

      setProjects((current) =>
        current.filter(
          (project) =>
            project._id !== projectId
        )
      );

      setTasks((current) =>
        current.filter(
          (task) =>
            task.project?._id !==
              projectId &&
            task.project !== projectId
        )
      );

      alert(
        "Project deleted successfully!"
      );
    } catch (error) {
      console.error(
        "Delete project failed:",
        error
      );

      alert(
        error.message ||
          "Failed to delete project"
      );
    }
  };

  // ==================== TASK CREATE ====================

  const handleCreateTask = async (
    data
  ) => {
    try {
      const response =
        await createTask({
          title: data.title,
          description:
            data.description || "",
          project: data.project,
          assignedTo:
            data.assignedTo || null,
          priority:
            data.priority || "Medium",
          status: "todo",
          dueDate:
            data.dueDate || null,
        });

      const newTask =
        response.data || response;

      setTasks((current) => [
        newTask,
        ...current,
      ]);

      setShowTaskModal(false);

      alert(
        "Task created successfully!"
      );
    } catch (error) {
      console.error(
        "Create task failed:",
        error
      );

      alert(
        error.message ||
          "Failed to create task"
      );
    }
  };

  // ==================== TASK UPDATE ====================

  const handleUpdateTask = async (
    taskId,
    data
  ) => {
    try {
      const response =
        await updateTask(
          taskId,
          data
        );

      const updatedTask =
        response.data || response;

      setTasks((current) =>
        current.map((task) =>
          task._id === taskId
            ? updatedTask
            : task
        )
      );

      setEditingTask(null);
      setShowTaskModal(false);

      alert(
        "Task updated successfully!"
      );
    } catch (error) {
      console.error(
        "Update task failed:",
        error
      );

      alert(
        error.message ||
          "Failed to update task"
      );
    }
  };

  // ==================== TASK DELETE ====================

  const handleDeleteTask = async (
    taskId
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this task?"
      );

    if (!confirmed) return;

    try {
      await deleteTask(taskId);

      setTasks((current) =>
        current.filter(
          (task) =>
            task._id !== taskId
        )
      );

      alert(
        "Task deleted successfully!"
      );
    } catch (error) {
      console.error(
        "Delete task failed:",
        error
      );

      alert(
        error.message ||
          "Failed to delete task"
      );
    }
  };

  // ==================== TOGGLE TASK ====================

  const handleToggleTask = async (
    taskId
  ) => {
    try {
      const selectedTask =
        tasks.find(
          (task) =>
            task._id === taskId
        );

      if (!selectedTask) return;

      const newStatus =
        selectedTask.status === "done"
          ? "todo"
          : "done";

      const response =
        await updateTaskStatus(
          taskId,
          newStatus
        );

      const updatedTask =
        response.data || response;

      setTasks((current) =>
        current.map((task) =>
          task._id === taskId
            ? {
                ...task,
                ...updatedTask,
              }
            : task
        )
      );
    } catch (error) {
      console.error(
        "Update task status failed:",
        error
      );

      alert(
        error.message ||
          "Failed to update task"
      );
    }
  };

  // ==================== AI TASK GENERATION ====================

const handleGenerateAITasks = async (projectId, count) => {
  try {
    setAiLoading(true);

    const response = await generateAITasks(projectId, count);

    console.log("AI generated tasks:", response);

    const generatedTasks = response?.data || [];

    // Backend already saves AI tasks in MongoDB.
    // We only update the frontend state here.
    setTasks((currentTasks) => [
      ...generatedTasks,
      ...currentTasks,
    ]);

    return generatedTasks;
  } catch (error) {
    console.error("AI generation failed:", error);
    throw error;
  } finally {
    setAiLoading(false);
  }
};


  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

          <p className="mt-4 text-sm text-slate-500">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  // ==================== UI ====================

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">

        <Sidebar
          isOpen={sidebarOpen}
          onClose={() =>
            setSidebarOpen(false)
          }
        />

        <div className="min-w-0 flex-1 overflow-x-hidden">

          <Navbar
            onMenuClick={() =>
              setSidebarOpen(true)
            }
          />

          <main className="p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">

              {/* HEADER */}

              <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                <div>
                  <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                    Developer Dashboard
                  </h1>

                  <p className="mt-1 text-sm text-slate-500 sm:text-base">
                    Manage your projects and
                    development tasks.
                  </p>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">

                  <button
                    type="button"
                    onClick={() => {
                      setEditingProject(null);
                      setShowProjectModal(true);
                    }}
                    className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                  >
                    <FolderPlus size={18} />
                    New Project
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingTask(null);
                      setShowTaskModal(true);
                    }}
                    disabled={
                      projects.length === 0
                    }
                    className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ClipboardPlus size={18} />
                    New Task
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setShowAIModal(true)
                    }
                    disabled={
                      projects.length === 0
                    }
                    className="flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Bot size={18} />
                    AI Generate
                  </button>

                </div>
              </div>

              {/* STATS */}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                <StatCard
                  title="Total Projects"
                  value={totalProjects}
                  type="projects"
                />

                <StatCard
                  title="Total Tasks"
                  value={totalTasks}
                  type="tasks"
                />

                <StatCard
                  title="Completed Tasks"
                  value={completedTasks}
                  type="completed"
                />

                <StatCard
                  title="In Progress"
                  value={inProgressTasks}
                  type="progress"
                />

              </div>

              {/* PROJECTS */}

              <section
                id="projects"
                className="mt-10 scroll-mt-20"
              >
                <div className="mb-5">
                  <h2 className="text-xl font-bold text-slate-900">
                    Projects
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Your development projects
                  </p>
                </div>

                {projects.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">

                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                      <FolderPlus
                        size={22}
                        className="text-slate-500"
                      />
                    </div>

                    <h3 className="mt-4 font-semibold text-slate-900">
                      No projects yet
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Create your first project
                      to get started.
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        setEditingProject(null);
                        setShowProjectModal(true);
                      }}
                      className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                      Create Project
                    </button>

                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

                    {projects.map((project) => (
                      <ProjectCard
                        key={project._id}
                        project={project}
                        onEdit={(item) => {
                          setEditingProject(item);
                          setShowProjectModal(true);
                        }}
                        onDelete={handleDeleteProject}
                        onView={(item) => {
                          alert(
                            `${item.name}\n\n${
                              item.description ||
                              "No description"
                            }\n\nStatus: ${
                              item.status
                            }`
                          );
                        }}
                      />
                    ))}

                  </div>
                )}
              </section>

              {/* TASKS */}

              <section
                id="tasks"
                className="mt-10 scroll-mt-20"
              >
                <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      Recent Tasks
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Track your development work
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row">

                    <div className="relative">
                      <Search
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type="text"
                        value={search}
                        onChange={(e) =>
                          setSearch(
                            e.target.value
                          )
                        }
                        placeholder="Search tasks..."
                        className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-64"
                      />
                    </div>

                    <select
                      value={filter}
                      onChange={(e) =>
                        setFilter(
                          e.target.value
                        )
                      }
                      className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="All">
                        All
                      </option>

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

                {filteredTasks.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">

                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                      <ClipboardPlus
                        size={22}
                        className="text-slate-500"
                      />
                    </div>

                    <h3 className="mt-4 font-semibold text-slate-900">
                      No tasks found
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Try changing your search
                      or filter.
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        setSearch("");
                        setFilter("All");
                      }}
                      className="mt-4 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Clear Filter
                    </button>

                  </div>
                ) : (
                  <div className="space-y-3">

                    {filteredTasks.map(
                      (task) => (
                        <TaskCard
                          key={task._id}
                          task={task}
                          onToggle={
                            handleToggleTask
                          }
                          onEdit={(item) => {
                            setEditingTask(item);
                            setShowTaskModal(true);
                          }}
                          onDelete={
                            handleDeleteTask
                          }
                        />
                      )
                    )}

                  </div>
                )}

              </section>

            </div>
          </main>
        </div>
      </div>

      {/* PROJECT MODAL */}

      {showProjectModal && (
        <ProjectModal
          project={editingProject}
          onClose={() => {
            setShowProjectModal(false);
            setEditingProject(null);
          }}
          onCreate={
            handleCreateProject
          }
          onUpdate={
            handleUpdateProject
          }
        />
      )}

      {/* TASK MODAL */}

      {showTaskModal && (
        <TaskModal
          task={editingTask}
          projects={projects}
          users={users}
          onClose={() => {
            setShowTaskModal(false);
            setEditingTask(null);
          }}
          onCreate={
            handleCreateTask
          }
          onUpdate={
            handleUpdateTask
          }
        />
      )}

      {/* AI MODAL */}

      {showAIModal && (
  <AITaskModal
    projects={projects}
    onClose={() =>
      setShowAIModal(false)
    }
    onGenerate={handleGenerateAITasks}
    loading={aiLoading}
  />
)}

    </div>
  );
};

export default Dashboard;