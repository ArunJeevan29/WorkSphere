import { useAuth } from "../context/authContext";

function Navbar() {
  const { user, logout } = useAuth();
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
      {/* Logo / Application Name */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-slate-900 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold">SA</span>
        </div>

        <div>
          <h1 className="font-bold text-slate-900">Secure Access Hub</h1>

          <p className="text-xs text-slate-500">
            Access & Workspace Management
          </p>
        </div>
      </div>

      {/* User Section */}
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-semibold text-slate-800">
            {user?.name.toUpperCase()}
          </p>
          <p className="text-xs text-slate-500">{user?.role.toUpperCase()}</p>
        </div>

        <div className="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center">
          <span className="text-sm font-semibold text-white">
            {user?.name[0].toUpperCase()}
          </span>
        </div>

        <button
          className="px-4 py-2 text-sm font-medium border border-slate-300 rounded-lg hover:bg-slate-100 transition cursor-pointer"
          onClick={logout}
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Navbar;
