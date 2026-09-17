import { useAuth } from "../../context/authContext";
import AdminDashboard from "./AdminDashboard";


function DashboardPage() {
  const { user } = useAuth();
  if (user?.role === "admin") {
    return <AdminDashboard />;
  }
  return <div>Welcome, {user?.name}</div>;
}

export default DashboardPage;
