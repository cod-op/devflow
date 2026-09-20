const API_URL = (
  import.meta.env.VITE_API_URL || "https://devflow-qqud.onrender.com/api"
).replace(/\/$/, "");

const getToken = () => localStorage.getItem("token");

const request = async (path, options = {}) => {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 15000);

  try {
    const token = getToken();

    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
    });

    const contentType = response.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
      ? await response.json()
      : null;

    if (!response.ok) {
      if (response.status === 401) {
        window.dispatchEvent(new Event("auth:expired"));
      }

      throw new Error(
        data?.message || `Request failed with status ${response.status}`
      );
    }

    return data;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("Request timed out. Please try again.");
    }

    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
};

const jsonRequest = (method, body) => ({
  method,
  body: JSON.stringify(body),
});

export const registerUser = (userData) =>
  request("/auth/register", jsonRequest("POST", userData));

export const loginUser = (userData) =>
  request("/auth/login", jsonRequest("POST", userData));

export const getCurrentUser = () =>
  request("/auth/me");

export const getProjects = () =>
  request("/projects");

export const getProject = (projectId) =>
  request(`/projects/${projectId}`);

export const createProject = (projectData) =>
  request("/projects", jsonRequest("POST", projectData));

export const updateProject = (projectId, projectData) =>
  request(`/projects/${projectId}`, jsonRequest("PUT", projectData));

export const deleteProject = (projectId) =>
  request(`/projects/${projectId}`, { method: "DELETE" });

export const getTasks = () =>
  request("/tasks");

export const getTask = (taskId) =>
  request(`/tasks/${taskId}`);

export const createTask = (taskData) =>
  request("/tasks", jsonRequest("POST", taskData));

export const updateTask = (taskId, taskData) =>
  request(`/tasks/${taskId}`, jsonRequest("PUT", taskData));

export const updateTaskStatus = (taskId, status) =>
  request(
    `/tasks/${taskId}/status`,
    jsonRequest("PATCH", { status })
  );

export const deleteTask = (taskId) =>
  request(`/tasks/${taskId}`, { method: "DELETE" });

export const getUsers = () =>
  request("/users");

export const getUser = (userId) =>
  request(`/users/${userId}`);

export const createUser = (userData) =>
  request("/users", jsonRequest("POST", userData));

export const updateUser = (userId, userData) =>
  request(`/users/${userId}`, jsonRequest("PUT", userData));

export const deleteUser = (userId) =>
  request(`/users/${userId}`, { method: "DELETE" });

export const generateAITasks = (projectId, count = 8) =>
  request(
    "/ai/generate-tasks",
    jsonRequest("POST", { projectId, count })
  );

export const getAnalytics = () =>
  request("/analytics");
