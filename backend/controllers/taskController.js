import Task from "../models/Task.js";
import Project from "../models/Project.js";

const getOwnedProject = async (projectId, userId) => {
  return Project.findOne({
    _id: projectId,
    owner: userId,
  });
};

export const createTask = async (req, res, next) => {
  try {
    const {
      title,
      description,
      project,
      assignedTo,
      priority,
      status,
      dueDate,
    } = req.body;

    if (!title || !project) {
      return res.status(400).json({
        success: false,
        message: "Task title and project are required",
      });
    }

    const ownedProject = await getOwnedProject(
      project,
      req.user.userId
    );

    if (!ownedProject) {
      return res.status(403).json({
        success: false,
        message: "You do not have access to this project",
      });
    }

    const task = await Task.create({
      title: title.trim(),
      description: description?.trim() || "",
      project,
      assignedTo: assignedTo || null,
      priority: priority || "Medium",
      status: status || "todo",
      dueDate: dueDate || null,
    });

    const populatedTask = await task.populate([
      {
        path: "project",
        select: "name status owner",
      },
      {
        path: "assignedTo",
        select: "name email",
      },
    ]);

    res.status(201).json({
      success: true,
      data: populatedTask,
    });
  } catch (error) {
    next(error);
  }
};

export const getTasks = async (req, res, next) => {
  try {
    const ownedProjects = await Project.find({
      owner: req.user.userId,
    }).select("_id");

    const projectIds = ownedProjects.map(
      (project) => project._id
    );

    const tasks = await Task.find({
      project: { $in: projectIds },
    })
      .populate("project", "name status")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("project", "name status owner")
      .populate("assignedTo", "name email");

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    if (
      task.project.owner.toString() !==
      req.user.userId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You do not have access to this task",
      });
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate(
      "project",
      "name status owner"
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    if (
      task.project.owner.toString() !==
      req.user.userId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You do not have access to this task",
      });
    }

    const allowedFields = [
      "title",
      "description",
      "priority",
      "status",
      "assignedTo",
      "dueDate",
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        task[field] =
          typeof req.body[field] === "string"
            ? req.body[field].trim()
            : req.body[field];
      }
    }

    await task.save();

    const populatedTask = await task.populate([
      {
        path: "project",
        select: "name status owner",
      },
      {
        path: "assignedTo",
        select: "name email",
      },
    ]);

    res.status(200).json({
      success: true,
      data: populatedTask,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTaskStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const validStatuses = [
      "todo",
      "in-progress",
      "done",
    ];

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const task = await Task.findById(req.params.id).populate(
      "project",
      "owner"
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    if (
      task.project.owner.toString() !==
      req.user.userId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You do not have access to this task",
      });
    }

    task.status = status;

    await task.save();

    const populatedTask = await task.populate([
      {
        path: "project",
        select: "name status",
      },
      {
        path: "assignedTo",
        select: "name email",
      },
    ]);

    res.status(200).json({
      success: true,
      message: "Task status updated successfully",
      data: populatedTask,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate(
      "project",
      "owner"
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    if (
      task.project.owner.toString() !==
      req.user.userId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You do not have access to this task",
      });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};