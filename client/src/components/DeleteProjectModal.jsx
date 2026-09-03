import { X, AlertTriangle } from "lucide-react";
import { deleteProject } from "../api/projectApi";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function DeleteProjectModal({ fetchProject, id, project, onClose }) {
  const navigate = useNavigate();
  async function handleDeleteProject() {
    try {
      const response = await deleteProject(id);
      toast.success(response.data.message);
      await fetchProject();
      onClose();
      navigate("/projects");
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
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Delete Project
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Permanently remove this project.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="px-5 py-5">
          {/* Warning */}
          <div className="flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600">
              <AlertTriangle size={18} />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-red-800">
                Are you sure?
              </h3>

              <p className="mt-1 text-xs leading-5 text-red-700">
                This action cannot be undone. Deleting this project will
                permanently remove the project and its associated data.
              </p>
            </div>
          </div>

          {/* Project Information */}
          <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-800">
              {project?.name}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              {project?.description}
            </p>
          </div>

          {/* Actions */}
          <div className="mt-5 flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleDeleteProject}
              className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
            >
              Delete Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteProjectModal;
