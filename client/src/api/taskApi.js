import api from "../api/axios";

export const getTasks = (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.search) {
    params.append("search", filters.search);
  }
  if (filters.status) {
    params.append("status", filters.status);
  }
  if (filters.priority) {
    params.append("priority", filters.priority);
  }
  if (filters.sortBy) {
    params.append("sortBy", filters.sortBy);
  }
  if (filters.page) {
    params.append("page", filters.page);
  }
  if (filters.limit) {
    params.append("limit", filters.limit);
  }
  return api.get(`/api/tasks?${params.toString()}`);
};

export const updateTaskStatus = (id, status) =>
  api.patch(`/api/tasks/${id}/status`, { status });

export const updateTask = (id, updatedTask) =>
  api.put(`/api/tasks/${id}`, updatedTask);

export const deleteTask = (id) => api.delete(`/api/tasks/${id}`);
