import {
  FolderKanban,
  CheckSquare,
  Clock3,
  CircleCheck,
  TrendingUp,
  ArrowUpRight,
  Activity,
  AlertCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { fetchManagerDashboardAnalytics } from "../../api/dashboardApi";
import TaskOverviewChart from "../../components/TaskOverviewChart";

function ManagerDashboard() {
  const [projectStats, setProjectStats] = useState({});
  const [taskStats, setTaskStats] = useState({});
  const [completedProjectsRate, setCompletedProjectsRate] = useState(0);
  const [completedTasksRate, setCompletedTasksRate] = useState(0);
  const [projectProgress, setProjectProgress] = useState([]);
  const [teamAlerts, setTeamAlerts] = useState({});

  async function fetchDashboardDetails() {
    try {
      const response = await fetchManagerDashboardAnalytics();
      setProjectStats(response.data.projectStats);
      setCompletedProjectsRate(response.data.completedProjectsRate);
      setTaskStats(response.data.taskStats);
      setCompletedTasksRate(response.data.completedTasksRate);
      setProjectProgress(response.data.projectProgress);
      setTeamAlerts(response.data.teamAlerts);
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
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Manager Dashboard
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Overview of your projects and team performance.
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Total Projects */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Projects
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                {projectStats.totalProjects}
              </h2>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <FolderKanban size={19} />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-1 text-xs">
            <FolderKanban size={14} className="text-blue-500" />

            <span className="font-medium text-blue-600">
              {projectStats.activeProjects}
            </span>

            <span className="text-slate-400">active projects</span>
          </div>
        </div>

        {/* Completed Projects */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Completed Projects
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                {projectStats.completedProjects}
              </h2>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <CircleCheck size={19} />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-1 text-xs">
            <TrendingUp size={14} className="text-emerald-500" />

            <span className="font-medium text-emerald-600">
              {completedProjectsRate}%
            </span>

            <span className="text-slate-400">of your projects</span>
          </div>
        </div>

        {/* Team Tasks */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Team Tasks</p>

              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                {taskStats.totalTasks}
              </h2>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
              <CheckSquare size={19} />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-1 text-xs">
            <Clock3 size={14} className="text-amber-500" />

            <span className="font-medium text-amber-600">
              {taskStats.pendingTasks}
            </span>

            <span className="text-slate-400">pending tasks</span>
          </div>
        </div>

        {/* Completed Tasks */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Completed Tasks
              </p>

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
              {completedTasksRate}%
            </span>

            <span className="text-slate-400">team completion</span>
          </div>
        </div>
      </div>

      {/* Main Analytics */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        {/* Task Overview */}
        <div className="rounded-xl border border-slate-200 bg-white xl:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-800">
                Team Task Overview
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Current task distribution across your projects.
              </p>
            </div>

            <select className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 outline-none focus:border-violet-500">
              <option>All Projects</option>
              <option>Active Projects</option>
              <option>Completed Projects</option>
            </select>
          </div>

          {/* Chart Placeholder */}
          <div className="flex h-72 items-center justify-center px-5 py-2">
            <TaskOverviewChart taskStats={taskStats} />
          </div>
        </div>

        {/* Project Progress */}
        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-sm font-semibold text-slate-800">
              Project Progress
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Progress of your recent projects.
            </p>
          </div>

          <div className="space-y-5 px-5 py-5">
            {projectProgress.length === 0 ? (
              <div>
                <p>No Recent Projects</p>
              </div>
            ) : (
              projectProgress.map((project) => (
                <div key={project._id}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-600">
                      {project.name}
                    </span>

                    <span className="text-xs font-semibold text-slate-800">
                      {project.progress.toFixed(0)}%
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-blue-500"
                      style={{ width: `${project.progress.toFixed()}%` }}
                    />
                  </div>
                </div>
              ))
            )}
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
                My Projects
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Your recently active projects.
              </p>
            </div>

            <button
              type="button"
              className="inline-flex items-center gap-1 text-xs font-medium text-violet-600 transition hover:text-violet-700"
            >
              View All
              <ArrowUpRight size={13} />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {projectProgress.length === 0 ? (
              <div>
                <p>No projects yet</p>
              </div>
            ) : (
              projectProgress.slice(0, 3).map((project) => (
                <div className="flex items-center justify-between px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-sm font-semibold text-blue-600">
                      {project.name[0].toUpperCase()}
                    </div>

                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        {project.name}
                      </p>

                      <p className="mt-0.5 text-xs text-slate-400">
                        {project.totalTasks} tasks
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-600">
                    {project.status[0].toUpperCase() + project.status.slice(1)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Team Alerts */}
        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-800">
                Team Alerts
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Items that may need your attention.
              </p>
            </div>

            <AlertCircle size={16} className="text-slate-400" />
          </div>

          <div className="divide-y divide-slate-100">
            {/* Alert 1 */}
            <div className="flex gap-3 px-5 py-4">
              <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50">
                <Clock3 size={15} className="text-amber-600" />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-700">
                  {teamAlerts.upcomingTasks} tasks are approaching their
                  deadlines
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Review upcoming task deadlines.
                </p>
              </div>
            </div>

            {/* Alert 2 */}
            <div className="flex gap-3 px-5 py-4">
              <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-50">
                <AlertCircle size={15} className="text-red-500" />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-700">
                  {teamAlerts.overdueTasks} overdue tasks need attention
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Check your team's overdue tasks.
                </p>
              </div>
            </div>

            {/* Alert 3 */}
            <div className="flex gap-3 px-5 py-4">
              <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
                <CircleCheck size={15} className="text-emerald-600" />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-700">
                  {taskStats.completedTasks} tasks were completed
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Your team is making progress.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManagerDashboard;
