import api from "../api/axios";

export const getAllLogs = (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.action) {
    params.append("action", filters.action);
  }
  if (filters.search) {
    params.append("search", filters.search);
  }
  if (filters.page) {
    params.append("page", filters.page);
  }
  if (filters.limit) {
    params.append("limit", filters.limit);
  }
  return api.get(`/api/auditlogs?${params.toString()}`);
};
