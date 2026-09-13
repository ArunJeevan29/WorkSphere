import { X } from "lucide-react";

function ViewUserModal({ user, onClose }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      {/* Modal */}
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              User Details
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              View information about this user.
            </p>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="cursor-pointer rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={18} />
          </button>
        </div>

        {/* User Profile */}
        <div className="flex flex-col items-center px-5 py-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-100 text-xl font-semibold text-violet-600">
            {user.name[0].toUpperCase()}
          </div>

          <h3 className="mt-3 text-base font-semibold text-slate-800">
            {user.name}
          </h3>

          <p className="mt-1 text-sm text-slate-500">{user.email}</p>
        </div>

        {/* User Information */}
        <div className="space-y-3 px-5 pb-5">
          {/* Name */}
          <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
            <span className="text-xs font-medium text-slate-500">Name</span>

            <span className="text-sm font-medium text-slate-700">
              {user.name}
            </span>
          </div>

          {/* Email */}
          <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
            <span className="text-xs font-medium text-slate-500">Email</span>

            <span className="text-sm text-slate-700">{user.email}</span>
          </div>

          {/* Role */}
          <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
            <span className="text-xs font-medium text-slate-500">Role</span>

            <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[11px] font-medium text-violet-600">
              {user.role[0].toUpperCase() + user.role.slice(1)}
            </span>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
            <span className="text-xs font-medium text-slate-500">Status</span>

            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-600">
              {user.status[0].toUpperCase() + user.status.slice(1)}
            </span>
          </div>

          {/* Joined */}
          <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
            <span className="text-xs font-medium text-slate-500">Joined</span>

            <span className="text-sm text-slate-700">
              {formatDate(user.createdAt)}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-slate-200 px-5 py-4">
          <button
            onClick={onClose}
            type="button"
            className="cursor-pointer rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViewUserModal;
