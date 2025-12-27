import React from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import "./Success.css";

const Success = () => {
  const navigate = useNavigate();

  return (
    <div className="success-page">
      <div className="success-card">
        <CheckCircle size={72} className="success-icon" />

        <h1>Booking Confirmed 🎉</h1>
        <p>
          Your car has been successfully booked.  
          We’ve reserved it for your selected date and location.
        </p>

        <div className="success-actions">
          <button
            className="primary-btn"
            onClick={() => navigate("/user/bookings")}
          >
            View My Bookings
          </button>

          <button
            className="secondary-btn"
            onClick={() => navigate("/")}
          >
            Book Another Car
          </button>
        </div>
      </div>
    </div>
  );
};

export default Success;
