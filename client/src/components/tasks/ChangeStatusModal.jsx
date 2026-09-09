import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { updateTaskStatus } from "../../api/taskApi";

function ChangeStatusModal({ task, fetchTasks, onClose }) {
  const [status, setStatus] = useState(task.status || "");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await updateTaskStatus(task._id, status);
      toast.success(response.data.message);
      fetchTasks();
      onClose();
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      {/* Modal */}
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Change Task Status
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Update the status of this task.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5">
          {/* Task Name */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-700">
              Task
            </label>

            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
              <p className="text-sm font-medium text-slate-700">{task.title}</p>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-700">
              Status
            </label>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="cursor-pointer rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-violet-700"
            >
              Update Status
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangeStatusModal;
