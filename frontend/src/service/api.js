const API_URL = "http://localhost:5000/api";

const getToken = () => {
  return localStorage.getItem("token");
};

const getHeaders = () => {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    ...(token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}),
  };
};

// ==================== AUTH ====================

export const registerUser = async (userData) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Registration failed");
  }

  return data;
};

export const loginUser = async (userData) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
};

export const getCurrentUser = async () => {
  const response = await fetch(`${API_URL}/auth/me`, {
    method: "GET",
    headers: getHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to get current user"
    );
  }

  return data;
};

// ==================== PROJECTS ====================

export const getProjects = async () => {
  const response = await fetch(`${API_URL}/projects`, {
    method: "GET",
    headers: getHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch projects"
    );
  }

  return data;
};

export const getProject = async (projectId) => {
  const response = await fetch(
    `${API_URL}/projects/${projectId}`,
    {
      method: "GET",
      headers: getHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch project"
    );
  }

  return data;
};

export const createProject = async (projectData) => {
  const response = await fetch(`${API_URL}/projects`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(projectData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to create project"
    );
  }

  return data;
};

export const updateProject = async (
  projectId,
  projectData
) => {
  const response = await fetch(
    `${API_URL}/projects/${projectId}`,
    {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(projectData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to update project"
    );
  }

  return data;
};

export const deleteProject = async (projectId) => {
  const response = await fetch(
    `${API_URL}/projects/${projectId}`,
    {
      method: "DELETE",
      headers: getHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to delete project"
    );
  }

  return data;
};

// ==================== TASKS ====================

export const getTasks = async () => {
  const response = await fetch(`${API_URL}/tasks`, {
    method: "GET",
    headers: getHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch tasks"
    );
  }

  return data;
};

export const getTask = async (taskId) => {
  const response = await fetch(
    `${API_URL}/tasks/${taskId}`,
    {
      method: "GET",
      headers: getHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch task"
    );
  }

  return data;
};

export const createTask = async (taskData) => {
  const response = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(taskData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to create task"
    );
  }

  return data;
};

export const updateTask = async (
  taskId,
  taskData
) => {
  const response = await fetch(
    `${API_URL}/tasks/${taskId}`,
    {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(taskData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to update task"
    );
  }

  return data;
};

export const updateTaskStatus = async (
  taskId,
  status
) => {
  const response = await fetch(
    `${API_URL}/tasks/${taskId}/status`,
    {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify({
        status,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to update task status"
    );
  }

  return data;
};

export const deleteTask = async (taskId) => {
  const response = await fetch(
    `${API_URL}/tasks/${taskId}`,
    {
      method: "DELETE",
      headers: getHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to delete task"
    );
  }

  return data;
};

// ==================== USERS ====================

export const getUsers = async () => {
  const response = await fetch(`${API_URL}/users`, {
    method: "GET",
    headers: getHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch users"
    );
  }

  return data;
};

export const getUser = async (userId) => {
  const response = await fetch(
    `${API_URL}/users/${userId}`,
    {
      method: "GET",
      headers: getHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch user"
    );
  }

  return data;
};

export const createUser = async (userData) => {
  const response = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to create user"
    );
  }

  return data;
};

export const updateUser = async (
  userId,
  userData
) => {
  const response = await fetch(
    `${API_URL}/users/${userId}`,
    {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(userData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to update user"
    );
  }

  return data;
};

export const deleteUser = async (userId) => {
  const response = await fetch(
    `${API_URL}/users/${userId}`,
    {
      method: "DELETE",
      headers: getHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to delete user"
    );
  }

  return data;
};


export const generateAITasks = async (projectId, count = 8) => {
  const response = await fetch(`${API_URL}/ai/generate-tasks`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      projectId,
      count,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to generate AI tasks"
    );
  }

  return data;
};
// ==================== ANALYTICS ====================

export const getAnalytics = async () => {
  const response = await fetch(
    `${API_URL}/analytics`,
    {
      method: "GET",
      headers: getHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch analytics"
    );
  }

  return data;
};