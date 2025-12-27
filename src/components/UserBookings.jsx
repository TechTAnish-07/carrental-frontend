import React, { useEffect, useState } from "react";
import api from "../components/Axios.jsx";
import CarInspectionModal from "./CarInspectionModal";
import "./UserBookings.css";

const UserBookings = () => {
  const [activeBookings, setActiveBookings] = useState([]);
  const [historyBookings, setHistoryBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("CURRENT");
  const [loading, setLoading] = useState(true);

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showInspection, setShowInspection] = useState(false);
  const [inspectionMode, setInspectionMode] = useState("PICKUP"); // PICKUP | RETURN

  /* ---------------- FETCH BOOKINGS ---------------- */
  useEffect(() => {
    fetchAllBookings();
  }, []);

  const fetchAllBookings = async () => {
    setLoading(true);
    try {
      const [a, h] = await Promise.all([
        api.get("/api/user/booking/active"),
        api.get("/api/user/booking/history"),
      ]);
      setActiveBookings(a.data || []);
      setHistoryBookings(h.data || []);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- ACTIONS ---------------- */
  const handleCancel = async (id) => {
    if (!window.confirm("Cancel booking?")) return;
    await api.post(`/api/user/booking/cancel/${id}`);
    fetchAllBookings();
  };

  // 📸 BEFORE images (pickup)
  const handlePickupInspection = (booking) => {
    setInspectionMode("PICKUP");
    setSelectedBooking(booking);
    setShowInspection(true);
  };

  // 🚗 AFTER images (return)
  const handleReturn = (booking) => {
    if (!window.confirm("Proceed to car inspection before return?")) return;

    setInspectionMode("RETURN");
    setSelectedBooking(booking);
    setShowInspection(true);
  };

  /* ---------------- FILTER BOOKINGS ---------------- */
  const bookings =
    activeTab === "CURRENT"
      ? activeBookings
      : activeTab === "HISTORY"
      ? historyBookings.filter((b) => b.bookingStatus === "COMPLETED")
      : historyBookings.filter((b) => b.bookingStatus === "CANCELLED");

  if (loading) return <p className="loading-text">Loading bookings…</p>;

  return (
    <div className="user-bookings-container">
      {/* ---------------- TABS ---------------- */}
      <div className="booking-toggle">
        {["CURRENT", "HISTORY", "CANCELLED"].map((t) => (
          <button
            key={t}
            className={activeTab === t ? "active" : ""}
            onClick={() => setActiveTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ---------------- BOOKINGS ---------------- */}
      <div className="bookings-grid">
        {bookings.map((b) => {
          const now = new Date();
          const startTime = new Date(b.startDateTime || b.startDate);

          const canCancel = now < startTime;
          const canReturn = now >= startTime;

          return (
            <div className="booking-card" key={b.bookingId}>
              <img src={b.carImage} alt={b.carName} />

              <h3>{b.carName}</h3>
              <p>StartTime :{b.startDate} </p>
              <p>EndTime : {b.endDate}</p>
              <p>{b.fuelType} • ₹{b.pricePerDay}/day</p>
               <p>Total Paid: ₹{b.totalAmount}</p>
              <p>Status: {b.bookingStatus}</p>

              {activeTab === "CURRENT" && (
                <div className="booking-actions">
                  {/* ❌ Cancel only BEFORE start */}
                  {canCancel && (
                    <button
                      className="cancel-btn"
                      onClick={() => handleCancel(b.bookingId)}
                    >
                      Cancel
                    </button>
                  )}

                  {/* 📸 Pickup inspection (BEFORE images) */}
                  <button
                    className="inspection-btn"
                    onClick={() => handlePickupInspection(b)}
                  >
                    Upload Pickup Images
                  </button>

                  {/* 🚗 Return only AFTER start */}
                  {canReturn && (
                    <button
                      className="return-btn"
                      onClick={() => handleReturn(b)}
                    >
                      Return
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ---------------- INSPECTION MODAL ---------------- */}
      {showInspection && selectedBooking && (
        <CarInspectionModal
          booking={selectedBooking}
          open={showInspection}
          mode={inspectionMode} // PICKUP | RETURN
          onClose={() => {
            setShowInspection(false);
            setSelectedBooking(null);
          }}
          onReturnConfirmed={async () => {
            await api.post(
              `/api/user/booking/return/${selectedBooking.bookingId}`
            );
            setShowInspection(false);
            setSelectedBooking(null);
            fetchAllBookings();
          }}
        />
      )}
    </div>
  );
};

export default UserBookings;
