import api from "../api/axios";

export const getProjects = () => api.get("/api/projects/");

export const createProject = (project) => api.post("/api/projects", project);

export const getproject = (id) => api.get(`/api/projects/${id}`);

export const fetchAllTask = (id) => api.get(`/api/projects/${id}/tasks`);

export const getAuditLogs = (id) => api.get(`/api/auditlogs/${id}`);
