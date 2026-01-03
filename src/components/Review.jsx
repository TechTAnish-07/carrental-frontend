import React, { useEffect, useState } from "react";
import "./Review.css";
import api from "../components/Axios.jsx";
import { useAuth } from "./AuthProvider.jsx";

const Review = () => {
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 6;
  const [showForm, setShowForm] = useState(false);

  const {user} = useAuth();
  const currentUser = user;

  const [formData, setFormData] = useState({
    rating: 5,
    comment: "",
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await api.get("/api/user/reviews");
      setReviews(res.data || []);
    } catch (err) {
      console.error("Failed to fetch reviews", err);
    }
  };

  /* ================= PAGINATION ================= */
  const indexOfLast = currentPage * reviewsPerPage;
  const indexOfFirst = indexOfLast - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  /* ================= HELPERS ================= */
  const getInitials = (name) => {
    if (!name || typeof name !== "string") return "A";
    return name
      .trim()
      .split(/\s+/)
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  /* ================= ADD REVIEW ================= */
  const handleAddReview = async () => {
    if (!formData.comment.trim()) {
      alert("Review cannot be empty");
      return;
    }

    // ✅ ALWAYS take username from logged-in user
    const payload = {
      username: currentUser.name,
      rating: formData.rating,
      comment: formData.comment,
    };

    try {
      await api.post("/api/user/reviews", payload);
      setShowForm(false);
      setFormData({ rating: 5, comment: "" });
      fetchReviews();
    } catch (err) {
      console.error(err);
      alert("Failed to add review");
    }
  };

  return (
    <section className="reviews-section">
      <div className="reviews-wrapper">
        {/* HEADER */}
        <div className="reviews-header">
          <h2 className="reviews-title">
            Customer <span className="reviews-title-highlight">Reviews</span>
          </h2>
          <p className="reviews-subtitle">
            See what our customers say about their experience.
          </p>
        </div>

        {/* REVIEWS */}
        <div className="reviews-container">
          {currentReviews.length === 0 ? (
            <p className="empty-text">No reviews yet</p>
          ) : (
            currentReviews.map((review) => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <div className="reviewer-info">
                    <div className="reviewer-avatar">
                      {getInitials(review.username)}
                    </div>
                    <h3>{review.username || "Anonymous"}</h3>
                  </div>

                  <div className="rating">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`star ${i < review.rating ? "filled" : ""}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>

                <p className="review-comment">"{review.comment}"</p>

                <div className="review-footer">
                  <span className="review-date">
                    🗓 {formatDate(review.createdAt)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="pagination">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={`page-btn ${currentPage === i + 1 ? "active" : ""}`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
        <div className="add-review-wrapper">
        <button className="add-review-btn" onClick={() => setShowForm(true)}>
          ✍️ Add Your Review
        </button>
      </div>
      </div>

      {/* ADD REVIEW */}
      
      
      {/* MODAL */}
      {showForm && (
        <div className="review-modal">
          <div className="review-form">
            <h3>Share Your Experience</h3>

            {/* Display only (not state-controlled) */}
            <input
              value={currentUser?.name || "Anonymous"}
              disabled
            />

            <select
              value={formData.rating}
              onChange={(e) =>
                setFormData({ ...formData, rating: Number(e.target.value) })
              }
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r} ⭐
                </option>
              ))}
            </select>

            <textarea
              placeholder="Write your honest review..."
              value={formData.comment}
              onChange={(e) =>
                setFormData({ ...formData, comment: e.target.value })
              }
            />

            <div className="form-actions">
              <button className="submit-btn" onClick={handleAddReview}>
                Submit Review
              </button>
              <button className="cancel-btn" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Review;
