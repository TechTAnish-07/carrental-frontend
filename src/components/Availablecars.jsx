import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Filter,
  Star,
  Users,
  Zap,
  ChevronDown,
} from "lucide-react";
import api from "../components/Axios.jsx";
import "./Availablecars.css";

const AvailableCars = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const params = new URLSearchParams(search);
  const location = params.get("location");
  const start = params.get("start");
  const end = params.get("end");

  const [carData, setCarData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: "all",
    sortBy: "recommended",
  });

  /* ---------------- FETCH AVAILABLE CARS ---------------- */
  useEffect(() => {
    if (!location || !start || !end) return;

    const fetchCars = async () => {
      setLoading(true);
      setError("");
      location = location.toLowerCase();
      try {
        const res = await api.get("/api/cars/display/available", {
          params: {
            location,
            startDateTime: start,
            endDateTime: end,
          },
        });

        setCarData(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
        setError("Unable to fetch available cars. Please try again.");
        setCarData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [location, start, end]);

  /* ---------------- FILTER + SORT ---------------- */
  const filteredCars = carData
    .filter((car) => {
      if (filters.category !== "all" && car.category !== filters.category)
        return false;
      return true;
    })
    .sort((a, b) => {
      if (filters.sortBy === "price-low")
        return a.pricePerDay - b.pricePerDay;
      if (filters.sortBy === "price-high")
        return b.pricePerDay - a.pricePerDay;
      if (filters.sortBy === "rating")
        return (b.rating || 0) - (a.rating || 0);
      return 0;
    });

  /* ---------------- BOOK ---------------- */
  const handleBook = (carId) => {
    if(!isLoggedIn){
      navigate("/signin");
       return;
    }
    if (!carId) {
    console.error("Invalid carId:", carId);
    return;
  }
    console.log("Booking car:", carId);

    navigate(`/book/${carId}?location=${location}&start=${start}&end=${end}`);
  };

  return (
    <div className="cars-page">
      {/* ---------------- HERO ---------------- */}
      <div className="cars-hero">
        <h1>Available Cars in {location}</h1>

        <div className="hero-info">
          <div>
            <MapPin size={18} /> {location}
          </div>
          <div>
            <Calendar size={18} />{" "}
            {start && end
              ? `${new Date(start).toLocaleDateString()} – ${new Date(
                  end
                ).toLocaleDateString()}`
              : "Invalid dates"}
          </div>
        </div>
      </div>

      {/* ---------------- FILTER BAR ---------------- */}
      <div className="filter-bar">
        <span>
          {loading
            ? "Searching cars..."
            : `${filteredCars.length} cars available`}
        </span>

        <button onClick={() => setShowFilters((s) => !s)}>
          <Filter size={16} />
          Filters
          <ChevronDown
            size={14}
            style={{
              transform: showFilters ? "rotate(180deg)" : "rotate(0deg)",
              transition: "0.3s",
            }}
          />
        </button>
      </div>

      {showFilters && (
        <div className="filters-panel">
          <select
            value={filters.category}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
          >
            <option value="all">All Categories</option>
            <option value="SUV">SUV</option>
            <option value="Sedan">Sedan</option>
            <option value="Luxury">Luxury</option>
            <option value="Electric">Electric</option>
          </select>

          <select
            value={filters.sortBy}
            onChange={(e) =>
              setFilters({ ...filters, sortBy: e.target.value })
            }
          >
            <option value="recommended">Recommended</option>
            <option value="price-low">Price: Low → High</option>
            <option value="price-high">Price: High → Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      )}

      {/* ---------------- STATES ---------------- */}
      {loading && <p className="loading-text">Finding the best rides 🚗...</p>}
      {!loading && error && <p className="error-text">{error}</p>}
      {!loading && !error && filteredCars.length === 0 && (
        <p className="empty-text">
          No cars available for selected date & time.
        </p>
      )}

      {/* ---------------- CARS GRID ---------------- */}
      <div className="cars-grid">
        {filteredCars.map((car) => (
          <div className="car-card" key={car.carId || car.id}>
            <div className="car-badge">{car.category}</div>

            <div className="car-image">
              <img src={car.imageUrl} alt={`${car.brand} ${car.model}`} />

              {car.rating && (
                <div className="rating-badge">
                  <Star size={14} /> {car.rating}
                </div>
              )}
            </div>

            <div className="car-body">
              <h3>
                {car.brand} {car.model}
              </h3>
              <span className="year">{car.modelYear}</span>

              {/* STATS */}
              <div className="car-stats">
                <span>
                  <Users size={14} /> {car.seats || 5}
                </span>
                <span>
                  <Zap size={14} /> {car.transmission || "Automatic"}
                </span>
              </div>

              {/* FEATURES (optional but aesthetic) */}
              {car.features && (
                <div className="features">
                  {car.features.slice(0, 2).map((f) => (
                    <span key={f} className="feature-tag">
                      {f}
                    </span>
                  ))}
                </div>
              )}

              <div className="car-footer">
                <div className="price">
                  ₹{car.pricePerDay}
                  <span>/day</span>
                </div>

                <button onClick={() => handleBook(car.id)}>
                  Book Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvailableCars;
