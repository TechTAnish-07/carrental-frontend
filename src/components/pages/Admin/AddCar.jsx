import api from "/Users/tanish/web-dev/react/carrental-project/src/components/Axios.jsx";
import { useNavigate } from "react-router-dom";

const AddCar = () => {
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);

    await api.post("/api/cars/add", fd);
    navigate("/cars"); // or admin dashboard
  };

  return (
    <div className="add-car-page">
      <h2>Add New Car</h2>

      <form onSubmit={submit} className="add-car-form">
        <input name="brand" placeholder="Brand" required />
        <input name="model" placeholder="Model" required />
        <input name="modelYear" placeholder="Model Year" type="number" required />
        <input name="seats" placeholder="Seats" type="number" required />
        <input name="pricePerDay" placeholder="Price Per Day" type="number" required />
        <input name="fuelType" placeholder="Fuel Type" required />
        <input name="location" placeholder="Location" required />
        <input name="quantity" placeholder="Quantity" type="number" required />
        <input type="file" name="image" required />

        <button type="submit">Add Car</button>
      </form>
    </div>
  );
};

export default AddCar;
