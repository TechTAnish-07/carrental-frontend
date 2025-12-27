import AdminLayout from "../../AdminLayout";
import AdminStats from "./AdminStats";
import ActiveBookings from "./ActiveBooking";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <div className="admin-page">
        <h1 className="admin-title">Dashboard</h1>

        <AdminStats />
        <ActiveBookings />
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
