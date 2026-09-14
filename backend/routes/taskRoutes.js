import express from "express";

import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
} from "../controllers/taskController.js";

import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/",protect, createTask);
router.get("/",protect, getTasks);
router.get("/:id",protect, getTaskById);
router.put("/:id",protect, updateTask);
router.patch("/:id/status",protect, updateTaskStatus);
router.delete("/:id",protect, deleteTask);

export default router;