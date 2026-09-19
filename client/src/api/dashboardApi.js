import api from "../api/axios";

export const fetchAdminDashboardAnalytics = () =>
  api.get("/api/dashboard/admin");

export const fetchManagerDashboardAnalytics = () =>
  api.get("/api/dashboard/manager");

export const fetchMemberDashboardAnalytics = () =>
  api.get("/api/dashboard/member");
