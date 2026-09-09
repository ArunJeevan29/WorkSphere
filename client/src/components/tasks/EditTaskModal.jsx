import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { updateTask } from "../../api/taskApi";
import { getproject } from "../../api/projectApi";
import { useEffect } from "react";

function EditTaskModal({
  task,
  members: projectMembers,
  fetchProject,
  isTaskPageEditModal,
  fetchTasks,
  onClose,
  fetchProjectTasks,
}) {
  const [title, setTitle] = useState(task.title || "");
  const [description, setDescription] = useState(task.description || "");
  const [priority, setPriority] = useState(task.priority || "");
  const [dueDate, setDueDate] = useState(
    task.dueDate ? task.dueDate.slice(0, 10) : "",
  );
  const [assignUsers, setAssignUsers] = useState(
    task.assignedTo.map((user) => user._id),
  );
  const [members, setMembers] = useState(
    isTaskPageEditModal ? [] : projectMembers,
  );

  async function fetchProjectMembers() {
    const response = await getproject(task.project._id);
    setMembers(response.data.members);
  }

  useEffect(() => {
    if (isTaskPageEditModal) {
      fetchProjectMembers();
    }
  }, [isTaskPageEditModal, task.project._id]);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      if (
        !title ||
        !description ||
        !priority ||
        !dueDate ||
        assignUsers.length === 0
      ) {
        return toast.error("Fill all the fields");
      }

      const updatedTask = {
        title,
        description,
        assignedTo: assignUsers,
        priority,
        dueDate,
      };

      const response = await updateTask(task._id, updatedTask);
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
      <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Edit Task</h2>

            <p className="mt-1 text-xs text-slate-500">
              Update the details of this task.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5">
          {/* Title */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-700">
              Task Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-700">
              Description
            </label>

            <textarea
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
              className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            />
          </div>

          {/* Priority + Due Date */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Priority */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-700">
                Priority
              </label>

              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-violet-500"
              >
                <option value="">Select Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-700">
                Due Date
              </label>

              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-violet-500"
              />
            </div>
          </div>

          {/* Assigned Users */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-700">
              Assign Users
            </label>

            <select
              multiple
              value={assignUsers}
              onChange={(e) =>
                setAssignUsers(
                  Array.from(
                    e.target.selectedOptions,
                    (option) => option.value,
                  ),
                )
              }
              className="h-28 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-violet-500"
            >
              {members.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.name}
                </option>
              ))}
            </select>

            <p className="mt-1.5 text-[11px] text-slate-400">
              Hold Ctrl/Cmd to select multiple users.
            </p>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-violet-700 cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditTaskModal;
