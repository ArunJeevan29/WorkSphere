import {
  ArrowLeft,
  Calendar,
  Clock,
  MoreVertical,
  Pencil,
  User,
  CheckSquare,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getproject, fetchAllTask } from "../api/projectApi";

function ProjectDetails() {
  const [project, setProject] = useState([]);
  const [members, setMembers] = useState([]);
  const [recentTasks, setRecentTasks] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);
  const [progress, setProgress] = useState(0);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatActivity = (log) => {
    switch (log.action) {
      case "PROJECT_CREATED":
        return "created this project";

      case "PROJECT_UPDATED":
        return "updated this project";

      case "PROJECT_DELETED":
        return "deleted this project";

      case "PROJECT_MEMBERS_ADDED":
        return "added members to this project";

      case "PROJECT_MEMBERS_REMOVED":
        return "removed members from this project";

      default:
        return "performed an action";
    }
  };

  const { id } = useParams();

  async function fetchProject() {
    try {
      const response1 = await getproject(id);
      setProject(response1.data);
      setMembers(response1.data.members);
      const response2 = await fetchAllTask(id);
      setRecentTasks(response2.data.tasks);
      setCompletedTasks(response2.data.completedTasks);
      setTotalTasks(response2.data.totalTasks);
      setProgress(response2.data.progress);
      const response3 = await getAuditLogs(id);
      setAuditLogs(response3.data.auditLogs);
    } catch (error) {
      // const errors = error.response?.data?.error;
      // const message = error.response?.data?.message;
      console.log("Cannot fetch Project", error.response1?.data?.message);
    }
  }

  useEffect(() => {
    fetchProject();
  }, [id]);

  return (
    <div className="space-y-5">
      {/* Back Button */}
      <button className="flex items-center gap-2 text-sm font-medium text-violet-600 hover:text-violet-700 cursor-pointer">
        <ArrowLeft size={15} />
        Back to Projects
      </button>

      {/* Project Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">
              {project.name}
            </h1>

            <span className="px-3 py-1 text-xs font-medium rounded-full bg-emerald-50 text-emerald-600">
              {project.status?.toUpperCase()}
            </span>
          </div>

          <p className="mt-2 text-sm text-slate-500">{project.description}</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition cursor-pointer">
            <Pencil size={15} />
            Edit Project
          </button>

          <button className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer">
            <MoreVertical size={18} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <div className="flex items-center gap-8">
          <button className="px-4 py-3 text-sm font-medium text-violet-600 border-b-2 border-violet-600 cursor-pointer">
            Overview
          </button>

          <button className="px-4 py-3 text-sm text-slate-500 hover:text-slate-900 cursor-pointer">
            Tasks ({recentTasks.length})
          </button>

          <button className="px-4 py-3 text-sm text-slate-500 hover:text-slate-900 cursor-pointer">
            Members ({members.length})
          </button>

          <button className="px-4 py-3 text-sm text-slate-500 hover:text-slate-900 cursor-pointer">
            Activity
          </button>
        </div>
      </div>

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
                  {project.createdBy?.name?.toUpperCase()}
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
                {new Date(project.createdAt).toLocaleString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </div>
            </div>

            <div className="grid grid-cols-[90px_1fr] gap-4 text-sm">
              <p className="text-slate-400">Last Updated</p>

              <div className="flex items-center gap-2 text-slate-700">
                <Clock size={14} className="text-slate-400" />
                {new Date(project.updatedAt).toLocaleString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
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
            <div className="w-[75%] h-full bg-violet-600 rounded-full" />
          </div>
        </div>

        {/* Members */}
        <div className="xl:col-span-5 bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-800">
              Members (5)
            </h2>

            <button className="text-xs font-medium text-violet-600 hover:text-violet-700 cursor-pointer">
              View All
            </button>
          </div>

          <div className="space-y-3">
            {members.map((member) => (
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
            ))}
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

            <button className="text-xs font-medium text-violet-600 hover:text-violet-700 cursor-pointer">
              View All Tasks
            </button>
          </div>

          <div className="space-y-4">
            {recentTasks.map((task) => (
              <div key={task._id} className="flex items-center justify-between">
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
            ))}
          </div>
        </div>

        {/* Project Activity */}
        <div className="xl:col-span-6 bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-slate-800">
              Project Activity
            </h2>

            <button className="text-xs font-medium text-violet-600 hover:text-violet-700 cursor-pointer">
              View All Activity
            </button>
          </div>

          <div className="space-y-5">
            {auditLogs.map((log) => (
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetails;
