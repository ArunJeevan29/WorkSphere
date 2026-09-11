import { X, Trash2, User } from "lucide-react";
import { removeProjectMembers } from "../../api/projectApi";
import { toast } from "react-hot-toast";
import { useState } from "react";

function RemoveMemberModal({ id, fetchProject, member, onClose }) {
  const [loading, setLoading] = useState(false);
  async function handleDeleteMember() {
    try {
      setLoading(true);
      const response = await removeProjectMembers(id, member._id);
      toast.success(response.data.message);
      await fetchProject();
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
    } finally {
      setLoading(false);
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
                Remove Member
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Remove this user from the project.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="px-5 py-5">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-600">
                <User size={17} />
              </div>

              <div>
                <p className="text-sm font-medium text-slate-800">
                  {member?.name}
                </p>

                <p className="text-xs text-slate-500">{member?.email}</p>
              </div>
            </div>
          </div>

          <p className="mt-4 text-sm leading-6 text-slate-600">
            Are you sure you want to remove this member from the project?
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-slate-200 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            onClick={handleDeleteMember}
            type="button"
            disabled={loading}
            className="cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Removing..." : "Remove Member"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default RemoveMemberModal;
