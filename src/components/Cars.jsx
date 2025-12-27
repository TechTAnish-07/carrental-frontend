import React, { useEffect, useState } from "react";
import "./Cars.css";
import Reviews from "./Reviews";
import { useNavigate } from "react-router-dom";
import api from "./Axios";


function Cars() {
  const [searchTerm, setSearchTerm] = useState("");
  const [flips, setFlips] = useState({});
  const [carData, setCarData] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const navigate = useNavigate();

  // 🚀 Fetch cars (NO useEffect)
  const fetchCars = async () => {
    try {
      const res = await api.get("/api/cars/display");
      console.log("API Response:", res.data);
      setCarData(res.data);
      console.log("Fetched car data:", res.data);
      setLoaded(true);

    } catch (err) {
      console.error("Error fetching car data:", err);
      setLoaded(true);
    }
  };
  const updateQty = async (carId, delta) => {
    try {
      await api.put(`/api/cars/admin/quantity`, null, {
        params: { carId, delta },
      });
      // update UI locally (fast UX)
      setCarData((prev) =>
        prev.map((car) =>
          car.carId === carId
            ? { ...car, quantity: car.quantity + delta }
            : car
        )
      );
    } catch (err) {
      alert(err.response?.data || "Failed to update quantity");
    }
  };


  // call once
  useEffect(() => {
    fetchCars();
  }, []);
  const isAdmin = localStorage.getItem("isLoggedIn") === "true" && JSON.parse(localStorage.getItem("currentUser"))?.role === "ROLE_ADMIN";
  const handleSearchBar = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const toggleFlip = (id) => {
    setFlips((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredCars = carData
    .filter((car) => {
      // 👤 USER → hide quantity 0
      if (!isAdmin && car.quantity === 0) return false;
      return true;
    })
    .filter((car) =>
      (car.brand + " " + car.model)
        .toLowerCase()
        .includes(searchTerm)
    );


  return (
    <>
      <div className="search-container">
        <input
          className="search-input"
          type="text"
          placeholder="Search for cars..."
          onChange={handleSearchBar}
          value={searchTerm}
        />
      </div>

      <h1 id="title">Ready. Set. Rent. 🚘</h1>

      <div className="container">
        {filteredCars.length > 0 ? (
          filteredCars.map((car) => (
            <div className="flip-card" key={car.carId}>
              <div
                className={`flip-card-inner ${flips[car.carId] ? "flipped" : ""
                  }`}
              >
                {/* FRONT */}
                <div className="flip-card-front">
                  <div
                    className="card-image"
                    onClick={() => handleCardClick(car.carId)}
                  >
                    <img src={car.imageUrl} alt={car.model} />
                    <div className="image-overlay">
                      <span>Click to view details</span>
                    </div>
                  </div>

                  <div className="card-body">
                    <h2 className="card-title">
                      {car.brand} {car.model}
                    </h2>

                    <div className="card-description">
                      <strong>Model Year:</strong> {car.modelYear} <br />
                      <strong>Fuel Type:</strong> {car.fuelType || "N/A"} <br />
                      <strong>Seats:</strong> {car.seats} <br />
                      <strong>Price/Day:</strong> ₹{car.pricePerDay} <br />
                      <strong>Status:</strong> {car.status} <br />
                      <strong>Quantity:</strong>{car.quantity} <br />

                      {isAdmin && (
                        <div className="qty-controls">
                          <button
                            onClick={() => updateQty(car.carId, -1)}
                            disabled={car.quantity === 0}
                          >
                            −
                          </button>
                          {isAdmin && car.quantity === 0 && (
                            <span className="out-of-stock-badge">
                              Out of Stock
                            </span>
                          )}

                          <button onClick={() => updateQty(car.carId, +1)}>
                            +
                          </button>
                        </div>
                      )}

                      <strong>Location:</strong> {car.location} <br />
                      {/* <button onClick={() => toggleFlip(car.carId)}>
                        Show Reviews
                      </button> */}
                    </div>
                  </div>
                </div>

                {/* BACK */}
                <div className="flip-card-back">
                  <div className="card-body">
                    <h2>
                      {car.brand} {car.model} - Reviews
                    </h2>

                    <Reviews reviews={car.reviews || []} />

                    <button onClick={() => toggleFlip(car.carId)}>
                      Back to Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="no-results">No cars found.</p>
        )}

        {isAdmin && (
          <button
            className="add-car-btn"
            onClick={() => navigate("/admin/cars/add")}
          >
            ➕ Add Car
          </button>
        )}
      </div>
    </>
  );
}

export default Cars;
