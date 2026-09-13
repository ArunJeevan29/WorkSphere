import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { updateUserRole } from "../../api/userApi";

function ChangeRoleModal({ user, fetchUsers, onClose }) {
  const [role, setRole] = useState(user.role || "");
  const id = user._id;
  async function handleChangeRole(e) {
    e.preventDefault();
    try {
      const response = await updateUserRole(id, role);
      toast.success(response.data.message);
      fetchUsers();
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
              Change User Role
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Update the role assigned to this user.
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
        <form onSubmit={handleChangeRole} className="space-y-4 px-5 py-5">
          {/* User */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-700">
              User
            </label>

            <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 text-sm font-semibold text-violet-600">
                {user.name[0].toUpperCase()}
              </div>

              <div>
                <p className="text-sm font-medium text-slate-800">
                  {user.name}
                </p>

                <p className="mt-0.5 text-xs text-slate-400">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Current Role */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-700">
              Current Role
            </label>

            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
              <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[11px] font-medium text-violet-600">
                {user.role[0].toUpperCase() + user.role.slice(1)}
              </span>
            </div>
          </div>

          {/* New Role */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-700">
              New Role
            </label>

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            >
              <option value="">Select Role</option>
              <option value="manager">Manager</option>
              <option value="member">Member</option>
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
              Update Role
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangeRoleModal;
