import React, { useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import api from "../components/Axios";
import "./BookNow.css";

const BookNow = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const location = searchParams.get("location");
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  const handleConfirmBooking = async () => {
    try {
      setLoading(true);
      console.log("Booking car:", id, location, start, end);
      const payload = {
        carId: Number(id),
        location,
        startDateTime: start,
        endDateTime: end,
      };
      const res = await api.post("/api/user/booking", payload);
      // console.log("Booking created:", res.data);
      navigate("/booking/success");
    } catch (err) {
      console.error("Booking failed:", err);
      alert("Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="book-wrapper">
      <div className="book-container">
        <h1>Confirm Booking</h1>

        <div className="details">
          <div className="row">
            <span>Location</span>
            <p>{location}</p>
          </div>
          <div className="row">
            <span>Start</span>
            <p>{start}</p>
          </div>
          <div className="row">
            <span>End</span>
            <p>{end}</p>
          </div>
        </div>

        <button
          className="confirm-btn"
          disabled={loading}
          onClick={handleConfirmBooking}
        >
          {loading ? "Confirming..." : "Confirm Booking"}
        </button>
      </div>
    </div>
  );
};

export default BookNow;
