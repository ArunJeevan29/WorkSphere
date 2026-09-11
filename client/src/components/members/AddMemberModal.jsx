import { X, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import {
  getAvailableProjectMembers,
  addProjectMember,
} from "../../api/projectApi";
import { toast } from "react-hot-toast";

function AddMemberModal({ id, fetchProject, onClose }) {
  const [availableUsers, setAvailableUsers] = useState([]);
  const [members, setMembers] = useState([]);
  async function fetchAvailableUsers() {
    try {
      const response = await getAvailableProjectMembers(id);
      setAvailableUsers(response.data.users);
    } catch (error) {
      console.log(error.response.data);
      console.log(error);
    }
  }
  useEffect(() => {
    fetchAvailableUsers();
  }, []);

  async function handleAddMembers(e) {
    e.preventDefault();
    try {
      const response = await addProjectMember(id, members);
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
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      {/* Modal */}
      <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
              <UserPlus size={17} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Add Members
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Add users to this project.
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

        {/* Form */}
        <form onSubmit={handleAddMembers} className="space-y-4 px-5 py-5">
          {/* Users */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-700">
              Select Users
            </label>
            <select
              multiple
              value={members}
              onChange={(e) =>
                setMembers(
                  Array.from(
                    e.target.selectedOptions,
                    (option) => option.value,
                  ),
                )
              }
              className="h-32 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-violet-500"
            >
              {availableUsers.length === 0 ? (
                <option disabled>No Available Members</option>
              ) : (
                availableUsers.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name}
                  </option>
                ))
              )}
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
              Add Members
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddMemberModal;
