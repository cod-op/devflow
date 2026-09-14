import { useEffect, useState } from "react";

import {BarChart3,CheckCircle2,Clock3,FolderKanban,ListTodo,TrendingUp,} from "lucide-react";

import {Bar,BarChart,CartesianGrid,Cell,Legend,Pie,PieChart,ResponsiveContainer,Tooltip,XAxis,YAxis} from "recharts";

import Sidebar from "../components/SideBar";
import Navbar from "../components/Navbar";
import { getAnalytics } from "../service/api.js";


const STATUS_COLORS = {
  todo: "#3B82F6",          // Blue
  "in-progress": "#F59E0B", // Orange
  done: "#10B981",          // Green
};

const PRIORITY_COLORS = {
  low: "#10B981",
  medium: "#F59E0B",
  high: "#EF4444",
};


const normalizeStatus = (status = "") => {
  const value = String(status)
    .toLowerCase()
    .trim();

  if (
    value === "in progress" ||
    value === "in_progress" ||
    value === "inprogress"
  ) {
    return "in-progress";
  }

  if (
    value === "completed" ||
    value === "complete"
  ) {
    return "done";
  }

  if (value === "pending") {
    return "todo";
  }

  return value;
};

const normalizePriority = (priority = "") => {
  return String(priority)
    .toLowerCase()
    .trim();
};

const hasChartData = (data) => {
  return (
    Array.isArray(data) &&
    data.some(
      (item) => Number(item.value) > 0
    )
  );
};


