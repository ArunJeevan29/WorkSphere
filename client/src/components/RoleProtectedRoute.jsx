import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

function RoleProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();
  const userRole = user.role;
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }
  return children;
}

export default RoleProtectedRoute;
