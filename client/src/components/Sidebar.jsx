import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  ClipboardList,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/authContext";

function Sidebar() {
  const { user } = useAuth();

  const getNavClass = ({ isActive }) =>
    `group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-violet-50 text-violet-700 shadow-sm"
        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
    }`;

  const getIconClass = ({ isActive }) =>
    `transition-colors duration-200 ${
      isActive ? "text-violet-600" : "text-slate-400 group-hover:text-slate-600"
    }`;

  return (
    <aside className="flex min-h-[calc(100vh-64px)] w-64 flex-col border-r border-slate-200 bg-white px-3 py-5">
      {/* Navigation Header */}
      <div className="mb-3 px-3">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Workspace
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1.5">
        {/* Dashboard */}
        <NavLink to="/" end className={getNavClass}>
          {({ isActive }) => (
            <>
              <LayoutDashboard
                size={18}
                className={getIconClass({ isActive })}
              />
              <span>Dashboard</span>
            </>
          )}
        </NavLink>

        {/* Projects */}
        {["admin", "manager"].includes(user.role) && (
          <NavLink to="/projects" className={getNavClass}>
            {({ isActive }) => (
              <>
                <FolderKanban
                  size={18}
                  className={getIconClass({ isActive })}
                />
                <span>Projects</span>
              </>
            )}
          </NavLink>
        )}

        {/* Tasks */}
        <NavLink to="/tasks" className={getNavClass}>
          {({ isActive }) => (
            <>
              <CheckSquare size={18} className={getIconClass({ isActive })} />
              <span>Tasks</span>
            </>
          )}
        </NavLink>

        {/* Users */}
        {user.role === "admin" && (
          <NavLink to="/users" className={getNavClass}>
            {({ isActive }) => (
              <>
                <Users size={18} className={getIconClass({ isActive })} />
                <span>Users</span>
              </>
            )}
          </NavLink>
        )}

        {/* Audit Logs */}
        {user.role === "admin" && (
          <NavLink to="/audit-logs" className={getNavClass}>
            {({ isActive }) => (
              <>
                <ClipboardList
                  size={18}
                  className={getIconClass({ isActive })}
                />
                <span>Audit Logs</span>
              </>
            )}
          </NavLink>
        )}
      </nav>

      {/* Bottom Information */}
      <div className="mt-auto border-t border-slate-200 px-3 pt-4">
        <p className="text-xs font-semibold text-slate-500">
          Secure Access Hub
        </p>

        <p className="mt-1 text-xs text-slate-400">Role-based workspace</p>
      </div>
    </aside>
  );
}

export default Sidebar;
