import { Activity, Search, User } from "lucide-react";
import { useEffect, useState } from "react";
import { getAuditLogs } from "../api/projectApi";
import { useParams } from "react-router-dom";
import { getActivityMessage, getRelativeTime } from "../utils/auditLogUtils";

function ProjectActivity() {
  const { id } = useParams();

  const [auditLogs, setAuditLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [action, setAction] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  async function fetchProjectActivity() {
    try {
      const response = await getAuditLogs(id, {
        search,
        action,
        page,
        limit,
      });
      setAuditLogs(response.data.auditLogs);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    fetchProjectActivity();
  }, [search, action, page]);

  useEffect(() => {
    setPage(1);
  }, [search, action]);

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Project Activity</h1>

        <p className="mt-1 text-sm text-slate-500">
          Track recent activity and changes made in this project.
        </p>
      </div>

      {/* Search & Filter */}
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Search */}
          <div className="relative w-full md:max-w-sm">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search activity..."
              className="w-full rounded-lg border border-slate-300 py-2.5 pl-9 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            />
          </div>

          {/* Action Filter */}
          <select
            value={action}
            onChange={(e) => setAction(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100 md:w-52"
          >
            <option value="">All Activities</option>
            <option value="PROJECT_CREATED">Project Created</option>
            <option value="TASK_CREATED">Task Created</option>
            <option value="TASK_UPDATED">Task Updated</option>
            <option value="TASK_DELETED">Task Deleted</option>
            <option value="TASK_STATUS_UPDATED">Task Status Updated</option>
            <option value="PROJECT_MEMBERS_ADDED">Members Added</option>
            <option value="PROJECT_MEMBERS_REMOVED">Members Removed</option>
          </select>
        </div>
      </div>

      {/* Activity List */}
      <div className="rounded-xl border border-slate-200 bg-white">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
            <Activity size={17} />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-800">
              Recent Activity
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Activity history for this project.
            </p>
          </div>
        </div>

        {/* Activity Rows */}
        <div>
          {auditLogs.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-slate-500">
              No activity found
            </p>
          ) : (
            auditLogs.map((log) => (
              <div
                key={log._id}
                className="border-b border-slate-100 px-5 py-4 last:border-b-0"
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-600">
                    <User size={16} />
                  </div>

                  {/* Activity Details */}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-slate-700">
                      <span className="font-medium text-slate-900">
                        {log.actor.name}
                      </span>{" "}
                      {getActivityMessage(log)}
                    </p>

                    <p className="mt-1 text-[11px] text-slate-400">
                      {getRelativeTime(log.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-slate-200 px-5 py-4">
          <p className="text-xs text-slate-500">
            Page {page} of {totalPages}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>

            <button
              type="button"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectActivity;
