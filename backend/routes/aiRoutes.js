import express from "express";
import {generateTasks} from "../controllers/aicontroller.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/generate-tasks", protect, generateTasks);

export default router;