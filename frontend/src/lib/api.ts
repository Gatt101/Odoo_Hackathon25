const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

// Helper to get token from localStorage
function getToken() {
  return localStorage.getItem("token");
}

// Helper to set headers
function getAuthHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Auth APIs
export async function login(email: string, password: string) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export async function register(username: string, email: string, password: string) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });
  return res.json();
}

export async function getProfile() {
  const res = await fetch(`${BASE_URL}/auth/me`, {
    headers: { ...getAuthHeaders() },
  });
  return res.json();
}

// Questions APIs
export async function getQuestions(params = "") {
  const res = await fetch(`${BASE_URL}/questions${params}`);
  return res.json();
}

export async function getQuestionById(id: string) {
  const res = await fetch(`${BASE_URL}/questions/${id}`);
  return res.json();
}

export async function createQuestion(data: any) {
  const res = await fetch(`${BASE_URL}/questions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

// Users APIs
export async function getUsers(params = "") {
  const res = await fetch(`${BASE_URL}/users${params}`, {
    headers: { ...getAuthHeaders() },
  });
  return res.json();
}

export async function getUserById(id: string) {
  const res = await fetch(`${BASE_URL}/users/${id}`);
  return res.json();
}

// Answer APIs
export async function createAnswer(questionId: string, content: string) {
  const res = await fetch(`${BASE_URL}/questions/${questionId}/answers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ content }),
  });
  return res.json();
}

export async function getAnswers(questionId: string) {
  const res = await fetch(`${BASE_URL}/questions/${questionId}/answers`);
  return res.json();
}

export async function updateAnswer(answerId: string, content: string) {
  const res = await fetch(`${BASE_URL}/answers/${answerId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ content }),
  });
  return res.json();
}

export async function deleteAnswer(answerId: string) {
  const res = await fetch(`${BASE_URL}/answers/${answerId}`, {
    method: "DELETE",
    headers: { ...getAuthHeaders() },
  });
  return res.json();
} 