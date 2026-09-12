import api from "../api/axios";

export const getAllUsers = (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.search) {
    params.append("search", filters.search);
  }
  if (filters.role) {
    params.append("role", filters.role);
  }
  if (filters.status) {
    params.append("status", filters.status);
  }
  if (filters.page) {
    params.append("page", filters.page);
  }
  if (filters.limit) {
    params.append("limit", filters.limit);
  }
  return api.get(`/api/users?${params.toString()}`);
};

export const updateUserRole = (id, role) =>
  api.patch(`/api/users/${id}/role`, { role });

export const updateUserStatus = (id, status) =>
  api.patch(`/api/users/${id}/status`, { status });
