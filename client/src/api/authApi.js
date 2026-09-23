import api from "../api/axios";

export const registerUser = (user) => api.post("/api/auth/register", user);

export const loginUser = (user) => api.post("/api/auth/login", user);

export const refreshAccessToken = () => api.post("/api/auth/refresh");

export const getCurrentUser = () => api.get("/api/auth/me");

export const logoutUser = () => api.post("/api/auth/logout");
