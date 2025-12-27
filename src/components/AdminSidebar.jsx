import { LayoutDashboard, Car, Mail, LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";
import "./AdminSidebar.css";

const AdminSidebar = () => {
  const logout = () => {
    localStorage.clear();
    window.location.href = "/signin";
  };

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <h1>SAngRaj</h1>
        <span>Admin Panel</span>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/admin/dashboard" className="nav-item">
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>

        <NavLink to="/admin/cars" className="nav-item">
          <Car size={20} />
          Cars
        </NavLink>

        <NavLink to="/admin/messages" className="nav-item">
          <Mail size={20} />
          Messages
        </NavLink>
      </nav>

      <button className="logout-btn" onClick={logout}>
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
};

export default AdminSidebar;
