import {
  Users,
  FolderKanban,
  CheckSquare,
  Activity,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Clock,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { fetchAdminDashboardAnalytics } from "../../api/dashboardApi";
import { getActivityMessage, getRelativeTime } from "../../utils/auditLogUtils";
import TaskOverviewChart from "../../components/TaskOverviewChart";

function AdminDashboard() {
  const navigate = useNavigate();
  const [userStats, setUserStats] = useState({});
  const [totalProjects, setTotalProjects] = useState(0);
  const [taskStats, setTaskStats] = useState({});
  const [completionRate, setCompletionRate] = useState(0);
  const [recentProjects, setRecentProjects] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  async function fetchDashboardDetails() {
    try {
      const response = await fetchAdminDashboardAnalytics();
      setUserStats(response.data.userStats);
      setTotalProjects(response.data.totalProjects);
      setTaskStats(response.data.taskStats);
      setCompletionRate(response.data.completionRate);
      setRecentProjects(response.data.recentProjects);
      setRecentActivity(response.data.recentActivity);
    } catch (error) {
      const errors = error.response?.data?.error;
      const message = error.response?.data?.message;
      if (errors && errors.length > 0) {
        toast.error(errors[0].msg);
      } else if (message) {
        toast.error(message);
      } else {
        toast.error(error.message);
      }
    }
  }

  useEffect(() => {
    fetchDashboardDetails();
  }, []);

  const getUserPercentage = (count) => {
    if (!userStats.totalUsers) return 0;
    return (count / userStats.totalUsers) * 100;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>

          <p className="mt-1 text-sm text-slate-500">
            Overview of your organization's activity and performance.
          </p>
        </div>

        {/* Header Action */}
        <button
          onClick={fetchDashboardDetails}
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50"
        >
          <Activity size={16} />
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Total Users */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Users</p>

              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                {userStats.totalUsers}
              </h2>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
              <Users size={19} />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-1 text-xs">
            <Users size={14} className="text-emerald-500" />
            <span className="font-medium text-emerald-600">
              {userStats.activeUsers}
            </span>
            <span className="text-slate-400">active users</span>
          </div>
        </div>

        {/* Total Projects */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Projects
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                {totalProjects}
              </h2>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <FolderKanban size={19} />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-1 text-xs">
            <FolderKanban size={14} className="text-blue-500" />
            <span className="font-medium text-blue-600">{totalProjects}</span>
            <span className="text-slate-400">projects tracked</span>
          </div>
        </div>

        {/* Total Tasks */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Tasks</p>

              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                {taskStats.totalTasks}
              </h2>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <CheckSquare size={19} />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-1 text-xs">
            <CheckSquare size={14} className="text-emerald-500" />
            <span className="font-medium text-emerald-600">
              {taskStats.completedTasks}
            </span>
            <span className="text-slate-400">completed</span>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Completion Rate
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                {completionRate.toFixed(0)}%
              </h2>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <TrendingUp size={19} />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-1 text-xs">
            <CheckSquare size={14} className="text-emerald-500" />
            <span className="font-medium text-emerald-600">
              {taskStats.completedTasks}
            </span>
            <span className="text-slate-400">
              of {taskStats.totalTasks} tasks completed
            </span>
          </div>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        {/* Task Overview */}
        <div className="rounded-xl border border-slate-200 bg-white xl:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-800">
                Task Overview
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Task distribution across the system.
              </p>
            </div>
          </div>

          {/* Chart Placeholder */}
          <div className="flex h-72 items-center justify-center px-5 py-2 ">
            <TaskOverviewChart taskStats={taskStats} />
          </div>
        </div>

        {/* User Overview */}
        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-sm font-semibold text-slate-800">
              User Overview
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Current user distribution.
            </p>
          </div>

          <div className="space-y-5 px-5 py-5">
            {/* Active Users */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-600">
                  Active Users
                </span>

                <span className="text-xs font-semibold text-slate-800">
                  {userStats.activeUsers}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{
                    width: `${getUserPercentage(userStats.activeUsers)}%`,
                  }}
                />
              </div>
            </div>

            {/* Managers */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-600">
                  Managers
                </span>

                <span className="text-xs font-semibold text-slate-800">
                  {userStats.managers}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-blue-500"
                  style={{
                    width: `${getUserPercentage(userStats.managers)}%`,
                  }}
                />
              </div>
            </div>

            {/* Members */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-600">
                  Members
                </span>

                <span className="text-xs font-semibold text-slate-800">
                  {userStats.members}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-violet-500"
                  style={{ width: `${getUserPercentage(userStats.members)}%` }}
                />
              </div>
            </div>

            {/* Disabled */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-600">
                  Disabled
                </span>

                <span className="text-xs font-semibold text-slate-800">
                  {userStats.disabledUsers}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-red-400"
                  style={{
                    width: `${getUserPercentage(userStats.disabledUsers)}%`,
                  }}
                />{" "}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {/* Recent Projects */}
        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-800">
                Recent Projects
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Recently created or updated projects.
              </p>
            </div>

            <button
              onClick={() => navigate("/projects")}
              type="button"
              className="inline-flex items-center gap-1 text-xs font-medium text-violet-600 transition hover:text-violet-700"
            >
              View All
              <ArrowUpRight size={13} />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {/* Project 1 */}
            {recentProjects.length === 0 ? (
              <div>
                <p>No projects yet</p>
              </div>
            ) : (
              recentProjects.map((project) => (
                <div
                  key={project._id}
                  className="flex items-center justify-between px-5 py-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-sm font-semibold text-violet-600">
                      {project.name[0].toUpperCase()}
                    </div>

                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        {project.name}
                      </p>

                      <p className="mt-0.5 text-xs text-slate-400">
                        Created {getRelativeTime(project.createdAt)}
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-600">
                    {project.status[0].toUpperCase() + project.status.slice(1)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-800">
                Recent Activity
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Latest activity across the system.
              </p>
            </div>

            <Clock size={16} className="text-slate-400" />
          </div>

          {recentActivity.length === 0 ? (
            <div>
              <p>No Recent Activity</p>
            </div>
          ) : (
            recentActivity.map((activity) => (
              <div key={activity._id} className="divide-y divide-slate-100">
                {/* Activity 1 */}
                <div className="flex gap-3 px-5 py-4">
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-violet-500" />

                  <div className="min-w-0">
                    <p className="text-sm text-slate-700">
                      <span className="font-medium text-slate-900">
                        {activity.actor.name}
                      </span>{" "}
                      {getActivityMessage(activity)}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {getRelativeTime(activity.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
