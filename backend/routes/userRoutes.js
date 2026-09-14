import express from "express";

import {
  createUser,
  getUsers,
  getUserById,
  deleteUser,
  updateUser,
} from "../controllers/userController.js";

import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", createUser);
router.get("/",protect, getUsers);
router.get("/:id",protect, getUserById);
router.put("/:id",protect, updateUser);
router.delete("/:id",protect, deleteUser);

export default router;