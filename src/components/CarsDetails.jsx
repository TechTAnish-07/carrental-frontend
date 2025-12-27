import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./CarDetails.css";
import api from "../components/Axios.jsx"; // 👈 your axios instance
const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [car, setCar] = useState(null);

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const res = await api.get(`/api/cars/${id}`);
        setCar(res.data);
      } catch (error) {
        console.error("Error fetching car details:", error);
      }
    };

    fetchCarDetails();
  }, [id]);

  if (!car) return <p>Loading...</p>;

  return (
    <div className="car-details">
      <button onClick={() => navigate(-1)} className="back-button">← Back</button>

      <h2>{car.brand} {car.model} - Full Details</h2>

      <img src={car.imageUrl} alt={car.model} className="modal-img" />

      <p><strong>Model Year:</strong> {car.modelYear}</p>
      <p><strong>Fuel Type:</strong> {car.fuelType || "Not Provided"}</p>
      <p><strong>Seats:</strong> {car.seats}</p>
      <p><strong>Price/Day:</strong> ₹{car.pricePerDay}</p>
      <p><strong>Status:</strong> {car.status}</p>

      <h4>Interior images will be added later</h4>
    </div>
  );
};

export default CarDetails;
