import Task from "../models/Task.js";
import Project from "../models/Project.js";

const canAccessProject = (project, userId) =>
  project && (project.owner.toString() === userId.toString() || project.members?.some((member) => member.toString() === userId.toString()));

const isOwner = (project, userId) => project.owner.toString() === userId.toString();

export const createTask = async (req, res, next) => {
  try {
    const { title, description, project, assignedTo, priority, status, dueDate } = req.body;
    if (!title?.trim() || title.trim().length < 2 || !project) {
      return res.status(400).json({ success: false, message: "Task title (minimum 2 characters) and project are required" });
    }

    const ownedProject = await Project.findOne({ _id: project, owner: req.user.userId });
    if (!ownedProject) return res.status(403).json({ success: false, message: "Only the project owner can create tasks" });

    if (assignedTo && ![ownedProject.owner.toString(), ...ownedProject.members.map(String)].includes(String(assignedTo))) {
      return res.status(400).json({ success: false, message: "Task can only be assigned to a project member" });
    }

    const task = await Task.create({ title: title.trim(), description: description?.trim() || "", project, assignedTo: assignedTo || null, priority: priority || "Medium", status: status || "todo", dueDate: dueDate || null });
    const populatedTask = await task.populate([
      { path: "project", select: "name status owner members" },
      { path: "assignedTo", select: "name email role" },
    ]);
    res.status(201).json({ success: true, data: populatedTask });
  } catch (error) { next(error); }
};

export const getTasks = async (req, res, next) => {
  try {
    const projects = await Project.find({ $or: [{ owner: req.user.userId }, { members: req.user.userId }] }).select("_id");
    const projectIds = projects.map((project) => project._id);
    const tasks = await Task.find({ $or: [{ project: { $in: projectIds } }, { assignedTo: req.user.userId }] })
      .populate("project", "name status owner members")
      .populate("assignedTo", "name email role")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (error) { next(error); }
};

export const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("project", "name status owner members")
      .populate("assignedTo", "name email role");
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });
    const userId = req.user.userId.toString();
    const allowed = task.assignedTo?._id?.toString() === userId || canAccessProject(task.project, userId);
    if (!allowed) return res.status(403).json({ success: false, message: "You do not have access to this task" });
    res.status(200).json({ success: true, data: task });
  } catch (error) { next(error); }
};

export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate("project", "name status owner members");
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });
    const userId = req.user.userId.toString();
    const owner = isOwner(task.project, userId);
    const assignee = task.assignedTo?.toString() === userId;
    if (!owner && !assignee) return res.status(403).json({ success: false, message: "You do not have access to this task" });

    if (!owner) {
      const allowed = ["status"];
      const incoming = Object.keys(req.body);
      if (incoming.some((field) => !allowed.includes(field))) {
        return res.status(403).json({ success: false, message: "Assigned members can only update task status" });
      }
    }

    const allowedFields = ["title", "description", "priority", "status", "assignedTo", "dueDate"];
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) task[field] = typeof req.body[field] === "string" ? req.body[field].trim() : req.body[field];
    }

    if (req.body.assignedTo && ![task.project.owner.toString(), ...task.project.members.map(String)].includes(String(req.body.assignedTo))) {
      return res.status(400).json({ success: false, message: "Task can only be assigned to a project member" });
    }
    await task.save();
    const populatedTask = await task.populate([
      { path: "project", select: "name status owner members" },
      { path: "assignedTo", select: "name email role" },
    ]);
    res.status(200).json({ success: true, data: populatedTask });
  } catch (error) { next(error); }
};

export const updateTaskStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ["todo", "in-progress", "done"];
    if (!validStatuses.includes(status)) return res.status(400).json({ success: false, message: "Invalid status" });
    const task = await Task.findById(req.params.id).populate("project", "name status owner members");
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });
    const userId = req.user.userId.toString();
    const allowed = isOwner(task.project, userId) || task.assignedTo?.toString() === userId;
    if (!allowed) return res.status(403).json({ success: false, message: "You do not have access to this task" });
    task.status = status;
    await task.save();
    const populatedTask = await task.populate({ path: "assignedTo", select: "name email role" });
    res.status(200).json({ success: true, message: "Task status updated successfully", data: populatedTask });
  } catch (error) { next(error); }
};

export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate("project", "owner");
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });
    if (task.project.owner.toString() !== req.user.userId.toString()) return res.status(403).json({ success: false, message: "Only the project owner can delete this task" });
    await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Task deleted successfully" });
  } catch (error) { next(error); }
};
