import { Plus, FolderOpen } from "lucide-react";
import ProjectCard from "../components/ProjectCard";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { getProjects } from "../api/projectApi";
import CreateProjectModal from "../components/CreateProjectModal";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  async function fetchProjects() {
    try {
      setLoading(true);
      const response = await getProjects();
      setProjects(Array.isArray(response.data) ? response.data : []);
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
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Page Header */}

      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Projects</h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage and track all your projects
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-violet-700"
        >
          <Plus size={17} />
          New Project
        </button>
      </div>

      {/* Projects Grid */}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white py-20 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
            <FolderOpen size={26} className="text-slate-400" />
          </div>
          <p className="mt-4 text-sm font-medium text-slate-700">
            No projects yet
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Get started by creating your first project.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-5 flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-violet-700"
          >
            <Plus size={15} />
            New Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}

      {showCreateModal && (
        <CreateProjectModal
          onClose={() => setShowCreateModal(false)}
          fetchProjects={fetchProjects}
        />
      )}
    </div>
  );
};

export default Projects;
