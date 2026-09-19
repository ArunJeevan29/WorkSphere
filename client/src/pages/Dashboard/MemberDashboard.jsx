import {
  CheckSquare,
  Clock3,
  CircleCheck,
  AlertCircle,
  Activity,
  ArrowUpRight,
  CalendarClock,
  TrendingUp,
} from "lucide-react";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { fetchMemberDashboardAnalytics } from "../../api/dashboardApi";
import TaskOverviewChart from "../../components/TaskOverviewChart";
import { formatDate } from "../../utils/formatDateUtils";
import { formatActivity, getRelativeTime } from "../../utils/auditLogUtils";

function MemberDashboard() {
  const navigate = useNavigate();
  const [taskStats, setTaskStats] = useState({
    totalTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0,
  });
  const [completionRate, setCompletionRate] = useState(0);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  async function fetchDashboardDetails() {
    try {
      const response = await fetchMemberDashboardAnalytics();

      setTaskStats(response.data.taskStats);
      setCompletionRate(response.data.completionRate);
      setUpcomingTasks(response.data.upcomingTasks);
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

  const getActivityType = (activity) => {
    if (
      activity.action === "TASK_STATUS_UPDATED" &&
      activity.metadata?.status === "completed"
    ) {
      return "completed";
    }

    if (
      activity.action === "TASK_STATUS_UPDATED" &&
      activity.metadata?.status === "in-progress"
    ) {
      return "started";
    }

    if (activity.action === "TASK_CREATED") {
      return "assigned";
    }

    return "updated";
  };

  return (
    <div className="space-y-6">
      {/* =========================================
          PAGE HEADER
      ========================================== */}

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Member Dashboard
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Overview of your tasks and work progress.
          </p>
        </div>

        <button
          onClick={fetchDashboardDetails}
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50"
        >
          <Activity size={16} />
          Refresh
        </button>
      </div>

      {/* =========================================
          SUMMARY CARDS
      ========================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* My Tasks */}

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">My Tasks</p>

              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                {taskStats.totalTasks}
              </h2>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
              <CheckSquare size={19} />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-1 text-xs">
            <CheckSquare size={14} className="text-violet-500" />

            <span className="font-medium text-violet-600">
              {taskStats.totalTasks}
            </span>

            <span className="text-slate-400">assigned to you</span>
          </div>
        </div>

        {/* Pending */}

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Pending</p>

              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                {taskStats.pendingTasks}
              </h2>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <Clock3 size={19} />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-1 text-xs">
            <Clock3 size={14} className="text-amber-500" />

            <span className="font-medium text-amber-600">
              {taskStats.pendingTasks}
            </span>

            <span className="text-slate-400">waiting to start</span>
          </div>
        </div>

        {/* In Progress */}

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">In Progress</p>

              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                {taskStats.inProgressTasks}
              </h2>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Activity size={19} />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-1 text-xs">
            <Activity size={14} className="text-blue-500" />

            <span className="font-medium text-blue-600">
              {taskStats.inProgressTasks}
            </span>

            <span className="text-slate-400">currently working</span>
          </div>
        </div>

        {/* Completed */}

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Completed</p>

              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                {taskStats.completedTasks}
              </h2>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <CircleCheck size={19} />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-1 text-xs">
            <TrendingUp size={14} className="text-emerald-500" />

            <span className="font-medium text-emerald-600">
              {completionRate.toFixed(1)}%
            </span>

            <span className="text-slate-400">completion rate</span>
          </div>
        </div>
      </div>

      {/* =========================================
          MAIN ANALYTICS
      ========================================== */}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        {/* =====================================
            TASK OVERVIEW
        ====================================== */}

        <div className="rounded-xl border border-slate-200 bg-white xl:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-800">
                My Task Overview
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Current distribution of your assigned tasks.
              </p>
            </div>
          </div>

          {/* Chart */}

          <div className="flex h-72 items-center justify-center px-5 py-2">
            <TaskOverviewChart taskStats={taskStats} />
          </div>
        </div>

        {/* =====================================
            COMPLETION PROGRESS
        ====================================== */}

        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-sm font-semibold text-slate-800">
              My Progress
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Your overall task completion.
            </p>
          </div>

          <div className="px-5 py-6">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs text-slate-400">Completion Rate</p>

                <p className="mt-1 text-3xl font-bold text-slate-900">
                  {completionRate.toFixed(1)}%
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <TrendingUp size={20} />
              </div>
            </div>

            {/* Progress Bar */}

            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs text-slate-400">Progress</span>

                <span className="text-xs font-semibold text-slate-700">
                  {taskStats.completedTasks} / {taskStats.totalTasks}
                </span>
              </div>

              <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all"
                  style={{
                    width: `${completionRate}%`,
                  }}
                />
              </div>
            </div>

            {/* Status Breakdown */}

            <div className="mt-7 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-400" />

                  <span className="text-xs text-slate-500">Pending</span>
                </div>

                <span className="text-xs font-semibold text-slate-700">
                  {taskStats.pendingTasks}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-blue-500" />

                  <span className="text-xs text-slate-500">In Progress</span>
                </div>

                <span className="text-xs font-semibold text-slate-700">
                  {taskStats.inProgressTasks}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />

                  <span className="text-xs text-slate-500">Completed</span>
                </div>

                <span className="text-xs font-semibold text-slate-700">
                  {taskStats.completedTasks}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================
          BOTTOM SECTION
      ========================================== */}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {/* =====================================
            UPCOMING DEADLINES
        ====================================== */}

        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-800">
                Upcoming Deadlines
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Tasks that need your attention soon.
              </p>
            </div>

            <CalendarClock size={16} className="text-slate-400" />
          </div>

          <div className="divide-y divide-slate-100">
            {upcomingTasks.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <p className="text-sm text-slate-400">No upcoming deadlines.</p>
              </div>
            ) : (
              upcomingTasks.map((task) => (
                <div
                  key={task._id}
                  className="flex items-center justify-between gap-4 px-5 py-4"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                      <CheckSquare size={16} />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-700">
                        {task.title}
                      </p>

                      <p className="mt-0.5 text-xs text-slate-400">
                        {task.project?.name}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${
                        task.priority === "high"
                          ? "bg-red-50 text-red-600"
                          : task.priority === "medium"
                            ? "bg-amber-50 text-amber-600"
                            : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {task.priority[0].toUpperCase() + task.priority.slice(1)}
                    </span>

                    <p className="mt-1 text-[11px] text-slate-400">
                      Due {formatDate(task.dueDate)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-slate-100 px-5 py-3">
            <button
              onClick={() => navigate("/tasks")}
              type="button"
              className="inline-flex items-center gap-1 text-xs font-medium text-violet-600 transition hover:text-violet-700"
            >
              View All Tasks
              <ArrowUpRight size={13} />
            </button>
          </div>
        </div>

        {/* =====================================
            RECENT ACTIVITY
        ====================================== */}

        {/* =====================================
    RECENT ACTIVITY
====================================== */}

        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-800">
                Recent Activity
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Your latest task activity.
              </p>
            </div>

            <Activity size={16} className="text-slate-400" />
          </div>

          <div className="divide-y divide-slate-100">
            {recentActivity.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <p className="text-sm text-slate-400">No recent activity.</p>
              </div>
            ) : (
              recentActivity.map((activity) => {
                const type = getActivityType(activity);

                return (
                  <div key={activity._id} className="flex gap-3 px-5 py-4">
                    {/* Icon */}

                    <div
                      className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                        type === "completed"
                          ? "bg-emerald-50"
                          : type === "started"
                            ? "bg-blue-50"
                            : type === "assigned"
                              ? "bg-violet-50"
                              : "bg-slate-100"
                      }`}
                    >
                      {type === "completed" ? (
                        <CircleCheck size={15} className="text-emerald-600" />
                      ) : type === "started" ? (
                        <Activity size={15} className="text-blue-600" />
                      ) : type === "assigned" ? (
                        <CheckSquare size={15} className="text-violet-600" />
                      ) : (
                        <Clock3 size={15} className="text-slate-500" />
                      )}
                    </div>

                    {/* Activity Content */}

                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-700">
                        {formatActivity(activity)}
                      </p>

                      <p className="mt-0.5 text-xs text-slate-400">
                        {activity.project?.name || "Unknown Project"}
                      </p>

                      <p className="mt-1 text-[11px] text-slate-400">
                        {getRelativeTime(activity.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MemberDashboard;
