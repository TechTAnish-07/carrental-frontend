import { useEffect, useState } from "react";
import api from "/Users/tanish/web-dev/react/carrental-project/src/components/Axios.jsx";
import "./ActiveBooking.css";
const ActiveBookings = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/api/admin/bookings/active").then(res => setData(res.data));
  }, []);

 return (
  <div className="table-card">
    <h2 className="table-title">Active Bookings</h2>

    <table className="admin-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>User</th>
          <th>Car</th>
          <th>From</th>
          <th>To</th>
        </tr>
      </thead>
      <tbody>
        {data.map((b) => (
          <tr key={b.bookingId}>
            <td>{b.bookingId}</td>
            <td>{b.userEmail}</td>
            <td>{b.carName}</td>
            <td>{b.startDate}</td>
            <td>{b.endDate}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
};
export default ActiveBookings;
