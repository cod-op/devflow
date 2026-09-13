import { useMemo, useState } from "react";

import {
  ClipboardPlus,
  FolderPlus,
  Search,
} from "lucide-react";

import {
  projects as initialProjects,
  initialTasks,
} from "../data/mockData";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import ProjectCard from "../components/ProjectCard";
import TaskCard from "../components/TaskCard";
import ProjectModal from "../components/ProjectModal";
import TaskModal from "../components/TaskModal";

const Dashboard = () => {
  // ==========================================
  // PROJECTS
  // ==========================================

  const [projects, setProjects] = useState(
    initialProjects
  );

  // ==========================================
  // TASKS
  // ==========================================

  const [tasks, setTasks] = useState(
    initialTasks
  );

  // ==========================================
  // SEARCH
  // ==========================================

  const [search, setSearch] = useState("");

  // ==========================================
  // FILTER
  // ==========================================

  const [filter, setFilter] = useState("All");

  // ==========================================
  // MODALS
  // ==========================================

  const [showProjectModal, setShowProjectModal] =
    useState(false);

  const [showTaskModal, setShowTaskModal] =
    useState(false);

  // ==========================================
  // SIDEBAR
  // ==========================================

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  // ==========================================
  // FILTER TASKS
  // ==========================================

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const searchText =
        search.toLowerCase().trim();

      const matchesSearch =
        task.title
          .toLowerCase()
          .includes(searchText) ||
        task.project
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

  // ==========================================
  // STATISTICS
  // ==========================================

  const totalProjects = projects.length;

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) =>
      task.status === "Completed"
  ).length;

  const inProgressTasks = tasks.filter(
    (task) =>
      task.status === "In Progress"
  ).length;

  // ==========================================
  // CREATE PROJECT
  // ==========================================

  const handleCreateProject = (data) => {
    const newProject = {
      id: Date.now(),

      name: data.name,

      description:
        data.description ||
        "New development project",

      completed: 0,

      total: 0,

      progress: 0,

      color:
        data.color ||
        "bg-blue-500",
    };

    setProjects((currentProjects) => [
      ...currentProjects,
      newProject,
    ]);

    setShowProjectModal(false);
  };

  // ==========================================
  // CREATE TASK
  // ==========================================

  const handleCreateTask = (data) => {
    const newTask = {
      id: Date.now(),

      title: data.title,

      project: data.project,

      priority: data.priority,

      status: "Pending",

      dueDate: data.dueDate || "",
    };

    // Add task
    setTasks((currentTasks) => [
      newTask,
      ...currentTasks,
    ]);

    // Update project task count
    setProjects((currentProjects) =>
      currentProjects.map((project) => {
        if (
          project.name !== data.project
        ) {
          return project;
        }

        const newTotal =
          project.total + 1;

        const newProgress =
          newTotal > 0
            ? Math.round(
                (project.completed /
                  newTotal) *
                  100
              )
            : 0;

        return {
          ...project,

          total: newTotal,

          progress: newProgress,
        };
      })
    );

    setShowTaskModal(false);
  };

  // ==========================================
  // TOGGLE TASK
  // ==========================================

  const handleToggleTask = (taskId) => {
    const selectedTask = tasks.find(
      (task) =>
        task.id === taskId
    );

    if (!selectedTask) {
      return;
    }

    const wasCompleted =
      selectedTask.status ===
      "Completed";

    const newStatus = wasCompleted
      ? "Pending"
      : "Completed";

    // Update task status
    setTasks((currentTasks) =>
      currentTasks.map((task) => {
        if (task.id !== taskId) {
          return task;
        }

        return {
          ...task,
          status: newStatus,
        };
      })
    );

    // Update project progress
    setProjects((currentProjects) =>
      currentProjects.map((project) => {
        if (
          project.name !==
          selectedTask.project
        ) {
          return project;
        }

        const newCompleted =
          Math.max(
            0,
            project.completed +
              (wasCompleted
                ? -1
                : 1)
          );

        const newProgress =
          project.total > 0
            ? Math.min(
                100,
                Math.round(
                  (newCompleted /
                    project.total) *
                    100
                )
              )
            : 0;

        return {
          ...project,

          completed:
            newCompleted,

          progress:
            newProgress,
        };
      })
    );
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-50">

      {/* =====================================
          PAGE LAYOUT
      ====================================== */}

      <div className="flex min-h-screen">

        {/* ===================================
            SIDEBAR
        ==================================== */}

        <Sidebar
          isOpen={sidebarOpen}
          onClose={() =>
            setSidebarOpen(false)
          }
        />

        {/* ===================================
            MAIN CONTENT
        ==================================== */}

        <div className="min-w-0 flex-1 overflow-x-hidden">

          {/* Navbar */}

          <Navbar
            onMenuClick={() =>
              setSidebarOpen(true)
            }
          />

          {/* Main */}

          <main className="p-4 sm:p-6 lg:p-8">

            <div className="mx-auto max-w-7xl">

              {/* =================================
                  HEADER
              ================================== */}

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

                {/* Buttons */}

                <div className="flex flex-col gap-2 sm:flex-row">

                  {/* New Project */}

                  <button
                    type="button"
                    onClick={() =>
                      setShowProjectModal(
                        true
                      )
                    }
                    className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                  >
                    <FolderPlus
                      size={18}
                    />

                    New Project
                  </button>

                  {/* New Task */}

                  <button
                    type="button"
                    onClick={() =>
                      setShowTaskModal(true)
                    }
                    className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                  >
                    <ClipboardPlus
                      size={18}
                    />

                    New Task
                  </button>

                </div>
              </div>

              {/* =================================
                  STATISTICS
              ================================== */}

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

              {/* =================================
                  PROJECT SECTION
              ================================== */}

              <section
                id="projects"
                className="mt-10 scroll-mt-20"
              >

                <div className="mb-5">
                  <h2 className="text-xl font-bold text-slate-900">
                    Projects
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Your active development
                    projects
                  </p>
                </div>

                {projects.length === 0 ? (

                  /* Empty Project */

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
                      onClick={() =>
                        setShowProjectModal(
                          true
                        )
                      }
                      className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                      Create Project
                    </button>

                  </div>

                ) : (

                  /* Projects */

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

                    {projects.map(
                      (project) => (
                        <ProjectCard
                          key={project.id}
                          project={project}
                        />
                      )
                    )}

                  </div>
                )}

              </section>

              {/* =================================
                  TASK SECTION
              ================================== */}

              <section
                id="tasks"
                className="mt-10 scroll-mt-20"
              >

                {/* Task Header */}

                <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      Recent Tasks
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Track your development
                      work
                    </p>
                  </div>

                  {/* Search + Filter */}

                  <div className="flex flex-col gap-2 sm:flex-row">

                    {/* Search */}

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

                    {/* Filter */}

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

                      <option value="Pending">
                        Pending
                      </option>

                      <option value="In Progress">
                        In Progress
                      </option>

                      <option value="Completed">
                        Completed
                      </option>
                    </select>

                  </div>
                </div>

                {/* =================================
                    TASK LIST
                ================================== */}

                {filteredTasks.length === 0 ? (

                  /* Empty Tasks */

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

                  /* Task Cards */

                  <div className="space-y-3">

                    {filteredTasks.map(
                      (task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onToggle={
                            handleToggleTask
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

      {/* =====================================
          PROJECT MODAL
      ====================================== */}

      {showProjectModal && (
        <ProjectModal
          onClose={() =>
            setShowProjectModal(false)
          }
          onCreate={
            handleCreateProject
          }
        />
      )}

      {/* =====================================
          TASK MODAL
      ====================================== */}

      {showTaskModal && (
        <TaskModal
          projects={projects}
          onClose={() =>
            setShowTaskModal(false)
          }
          onCreate={handleCreateTask}
        />
      )}

    </div>
  );
};

export default Dashboard;