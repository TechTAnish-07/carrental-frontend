import { useEffect, useState } from "react";
import api from "/Users/tanish/web-dev/react/carrental-project/src/components/Axios.jsx";
import "./AdminStates.css";
const AdminStats = () => {
  const [stats, setStats] = useState({
    revenue: 0,
    active: 0,
    history: 0,
    cars: 0,
  });

  useEffect(() => {
    const load = async () => {
      const [r, a, h, c] = await Promise.all([
        api.get("/api/admin/bookings/revenue"),
        api.get("/api/admin/bookings/active"),
        api.get("/api/admin/bookings/history"),
        api.get("/api/cars/all"),
      ]);

      setStats({
        revenue: r.data,
        active: a.data.length,
        history: h.data.length,
        cars: c.data.length,
      });
    };
    load();
  }, []);

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      <Card title="Revenue" value={`₹${stats.revenue}`} />
      <Card title="Active Bookings" value={stats.active} />
      <Card title="Returned" value={stats.history} />
      <Card title="Cars" value={stats.cars} />
    </div>
  );
};

const Card = ({ title, value }) => (
  <div className="stat-card">
    <p className="stat-title">{title}</p>
    <h2 className="stat-value">{value}</h2>
  </div>
);

export default AdminStats;
