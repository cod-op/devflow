# 🚀 DevFlow

> AI-Powered Project & Task Management Platform

DevFlow is a full-stack project and task management platform developed as part of the **Full Stack Development Internship at Innovation Hacks**.

The application combines a modern React frontend, RESTful Node.js/Express backend, MongoDB database, JWT authentication, analytics, and Google Gemini AI to provide a complete project-management experience.

---

## 📌 Project Overview

DevFlow helps users manage their development projects and tasks from a single dashboard.

Users can:

- Create an account and log in securely
- Access protected application routes
- Create and manage projects
- Create, assign, update, and delete tasks
- Track task status and priority
- Set task due dates
- Search and filter tasks
- View project progress
- View productivity analytics
- Generate tasks automatically using AI
- Monitor recent project/task activity

The project was developed progressively across the internship tasks, combining:

**Frontend → REST API → Database → Authentication → AI → Analytics**

---

# ✨ Features

## 🔐 Authentication

- User registration
- User login
- JWT-based authentication
- Protected routes
- Current-user authentication
- Logout functionality
- Password hashing with bcrypt
- Token-based API authorization

---

## 📊 Developer Dashboard

The main dashboard provides an overview of the user's development work.

### Dashboard includes:

- Total projects
- Total tasks
- Completed tasks
- Pending tasks
- In-progress tasks
- Project progress
- Task progress
- Recent activity
- Search functionality
- Task filtering
- Responsive layout

---

## 📁 Project Management

Users can manage their projects through complete CRUD operations.

### Project features:

- Create project
- View projects
- View project details
- Update project
- Delete project
- Project status
- Project description
- Project progress
- Project-based task management

Deleting a project also removes its associated tasks.

---

## ✅ Task Management

DevFlow provides complete task management functionality.

### Task features:

- Create tasks
- View tasks
- Update tasks
- Delete tasks
- Assign tasks to users
- Change task status
- Set task priority
- Set due dates
- Search tasks
- Filter tasks
- Track completed/in-progress/pending tasks

### Supported task statuses:

- `todo`
- `in-progress`
- `done`

### Supported priorities:

- `low`
- `medium`
- `high`

---

# 🤖 AI-Powered Task Generation

DevFlow includes an AI-powered task generation feature using **Google Gemini**.

Users can select a project and request AI-generated tasks.

The AI generates tasks containing:

- Task title
- Description
- Priority
- Status
- Due date

Generated tasks are automatically saved to MongoDB.

### AI workflow

```text
User selects project
        ↓
User selects number of tasks
        ↓
Frontend sends request
        ↓
Backend validates project ownership
        ↓
Google Gemini generates tasks
        ↓
Backend validates generated data
        ↓
Tasks are saved to MongoDB
        ↓
Generated tasks returned to frontend
        ↓
Tasks appear in dashboard