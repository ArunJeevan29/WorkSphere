import { LogOut } from "lucide-react";
import { useAuth } from "../context/authContext";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      {/* Logo / Application Name */}
      <div className="flex items-center gap-3">
        {/* Logo */}
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 shadow-sm">
          <span className="text-sm font-bold text-white">SA</span>
        </div>

        {/* Application Name */}
        <div>
          <h1 className="text-sm font-bold text-slate-800">
            Secure Access Hub
          </h1>

          <p className="text-[11px] text-slate-400">
            Access & Workspace Management
          </p>
        </div>
      </div>

      {/* User Section */}
      <div className="flex items-center gap-4">
        {/* User Details */}
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-slate-800">
            {user?.name?.toUpperCase()}
          </p>

          <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-slate-400">
            {user?.role}
          </p>
        </div>

        {/* Avatar */}
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-50 ring-1 ring-violet-100">
          <span className="text-sm font-bold text-violet-600">
            {user?.name?.[0]?.toUpperCase()}
          </span>
        </div>

        {/* Divider */}
        <div className="hidden h-7 w-px bg-slate-200 sm:block" />

        {/* Logout */}
        <button
          type="button"
          onClick={logout}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-600 transition-all duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={15} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}

export default Navbar;
