import React, { useEffect, useState } from "react";
import { X, Camera, Lock } from "lucide-react";
import api from "../components/Axios";
import "./CarInspectionModal.css";

const SIDES = [
  { key: "FRONT", label: "Front View" },
  { key: "BACK", label: "Back View" },
  { key: "LEFT", label: "Left Side" },
  { key: "RIGHT", label: "Right Side" },
];

const ALL_SIDES = SIDES.map((s) => s.key);

/* ---------------- HELPERS ---------------- */
const mapResponse = (data) => ({
  FRONT: data?.front?.imageUrl || null,
  BACK: data?.back?.imageUrl || null,
  LEFT: data?.left?.imageUrl || null,
  RIGHT: data?.right?.imageUrl || null,
});

const isComplete = (images) =>
  ALL_SIDES.every((side) => images?.[side]);

/* ---------------- COMPONENT ---------------- */
const CarInspectionModal = ({ booking, open, onClose, onReturnConfirmed }) => {
  const [images, setImages] = useState({ BEFORE: {}, AFTER: {} });
  const [uploadingSide, setUploadingSide] = useState(null);
  const [beforeComplete, setBeforeComplete] = useState(false);

  useEffect(() => {
    if (open) fetchBefore();
  }, [open]);

  /* -------- FETCH BEFORE -------- */
  const fetchBefore = async () => {
    try {
      const res = await api.get(
        `/api/car-inspection/booking/${booking.bookingId}/BEFORE`
      );

      const beforeImages = mapResponse(res.data);
      setImages((prev) => ({ ...prev, BEFORE: beforeImages }));

      const completed = isComplete(beforeImages);
      setBeforeComplete(completed);

      if (completed) {
        fetchAfter();
      }
    } catch (err) {
      console.error("Failed to fetch BEFORE images", err);
    }
  };

  /* -------- FETCH AFTER -------- */
  const fetchAfter = async () => {
    try {
      const res = await api.get(
        `/api/car-inspection/booking/${booking.bookingId}/AFTER`
      );

      setImages((prev) => ({
        ...prev,
        AFTER: mapResponse(res.data),
      }));
    } catch (err) {
      console.error("Failed to fetch AFTER images", err);
    }
  };

  /* -------- DELETE IMAGE -------- */
  const deleteImage = async (side, type) => {

    try {
      await api.delete(
        `/api/car-inspection/${booking.carId}/${type}/${side}`
      );
      await fetchBefore(); // re-evaluate flow
    } catch {
      alert("Failed to delete image");
    }
  };

  /* -------- UPLOAD IMAGE -------- */
  const uploadImage = async (side, type, file) => {
    if (!file) return;

    const data = new FormData();
    data.append("bookingId", booking.bookingId);
    data.append("carId", booking.carId);
    data.append("type", type);
    data.append("side", side);
    data.append("image", file);

    try {
      setUploadingSide(`${type}-${side}`);
      await api.post("/api/car-inspection/upload", data);
      await fetchBefore();
    } catch {
      alert("Image upload failed");
    } finally {
      setUploadingSide(null);
    }
  };

  if (!open) return null;

  return (
    <div className="inspection-overlay" onClick={onClose}>
      <div className="inspection-modal" onClick={(e) => e.stopPropagation()}>
        <div className="inspection-header">
          <h2>Car Inspection – {booking.carName}</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* ================= BEFORE ================= */}
        <section className="inspection-section">
          <h3>Before Pickup</h3>

          <div className="inspection-grid">
            {SIDES.map((side) => {
              const imageUrl = images.BEFORE[side.key];
              const loading = uploadingSide === `BEFORE-${side.key}`;

              return (
                <div key={side.key} className="inspection-box">
                  <p>{side.label}</p>

                  {imageUrl ? (
                    <div className="image-wrapper">
                      <img src={imageUrl} alt={side.label} />
                      <button
                        className="delete-btn"
                        onClick={() => deleteImage(side.key, "BEFORE")}
                        disabled={!!uploadingSide}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <label className="upload-area">
                      <Camera />
                      <span>{loading ? "Uploading..." : "Upload"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={!!uploadingSide}
                        onChange={(e) =>
                          uploadImage(
                            side.key,
                            "BEFORE",
                            e.target.files[0]
                          )
                        }
                      />
                    </label>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ================= AFTER ================= */}
        <section className="inspection-section">
          <h3>
            After Return{" "}
            {!beforeComplete && (
              <span className="locked-text">
                <Lock size={14} /> Upload BEFORE images first
              </span>
            )}
          </h3>

          <div className="inspection-grid">
            {SIDES.map((side) => {
              const imageUrl = images.AFTER[side.key];
              const loading = uploadingSide === `AFTER-${side.key}`;

              return (
                <div
                  key={side.key}
                  className={`inspection-box ${!beforeComplete ? "locked" : ""
                    }`}
                >
                  <p>{side.label}</p>

                  {imageUrl ? (
                    <div className="image-wrapper">
                      <img src={imageUrl} alt={side.label} />
                      <button
                        className="delete-btn"
                        onClick={() => deleteImage(side.key, "AFTER")}
                        disabled={!!uploadingSide}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <label className="upload-area">
                      <Camera />
                      <span>{loading ? "Uploading..." : "Upload"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={!beforeComplete || !!uploadingSide}
                        onChange={(e) =>
                          uploadImage(
                            side.key,
                            "AFTER",
                            e.target.files[0]
                          )
                        }
                      />
                    </label>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
      <div className="inspection-footer">
        <button
          className="return-btn"
          disabled={!beforeComplete || !isComplete(images.AFTER)}
          onClick={() => {
            if (!window.confirm("Confirm car return?")) return;
            onReturnConfirmed();
          }}
        >
          Confirm Return
        </button>
      </div>

    </div>
  );
};

export default CarInspectionModal;
