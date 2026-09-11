import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ProtectedRoutes from "./components/ProtectedRoutes";
import RoleProtectedRoute from "./components/RoleProtectedRoute";
import AppLayout from "./components/AppLayout";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";
import Users from "./pages/Users";
import AuditLogs from "./pages/AuditLogs";

import ProjectDetails from "./pages/ProjectDetails";
import ProjectOverview from "./pages/ProjectOverview";
import ProjectTasks from "./pages/ProjectTasks";
import ProjectMembers from "./pages/ProjectMembers";

function App() {
  return (
    <div className="h-screen flex flex-col">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "white",
            color: "black",
            border: "2px solid white",
            borderRadius: "4px",
            fontWeight: "600",
            padding: "14px",
          },
        }}
      />
      <div className="flex flex-1">
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoutes>
                <RoleProtectedRoute
                  allowedRoles={["member", "manager", "admin"]}
                >
                  <AppLayout>
                    <Dashboard />
                  </AppLayout>
                </RoleProtectedRoute>
              </ProtectedRoutes>
            }
          />
          <Route
            path="/projects"
            element={
              <ProtectedRoutes>
                <RoleProtectedRoute allowedRoles={["manager", "admin"]}>
                  <AppLayout>
                    <Projects />
                  </AppLayout>
                </RoleProtectedRoute>
              </ProtectedRoutes>
            }
          />
          <Route
            path="/projects/:id"
            element={
              <ProtectedRoutes>
                <RoleProtectedRoute allowedRoles={["manager", "admin"]}>
                  <AppLayout>
                    <ProjectDetails />
                  </AppLayout>
                </RoleProtectedRoute>
              </ProtectedRoutes>
            }
          >
            <Route index element={<ProjectOverview />} />
            <Route path="tasks" element={<ProjectTasks />} />
            <Route path="members" element={<ProjectMembers />} />
          </Route>
          <Route
            path="/tasks"
            element={
              <ProtectedRoutes>
                <AppLayout>
                  <Tasks />
                </AppLayout>
              </ProtectedRoutes>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoutes>
                <RoleProtectedRoute allowedRoles={["admin"]}>
                  <AppLayout>
                    <Users />
                  </AppLayout>
                </RoleProtectedRoute>
              </ProtectedRoutes>
            }
          />
          <Route
            path="/audit-logs"
            element={
              <ProtectedRoutes>
                <RoleProtectedRoute allowedRoles={["admin"]}>
                  <AppLayout>
                    <AuditLogs />
                  </AppLayout>
                </RoleProtectedRoute>
              </ProtectedRoutes>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
