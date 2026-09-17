import api from "../api/axios";

export const fetchAdminDashboardAnalytics = () =>
  api.get("/api/dashboard/admin");


