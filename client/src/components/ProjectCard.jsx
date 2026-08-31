import {
  Monitor,
  Smartphone,
  ShoppingCart,
  ChartNoAxesCombined,
  LayoutDashboard,
  Code2,
  Palette,
  CalendarDays,
  User,
  Users,
  ClipboardList,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const iconMap = {
  monitor: Monitor,
  mobile: Smartphone,
  shopping: ShoppingCart,
  chart: ChartNoAxesCombined,
  dashboard: LayoutDashboard,
  code: Code2,
  design: Palette,
};

const colorStyles = {
  violet: "bg-violet-100 text-violet-600",
  blue: "bg-blue-100 text-blue-600",
  green: "bg-emerald-100 text-emerald-600",
  orange: "bg-orange-100 text-orange-500",
  red: "bg-red-100 text-red-600",
  slate: "bg-slate-100 text-slate-600",
};

const progressStyles = {
  violet: "bg-violet-600",
  blue: "bg-blue-500",
  green: "bg-emerald-500",
  orange: "bg-orange-500",
  red: "bg-red-500",
  slate: "bg-slate-600",
};

const statusStyles = {
  planning: "bg-yellow-50 text-yellow-600",
  active: "bg-emerald-50 text-emerald-600",
  completed: "bg-blue-50 text-blue-600",
  archived: "bg-slate-100 text-slate-500",
};

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();
  const Icon = iconMap[project.icon];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      {/* Top Section */}

      <div className="flex items-start gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${colorStyles[project.color]}`}
        >
          <Icon size={21} />
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-800">
            {project.name}
          </h3>

          <p className="mt-1 line-clamp-2 text-xs text-slate-500">
            {project.description}
          </p>
        </div>
      </div>

      {/* Status */}

      <div className="mt-4 flex items-center justify-between">
        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${
            statusStyles[project.status]
          }`}
        >
          {project.status}
        </span>
      </div>

      {/* Progress */}

      <div className="mt-3">
        <div className="flex items-center justify-between">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full ${progressStyles[project.color]}`}
              style={{
                width: `${project.progress.toFixed(0)}%`,
              }}
            />
          </div>

          <span className="ml-3 text-xs text-slate-500">
            {project.progress.toFixed(0)}%
          </span>
        </div>
      </div>

      {/* Project Details */}

      <div className="mt-5 space-y-2.5 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <CalendarDays size={13} />

          <span>
            Created:{" "}
            {new Date(project.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <User size={13} />

          <span>Created by: {project.createdBy.name.toUpperCase()}</span>
        </div>

        <div className="flex items-center gap-2">
          <Users size={13} />

          <span>Members: {project.memberCount}</span>
        </div>

        <div className="flex items-center gap-2">
          <ClipboardList size={13} />

          <span>
            Tasks: {project.completedTasks} / {project.totalTasks}
          </span>
        </div>
      </div>

      {/* View Details */}

      <button
        className="mt-5 flex items-center gap-2 text-xs font-medium text-violet-600 transition hover:text-violet-800"
        onClick={() => navigate(`/projects/${project._id}`)}
      >
        View Details
        <ArrowRight size={15} />
      </button>
    </div>
  );
};

export default ProjectCard;
