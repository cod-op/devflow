import Project from "../models/Project.js";
import Task from "../models/Task.js";

export const createProject = async (req, res, next) => {
  try {
    const { name, description, status } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Project name is required",
      });
    }

    const project = await Project.create({
      name: name.trim(),
      description: description?.trim() || "",
      status: status || "Planning",
      owner: req.user.userId,
    });

    const populatedProject = await project.populate(
      "owner",
      "name email"
    );

    res.status(201).json({
      success: true,
      data: populatedProject,
    });
  } catch (error) {
    next(error);
  }
};

export const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({
      owner: req.user.userId,
    })
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.user.userId,
    }).populate("owner", "name email");

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const allowedFields = [
      "name",
      "description",
      "status",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] =
          typeof req.body[field] === "string"
            ? req.body[field].trim()
            : req.body[field];
      }
    }

    const project = await Project.findOneAndUpdate(
      {
        _id: req.params.id,
        owner: req.user.userId,
      },
      updates,
      {
        new: true,
        runValidators: true,
      }
    ).populate("owner", "name email");

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.userId,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Delete all tasks belonging to this project
    await Task.deleteMany({
      project: project._id,
    });

    res.status(200).json({
      success: true,
      message: "Project and related tasks deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};