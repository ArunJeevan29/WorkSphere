import { ArrowLeft, MoreVertical, Pencil } from "lucide-react";
import { useState, useEffect } from "react";
import { Outlet, useParams, useNavigate, useLocation } from "react-router-dom";
import { getproject, fetchAllTask, getAuditLogs } from "../api/projectApi";
import EditProjectModal from "../components/EditProjectModal";
import DeleteProjectModal from "../components/DeleteProjectModal";

function ProjectDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);

  const [recentTasks, setRecentTasks] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);
  const [progress, setProgress] = useState(0);

  const { id } = useParams();

  async function fetchProject() {
    try {
      const response1 = await getproject(id);
      setProject(response1.data);
      setMembers(response1.data.members);
      const response2 = await fetchAllTask(id);
      setRecentTasks(response2.data.tasks);
      setCompletedTasks(response2.data.completedTasks);
      setTotalTasks(response2.data.totalTasks);
      setProgress(response2.data.progress);
      const response3 = await getAuditLogs(id);
      setAuditLogs(response3.data.auditLogs);
    } catch (error) {
      console.log(
        "Cannot fetch Project",
        error.response?.data?.message || error.message,
      );
    }
  }

  useEffect(() => {
    fetchProject();
  }, [id]);

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-5">
      {/* Back Button */}
      <button
        onClick={() => navigate("/projects")}
        className="flex items-center gap-2 text-sm font-medium text-violet-600 hover:text-violet-700 cursor-pointer"
      >
        <ArrowLeft size={15} />
        Back to Projects
      </button>

      {/* Project Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">
              {project.name}
            </h1>

            <span className="px-3 py-1 text-xs font-medium rounded-full bg-emerald-50 text-emerald-600">
              {project.status?.toUpperCase()}
            </span>
          </div>

          <p className="mt-2 text-sm text-slate-500">{project.description}</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setShowEditModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition cursor-pointer"
          >
            <Pencil size={15} />
            Edit Project
          </button>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer"
            >
              <MoreVertical size={18} />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-40 rounded-lg border border-slate-200 bg-white shadow-lg">
                <button
                  onClick={() => {
                    setShowEditModal(true);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                >
                  Edit Project
                </button>

                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                >
                  Delete Project
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <div className="flex items-center gap-8">
          {/* Overview */}
          <button
            onClick={() => navigate(`/projects/${id}`)}
            className={`px-4 py-3 text-sm font-medium cursor-pointer ${
              location.pathname === `/projects/${id}`
                ? "text-violet-600 border-b-2 border-violet-600"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Overview
          </button>


        </div>
      </div>
      <Outlet
        context={{
          project,
          members,
          recentTasks,
          auditLogs,
          completedTasks,
          totalTasks,
          progress,
          fetchProject,
        }}
      />
      {showEditModal && (
        <EditProjectModal
          fetchProject={fetchProject}
          id={id}
          project={project}
          onClose={() => setShowEditModal(false)}
        />
      )}

      {showDeleteModal && (
        <DeleteProjectModal
          fetchProject={fetchProject}
          id={id}
          project={project}
          onClose={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
}

export default ProjectDetails;
