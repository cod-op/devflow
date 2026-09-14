import { GoogleGenAI } from "@google/genai";

import Project from "../models/Project.js";
import Task from "../models/Task.js";

export const generateTasks = async (req, res, next) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "GEMINI_API_KEY is missing",
      });
    }



    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });


    const { projectId, count = 8 } = req.body;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: "Project ID is required",
      });
    }



    const project = await Project.findOne({
      _id: projectId,
      owner: req.user.userId,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }


    const safeCount = Math.min(
      Math.max(Number(count) || 8, 1),
      15
    );

 

    const prompt = `
You are an expert software project manager.

Generate exactly ${safeCount} useful development tasks for this project.

Project name:
${project.name}

Project description:
${project.description || "No description provided"}

Return ONLY valid JSON.
Do not use markdown.
Do not add explanations.

Return exactly this format:

[
  {
    "title": "Task title",
    "description": "Short task description",
    "priority": "High",
    "status": "todo",
    "dueDate": "2026-09-20"
  }
]

Rules:

- Return exactly ${safeCount} tasks
- priority must be exactly High, Medium, or Low
- status must always be todo
- titles must be actionable
- descriptions must be concise
- tasks should be practical software development tasks
- dueDate must be a valid future date
- dueDate must use YYYY-MM-DD format
- distribute due dates realistically across the next 7 to 30 days
- complex tasks should generally have later due dates
- simple tasks can have earlier due dates
`;

    // ==============================
    // TRY GEMINI MODELS
    // ==============================

    let response;
    let lastError;

    const models = [
      process.env.GEMINI_MODEL || "gemini-3.8-flash",
      "gemini-3.7-flash",
      "gemini-3.6-flash",
    ];

    for (const model of models) {
      try {
        console.log(
          `Trying Gemini model: ${model}`
        );

        response =
          await ai.models.generateContent({
            model,
            contents: prompt,
          });

        console.log(
          `Gemini success with model: ${model}`
        );

        break;
      } catch (error) {
        lastError = error;

        console.error(
          `Gemini model ${model} failed:`,
          error.message
        );

        // Try next model only for temporary errors
        if (error.status !== 503) {
          throw error;
        }
      }
    }

    if (!response) {
      throw lastError;
    }

  

    let text = response.text || "";

    console.log(
      "Gemini response:",
      text
    );

    text = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

 

    let tasks;

    try {
      tasks = JSON.parse(text);
    } catch (error) {
      console.error(
        "Gemini JSON parse error:",
        error
      );

      return res.status(502).json({
        success: false,
        message:
          "AI returned invalid task data",
      });
    }

    if (!Array.isArray(tasks)) {
      return res.status(502).json({
        success: false,
        message:
          "AI returned invalid task format",
      });
    }

    // ==============================
    // CLEAN AI TASKS
    // ==============================

    const cleanedTasks = tasks
      .slice(0, safeCount)
      .map((task) => {
        let validDueDate = null;

        if (
          task.dueDate &&
          /^\d{4}-\d{2}-\d{2}$/.test(
            String(task.dueDate)
          )
        ) {
          validDueDate =
            String(task.dueDate);
        }

        return {
          title: String(
            task.title || ""
          ).trim(),

          description: String(
            task.description || ""
          ).trim(),

          priority:
            [
              "High",
              "Medium",
              "Low",
            ].includes(task.priority)
              ? task.priority
              : "Medium",

          status: "todo",

          dueDate: validDueDate,
        };
      })
      .filter(
        (task) =>
          task.title.length >= 2
      );

    if (cleanedTasks.length === 0) {
      return res.status(502).json({
        success: false,
        message:
          "AI did not generate valid tasks",
      });
    }

    // ==============================
    // SAVE TASKS TO MONGODB
    // ==============================

    const tasksToSave =
      cleanedTasks.map(
        (task) => ({
          title: task.title,

          description:
            task.description,

          project: project._id,

          assignedTo: null,

          priority:
            task.priority,

          status: "todo",

          dueDate:
            task.dueDate || null,
        })
      );

    const savedTasks =
      await Task.insertMany(
        tasksToSave
      );

    console.log(
      `${savedTasks.length} AI tasks saved to MongoDB`
    );

    // ==============================
    // POPULATE SAVED TASKS
    // ==============================

    const populatedTasks =
      await Task.find({
        _id: {
          $in: savedTasks.map(
            (task) =>
              task._id
          ),
        },
      })
        .populate(
          "project",
          "name status"
        )
        .populate(
          "assignedTo",
          "name email"
        )
        .sort({
          createdAt: -1,
        });

    // ==============================
    // SEND RESPONSE
    // ==============================

    return res.status(200).json({
      success: true,
      count: populatedTasks.length,
      data: populatedTasks,
    });
  } catch (error) {
    console.error(
      "AI task generation error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "AI task generation failed",
    });
  }
};