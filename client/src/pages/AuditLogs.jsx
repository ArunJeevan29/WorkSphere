import { Search, FileText, MoreVertical } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { getAllLogs } from "../api/auditApi";
import { formatDate, formatTime } from "../utils/formatDateUtils";
import { getActivityMessage } from "../utils/auditLogUtils";

function AuditLogs() {
  const [auditLogs, setAuditLogs] = useState([]);

  const [search, setSearch] = useState("");
  const [action, setAction] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);

  async function fetchAuditLogs() {
    try {
      const response = await getAllLogs({ search, action, page, limit });
      setAuditLogs(response.data.auditLogs);
      setTotalPages(response.data.totalPages);
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
    fetchAuditLogs();
  }, [search, action, page]);

  useEffect(() => {
    setPage(1);
  }, [search, action]);
  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Audit Logs</h1>

          <p className="mt-1 text-sm text-slate-500">
            Monitor and review system activity.
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Search */}
          <div className="relative w-full md:max-w-sm">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search logs..."
              className="w-full rounded-lg border border-slate-300 py-2.5 pl-9 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-3 sm:flex-row">
            {/* Action Filter */}
            <select
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            >
              <option value="">All Actions</option>
              <option value="created">Created</option>
              <option value="updated">Updated</option>
              <option value="deleted">Deleted</option>
              <option value="status_changed">Status Changed</option>
              <option value="role_changed">Role Changed</option>
              <option value="member_add_remove">Member Add/Remove</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Logs List */}
      <div className="rounded-xl border border-slate-200 bg-white">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50">
            <FileText size={16} className="text-violet-600" />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-800">
              System Activity
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Review recent actions performed across the system.
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            {/* Table Header */}
            <thead>
              <tr className="border-b border-slate-200 text-left">
                <th className="px-5 py-3 text-xs font-medium text-slate-500">
                  User
                </th>

                <th className="px-5 py-3 text-xs font-medium text-slate-500">
                  Action
                </th>

                <th className="px-5 py-3 text-xs font-medium text-slate-500">
                  Resource
                </th>

                <th className="px-5 py-3 text-xs font-medium text-slate-500">
                  Description
                </th>

                <th className="px-5 py-3 text-xs font-medium text-slate-500">
                  Date
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {auditLogs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-5 py-10 text-center">
                    <p className="text-sm text-slate-500">
                      No audit logs found
                    </p>
                  </td>
                </tr>
              ) : (
                auditLogs.map((logs) => (
                  <tr
                    key={logs._id}
                    className="border-b border-slate-100 transition hover:bg-slate-50"
                  >
                    {/* User */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
                          {logs.actor.name[0].toUpperCase()}
                        </div>

                        <div>
                          <p className="text-sm font-medium text-slate-800">
                            {logs.actor.name}
                          </p>

                          <p className="mt-0.5 text-xs text-slate-400">
                            {logs.actor.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-600">
                        {logs.action}
                      </span>
                    </td>

                    {/* Resource */}
                    <td className="px-5 py-4">
                      <div>
                        <p className="text-sm font-medium text-slate-700">
                          {logs.resource}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-400">
                          {logs.resourceId}
                        </p>
                      </div>
                    </td>

                    {/* Description */}
                    <td className="px-5 py-4">
                      <p className="max-w-xs truncate text-sm text-slate-600">
                        {getActivityMessage(logs)[0].toUpperCase() +
                          getActivityMessage(logs).slice(1)}
                      </p>
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4">
                      <div>
                        <p className="text-sm text-slate-600">
                          {formatDate(logs.createdAt)}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-400">
                          {formatTime(logs.createdAt)}
                        </p>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-slate-200 px-5 py-4">
          <p className="text-xs text-slate-500">
            Page {page} of {totalPages}
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>

            <button
              type="button"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
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

export default AuditLogs;