const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);

        const response = await getAnalytics();

        setAnalytics(response);
      } catch (error) {
        console.error(
          "Failed to load analytics:",
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

    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

          <p className="mt-4 text-sm font-medium text-slate-500">
            Loading analytics...
          </p>
        </div>
      </div>
    );
  }



  if (!analytics) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-50">
            <BarChart3
              size={24}
              className="text-red-500"
            />
          </div>

          <h2 className="mt-4 text-lg font-bold text-slate-900">
            Analytics unavailable
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Unable to load analytics data.
          </p>
        </div>
      </div>
    );
  }



  const summary = analytics.summary || {};

  const statusDistribution =
    Array.isArray(
      analytics.statusDistribution
    )
      ? analytics.statusDistribution
      : [];

  const priorityDistribution =
    Array.isArray(
      analytics.priorityDistribution
    )
      ? analytics.priorityDistribution
      : [];

  const projectPerformance =
    Array.isArray(
      analytics.projectPerformance
    )
      ? analytics.projectPerformance
      : [];



  const statusChartData =
    statusDistribution.map(
      (entry, index) => {
        const key = normalizeStatus(
          entry.name
        );

        return {
          id: `status-${index}`,
          key,
          name:
            key === "todo"
              ? "Todo"
              : key === "in-progress"
              ? "In Progress"
              : key === "done"
              ? "Done"
              : entry.name,

          value:
            Number(entry.value) || 0,

          color:
            STATUS_COLORS[key] ||
            "#6366F1",
        };
      }
    );


  const priorityChartData =
    priorityDistribution.map(
      (entry, index) => {
        const key = normalizePriority(
          entry.name
        );

        return {
          id: `priority-${index}`,
          key,

          name:
            key === "low"
              ? "Low"
              : key === "medium"
              ? "Medium"
              : key === "high"
              ? "High"
              : entry.name,

          value:
            Number(entry.value) || 0,

          color:
            PRIORITY_COLORS[key] ||
            "#6366F1",
        };
      }
    );


  const totalStatusTasks =
    statusChartData.reduce(
      (total, item) =>
        total + item.value,
      0
    );

  const totalPriorityTasks =
    priorityChartData.reduce(
      (total, item) =>
        total + item.value,
      0
    );

  const completionRate = Math.min(
    100,
    Math.max(
      0,
      Number(summary.completionRate) || 0
    )
  );


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


              <div className="mb-8">

                <div className="flex items-center gap-3">

                  <div className="rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 p-3 shadow-lg shadow-blue-500/20">

                    <BarChart3
                      size={24}
                      className="text-white"
                    />

                  </div>

                  <div>

                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                      Analytics
                    </h1>

                    <p className="mt-1 text-sm text-slate-500 sm:text-base">
                      Track project and task performance.
                    </p>

                  </div>

                </div>

              </div>



              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                <Stat
                  title="Total Projects"
                  value={
                    summary.totalProjects || 0
                  }
                  icon={
                    <FolderKanban size={22} />
                  }
                  iconClass="bg-blue-50 text-blue-600"
                />

                <Stat
                  title="Total Tasks"
                  value={
                    summary.totalTasks || 0
                  }
                  icon={
                    <ListTodo size={22} />
                  }
                  iconClass="bg-purple-50 text-purple-600"
                />

                <Stat
                  title="Completed Tasks"
                  value={
                    summary.completed || 0
                  }
                  icon={
                    <CheckCircle2 size={22} />
                  }
                  iconClass="bg-emerald-50 text-emerald-600"
                />

                <Stat
                  title="In Progress"
                  value={
                    summary.inProgress || 0
                  }
                  icon={
                    <Clock3 size={22} />
                  }
                  iconClass="bg-orange-50 text-orange-600"
                />

              </div>

  
              <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                <div className="flex items-center justify-between">

                  <div>

                    <h2 className="text-lg font-bold text-slate-900">
                      Overall Progress
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Task completion across all projects
                    </p>

                  </div>

                  <TrendingUp
                    size={22}
                    className="text-blue-600"
                  />

                </div>

                <div className="mt-6">

                  <div className="mb-2 flex justify-between text-sm">

                    <span className="font-medium text-slate-600">
                      Completion rate
                    </span>

                    <span className="font-bold text-slate-900">
                      {completionRate}%
                    </span>

                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">

                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-700"
                      style={{
                        width: `${completionRate}%`,
                      }}
                    />

                  </div>

                </div>

                {/* Metrics */}

                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">

                  <Metric
                    label="Pending"
                    value={
                      summary.pending || 0
                    }
                    className="text-blue-600"
                    bgClass="bg-blue-50"
                  />

                  <Metric
                    label="In Progress"
                    value={
                      summary.inProgress || 0
                    }
                    className="text-orange-500"
                    bgClass="bg-orange-50"
                  />

                  <Metric
                    label="Completed"
                    value={
                      summary.completed || 0
                    }
                    className="text-emerald-600"
                    bgClass="bg-emerald-50"
                  />

                </div>

              </section>


              <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">


                <ChartCard
                  title="Task Status"
                  description="Distribution of tasks by status"
                >

                  {hasChartData(
                    statusChartData
                  ) ? (
                    <div className="relative">

                      <ResponsiveContainer
                        width="100%"
                        height={330}
                      >

                        <PieChart>

                          <Pie
                            data={
                              statusChartData
                            }
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="48%"
                            outerRadius={105}
                            innerRadius={58}
                            paddingAngle={4}
                            stroke="#FFFFFF"
                            strokeWidth={3}
                            labelLine={false}
                            label={({
                              percent,
                            }) =>
                              percent >=
                              0.05
                                ? `${Math.round(
                                    percent *
                                      100
                                  )}%`
                                : ""
                            }
                          >

                            {statusChartData.map(
                              (
                                entry,
                                index
                              ) => (
                                <Cell
                                  key={
                                    entry.id
                                  }
                                  fill={
                                    entry.color
                                  }
                                />
                              )
                            )}

                          </Pie>

                          <Tooltip />

                          <Legend
                            verticalAlign="bottom"
                            height={36}
                            iconType="circle"
                          />

                        </PieChart>

                      </ResponsiveContainer>

                      {/* CENTER VALUE */}

                      <div className="pointer-events-none absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2 text-center">

                        <p className="text-3xl font-bold text-slate-900">
                          {totalStatusTasks}
                        </p>

                        <p className="text-xs font-medium text-slate-400">
                          Total Tasks
                        </p>

                      </div>

                    </div>
                  ) : (
                    <EmptyChart />
                  )}

                </ChartCard>

                <ChartCard
                  title="Task Priority"
                  description="Distribution of tasks by priority"
                >

                  {hasChartData(
                    priorityChartData
                  ) ? (
                    <div className="relative">

                      <ResponsiveContainer
                        width="100%"
                        height={330}
                      >

                        <PieChart>

                          <Pie
                            data={
                              priorityChartData
                            }
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="48%"
                            outerRadius={105}
                            innerRadius={58}
                            paddingAngle={4}
                            stroke="#FFFFFF"
                            strokeWidth={3}
                            labelLine={false}
                            label={({
                              percent,
                            }) =>
                              percent >=
                              0.05
                                ? `${Math.round(
                                    percent *
                                      100
                                  )}%`
                                : ""
                            }
                          >

                            {priorityChartData.map(
                              (
                                entry
                              ) => (
                                <Cell
                                  key={
                                    entry.id
                                  }
                                  fill={
                                    entry.color
                                  }
                                />
                              )
                            )}

                          </Pie>

                          <Tooltip />

                          <Legend
                            verticalAlign="bottom"
                            height={36}
                            iconType="circle"
                          />

                        </PieChart>

                      </ResponsiveContainer>

                      <div className="pointer-events-none absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2 text-center">

                        <p className="text-3xl font-bold text-slate-900">
                          {totalPriorityTasks}
                        </p>

                        <p className="text-xs font-medium text-slate-400">
                          Total Tasks
                        </p>

                      </div>

                    </div>
                  ) : (
                    <EmptyChart />
                  )}

                </ChartCard>

              </div>


              <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                <div className="mb-6">

                  <h2 className="text-lg font-bold text-slate-900">
                    Project Performance
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Completed tasks compared with total tasks
                  </p>

                </div>

                {projectPerformance.length ===
                0 ? (
                  <EmptyChart />
                ) : (
                  <ResponsiveContainer
                    width="100%"
                    height={360}
                  >

                    <BarChart
                      data={
                        projectPerformance
                      }
                      margin={{
                        top: 10,
                        right: 20,
                        left: 0,
                        bottom: 60,
                      }}
                    >

                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#E2E8F0"
                        vertical={false}
                      />

                      <XAxis
                        dataKey="name"
                        angle={-35}
                        textAnchor="end"
                        interval={0}
                        tick={{
                          fill: "#64748B",
                          fontSize: 12,
                        }}
                        axisLine={false}
                        tickLine={false}
                      />

                      <YAxis
                        allowDecimals={false}
                        tick={{
                          fill: "#64748B",
                          fontSize: 12,
                        }}
                        axisLine={false}
                        tickLine={false}
                      />

                      <Tooltip />

                      <Legend />

                      <Bar
                        dataKey="totalTasks"
                        name="Total Tasks"
                        fill="#6366F1"
                        radius={[
                          6,
                          6,
                          0,
                          0,
                        ]}
                      />

                      <Bar
                        dataKey="completedTasks"
                        name="Completed Tasks"
                        fill="#10B981"
                        radius={[
                          6,
                          6,
                          0,
                          0,
                        ]}
                      />

                    </BarChart>

                  </ResponsiveContainer>
                )}

              </section>

              <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                <div className="border-b border-slate-200 p-6">

                  <h2 className="text-lg font-bold text-slate-900">
                    Project Overview
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Detailed project progress
                  </p>

                </div>

                {projectPerformance.length ===
                0 ? (
                  <EmptyChart />
                ) : (
                  <div className="overflow-x-auto">

                    <table className="w-full min-w-[700px] text-left">

                      <thead className="bg-slate-50">

                        <tr>

                          <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Project
                          </th>

                          <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Status
                          </th>

                          <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Tasks
                          </th>

                          <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Completed
                          </th>

                          <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Progress
                          </th>

                        </tr>

                      </thead>

                      <tbody className="divide-y divide-slate-100">

                        {projectPerformance.map(
                          (project) => {

                            const progress =
                              Math.min(
                                100,
                                Math.max(
                                  0,
                                  Number(
                                    project.progress
                                  ) || 0
                                )
                              );

                            const status =
                              normalizeStatus(
                                project.status
                              );

                            return (
                              <tr
                                key={String(
                                  project.id
                                )}
                                className="transition hover:bg-slate-50"
                              >

                                <td className="px-6 py-4 font-medium text-slate-900">
                                  {project.name}
                                </td>

                                <td className="px-6 py-4">

                                  <span
                                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                                      status ===
                                      "done"
                                        ? "bg-emerald-50 text-emerald-700"
                                        : status ===
                                          "in-progress"
                                        ? "bg-orange-50 text-orange-700"
                                        : "bg-blue-50 text-blue-700"
                                    }`}
                                  >
                                    {project.status}
                                  </span>

                                </td>

                                <td className="px-6 py-4 text-sm text-slate-600">
                                  {
                                    project.totalTasks
                                  }
                                </td>

                                <td className="px-6 py-4 text-sm font-medium text-emerald-600">
                                  {
                                    project.completedTasks
                                  }
                                </td>

                                <td className="px-6 py-4">

                                  <div className="flex min-w-[150px] items-center gap-3">

                                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">

                                      <div
                                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-700"
                                        style={{
                                          width: `${progress}%`,
                                        }}
                                      />

                                    </div>

                                    <span className="text-sm font-semibold text-slate-700">
                                      {progress}%
                                    </span>

                                  </div>

                                </td>

                              </tr>
                            );
                          }
                        )}

                      </tbody>

                    </table>

                  </div>
                )}

              </section>

            </div>
          </main>

        </div>
      </div>
    </div>
  );
};


const Stat = ({
  title,
  value,
  icon,
  iconClass,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </p>

        </div>

        <div
          className={`rounded-xl p-3 ${iconClass}`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
};


const Metric = ({
  label,
  value,
  className = "text-slate-900",
  bgClass = "bg-slate-50",
}) => {
  return (
    <div
      className={`rounded-xl p-4 text-center ${bgClass}`}
    >

      <p
        className={`text-2xl font-bold ${className}`}
      >
        {value}
      </p>

      <p className="mt-1 text-xs font-medium text-slate-500">
        {label}
      </p>

    </div>
  );
};


const ChartCard = ({
  title,
  description,
  children,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:shadow-md">

      <h2 className="text-lg font-bold text-slate-900">
        {title}
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        {description}
      </p>

      <div className="mt-4">
        {children}
      </div>

    </div>
  );
};



const EmptyChart = () => {
  return (
    <div className="flex h-[300px] items-center justify-center">

      <div className="text-center">

        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50">

          <BarChart3
            size={30}
            className="text-slate-300"
          />

        </div>

        <p className="mt-3 text-sm font-semibold text-slate-600">
          No analytics data available
        </p>

        <p className="mt-1 text-xs text-slate-400">
          Add some tasks to see analytics.
        </p>

      </div>

    </div>
  );
};

export default Analytics;