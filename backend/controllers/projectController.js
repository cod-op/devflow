import Project from "../models/Project.js";

export const createProject = async (req, res, next) => {
  try {
    const { name, description, status, owner } = req.body;

    if (!name || !owner) {
      return res.status(400).json({
        success: false,
        message: "Project name and owner are required",
      });
    }

    const project = await Project.create({
      name,
      description,
      status,
      owner,
    });

    const populatedProject = await project.populate("owner", "name email");

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
    const projects = await Project.find()
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
    const project = await Project.findById(req.params.id).populate(
      "owner",
      "name email"
    );

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
    const allowedFields = ["name", "description", "status"];
    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        returnDocument: "after",
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
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};