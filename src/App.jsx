// App.jsx
import React, { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import TyreLoader from "./components/TyreLoader";
import AdminDashboard from "./components/pages/Admin/AdminDashboard";
import AddCar from "./components/pages/Admin/AddCar";
import ContactMessages from "./components/pages/Admin/ContactMessage";
const UserBookings  = lazy(() => import("./components/UserBookings")) ;
const Admin = lazy(() => import("./components/Admin"));
const Home = lazy(() => import("./components/Home"));
const Login = lazy(() => import("./components/Login"));
const Profile = lazy(() => import("./components/Profile"));
const Cars = lazy(() => import("./components/Cars"));
const AppLayout = lazy(() => import("./components/layout/AppLayout"));
const ContactUs = lazy(() => import("./ContactUs"));
const ErrorPage = lazy(() => import("./components/errorPage"));
const CarDetails = lazy(() => import("./components/CarsDetails"));
const AvailableCars = lazy(() => import("./components/Availablecars"));
const BookNow = lazy(() => import("./components/BookNow"));
const Success = lazy(() => import("./components/Success"));

// Loader
const Loader = () => (
  <div style={{ textAlign: "center", marginTop: "100px" }}>
   
  </div>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "signin", element: <Login /> },
      { path: "user/dashboard", element: <Profile /> },
      { path: "cars", element: <Cars /> },
      { path: "cars/:id", element: <CarDetails /> },
      { path: "contact", element: <ContactUs /> },
      { path: "available", element: <AvailableCars /> },
      { path: "book/:id", element: <BookNow /> },
      { path: "booking/success", element: <Success /> },
      { path: "user/bookings", element: <UserBookings /> },
      { path: "admin/dashboard", element: <AdminDashboard /> },
      { path: "admin/cars", element: <Cars /> },
      { path: "admin/messages", element: <ContactMessages /> },
      { path: "admin/cars/add", element: <AddCar /> },
    ],
  },
]);

function App() {
  return (
    <Suspense fallback={<TyreLoader />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;
