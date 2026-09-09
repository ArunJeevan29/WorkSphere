import { X, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { deleteTask } from "../../api/taskApi";

function DeleteTaskModal({
  task,
  fetchProject,
  isTaskPageEditModal,
  fetchTasks,
  onClose,
  fetchProjectTasks,
}) {
  async function handleDeleteTask() {
    try {
      const response = await deleteTask(task._id);
      toast.success(response.data.message);
      if (isTaskPageEditModal) {
        fetchTasks();
      } else {
        fetchProjectTasks();
        fetchProject();
      }
      onClose();
    } catch (error) {
      const errors = error.response?.data?.error;
      const message = error.response?.data?.message;
      if (Array.isArray(errors) && errors.length > 0) {
        toast.error(errors[0].msg);
      } else if (message) {
        toast.error(message);
      } else {
        toast.error(error.message);
      }
    }
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      {/* Modal */}
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600">
              <Trash2 size={17} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Delete Task
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Permanently remove this task.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="px-5 py-5">
          <p className="text-sm leading-6 text-slate-600">
            Are you sure you want to delete this task?
          </p>

          {/* Task Preview */}
          <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-sm font-medium text-slate-800">{task?.title}</p>

            <p className="mt-1 line-clamp-2 text-xs text-slate-500">
              {task?.description}
            </p>
          </div>

          <p className="mt-3 text-xs text-red-500">
            This action cannot be undone.
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-slate-200 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleDeleteTask}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-red-700 cursor-pointer"
          >
            Delete Task
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteTaskModal;
