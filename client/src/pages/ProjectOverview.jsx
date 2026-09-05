import {
  ArrowLeft,
  Calendar,
  Clock,
  MoreVertical,
  Pencil,
  User,
  CheckSquare,
} from "lucide-react";
import { useOutletContext, NavLink, useParams } from "react-router-dom";
import { dateAndTime, formatDate } from "../utils/formatDateUtils";
import { formatActivity } from "../utils/auditLogUtils";

function ProjectOverview() {
  const { id } = useParams();
  const {
    project,
    members,
    recentTasks,
    auditLogs,
    completedTasks,
    totalTasks,
    progress,
  } = useOutletContext();

  return (
    <>
      {/* Top Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* Project Information */}
        <div className="xl:col-span-4 bg-white border border-slate-200 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-slate-800 mb-5">
            Project Information
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-[90px_1fr] gap-4 text-sm">
              <p className="text-slate-400">Project Name</p>
              <p className="text-slate-700">{project.name}</p>
            </div>

            <div className="grid grid-cols-[90px_1fr] gap-4 text-sm">
              <p className="text-slate-400">Description</p>
              <p className="text-slate-700">{project.description}.</p>
            </div>

            <div className="grid grid-cols-[90px_1fr] gap-4 text-sm">
              <p className="text-slate-400">Status</p>

              <div>
                <span className="px-2 py-1 text-xs rounded-full bg-emerald-50 text-emerald-600">
                  {project.status?.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-[90px_1fr] gap-4 text-sm">
              <p className="text-slate-400">Created By</p>

              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center">
                  <User size={13} className="text-slate-500" />
                </div>

                <p className="text-slate-700">
                  {project.createdBy?.name?.toUpperCase()}{" "}
                  <span className="text-slate-400">
                    ({project.createdBy?.role})
                  </span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-[90px_1fr] gap-4 text-sm">
              <p className="text-slate-400">Created On</p>

              <div className="flex items-center gap-2 text-slate-700">
                <Calendar size={14} className="text-slate-400" />
                {dateAndTime(project.createdAt)}
              </div>
            </div>

            <div className="grid grid-cols-[90px_1fr] gap-4 text-sm">
              <p className="text-slate-400">Last Updated</p>

              <div className="flex items-center gap-2 text-slate-700">
                <Clock size={14} className="text-slate-400" />
                {dateAndTime(project.updatedAt)}
              </div>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="xl:col-span-3 bg-white border border-slate-200 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-slate-800">Progress</h2>

          <div className="flex flex-col items-center justify-center py-5">
            {/* Circular Progress UI */}
            <div className="w-28 h-28 rounded-full border-[4px] border-violet-600 flex items-center justify-center">
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-800">
                  {progress.toFixed(0)}%
                </p>
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-600">
              {completedTasks} of {totalTasks} tasks completed
            </p>
          </div>

          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-violet-600 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Members */}
        <div className="xl:col-span-5 bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-800">
              Members ({members.length})
            </h2>

            <NavLink
              to={`/projects/${id}/members`}
              className="text-xs font-medium text-violet-600 hover:text-violet-700 cursor-pointer"
            >
              View All
            </NavLink>
          </div>

          <div className="space-y-3">
            {members.length === 0 ? (
              <p className="py-6 text-center text-xs text-slate-400">
                No members yet
              </p>
            ) : (
              members.map((member) => (
                <div
                  key={member._id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center">
                      <span className="text-xs font-medium text-slate-600">
                        {member.name[0].toUpperCase()}
                      </span>
                    </div>

                    <p className="text-xs font-medium text-slate-700">
                      {member.name.toUpperCase()}
                    </p>
                  </div>

                  <div className="flex items-center gap-5">
                    <p className="text-xs text-slate-400">
                      {member.role.toUpperCase()}
                    </p>

                    <span className="px-2 py-0.5 text-[10px] rounded-full bg-slate-100 text-slate-500">
                      {member.role[0].toUpperCase() + member.role.slice(1)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* Recent Tasks */}
        <div className="xl:col-span-6 bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-slate-800">
              Recent Tasks
            </h2>

            <NavLink
              to={`/projects/${id}/tasks`}
              className="text-xs font-medium text-violet-600 hover:text-violet-700 cursor-pointer"
            >
              View All Tasks
            </NavLink>
          </div>

          <div className="space-y-4">
            {recentTasks.length === 0 ? (
              <p className="py-6 text-center text-xs text-slate-400">
                No tasks yet
              </p>
            ) : (
              recentTasks.map((task) => (
                <div
                  key={task._id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <CheckSquare size={15} className="text-violet-500" />

                    <p className="text-xs text-slate-700">{task.title}</p>
                  </div>

                  <div className="flex items-center gap-5">
                    <span
                      className={`px-2 py-1 text-[10px] rounded-full ${
                        task.status === "completed"
                          ? "bg-violet-50 text-violet-600"
                          : task.status === "in-progress"
                            ? "bg-blue-50 text-blue-600"
                            : "bg-amber-50 text-amber-600"
                      }`}
                    >
                      {task.status === "in-progress"
                        ? "In Progress"
                        : task.status.charAt(0).toUpperCase() +
                          task.status.slice(1)}
                    </span>

                    <p className="text-[10px] text-slate-400 w-36">
                      {task.status === "completed"
                        ? `Completed on ${formatDate(task.updatedAt)}`
                        : `Due on ${formatDate(task.dueDate)}`}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Project Activity */}
        <div className="xl:col-span-6 bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-slate-800">
              Project Activity
            </h2>

            <NavLink
              to={`/projects/${id}/activity`}
              className="text-xs font-medium text-violet-600 hover:text-violet-700 cursor-pointer"
            >
              View All Activity
            </NavLink>
          </div>

          <div className="space-y-5">
            {auditLogs.length === 0 ? (
              <p className="py-6 text-center text-xs text-slate-400">
                No project activity yet
              </p>
            ) : (
              auditLogs.map((log) => (
                <div key={log._id} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                    <span className="text-xs font-medium text-slate-600">
                      {log.actor?.name?.[0]?.toUpperCase()}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs text-slate-700">
                      <span className="font-semibold">{log.actor?.name}</span>{" "}
                      {formatActivity(log)}
                    </p>

                    <p className="text-[10px] text-slate-400 mt-1">
                      {new Date(log.createdAt).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ProjectOverview;
