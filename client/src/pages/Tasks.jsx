import { Search, Plus, MoreVertical, ClipboardList, User } from "lucide-react";
import { useEffect, useState } from "react";
import { getTasks } from "../api/taskApi";
import { toast } from "react-hot-toast";
import EditTaskModal from "../components/tasks/EditTaskModal";
import DeleteTaskModal from "../components/tasks/DeleteTaskModal";
import ChangeStatusModal from "../components/tasks/ChangeStatusModal";
import { formatDate } from "../utils/formatDateUtils";

function Tasks() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedTask, setSelectedTask] = useState(null);
  const [showEditTask, setShowEditTask] = useState(false);
  const [showChangeStatus, setShowChangeStatus] = useState(false);
  const [showDeleteTask, setShowDeleteTask] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [sortBy, setSortBy] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  async function fetchTasks() {
    try {
      const response = await getTasks({
        search,
        status,
        priority,
        sortBy,
        page,
        limit,
      });
      setTasks(response.data.tasks);
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
    fetchTasks();
  }, [search, status, priority, sortBy, page]);

  useEffect(() => {
    setPage(1);
  }, [search, status, priority, sortBy]);
  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tasks</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage and track tasks across your projects.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700"
        >
          <Plus size={17} />
          Create Task
        </button>
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
              placeholder="Search tasks..."
              className="w-full rounded-lg border border-slate-300 py-2.5 pl-9 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-3 sm:flex-row">
            {/* Status */}
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            {/* Priority */}
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            >
              <option value="">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            >
              <option value="">Sort By</option>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="rounded-xl border border-slate-200 bg-white">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
            <ClipboardList size={17} />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-800">All Tasks</h2>

            <p className="mt-1 text-xs text-slate-400">
              View and manage your tasks.
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-slate-200 text-left">
                <th className="px-5 py-3 text-xs font-medium text-slate-500">
                  Task
                </th>

                <th className="px-5 py-3 text-xs font-medium text-slate-500">
                  Project
                </th>

                <th className="px-5 py-3 text-xs font-medium text-slate-500">
                  Assigned To
                </th>

                <th className="px-5 py-3 text-xs font-medium text-slate-500">
                  Priority
                </th>

                <th className="px-5 py-3 text-xs font-medium text-slate-500">
                  Status
                </th>

                <th className="px-5 py-3 text-xs font-medium text-slate-500">
                  Due Date
                </th>

                <th className="px-5 py-3 text-xs font-medium text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-5 py-10 text-center">
                    <p className="text-sm text-slate-500">No tasks found</p>
                  </td>
                </tr>
              ) : (
                tasks.map((task) => (
                  <tr
                    key={task._id}
                    className="border-b border-slate-100 transition hover:bg-slate-50"
                  >
                    {/* Task */}
                    <td className="px-5 py-4">
                      <div>
                        <p className="text-sm font-medium text-slate-800">
                          {task.title}
                        </p>

                        <p className="mt-1 max-w-xs truncate text-xs text-slate-400">
                          {task.description}
                        </p>
                      </div>
                    </td>

                    {/* Project */}
                    <td className="px-5 py-4">
                      <span className="text-sm text-slate-600">
                        {task.project?.name}
                      </span>
                    </td>

                    {/* Assigned To */}
                    <td className="px-5 py-4">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200">
                        <User size={13} className="text-slate-500" />
                      </div>
                      <span className="text-sm text-slate-600">
                        {task.assignedTo.map((user) => (
                          <p key={user._id}>
                            {user.name[0].toUpperCase() + user.name.slice(1)}
                          </p>
                        ))}
                      </span>
                    </td>

                    {/* Priority */}
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-orange-50 px-2.5 py-1 text-[11px] font-medium text-orange-600">
                        {task.priority[0].toUpperCase() +
                          task.priority.slice(1)}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-600">
                        {task.status[0].toUpperCase() + task.status.slice(1)}
                      </span>
                    </td>

                    {/* Due Date */}
                    <td className="px-5 py-4">
                      <span className="text-sm text-slate-500">
                        {formatDate(task.dueDate)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() =>
                            setOpenMenu(openMenu === task._id ? null : task._id)
                          }
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                        >
                          <MoreVertical size={17} />
                        </button>

                        {openMenu === task._id && (
                          <div className="absolute right-0 z-20 mt-1 w-40 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                            {/* Admin / Manager */}
                            {(user.role === "admin" ||
                              user.role === "manager") && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedTask(task);
                                    setShowEditTask(true);
                                    setOpenMenu(null);
                                  }}
                                  className="block w-full px-4 py-2 text-left text-sm text-slate-600 transition hover:bg-slate-50"
                                >
                                  Edit Task
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedTask(task);
                                    setShowDeleteTask(true);
                                    setOpenMenu(null);
                                  }}
                                  className="block w-full px-4 py-2 text-left text-sm text-slate-600 transition hover:bg-slate-50"
                                >
                                  Delete Task
                                </button>
                              </>
                            )}

                            {/* All Roles */}
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedTask(task);
                                setShowChangeStatus(true);
                                setOpenMenu(null);
                              }}
                              className="block w-full px-4 py-2 text-left text-sm text-slate-600 transition hover:bg-slate-50"
                            >
                              Change Status
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && tasks.length > 0 && (
          <div className="flex items-center justify-between border-t border-slate-200 px-5 py-4">
            <p className="text-xs text-slate-500">
              Page {page} of {totalPages}
            </p>

            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>

              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
      {showEditTask && selectedTask && (
        <EditTaskModal
          task={selectedTask}
          isTaskPageEditModal={true}
          fetchTasks={fetchTasks}
          onClose={() => {
            setShowEditTask(false);
            setSelectedTask(null);
          }}
        />
      )}

      {showDeleteTask && selectedTask && (
        <DeleteTaskModal
          task={selectedTask}
          isTaskPageEditModal={true}
          fetchTasks={fetchTasks}
          onClose={() => {
            setShowDeleteTask(false);
            setSelectedTask(null);
          }}
        />
      )}

      {showChangeStatus && selectedTask && (
        <ChangeStatusModal
          task={selectedTask}
          fetchTasks={fetchTasks}
          onClose={() => {
            setShowChangeStatus(false);
            setSelectedTask(null);
          }}
        />
      )}
    </div>
  );
}

export default Tasks;
