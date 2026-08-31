import api from "../api/axios";

export const registerUser = (user) => api.post("/api/auth/register", user);

export const loginUser = (user) => api.post("/api/auth/login", user);

export const getCurrentUser = () => api.get("/api/auth/me");
