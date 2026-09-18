import { useAuth } from "../../context/authContext";
import AdminDashboard from "./AdminDashboard";
import ManagerDashboard from "./ManagerDashboard";


function DashboardPage() {
  const { user } = useAuth();
  if (user?.role === "admin") {
    return <AdminDashboard />;
  }
  if (user?.role === "manager") {
    return <ManagerDashboard />;
  }
  return <div>Welcome, {user?.name}</div>;
}

export default DashboardPage;
