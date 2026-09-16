import api from "../api/axios";

export const getProjects = () => api.get("/api/projects/");

export const createProject = (project) => api.post("/api/projects", project);

export const getproject = (id) => api.get(`/api/projects/${id}`);

export const updateProject = (id, project) =>
  api.put(`/api/projects/${id}`, project);

export const deleteProject = (id) => api.delete(`/api/projects/${id}`);

export const fetchAllTask = (id, filters = {}) => {
  const params = new URLSearchParams();
  if (filters.status) {
    params.append("status", filters.status);
  }
  if (filters.priority) {
    params.append("priority", filters.priority);
  }
  if (filters.search) {
    params.append("search", filters.search);
  }
  if (filters.sort) {
    params.append("sort", filters.sort);
  }
  if (filters.page) {
    params.append("page", filters.page);
  }
  if (filters.limit) {
    params.append("limit", filters.limit);
  }

  return api.get(`/api/projects/${id}/tasks?${params.toString()}`);
};

export const createTask = (id, task) =>
  api.post(`/api/projects/${id}/tasks`, task);

export const getAvailableProjectMembers = (id) =>
  api.get(`/api/projects/${id}/available-members`);

export const addProjectMember = (id, members) =>
  api.patch(`/api/projects/${id}/members`, { members });

export const removeProjectMembers = (id, memberId) =>
  api.delete(`/api/projects/${id}/members`, { data: { members: [memberId] } });

export const getAuditLogs = (id, filters = {}) => {
  const params = new URLSearchParams();
  if (filters.search) {
    params.append("search", filters.search);
  }
  if (filters.action) {
    params.append("action", filters.action);
  }
  if (filters.page) {
    params.append("page", filters.page);
  }
  if (filters.limit) {
    params.append("limit", filters.limit);
  }
  return api.get(`/api/auditlogs/${id}?${params.toString()}`);
};
