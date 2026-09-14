import Project from "../models/Project.js";
import Task from "../models/Task.js";

export const getAnalytics = async (
  req,
  res,
  next
) => {
  try {
    const userId = req.user.userId;

    const projects = await Project.find({
      owner: userId,
    }).lean();

    const projectIds = projects.map(
      (project) => project._id
    );

    const tasks = await Task.find({
      project: {
        $in: projectIds,
      },
    }).lean();

    const completed = tasks.filter(
      (task) => task.status === "done"
    ).length;

    const inProgress = tasks.filter(
      (task) => task.status === "in-progress"
    ).length;

    const pending = tasks.filter(
      (task) => task.status === "todo"
    ).length;

    const high = tasks.filter(
      (task) => task.priority === "High"
    ).length;

    const medium = tasks.filter(
      (task) => task.priority === "Medium"
    ).length;

    const low = tasks.filter(
      (task) => task.priority === "Low"
    ).length;

    const completionRate =
      tasks.length > 0
        ? Math.round(
            (completed / tasks.length) * 100
          )
        : 0;

    const projectPerformance =
      projects.map((project) => {
        const projectTasks =
          tasks.filter(
            (task) =>
              task.project.toString() ===
              project._id.toString()
          );

        const projectCompleted =
          projectTasks.filter(
            (task) =>
              task.status === "done"
          ).length;

        const progress =
          projectTasks.length > 0
            ? Math.round(
                (projectCompleted /
                  projectTasks.length) *
                  100
              )
            : 0;

        return {
          id: project._id,
          name: project.name,
          status: project.status,
          totalTasks:
            projectTasks.length,
          completedTasks:
            projectCompleted,
          progress,
        };
      });

    res.status(200).json({
      success: true,

      summary: {
        totalProjects:
          projects.length,
        totalTasks:
          tasks.length,
        completed,
        inProgress,
        pending,
        completionRate,
      },

      statusDistribution: [
        {
          name: "Completed",
          value: completed,
        },
        {
          name: "In Progress",
          value: inProgress,
        },
        {
          name: "Pending",
          value: pending,
        },
      ],

      priorityDistribution: [
        {
          name: "High",
          value: high,
        },
        {
          name: "Medium",
          value: medium,
        },
        {
          name: "Low",
          value: low,
        },
      ],

      projectPerformance,
    });
  } catch (error) {
    next(error);
  }
};