import {
  ArrowLeft,
  Plus,
  Search,
  MoreVertical,
  CalendarDays,
  User,
  CheckSquare,
} from "lucide-react";
import { useState, useEffect } from "react";
import { fetchAllTask } from "../api/projectApi";
import { useParams, useOutletContext } from "react-router-dom";
import CreateTaskModal from "../components/tasks/CreateTaskModal";
import EditTaskModal from "../components/tasks/EditTaskModal";
import DeleteTaskModal from "../components/tasks/DeleteTaskModal";

function ProjectTasks() {
  const { id } = useParams();
  const { members, fetchProject } = useOutletContext();
  const [loading, setLoading] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showEditTask, setShowEditTask] = useState(false);
  const [showDeleteTask, setShowDeleteTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);

  const [tasks, setTasks] = useState([]);
  const [totalTasks, setTotalTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [pendingTask, setPendingTask] = useState(0);
  const [inProgressTask, setInProgressTask] = useState(0);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(5);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };
  async function fetchProjectTasks() {
    try {
      setLoading(true);
      const response = await fetchAllTask(id, {
        status: statusFilter,
        priority: priorityFilter,
        search,
        sort: sortBy,
        page,
        limit,
      });
      setTasks(response.data.tasks);
      setTotalTasks(response.data.totalTasks);
      setTotalPages(response.data.totalPages);
      setCompletedTasks(response.data.completedTasks);
      setPendingTask(response.data.pendingTask);
      setInProgressTask(response.data.inProgressTask);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProjectTasks();
  }, [id, statusFilter, priorityFilter, search, sortBy, page]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter, priorityFilter, search]);

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Project Tasks</h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage and track tasks for this project.
          </p>
        </div>

        <button
          onClick={() => setShowCreateTask(true)}
          className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-violet-700 cursor-pointer"
        >
          <Plus size={17} />
          Create Task
        </button>
      </div>

      {/* Task Summary */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-xs text-slate-500">Total Tasks</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{totalTasks}</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-xs text-slate-500">Pending</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {pendingTask}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-xs text-slate-500">In Progress</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {inProgressTask}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-xs text-slate-500">Completed</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {completedTasks}
          </p>
        </div>
      </div>

      {/* Search / Filters */}

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-sm">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks..."
              className="w-full rounded-lg border border-slate-300 py-2.5 pl-9 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            />
          </div>

          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-violet-500"
            >
              <option value={""}>All Status</option>
              <option value={"pending"}>Pending</option>
              <option value={"in-progress"}>In Progress</option>
              <option value={"completed"}>Completed</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-violet-500"
            >
              <option value={""}>All Priority</option>
              <option value={"high"}>High</option>
              <option value={"medium"}>Medium</option>
              <option value={"low"}>Low</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-violet-500"
            >
              <option value="newest">Newest Created</option>
              <option value="oldest">Oldest Created</option>
              <option value="due-asc">Due Date — Earliest</option>
              <option value="due-desc">Due Date — Latest</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tasks */}

      <div className="rounded-xl border border-slate-200 bg-white">
        {/* Table Header */}

        <div className="hidden border-b border-slate-200 px-5 py-4 md:grid md:grid-cols-[2fr_1.2fr_1fr_1fr_40px] md:items-center md:gap-4">
          <p className="text-xs font-medium text-slate-400">Task</p>

          <p className="text-xs font-medium text-slate-400">Assigned To</p>

          <p className="text-xs font-medium text-slate-400">Priority</p>

          <p className="text-xs font-medium text-slate-400">Status</p>

          <span />
        </div>

        {/* Task Rows */}

        <div>
          {loading ? (
            <p className="px-5 py-10 text-center text-sm text-slate-500">
              Loading tasks...
            </p>
          ) : tasks.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-slate-500">
              No tasks yet
            </p>
          ) : (
            tasks.map((task) => (
              <div
                key={task._id}
                className="border-b border-slate-100 px-5 py-4 last:border-b-0 hover:bg-slate-50 transition"
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-[2fr_1.2fr_1fr_1fr_40px] md:items-center">
                  {/* Task */}

                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                      <CheckSquare size={16} />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        {task.title}
                      </p>

                      <p className="mt-1 line-clamp-1 text-xs text-slate-400">
                        {task.description}
                      </p>

                      <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-400">
                        <CalendarDays size={12} />
                        Due {formatDate(task.dueDate)}
                      </div>
                    </div>
                  </div>

                  {/* Assigned User */}

                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200">
                      <User size={13} className="text-slate-500" />
                    </div>

                    <span className="text-xs text-slate-600">
                      {task.assignedTo.map((user) => (
                        <p key={user._id}>
                          {user.name[0].toUpperCase() + user.name.slice(1)}
                        </p>
                      ))}
                    </span>
                  </div>

                  {/* Priority */}
                  <div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${
                        task.priority === "high"
                          ? "bg-red-50 text-red-600"
                          : task.priority === "medium"
                            ? "bg-amber-50 text-amber-600"
                            : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {task.priority[0].toUpperCase() + task.priority.slice(1)}
                    </span>
                  </div>

                  {/* Status */}

                  <div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${
                        task.status === "completed"
                          ? "bg-emerald-50 text-emerald-600"
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
                  </div>

                  {/* More */}

                  <div className="relative hidden md:block">
                    <button
                      onClick={() =>
                        setOpenMenu(openMenu === task._id ? null : task._id)
                      }
                      className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
                    >
                      <MoreVertical size={17} />
                    </button>

                    {openMenu === task._id && (
                      <div className="absolute right-0 top-10 z-20 w-32 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                        {/* Edit */}
                        <button
                          onClick={() => {
                            setSelectedTask(task);
                            setShowEditTask(true);
                            setOpenMenu(null);
                          }}
                          className="w-full px-3 py-2 text-left text-xs text-slate-600 hover:bg-slate-50 cursor-pointer"
                        >
                          Edit Task
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => {
                            setSelectedTask(task);
                            setShowDeleteTask(true);
                            setOpenMenu(null);
                          }}
                          className="w-full px-3 py-2 text-left text-xs text-red-600 hover:bg-red-50 cursor-pointer"
                        >
                          Delete Task
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
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
      {showCreateTask && (
        <CreateTaskModal
          id={id}
          fetchProject={fetchProject}
          fetchProjectTasks={fetchProjectTasks}
          members={members}
          onClose={() => setShowCreateTask(false)}
        />
      )}
      {showEditTask && selectedTask && (
        <EditTaskModal
          task={selectedTask}
          members={members}
          fetchProject={fetchProject}
          fetchProjectTasks={fetchProjectTasks}
          onClose={() => {
            setShowEditTask(false);
            setSelectedTask(null);
          }}
        />
      )}
      {showDeleteTask && selectedTask && (
        <DeleteTaskModal
          task={selectedTask}
          fetchProject={fetchProject}
          fetchProjectTasks={fetchProjectTasks}
          onClose={() => {
            (setShowDeleteTask(false), setSelectedTask(null));
          }}
        />
      )}
    </div>
  );
}

export default ProjectTasks;
