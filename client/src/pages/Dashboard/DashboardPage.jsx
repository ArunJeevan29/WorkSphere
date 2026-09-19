import { useAuth } from "../../context/authContext";
import AdminDashboard from "./AdminDashboard";
import ManagerDashboard from "./ManagerDashboard";
import MemberDashboard from "./MemberDashboard";

function DashboardPage() {
  const { user } = useAuth();
  if (user?.role === "admin") {
    return <AdminDashboard />;
  }
  if (user?.role === "manager") {
    return <ManagerDashboard />;
  }
  return <MemberDashboard />;
}

export default DashboardPage;
