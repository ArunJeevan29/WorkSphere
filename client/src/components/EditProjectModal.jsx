import {
  X,
  Monitor,
  Smartphone,
  ShoppingCart,
  BarChart3,
  LayoutDashboard,
  Code2,
  Palette,
} from "lucide-react";
import { useState } from "react";
import { updateProject } from "../api/projectApi";
import { toast } from "react-hot-toast";

function EditProjectModal({ id, fetchProject, project, onClose }) {
  const [name, setName] = useState(project.name || "");
  const [description, setDescription] = useState(project.description || "");
  const [status, setStatus] = useState(project.status || "");
  const [icon, setIcon] = useState(project.icon || "monitor");
  const [color, setColor] = useState(project.color || "violet");
  const icons = [
    {
      name: "monitor",
      label: "Website",
      component: Monitor,
    },
    {
      name: "mobile",
      label: "Mobile",
      component: Smartphone,
    },
    {
      name: "shopping",
      label: "E-commerce",
      component: ShoppingCart,
    },
    {
      name: "chart",
      label: "Analytics",
      component: BarChart3,
    },
    {
      name: "dashboard",
      label: "Dashboard",
      component: LayoutDashboard,
    },
    {
      name: "code",
      label: "Development",
      component: Code2,
    },
    {
      name: "design",
      label: "Design",
      component: Palette,
    },
  ];

  const colors = [
    {
      name: "violet",
      className: "bg-violet-600",
    },
    {
      name: "blue",
      className: "bg-blue-500",
    },
    {
      name: "green",
      className: "bg-emerald-500",
    },
    {
      name: "orange",
      className: "bg-orange-500",
    },
    {
      name: "red",
      className: "bg-red-500",
    },
    {
      name: "slate",
      className: "bg-slate-600",
    },
  ];
  async function handleUpdateProject(e) {
    e.preventDefault();
    if (!name || !description || !status || !icon || !color) {
      return toast.error("Fill all the fields");
    }
    const updatedProject = {
      name,
      description,
      status,
      icon,
      color,
    };
    try {
      const response = await updateProject(id, updatedProject);
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
      <div className="w-full max-w-xl rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Edit Project
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Update project information and settings.
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

        {/* Form */}
        <form onSubmit={handleUpdateProject} className="space-y-4 px-5 py-5">
          {/* Project Name */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Project Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter project name"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Description
            </label>

            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter project description"
              className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            />
          </div>

          {/* Status */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Status
            </label>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            >
              <option value="">Select status</option>
              <option value="planning">Planning</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="on-hold">On Hold</option>
            </select>
          </div>

          {/* Icon */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Project Icon
            </label>
            <div>
              <div className="grid grid-cols-4 gap-3 sm:grid-cols-7">
                {icons.map((iconItem) => {
                  const Icon = iconItem.component;

                  return (
                    <button
                      key={iconItem.name}
                      type="button"
                      value={iconItem.name}
                      onClick={() => setIcon(iconItem.name)}
                      className={`group flex flex-col items-center gap-2 rounded-xl border p-3 transition ${icon === iconItem.name ? "border-violet-500 bg-violet-50" : "border-slate-200 hover:border-violet-400 hover:bg-violet-50"}`}
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition group-hover:bg-violet-100 group-hover:text-violet-600">
                        <Icon size={19} />
                      </div>

                      <span className="text-[10px] text-slate-500">
                        {iconItem.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Project Color
            </label>

            <div className="flex flex-wrap gap-3">
              {colors.map((colorItem) => (
                <button
                  key={colorItem.name}
                  type="button"
                  title={colorItem.name}
                  value={colorItem.name}
                  onClick={() => setColor(colorItem.name)}
                  className={`h-8 w-8 rounded-full ${colorItem.className} ring-2 ring-offset-2 transition hover:scale-105 ${color === colorItem.name ? "ring-slate-900" : "ring-transparent"}`}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProjectModal;
