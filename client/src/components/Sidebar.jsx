import { NavLink } from "react-router-dom";
import { useAuth } from "../context/authContext";

function Sidebar() {
  const { user } = useAuth();
  return (
    <aside className="w-64 min-h-[calc(100vh-64px)] bg-white border-r border-slate-200 p-4 flex flex-col">
      {/* Navigation */}
      <nav className="flex flex-col gap-2">
        <NavLink
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-900 text-white text-sm font-medium text-left cursor-pointer"
        >
          Dashboard
        </NavLink>

        {["admin", "manager"].includes(user.role) && (
          <NavLink
            to="/projects"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 text-sm font-medium text-left transition cursor-pointer"
          >
            Projects
          </NavLink>
        )}

        {["admin", "manager"].includes(user.role) && (
          <NavLink
            to="/tasks"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 text-sm font-medium text-left transition cursor-pointer"
          >
            Tasks
          </NavLink>
        )}

        {["member"].includes(user.role) && (
          <NavLink
            to="/my-tasks"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 text-sm font-medium text-left transition cursor-pointer"
          >
            My Tasks
          </NavLink>
        )}

        {["admin"].includes(user.role) && (
          <NavLink
            to="/users"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 text-sm font-medium text-left transition cursor-pointer"
          >
            Users
          </NavLink>
        )}

        {["admin"].includes(user.role) && (
          <NavLink
            to="/audit-logs"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 text-sm font-medium text-left transition cursor-pointer"
          >
            Audit Logs
          </NavLink>
        )}
      </nav>

      {/* Bottom Information */}
      <div className="mt-auto pt-4 border-t border-slate-200">
        <p className="text-xs text-slate-400">Secure Access Hub</p>

        <p className="text-xs text-slate-400 mt-1">Role-based workspace</p>
      </div>
    </aside>
  );
}

export default Sidebar;
