import { Plus } from "lucide-react";
import ProjectCard from "../components/ProjectCard";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { getProjects } from "../api/projectApi";
import CreateProjectModal from "../components/CreateProjectModal";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  async function fetchProjects() {
    try {
      const response = await getProjects();
      setProjects(response.data);
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

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {projects.map((project) => (
          <ProjectCard key={project._id} project={project} />
        ))}
      </div>
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
